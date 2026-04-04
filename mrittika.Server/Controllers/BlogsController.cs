using Microsoft.AspNetCore.Mvc;
using mrittika.Server.Data;
using mrittika.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace mrittika.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IWebHostEnvironment _environment;

        public BlogsController(ApplicationDbContext context, IWebHostEnvironment environment)
        {
            _context = context;
            _environment = environment;
        }

        // 1. Create Post
        [HttpPost("create")]
        public async Task<IActionResult> CreateBlog([FromForm] string title, [FromForm] string content, [FromForm] string authorName, [FromForm] string authorEmail, [FromForm] IFormFile image, [FromForm] decimal price, [FromForm] int quantity, [FromForm] string selectedType)
        {
            try
            {
                if (image == null || image.Length == 0) return BadRequest(new { message = "Image is mandatory." });
                string webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsPath = Path.Combine(webRootPath, "uploads");
                if (!Directory.Exists(uploadsPath)) Directory.CreateDirectory(uploadsPath);
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsPath, fileName);
                using (var stream = new FileStream(filePath, FileMode.Create)) { await image.CopyToAsync(stream); }

                var blog = new Blog
                {
                    Title = title,
                    Content = content,
                    AuthorName = authorName,
                    AuthorEmail = authorEmail,
                    ImageUrl = $"/uploads/{fileName}",
                    IsApproved = false,
                    CreatedAt = DateTime.Now,
                    Price = price,
                    Quantity = quantity,
                    IsHandmadeShowpiece = (selectedType == "Handmade Clay showpiece"),
                    IsClayCutlery = (selectedType == "Clay Cutlery")
                };
                _context.Blogs.Add(blog);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Post submitted successfully!" });
            }
            catch (Exception ex) { return StatusCode(500, new { message = ex.Message }); }
        }

        // 2. Get Approved Posts with Counts
        [HttpGet]
        public async Task<IActionResult> GetApproved()
        {
            var blogs = await _context.Blogs
                .Where(b => b.IsApproved)
                .OrderByDescending(x => x.CreatedAt)
                .Select(b => new {
                    b.Id,
                    b.Title,
                    b.Content,
                    b.AuthorName,
                    b.ImageUrl,
                    b.Price,
                    b.Quantity,
                    b.IsHandmadeShowpiece,
                    b.IsClayCutlery,
                    b.CreatedAt,
                    LikesCount = _context.BlogLikes.Count(l => l.BlogId == b.Id),
                    CommentsCount = _context.BlogComments.Count(c => c.BlogId == b.Id)
                }).ToListAsync();
            return Ok(blogs);
        }

        // 3. Get Single Blog
        [HttpGet("{id}")]
        public async Task<IActionResult> GetBlog(int id, [FromQuery] string userEmail = "")
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return NotFound();
            var likes = await _context.BlogLikes.Where(l => l.BlogId == id).ToListAsync();
            var comments = await _context.BlogComments.Where(c => c.BlogId == id).OrderByDescending(c => c.CreatedAt).ToListAsync();
            return Ok(new { blog, likesCount = likes.Count, isLiked = !string.IsNullOrEmpty(userEmail) && likes.Any(l => l.UserEmail == userEmail), comments });
        }

        // 4. Toggle Like + Notification (RESTORED THIS METHOD)
        [HttpPost("{id}/like")]
        public async Task<IActionResult> ToggleLike(int id, [FromBody] string email)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return NotFound();

            var existingLike = await _context.BlogLikes.FirstOrDefaultAsync(l => l.BlogId == id && l.UserEmail == email);

            if (existingLike != null)
            {
                _context.BlogLikes.Remove(existingLike);
            }
            else
            {
                _context.BlogLikes.Add(new BlogLike { BlogId = id, UserEmail = email });

                if (blog.AuthorEmail != email)
                {
                    _context.ContactMessages.Add(new ContactMessage
                    {
                        Name = "System",
                        Email = blog.AuthorEmail,
                        Category = "Like",
                        MessageBody = $"Someone liked your post: {blog.Title}",
                        TargetBlogId = id,
                        IsRead = false,
                        CreatedAt = DateTime.Now,
                        Role = "Alert" // FIXED: Prevents NULL error
                    });
                }
            }
            await _context.SaveChangesAsync();
            return Ok();
        }

        // 5. Add Comment + Notification
        [HttpPost("{id}/comment")]
        public async Task<IActionResult> AddComment(int id, [FromBody] BlogComment comment)
        {
            var blog = await _context.Blogs.FindAsync(id);
            if (blog == null) return NotFound();

            comment.BlogId = id;
            comment.CreatedAt = DateTime.Now;
            _context.BlogComments.Add(comment);

            if (blog.AuthorEmail != comment.UserEmail)
            {
                _context.ContactMessages.Add(new ContactMessage
                {
                    Name = comment.UserName,
                    Email = blog.AuthorEmail,
                    Category = "Comment",
                    MessageBody = $"commented on your post '{blog.Title}'",
                    TargetBlogId = id,
                    IsRead = false,
                    CreatedAt = DateTime.Now,
                    Role = "Alert" // FIXED: Prevents NULL error
                });
            }
            await _context.SaveChangesAsync();
            return Ok(comment);
        }

        // 6. Delete Comment (Owner Only)
        [HttpDelete("comment/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var comment = await _context.BlogComments.FindAsync(commentId);
            if (comment == null) return NotFound();
            _context.BlogComments.Remove(comment);
            await _context.SaveChangesAsync();
            return Ok();
        }

        // 7. Update Comment (Owner Only)
        [HttpPut("comment/{commentId}")]
        public async Task<IActionResult> UpdateComment(int commentId, [FromBody] string newText)
        {
            var comment = await _context.BlogComments.FindAsync(commentId);
            if (comment == null) return NotFound();
            comment.Text = newText;
            await _context.SaveChangesAsync();
            return Ok();
        }

        // Admin Approval/Refusal
        [HttpPost("approve/{id}")] public async Task<IActionResult> ApproveBlog(int id) { var b = await _context.Blogs.FindAsync(id); if (b == null) return NotFound(); b.IsApproved = true; await _context.SaveChangesAsync(); return Ok(); }
        [HttpDelete("refuse/{id}")] public async Task<IActionResult> RefuseBlog(int id) { var b = await _context.Blogs.FindAsync(id); if (b == null) return NotFound(); _context.Blogs.Remove(b); await _context.SaveChangesAsync(); return Ok(); }
    }
}

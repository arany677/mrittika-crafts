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

        // 1. Create Post with Image Upload (For Sellers)
        [HttpPost("create")]
        public async Task<IActionResult> CreateBlog([FromForm] string title, [FromForm] string content, [FromForm] string authorName, [FromForm] IFormFile image)
        {
            try
            {
                if (image == null || image.Length == 0)
                    return BadRequest(new { message = "Image is mandatory." });

                // Ensure wwwroot/uploads directory exists
                string webRootPath = _environment.WebRootPath ?? Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");
                var uploadsPath = Path.Combine(webRootPath, "uploads");

                if (!Directory.Exists(uploadsPath))
                    Directory.CreateDirectory(uploadsPath);

                // Generate unique filename
                var fileName = Guid.NewGuid().ToString() + Path.GetExtension(image.FileName);
                var filePath = Path.Combine(uploadsPath, fileName);

                // Save file to disk
                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    await image.CopyToAsync(stream);
                }

                var blog = new Blog
                {
                    Title = title,
                    Content = content,
                    AuthorName = authorName,
                    ImageUrl = $"/uploads/{fileName}",
                    IsApproved = false, // Must be false until Admin approves
                    CreatedAt = DateTime.Now
                };

                _context.Blogs.Add(blog);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Post submitted successfully! Waiting for Admin approval." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Server error: {ex.Message}" });
            }
        }

        // 2. Approve Post (For Admin)
        [HttpPost("approve/{id}")]
        public async Task<IActionResult> ApproveBlog(int id)
        {
            try
            {
                var blog = await _context.Blogs.FindAsync(id);
                if (blog == null) return NotFound(new { message = "Blog not found" });

                blog.IsApproved = true;
                await _context.SaveChangesAsync();
                return Ok(new { message = "Blog post approved!" }); // Added JSON body to prevent React crash
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // 3. Refuse/Delete Post (For Admin)
        [HttpDelete("refuse/{id}")]
        public async Task<IActionResult> RefuseBlog(int id)
        {
            try
            {
                var blog = await _context.Blogs.FindAsync(id);
                if (blog == null) return NotFound(new { message = "Blog not found" });

                _context.Blogs.Remove(blog);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Blog post rejected and deleted." }); // Added JSON body
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // 4. Get Pending Posts (For Admin Dashboard)
        [HttpGet("pending")]
        public async Task<IActionResult> GetPending()
        {
            try
            {
                var pending = await _context.Blogs.Where(b => !b.IsApproved).ToListAsync();
                return Ok(pending);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        // 5. Get Approved Posts (For Public Blog Page)
        [HttpGet]
        public async Task<IActionResult> GetApproved()
        {
            try
            {
                var blogs = await _context.Blogs
                    .Where(b => b.IsApproved)
                    .OrderByDescending(x => x.CreatedAt)
                    .ToListAsync();

                return Ok(blogs);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"Database error: {ex.Message}" });
            }
        }
        // Get a single blog by ID
        [HttpGet("{id}")]
        public IActionResult GetBlog(int id)
        {
            var blog = _context.Blogs.Find(id);
            if (blog == null) return NotFound();
            return Ok(blog);
        }
        
    }
}
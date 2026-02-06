using Microsoft.AspNetCore.Mvc;
using mrittika.Server.Data;

namespace mrittika.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BlogsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public BlogsController(ApplicationDbContext context) { _context = context; }

        [HttpGet]
        public IActionResult GetBlogs()
        {
            try
            {
                var blogs = _context.Blogs.Where(b => b.IsApproved).ToList();
                return Ok(blogs);
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, $"Database Error: {ex.Message}");
            }
        }
    }
}
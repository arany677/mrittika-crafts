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
        public IActionResult GetApprovedBlogs()
        {
            // Only show blogs that Admin has approved
            var blogs = _context.Blogs.Where(b => b.IsApproved == true).ToList();
            return Ok(blogs);
        }
    }
}
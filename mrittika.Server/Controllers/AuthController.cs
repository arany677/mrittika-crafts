using Microsoft.AspNetCore.Mvc;
using mrittika.Server.Data;
using mrittika.Server.Models;

namespace mrittika.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public AuthController(ApplicationDbContext context) { _context = context; }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            try
            {
                if (_context.Users.Any(u => u.Email == user.Email))
                    return BadRequest(new { message = "Email already exists." }); // JSON object

                user.IsVerified = (user.Role == "Buyer");
                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok(new { message = "Registration successful!" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = $"DB Error: {ex.Message}" });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            // Admin Hardcoded Check
            if (request.Email == "admin@mrittika.com" && request.Password == "admin6240")
                return Ok(new { name = "Admin", role = "Admin" });

            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email && u.Password == request.Password);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            if (user.Role == "Seller" && !user.IsVerified)
                return BadRequest(new { message = "Pending Admin approval." }); // JSON object

            return Ok(new { name = user.Name, role = user.Role });
        }
        public class LoginRequest
        {
            public string Email { get; set; } = string.Empty;
            public string Password { get; set; } = string.Empty;
        }
    }
}
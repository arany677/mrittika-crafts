using Microsoft.AspNetCore.Mvc;
using mrittika.Server.Data;
using mrittika.Server.Models;
using System.Linq;

namespace mrittika.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] User user)
        {
            try
            {
                if (_context.Users.Any(u => u.Email == user.Email))
                    return BadRequest(new { message = "Email already exists." });

                // Set Buyer to verified by default, Seller needs Admin
                user.IsVerified = (user.Role == "Buyer");
                _context.Users.Add(user);
                _context.SaveChanges();
                return Ok(new { message = "Registration successful!" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            if (request.Email == "admin@mrittika.com" && request.Password == "admin6240")
                return Ok(new { name = "Admin", role = "Admin" });

            var user = _context.Users.FirstOrDefault(u => u.Email == request.Email && u.Password == request.Password);

            if (user == null)
                return Unauthorized(new { message = "Invalid email or password." });

            if (user.Role == "Seller" && !user.IsVerified)
                return BadRequest(new { message = "Pending Admin approval." });

            return Ok(new { name = user.Name, role = user.Role });
        }

        [HttpGet("pending-sellers")]
        public IActionResult GetPendingSellers()
        {
            try
            {
                // 1. We must make sure the query is looking for exactly what is in your DB
                // If your DB has "Seller", ToLower() handles it.
                var pending = _context.Users
                    .Where(u => u.Role != null && u.Role.ToLower() == "seller" && u.IsVerified == false)
                    .ToList();

                return Ok(pending);
            }
            catch (System.Exception ex)
            {
                // This will show you the exact error in the "Output" window of VS
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpPost("approve-seller/{id}")]
        public IActionResult ApproveSeller(int id)
        {
            try
            {
                var user = _context.Users.Find(id);
                if (user == null) return NotFound(new { message = "User not found" });

                user.IsVerified = true;
                _context.SaveChanges();
                return Ok(new { message = "Seller approved successfully!" });
            }
            catch (System.Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
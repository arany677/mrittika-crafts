using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mrittika.Server.Models;
using mrittika.Server.Data;

namespace mrittika.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SellersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public SellersController(ApplicationDbContext context) { _context = context; }

        [HttpGet("profile/{email}")]
        public async Task<IActionResult> GetSellerProfile(string email)
        {
            // ১. Users টেবিল থেকে নাম এবং ইমেইল নিন
            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email.ToLower() == email.ToLower());
            if (user == null) return NotFound("User not found.");

            // ২. Blogs টেবিল থেকে আইটেমগুলো নিন এবং সরাসরি বিক্রির হিসাব (sold) ক্যালকুলেট করুন
            var sellerItems = await _context.Blogs
                .Where(b => b.AuthorEmail.ToLower() == email.ToLower())
                .Select(b => new {
                    id = b.Id,
                    title = b.Title,
                    price = b.Price,
                    imageUrl = b.ImageUrl,
                    isApproved = b.IsApproved,
                    remained = b.Quantity,
                    sold = _context.OrderItems.Where(oi => oi.ProductId == b.Id).Sum(oi => oi.Quantity)
                }).ToListAsync();

            return Ok(new
            {
                seller = new { name = user.Name, email = user.Email },
                items = sellerItems
            });
        }
    }
}
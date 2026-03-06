using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using mrittika.Server.Data; // আপনার DbContext এর লোকেশন অনুযায়ী এটি চেক করে নিন
using mrittika.Server.Models;

namespace mrittika.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase // এখানে : ControllerBase যোগ করা হয়েছে
    {
        private readonly ApplicationDbContext _context; // ডাটাবেস কানেকশন ভেরিয়েবল

        // কনস্ট্রাক্টর এর মাধ্যমে ডাটাবেস ইনজেক্ট করা
        public OrdersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmOrder([FromBody] OrderDto dto)
        {
            try
            {
                // ১. ব্লগ বা প্রোডাক্ট খুঁজে বের করা
                var product = await _context.Blogs.FindAsync(dto.BlogId);
                if (product == null)
                    return NotFound(new { message = "Product not found" });

                // ২. স্টক চেক করা
                if (product.Quantity < dto.Quantity)
                    return BadRequest(new { message = "Not enough stock!" });

                // ৩. স্টক কমানো
                product.Quantity -= dto.Quantity;

                // ৪. নতুন অর্ডার অবজেক্ট তৈরি করা (এটি ডাটাবেস মডেলের সাথে মিলবে)
                var order = new Order
                {
                    UserId = dto.UserId,
                    BlogId = dto.BlogId,
                    Quantity = dto.Quantity,
                    TotalPrice = dto.TotalPrice,
                    OrderDate = DateTime.Now
                };

                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                return Ok(new { message = "Purchase Successful!" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.InnerException?.Message ?? ex.Message });
            }
        }
    }

    // এটি OrdersController.cs এর নিচে যোগ করুন
    public class OrderDto
    {
        public int UserId { get; set; }
        public int BlogId { get; set; }
        public int Quantity { get; set; }
        public decimal TotalPrice { get; set; }
    }
}
using Microsoft.AspNetCore.Mvc;
using mrittika.Server.Data;
using Microsoft.EntityFrameworkCore;
using mrittika.Server.Models;

namespace mrittika.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public OrdersController(ApplicationDbContext context) { _context = context; }

        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmOrder([FromBody] Order order)
        {
            try
            {
                // ১. শুধুমাত্র অর্ডার সেভ করা হবে
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();

                if (order.OrderItems != null)
                {
                    foreach (var item in order.OrderItems)
                    {
                        // ২. শুধুমাত্র স্টক (Quantity) কমানো - Blogs টেবিল থেকে
                        var blogPost = await _context.Blogs.FindAsync(item.ProductId);
                        if (blogPost != null)
                        {
                            blogPost.Quantity -= item.Quantity;
                            _context.Entry(blogPost).State = EntityState.Modified;
                        }
                    }
                }

                await _context.SaveChangesAsync();
                return Ok(new { message = "Purchase Successful ✅" });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex.Message });
            }
        }

        [HttpGet("seller-notifications/{email}")]
        public IActionResult GetSellerOrders(string email)
        {
            var items = _context.OrderItems
                .Where(i => i.SellerEmail.ToLower() == email.ToLower())
                .ToList();

            var result = items.Select(item => {
                var parentOrder = _context.Orders.FirstOrDefault(o => o.Id == item.OrderId);
                return new
                {
                    item.ProductName,
                    item.Quantity,
                    item.Price,
                    BuyerEmail = parentOrder?.BuyerEmail ?? "Unknown Buyer",
                    Location = parentOrder?.Location ?? "No Location Provided",
                    Phone = parentOrder?.ContactNumber ?? "No Phone Provided",
                    OrderDate = parentOrder?.OrderDate ?? DateTime.Now
                };
            }).OrderByDescending(x => x.OrderDate).ToList();

            return Ok(result);
        }
    }
}
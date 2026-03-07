using Microsoft.AspNetCore.Mvc;
using mrittika.Server.Data;
using Microsoft.EntityFrameworkCore;

namespace mrittika.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        public OrdersController(ApplicationDbContext context) { _context = context; }

        // 1. Existing Confirm Order method...
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmOrder([FromBody] mrittika.Server.Models.Order order)
        {
            try
            {
                _context.Orders.Add(order);
                await _context.SaveChangesAsync();
                return Ok(new { message = "Order successfully placed!" });
            }
            catch (Exception ex) { return StatusCode(500, ex.Message); }
        }

        // 2. NEW: Get orders for a specific seller
        [HttpGet("seller-notifications/{email}")]
        public IActionResult GetSellerOrders(string email)
        {
            try
            {
                // 1. Get all items belonging to this seller
                var items = _context.OrderItems
                    .Where(i => i.SellerEmail.ToLower() == email.ToLower())
                    .ToList();

                // 2. For each item, find the parent order information (Buyer info)
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
            catch (Exception ex)
            {
                // If it crashes, this tells us why in the browser's Network tab
                return StatusCode(500, new { message = ex.Message });
            }
        }
    }
}
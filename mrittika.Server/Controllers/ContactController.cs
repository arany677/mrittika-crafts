using Microsoft.AspNetCore.Mvc;
using mrittika.Server.Data;
using mrittika.Server.Models;
using Microsoft.EntityFrameworkCore;

[Route("api/[controller]")]
[ApiController]
public class ContactController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public ContactController(ApplicationDbContext context)
    {
        _context = context;
    }

    [HttpPost("send")]
    public async Task<IActionResult> SendMessage([FromBody] ContactMessage msg)
    {
        if (msg.Role != "Admin")
        {
            var existingUser = await _context.ContactMessages
                .OrderByDescending(m => m.CreatedAt)
                .FirstOrDefaultAsync(m => m.Email == msg.Email && m.Role != "Admin");

            if (existingUser != null && existingUser.Name.ToLower() != msg.Name.ToLower())
            {
                return BadRequest("This email is already associated with a different name.");
            }
        }

        msg.CreatedAt = DateTime.Now;
        msg.IsRead = false; // New messages are always unread
        _context.ContactMessages.Add(msg);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Message sent successfully!" });
    }

    [HttpGet("message/{id}")]
    public async Task<IActionResult> GetMessage(int id)
    {
        var msg = await _context.ContactMessages.FindAsync(id);
        if (msg == null) return NotFound();
        return Ok(msg);
    }

    // --- UPDATED: Returns all messages so the list stays populated ---
    [HttpGet("notifications/{role}/{email}")]
    public async Task<IActionResult> GetNotifications(string role, string email)
    {
        IQueryable<ContactMessage> query = _context.ContactMessages;

        if (role == "Admin")
        {
            query = query.Where(m => m.Role != "Admin");
        }
        else
        {
            query = query.Where(m => m.Role == "Admin" && m.Email == email);
        }

        var notes = await query.OrderByDescending(m => m.CreatedAt).ToListAsync();
        return Ok(notes);
    }

    // --- NEW ENDPOINT: Marks messages as seen ---
    [HttpPost("mark-as-read/{role}/{email}")]
    public async Task<IActionResult> MarkAsRead(string role, string email)
    {
        IQueryable<ContactMessage> query = _context.ContactMessages;

        if (role == "Admin")
        {
            query = query.Where(m => m.Role != "Admin" && m.IsRead == false);
        }
        else
        {
            query = query.Where(m => m.Role == "Admin" && m.Email == email && m.IsRead == false);
        }

        var unreadMessages = await query.ToListAsync();
        foreach (var msg in unreadMessages)
        {
            msg.IsRead = true;
        }

        await _context.SaveChangesAsync();
        return Ok();
    }
}
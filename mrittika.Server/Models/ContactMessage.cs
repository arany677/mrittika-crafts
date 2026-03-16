// Models/ContactMessage.cs
using System.ComponentModel.DataAnnotations;

namespace mrittika.Server.Models
{
    public class ContactMessage
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Email { get; set; }
        public string MessageBody { get; set; }
        public string Role { get; set; } // Admin, Buyer, Seller
        public string? UserId { get; set; }
        public int? ParentMessageId { get; set; } // Used for replies
        public bool IsRead { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
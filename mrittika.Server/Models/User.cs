namespace mrittika.Server.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty; // In a real app, we hash this!
        public string Role { get; set; } = string.Empty; // "Buyer", "Seller", "Admin"

        // For Sellers: Admin must set this to true before they can post
        public bool IsVerified { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
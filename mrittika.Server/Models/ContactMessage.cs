public class ContactMessage
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string MessageBody { get; set; } = string.Empty;
    public string Role { get; set; } = "User"; // Default value prevents NULL errors
    public bool IsRead { get; set; } = false;
    public DateTime CreatedAt { get; set; } = DateTime.Now;
    public int? TargetBlogId { get; set; }
    public string Category { get; set; } = "Message";
}
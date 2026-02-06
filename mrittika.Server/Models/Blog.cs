namespace mrittika.Server.Models
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty;
        public bool IsApproved { get; set; } = false; // Default false for Admin review
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
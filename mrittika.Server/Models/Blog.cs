namespace mrittika.Server.Models
{
    public class Blog
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Content { get; set; } = string.Empty;
        public string AuthorName { get; set; } = string.Empty;

        // ADD THIS LINE
        public string AuthorEmail { get; set; } = string.Empty;

        public string ImageUrl { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Quantity { get; set; }
        public bool IsApproved { get; set; } = false;
        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Sumona's logic
        public bool IsHandmadeShowpiece { get; set; }
        public bool IsClayCutlery { get; set; }
    }
}
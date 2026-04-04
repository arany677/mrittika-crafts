namespace mrittika.Server.Models
{
    public class BlogComment
    {
        public int Id { get; set; }
        public int BlogId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
namespace mrittika.Server.Models
{
    public class BlogLike
    {
        public int Id { get; set; }
        public int BlogId { get; set; }
        public string UserEmail { get; set; } = string.Empty;
    }
}
namespace mrittika.Server.Models
{
    public class TeamMember
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string City { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public string JobStatus { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string FbLink { get; set; } = string.Empty;
        public string InstaLink { get; set; } = string.Empty;
        public string WorkDescription { get; set; } = string.Empty;
        public string ImageUrl { get; set; } = string.Empty; // Store path to the picture
        public string LinkedinLink { get; set; } = string.Empty; // Store LinkedIn URL
    }
}
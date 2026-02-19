using Microsoft.AspNetCore.Mvc;
using mrittika.Server.Data;
using mrittika.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace mrittika.Server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TeamMembersController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public TeamMembersController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetTeam() => Ok(_context.TeamMembers.ToList());

        [HttpPost]
        public async Task<IActionResult> CreateProfile([FromForm] TeamMember member, IFormFile? imageFile)
        {
            if (imageFile != null)
            {
                member.ImageUrl = await SaveImage(imageFile);
            }
            _context.TeamMembers.Add(member);
            await _context.SaveChangesAsync();
            return Ok(member);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateProfile(int id, [FromForm] TeamMember updated, IFormFile? imageFile)
        {
            var member = await _context.TeamMembers.FindAsync(id);
            if (member == null) return NotFound();

            // Update text fields
            member.Name = updated.Name;
            member.JobStatus = updated.JobStatus;
            member.Email = updated.Email;
            member.City = updated.City;
            member.Address = updated.Address;
            member.FbLink = updated.FbLink;
            member.InstaLink = updated.InstaLink;
            member.LinkedinLink = updated.LinkedinLink;
            member.WorkDescription = updated.WorkDescription;

            // Update image only if a new one is uploaded
            if (imageFile != null)
            {
                member.ImageUrl = await SaveImage(imageFile);
            }

            await _context.SaveChangesAsync();
            return Ok(new { message = "Updated Successfully" });
        }

        // Helper function to save images safely
        private async Task<string> SaveImage(IFormFile file)
        {
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot", "uploads");
            if (!Directory.Exists(folderPath)) Directory.CreateDirectory(folderPath);

            var fileName = Guid.NewGuid().ToString() + Path.GetExtension(file.FileName);
            var filePath = Path.Combine(folderPath, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }
            return "/uploads/" + fileName;
        }
    }
}
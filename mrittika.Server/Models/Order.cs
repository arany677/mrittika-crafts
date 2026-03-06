using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Mvc.ModelBinding.Validation;

namespace mrittika.Server.Models
{
    public class Order
    {
        [Key]
        public int Id { get; set; }

        [Required]
        public int UserId { get; set; }

        [Required]
        public int BlogId { get; set; }

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; }

        public DateTime OrderDate { get; set; } = DateTime.Now;

        // Navigation properties গুলোকে পুরোপুরি ইগনোর করার জন্য নিচের স্টাইলটি ব্যবহার করুন
        [JsonIgnore]
        [ValidateNever]
        public virtual User? User { get; set; }

        [JsonIgnore]
        [ValidateNever]
        public virtual Blog? Blog { get; set; }
    }
}
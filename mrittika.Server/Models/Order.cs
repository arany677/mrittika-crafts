namespace mrittika.Server.Models
{
    public class Order
    {
        public int Id { get; set; }
        public string BuyerEmail { get; set; } = string.Empty;

        // These are the new fields for your COD Popup
        public string Location { get; set; } = string.Empty;
        public string ContactNumber { get; set; } = string.Empty;

        public string PaymentMethod { get; set; } = "Cash on Delivery";
        public decimal TotalAmount { get; set; }
        public DateTime OrderDate { get; set; } = DateTime.Now;

        // One Order can have many items
        public List<OrderItem> OrderItems { get; set; } = new();
    }

    public class OrderItem
    {
        public int Id { get; set; }
        public int OrderId { get; set; }
        public int ProductId { get; set; }
        public string ProductName { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public decimal Price { get; set; }

        // This is CRITICAL for notifying the Seller
        public string SellerEmail { get; set; } = string.Empty;
    }
}
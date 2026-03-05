namespace Backend.Models
{
    public class ImageProduct
    {
        public int Id { get; set; }
        public string Url { get; set; } = string.Empty;
        public int ProductoId { get; set; }

        /// relacion con producto 
        public Product? Producto { get; set; }
    }
}

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models
{
    public class Product
    {
        // La entidad debe tener las siguientes propiedades Id, Nombre, precio, fechaCreacion, estado

        public int Id { get; set; }

        
        // Validación de que el campo nombre no sea nulo y tenga un máximo de 50 caracteres
        
        [MaxLength(50, ErrorMessage ="El campo {0} debe tener maximo {1} caractéres ")]
        public string Nombre { get; set; } = string.Empty;
        //permitir varias lineas
        [DataType(DataType.MultilineText)]
        public string Descripcion { get; set; } = string.Empty;
        [Column(TypeName = "decimal(18,2)")]
        public decimal Precio { get; set; }
        public DateTime FechaCreacion { get; set; } = DateTime.Now;
        public bool Estado { get; set; } = true;

        public ICollection<ImageProduct> Imagenes { get; set; } = new List<ImageProduct>();

        
    }
}

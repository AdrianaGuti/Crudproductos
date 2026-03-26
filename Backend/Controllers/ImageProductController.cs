using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    [Route("api/imageproducts")]

    public class ImageProductController : ControllerBase
    {
            private readonly Data.AppDbContext _context;
            public ImageProductController(Data.AppDbContext context)
            {
                _context = context;
            }

        //GET: api/imageproduct
        //Obtener todas las imágenes de un producto
        [HttpGet("producto/{productoId}")]

        public async Task<IActionResult> GetByProduct(int productoId)
        {
            var productoExiste = await _context.Products.AnyAsync(p => p.Id == productoId);
            if (!productoExiste)
                return NotFound(new { message = $"Producto con Id {productoId} no encontrado" });

            var imagenes = await _context.ImageProducts
                .Where(ip => ip.ProductoId == productoId)
                .ToListAsync();

            // Devuelve codigo 200 con las imagenes
            return Ok(imagenes);

        }

        //POST: api/imageproduct
        //Agregar una nueva imagen a un producto
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ImageProduct imageProduct)
        {
            var productoExiste = await _context.Products.AnyAsync(p => p.Id == imageProduct.ProductoId);
            if (!productoExiste)
                return NotFound(new { message = $"Producto con Id {imageProduct.ProductoId} no encontrado" });
            _context.ImageProducts.Add(imageProduct);
            await _context.SaveChangesAsync();
            // Devuelve codigo 201 con la imagen creada
            return CreatedAtAction(nameof(GetByProduct), new { productoId = imageProduct.ProductoId }, imageProduct);
        }

        //DELETE: api/imageproduct/{id}
        //Eliminar una imagen por su id

        [HttpDelete]
        public async Task<IActionResult> Delete(int id)
        {
            var imagen = await _context.ImageProducts.FindAsync(id);
            if (imagen == null)
                return NotFound(new { message = $"Imagen con Id {id} no encontrada" });
            _context.ImageProducts.Remove(imagen);
            await _context.SaveChangesAsync();
            // Devuelve codigo 204 sin contenido
            return NoContent();
        }
     }
}

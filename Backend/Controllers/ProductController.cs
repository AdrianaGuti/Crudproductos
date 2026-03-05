using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers
{
    [ApiController]
    // Se define la Ruta base del controlador que se usará para acceder a los endpoints definidos en este controlador.
    // En este caso, la ruta base será "api/products" (dado que el nombre del controlador es "ProductsController").
    [Route("api/[controller]")]
    public class ProductController : ControllerBase
    {
        private readonly Data.AppDbContext _context;
        public ProductController(Data.AppDbContext context)
        {
            _context = context;
        }

        //GET: api/products
        //Obtener todos los productos con sus imágenes
        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var products = await _context.Products
                .Include(p => p.Imagenes) // Incluir las imágenes relacionadas
                .ToListAsync();
            return Ok(products);

        }
        //Obtener un listado de productos ordenados de menor a mayor precio 
        [HttpGet("ordenados-por-precio")]
        public async Task<IActionResult> GetOrderedByPrice()
        {
            var products = await _context.Products
                .Include(p => p.Imagenes) // Incluir las imágenes relacionadas
                .OrderBy(p => p.Precio) // Ordenar por precio de menor a mayor
                .ToListAsync();
            return Ok(products);

        }

        //Obtener un producto por su id, incluyendo sus imágenes
        [HttpGet("{id}")]

        public async Task<IActionResult> GetById(int id)
        {
            var product = await _context.Products
                .Include(p => p.Imagenes) // Incluir las imágenes relacionadas
                .FirstOrDefaultAsync(p => p.Id == id);

            //Agregar validacion por si no se encuentra el producto con el id proporcionado
            if (product == null)
            {
                return NotFound(new { message = $"Producto con Id {id} no encontrado" });
            }
            return Ok(product);

        }

        //POST: api/products
        //Crear un nuevo producto con sus imágenes
        [HttpPost]
        public async Task<IActionResult> Create(Product product)
        {
            // Agregar validación de modelo
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            product.FechaCreacion = DateTime.Now; // Establecer la fecha de creación al momento de crear el producto
            _context.Products.Add(product);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = product.Id }, product);

        }

        //PUT: api/products/{id}
        //Actualizar un producto existente por su id
        [HttpPut("{id}")]

        public async Task<IActionResult> Update(int id, Product product)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingProduct = await _context.Products.FindAsync(id);

            if (existingProduct == null)
            {
                return NotFound(new { message = $"Producto con Id {id} no encontrado" });
            }

            existingProduct.Nombre = product.Nombre;
            existingProduct.Precio = product.Precio;
            existingProduct.Estado = product.Estado;
            existingProduct.Descripcion = product.Descripcion;

            await _context.SaveChangesAsync();
            return Ok(existingProduct);
        }

        //Delete: api/products/{id}
        //Eliminar un producto (tambien se eliminarán sus imágenes asociadas por el cascade)

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var existingProduct = await _context.Products.FindAsync(id);
            if (existingProduct == null)
            {
                return NotFound(new { message = $"Producto con Id {id} no encontrado, no se pudo eliminar" });
            }
            _context.Products.Remove(existingProduct);
            await _context.SaveChangesAsync();
            return NoContent();

        }
    }
}

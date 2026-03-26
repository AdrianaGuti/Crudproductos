
using Backend.Controllers;
using Backend.Data;
using Backend.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace Backend.Tests

{
    public class ProductsControllerTests
    {
        // Crea un contexto en memoria para no usar la BD real
        private AppDbContext GetInMemoryContext()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            return new AppDbContext(options);
        }

        // Prueba 1: Crear un producto válido retorna 201
        [Fact]
        public async Task Create_ProductoValido_Retorna201()
        {
            // Arrange
            var context = GetInMemoryContext();
            var controller = new ProductController(context);
            var producto = new Product
            {
                Nombre = "Laptop Dell",
                Descripcion = "Laptop para desarrollo",
                Precio = 2500000,
                Estado = true
            };

            // Act
            var result = await controller.Create(producto);

            // Assert
            var createdResult = Assert.IsType<CreatedAtActionResult>(result);
            var createdProduct = Assert.IsType<Product>(createdResult.Value);
            Assert.Equal("Laptop Dell", createdProduct.Nombre);
            Assert.Equal(2500000, createdProduct.Precio);
        }

        // Prueba 2: Obtener todos los productos retorna lista correcta
        [Fact]
        public async Task GetAll_Retorna_ListaDeProductos()
        {
            // Arrange
            var context = GetInMemoryContext();
            context.Products.AddRange(
                new Product { Nombre = "Producto 1", Precio = 100, Estado = true },
                new Product { Nombre = "Producto 2", Precio = 200, Estado = true }
            );
            await context.SaveChangesAsync();

            var controller = new ProductController(context);

            // Act
            var result = await controller.GetAll();

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result);
            var products = Assert.IsAssignableFrom<IEnumerable<Product>>(okResult.Value);
            Assert.Equal(2, products.Count());
        }

        // Prueba 3: Obtener producto por Id inexistente retorna 404
        [Fact]
        public async Task GetById_IdInexistente_Retorna404()
        {
            // Arrange
            var context = GetInMemoryContext();
            var controller = new ProductController(context);

            // Act
            var result = await controller.GetById(999);

            // Assert
            Assert.IsType<NotFoundObjectResult>(result);
        }

        // Prueba 4: Eliminar producto existente retorna 204
        [Fact]
        public async Task Delete_ProductoExistente_Retorna204()
        {
            // Arrange
            var context = GetInMemoryContext();
            var producto = new Product { Nombre = "Para eliminar", Precio = 50, Estado = true };
            context.Products.Add(producto);
            await context.SaveChangesAsync();

            var controller = new ProductController(context);

            // Act
            var result = await controller.Delete(producto.Id);

            // Assert
            Assert.IsType<NoContentResult>(result);
        }
    }
}
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        //Constructor que recibe las opciones de configuración para la base de datos
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        // Agrega las tablas en la BD para las entidades
        public DbSet<Models.Product> Products { get; set; }
        public DbSet<Models.ImageProduct> ImageProducts { get; set; }

        
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            // Configuración de la relación entre Product e ImageProduct
            modelBuilder.Entity<Models.ImageProduct>()
                .HasOne(ip => ip.Producto)
                .WithMany(p => p.Imagenes)
                .HasForeignKey(ip => ip.ProductoId)
                .OnDelete(DeleteBehavior.Cascade); // Si eliminas un producto, también se eliminarán sus imágenes asociadas

        }
    }

}
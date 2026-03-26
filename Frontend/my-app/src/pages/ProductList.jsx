import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordenado, setOrdenado] = useState(false);
  const navigate = useNavigate();

  // Cargar productos al montar el componente
  const fetchProducts = async (byPrice = false) => {
    try {
      setLoading(true);
      const url = byPrice ? "/products/ordenados-por-precio" : "/products";
      const { data } = await API.get(url);
      setProducts(data);
    } catch (error) {
      console.error("Error al cargar productos:", error);
      alert("No se pudieron cargar los productos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Eliminar producto
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de eliminar este producto?")) return;
    try {
      await API.delete(`/products/${id}`);
      setProducts(products.filter((p) => p.id !== id));
    } catch {
      alert("Error al eliminar el producto");
    }
  };

  // Alternar orden por precio
  const toggleOrden = () => {
    setOrdenado(!ordenado);
    fetchProducts(!ordenado);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 Gestión de Productos</h1>
        <div style={styles.actions}>
          <button style={styles.btnOrdenar} onClick={toggleOrden}>
            {ordenado ? "🔀 Orden normal" : "💲 Ordenar por precio"}
          </button>
          <button
            style={styles.btnAgregar}
            onClick={() => navigate("/producto/nuevo")}
          >
            ➕ Nuevo Producto
          </button>
        </div>
      </div>

      {loading ? (
        <p style={styles.loading}>Cargando productos...</p>
      ) : products.length === 0 ? (
        <p style={styles.empty}>No hay productos registrados.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>ID</th>
              <th style={styles.th}>Nombre</th>
              <th style={styles.th}>Descripción</th>
              <th style={styles.th}>Precio</th>
              <th style={styles.th}>Estado</th>
              <th style={styles.th}>Imágenes</th>
              <th style={styles.th}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} style={styles.tr}>
                <td style={styles.td}>{p.id}</td>
                <td style={styles.td}>{p.nombre}</td>
                <td style={styles.td}>{p.descripcion || "—"}</td>
                <td style={styles.td}>${p.precio.toLocaleString()}</td>
                <td style={styles.td}>
                  <span style={p.estado ? styles.activo : styles.inactivo}>
                    {p.estado ? "Activo" : "Inactivo"}
                  </span>
                </td>
                <td style={styles.td}>{p.imagenes?.length || 0}</td>
                <td style={styles.td}>
                  <button
                    style={styles.btnVer}
                    onClick={() => navigate(`/producto/${p.id}`)}
                  >
                    👁 Ver
                  </button>
                  <button
                    style={styles.btnEditar}
                    onClick={() => navigate(`/producto/editar/${p.id}`)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    style={styles.btnEliminar}
                    onClick={() => handleDelete(p.id)}
                  >
                    🗑 Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

// Estilos
const styles = {
  container: {
    maxWidth: "1100px",
    margin: "40px auto",
    padding: "0 20px",
    fontFamily: "Segoe UI, sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px",
  },
  title: { fontSize: "28px", color: "#1e293b" },
  actions: { display: "flex", gap: "10px" },
  btnAgregar: {
    backgroundColor: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  btnOrdenar: {
    backgroundColor: "#8b5cf6",
    color: "#fff",
    border: "none",
    padding: "10px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontSize: "14px",
  },
  loading: { textAlign: "center", color: "#64748b", fontSize: "18px" },
  empty: {
    textAlign: "center",
    color: "#94a3b8",
    fontSize: "16px",
    marginTop: "40px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    boxShadow: "0 1px 4px rgba(0,0,0,0.1)",
    borderRadius: "8px",
    overflow: "hidden",
  },
  thead: { backgroundColor: "#1e293b" },
  th: {
    padding: "14px 16px",
    color: "#fff",
    textAlign: "left",
    fontSize: "14px",
  },
  tr: { borderBottom: "1px solid #e2e8f0", backgroundColor: "#fff" },
  td: { padding: "12px 16px", fontSize: "14px", color: "#334155" },
  activo: {
    backgroundColor: "#dcfce7",
    color: "#16a34a",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },
  inactivo: {
    backgroundColor: "#fee2e2",
    color: "#dc2626",
    padding: "4px 10px",
    borderRadius: "20px",
    fontSize: "12px",
  },
  btnVer: {
    backgroundColor: "#0ea5e9",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "6px",
    fontSize: "12px",
  },
  btnEditar: {
    backgroundColor: "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    marginRight: "6px",
    fontSize: "12px",
  },
  btnEliminar: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 10px",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "12px",
  },
};

export default ProductList;

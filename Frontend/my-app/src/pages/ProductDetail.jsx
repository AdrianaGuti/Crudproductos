import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';
import ImageManager from '../components/ImageManager';

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar producto con sus imágenes
  const fetchProduct = async () => {
    try {
      const { data } = await API.get(`/products/${id}`);
      setProduct(data);
    } catch {
      alert('No se pudo cargar el producto');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  if (loading) return <p style={styles.loading}>Cargando producto...</p>;
  if (!product) return null;

  return (
    <div style={styles.container}>
      <div style={styles.card}>

        {/* Encabezado */}
        <div style={styles.header}>
          <button style={styles.btnVolver} onClick={() => navigate('/')}>
            ← Volver
          </button>
          <button style={styles.btnEditar} onClick={() => navigate(`/producto/editar/${id}`)}>
            ✏️ Editar
          </button>
        </div>

        {/* Info del producto */}
        <h2 style={styles.title}>{product.nombre}</h2>

        <div style={styles.infoGrid}>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Descripción</span>
            <span style={styles.infoValue}>{product.descripcion || '—'}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Precio</span>
            <span style={styles.precio}>${product.precio.toLocaleString()}</span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Estado</span>
            <span style={product.estado ? styles.activo : styles.inactivo}>
              {product.estado ? 'Activo' : 'Inactivo'}
            </span>
          </div>
          <div style={styles.infoItem}>
            <span style={styles.infoLabel}>Fecha de creación</span>
            <span style={styles.infoValue}>
              {new Date(product.fechaCreacion).toLocaleDateString('es-CO', {
                year: 'numeric', month: 'long', day: 'numeric'
              })}
            </span>
          </div>
        </div>

        {/* Gestión de imágenes */}
        <ImageManager
          productId={id}
          imagenes={product.imagenes}
          onUpdate={fetchProduct}
        />

      </div>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f1f5f9', padding: '40px 20px', fontFamily: 'Segoe UI, sans-serif' },
  card: { maxWidth: '800px', margin: '0 auto', backgroundColor: '#fff', borderRadius: '12px', padding: '36px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
  header: { display: 'flex', justifyContent: 'space-between', marginBottom: '24px' },
  btnVolver: { backgroundColor: 'transparent', border: '1px solid #cbd5e1', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', color: '#475569' },
  btnEditar: { backgroundColor: '#f59e0b', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px' },
  title: { fontSize: '28px', color: '#1e293b', marginBottom: '24px' },
  infoGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '36px' },
  infoItem: { display: 'flex', flexDirection: 'column', gap: '4px' },
  infoLabel: { fontSize: '12px', color: '#94a3b8', fontWeight: '600', textTransform: 'uppercase' },
  infoValue: { fontSize: '15px', color: '#334155' },
  precio: { fontSize: '22px', color: '#16a34a', fontWeight: '700' },
  activo: { backgroundColor: '#dcfce7', color: '#16a34a', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', width: 'fit-content' },
  inactivo: { backgroundColor: '#fee2e2', color: '#dc2626', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', width: 'fit-content' },
  loading: { textAlign: 'center', marginTop: '100px', fontSize: '18px', color: '#64748b' },
};

export default ProductDetail;
import { useState } from 'react';
import API from '../api/axios';

function ImageManager({ productId, imagenes, onUpdate }) {
  const [url, setUrl] = useState('');
  const [nombreArchivo, setNombreArchivo] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Validar el formulario de imagen
  const validate = () => {
    const newErrors = {};
    if (!url.trim()) newErrors.url = 'La URL es obligatoria';
    try {
      new URL(url); // Verifica que sea una URL válida
    } catch {
      if (url.trim()) newErrors.url = 'Ingresa una URL válida';
    }
    return newErrors;
  };

  // Agregar imagen
  const handleAdd = async () => {
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await API.post('/imageproducts', {
        productId: parseInt(productId),
        url: url.trim(),
        nombreArchivo: nombreArchivo.trim() || null,
      });
      setUrl('');
      setNombreArchivo('');
      setErrors({});
      onUpdate(); // Recargar el producto
    } catch {
      alert('Error al agregar la imagen');
    } finally {
      setLoading(false);
    }
  };

  // Eliminar imagen
  const handleDelete = async (imageId) => {
    if (!confirm('¿Eliminar esta imagen?')) return;
    try {
      await API.delete(`/imageproducts/${imageId}`);
      onUpdate(); // Recargar el producto
    } catch {
      alert('Error al eliminar la imagen');
    }
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>🖼️ Imágenes del Producto</h3>

      {/* Formulario para agregar imagen */}
      <div style={styles.form}>
        <div style={styles.fields}>
          <div style={styles.field}>
            <input
              style={errors.url ? styles.inputError : styles.input}
              type="text"
              placeholder="URL de la imagen *"
              value={url}
              onChange={e => { setUrl(e.target.value); setErrors({}); }}
            />
            {errors.url && <span style={styles.error}>{errors.url}</span>}
          </div>
          <div style={styles.field}>
            <input
              style={styles.input}
              type="text"
              placeholder="Nombre del archivo (opcional)"
              value={nombreArchivo}
              onChange={e => setNombreArchivo(e.target.value)}
            />
          </div>
        </div>
        <button
          style={styles.btnAgregar}
          onClick={handleAdd}
          disabled={loading}
        >
          {loading ? 'Agregando...' : '➕ Agregar'}
        </button>
      </div>

      {/* Lista de imágenes */}
      {imagenes && imagenes.length > 0 ? (
        <div style={styles.grid}>
          {imagenes.map(img => (
            <div key={img.id} style={styles.imageCard}>
              <img
                src={img.url}
                alt={img.nombreArchivo || 'Imagen del producto'}
                style={styles.image}
                onError={e => { e.target.src = 'https://via.placeholder.com/200x150?text=Sin+imagen'; }}
              />
              <div style={styles.imageInfo}>
                <span style={styles.imageName}>
                  {img.nombreArchivo || 'Sin nombre'}
                </span>
                <button
                  style={styles.btnEliminar}
                  onClick={() => handleDelete(img.id)}
                >
                  🗑 Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p style={styles.empty}>Este producto no tiene imágenes aún.</p>
      )}
    </div>
  );
}

const styles = {
  container: { borderTop: '1px solid #e2e8f0', paddingTop: '28px' },
  title: { fontSize: '18px', color: '#1e293b', marginBottom: '20px' },
  form: { display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap' },
  fields: { display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 },
  field: { display: 'flex', flexDirection: 'column' },
  input: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', minWidth: '260px' },
  inputError: { padding: '10px 14px', borderRadius: '8px', border: '1px solid #ef4444', fontSize: '14px', outline: 'none', minWidth: '260px' },
  error: { color: '#ef4444', fontSize: '12px', marginTop: '4px' },
  btnAgregar: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '10px 20px', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', whiteSpace: 'nowrap', height: 'fit-content' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '16px' },
  imageCard: { borderRadius: '10px', overflow: 'hidden', border: '1px solid #e2e8f0', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' },
  image: { width: '100%', height: '140px', objectFit: 'cover', display: 'block' },
  imageInfo: { padding: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#f8fafc' },
  imageName: { fontSize: '12px', color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '100px' },
  btnEliminar: { backgroundColor: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' },
  empty: { color: '#94a3b8', fontSize: '14px', textAlign: 'center', padding: '20px 0' },
};

export default ImageManager;
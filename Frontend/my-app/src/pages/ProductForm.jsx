import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api/axios';

function ProductForm() {
  const { id } = useParams(); // Si hay id en la URL, es edición
  const navigate = useNavigate();
  const isEditing = !!id;

  const [form, setForm] = useState({
    nombre: '',
    descripcion: '',
    precio: '',
    estado: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Si es edición, cargar los datos del producto
  useEffect(() => {
    if (isEditing) {
      const fetchProduct = async () => {
        try {
          const { data } = await API.get(`/products/${id}`);
          setForm({
            nombre: data.nombre,
            descripcion: data.descripcion || '',
            precio: data.precio,
            estado: data.estado,
          });
        } catch  {
          alert('No se pudo cargar el producto');
          navigate('/');
        }
      };
      fetchProduct();
    }
  }, [id]);

  // Manejar cambios en los inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Limpiar error del campo al escribir
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validaciones del formulario
  const validate = () => {
    const newErrors = {};
    if (!form.nombre.trim()) newErrors.nombre = 'El nombre es obligatorio';
    if (form.nombre.length > 100) newErrors.nombre = 'Máximo 100 caracteres';
    if (!form.precio) newErrors.precio = 'El precio es obligatorio';
    if (parseFloat(form.precio) <= 0) newErrors.precio = 'El precio debe ser mayor a 0';
    return newErrors;
  };

  // Enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        precio: parseFloat(form.precio),
      };

      if (isEditing) {
        await API.put(`/products/${id}`, payload);
        alert('Producto actualizado correctamente ✅');
      } else {
        await API.post('/products', payload);
        alert('Producto creado correctamente ✅');
      }

      navigate('/');
    } catch  {
      alert('Error al guardar el producto');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>
          {isEditing ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
        </h2>

        <form onSubmit={handleSubmit} noValidate>

          {/* Nombre */}
          <div style={styles.field}>
            <label style={styles.label}>Nombre *</label>
            <input
              style={errors.nombre ? styles.inputError : styles.input}
              type="text"
              name="nombre"
              value={form.nombre}
              onChange={handleChange}
              placeholder="Nombre del producto"
              maxLength={100}
            />
            {errors.nombre && <span style={styles.error}>{errors.nombre}</span>}
          </div>

          {/* Descripción */}
          <div style={styles.field}>
            <label style={styles.label}>Descripción</label>
            <textarea
              style={styles.textarea}
              name="descripcion"
              value={form.descripcion}
              onChange={handleChange}
              placeholder="Descripción del producto (opcional)"
              maxLength={500}
              rows={3}
            />
          </div>

          {/* Precio */}
          <div style={styles.field}>
            <label style={styles.label}>Precio *</label>
            <input
              style={errors.precio ? styles.inputError : styles.input}
              type="number"
              name="precio"
              value={form.precio}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
            {errors.precio && <span style={styles.error}>{errors.precio}</span>}
          </div>

          {/* Estado */}
          <div style={styles.checkboxField}>
            <input
              type="checkbox"
              name="estado"
              id="estado"
              checked={form.estado}
              onChange={handleChange}
              style={styles.checkbox}
            />
            <label htmlFor="estado" style={styles.checkboxLabel}>
              Producto activo
            </label>
          </div>

          {/* Botones */}
          <div style={styles.buttons}>
            <button
              type="button"
              style={styles.btnCancelar}
              onClick={() => navigate('/')}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={styles.btnGuardar}
              disabled={loading}
            >
              {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear Producto'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

// Estilos
const styles = {
  container: { minHeight: '100vh', backgroundColor: '#f1f5f9', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'Segoe UI, sans-serif', padding: '20px' },
  card: { backgroundColor: '#fff', borderRadius: '12px', padding: '40px', width: '100%', maxWidth: '520px', boxShadow: '0 4px 16px rgba(0,0,0,0.1)' },
  title: { fontSize: '24px', color: '#1e293b', marginBottom: '28px' },
  field: { marginBottom: '20px' },
  label: { display: 'block', fontSize: '14px', fontWeight: '600', color: '#475569', marginBottom: '6px' },
  input: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  inputError: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #ef4444', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  textarea: { width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' },
  error: { color: '#ef4444', fontSize: '12px', marginTop: '4px', display: 'block' },
  checkboxField: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '28px' },
  checkbox: { width: '16px', height: '16px', cursor: 'pointer' },
  checkboxLabel: { fontSize: '14px', color: '#475569', cursor: 'pointer' },
  buttons: { display: 'flex', justifyContent: 'flex-end', gap: '12px' },
  btnCancelar: { padding: '10px 20px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#fff', color: '#475569', cursor: 'pointer', fontSize: '14px' },
  btnGuardar: { padding: '10px 24px', borderRadius: '8px', border: 'none', backgroundColor: '#3b82f6', color: '#fff', cursor: 'pointer', fontSize: '14px', fontWeight: '600' },
};

export default ProductForm;
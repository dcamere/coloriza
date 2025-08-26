import * as Yup from 'yup'

// Regex para teléfono peruano (9 dígitos que empiecen con 9)
const peruPhoneRegex = /^9\d{8}$/

// Regex para email más estricta que requiere dominio válido
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/

const validators = [
  // Paso 0: Medidas (Step4)
  {
    ancho: Yup.number()
      .typeError('Debe ser un número')
      .min(1, 'Debe ser mayor a 0')
      .required('Este campo es requerido'),
    alto: Yup.number()
      .typeError('Debe ser un número')
      .min(1, 'Debe ser mayor a 0')
      .required('Este campo es requerido'),
    uploads: Yup.string()
      .test('has-files', 'Debes subir al menos 1 archivo', function(value) {
        if (!value) return false;
        try {
          const files = JSON.parse(value);
          return Array.isArray(files) && files.length > 0;
        } catch {
          return false;
        }
      })
      .required('Debes subir al menos 1 archivo'),
  },
  
  // Paso 1: Ubicación (UbicacionStep)
  {
    direccionUsuario: Yup.string()
      .min(3, 'Debe tener al menos 3 caracteres')
      .max(200, 'No puede tener más de 200 caracteres')
      .required('Este campo es requerido'),
    porQueMejorar: Yup.string()
      .min(5, 'Debe tener al menos 5 caracteres')
      .max(200, 'No puede tener más de 200 caracteres')
      .required('Este campo es requerido'),
    // Validar que se hayan seleccionado coordenadas del mapa
    latitud: Yup.number()
      .typeError('Debe seleccionar una ubicación en el mapa')
      .required('Debe seleccionar una ubicación en el mapa'),
    longitud: Yup.number()
      .typeError('Debe seleccionar una ubicación en el mapa')
      .required('Debe seleccionar una ubicación en el mapa'),
  },
  
  // Paso 2: Contacto (ContactoStep)
  {
    nombreContacto: Yup.string()
      .min(2, 'Debe tener al menos 2 caracteres')
      .max(80, 'No puede tener más de 80 caracteres')
      .required('Este campo es requerido'),
    comoEnteraste: Yup.string()
      .required('Este campo es requerido'),
    email: Yup.string()
      .matches(emailRegex, 'Debe ser un email válido')
      .required('Este campo es requerido'),
    // Validaciones condicionales para campos opcionales
    // whatsapp: Yup.string()
    //   .test('whatsapp-format', 'Debe ser un número válido (ej: 944444444)', function(value) {
    //     if (!value || value.length === 0) return true; // Es opcional
    //     return peruPhoneRegex.test(value);
    //   }),
  },
]

export default validators

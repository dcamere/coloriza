import * as Yup from 'yup'
import parse from 'date-fns/parse'

const validators = [
  {
    estiloMural: Yup.string().nullable(),
    estiloMuralOpcional: Yup.string().nullable(),
    custom: Yup.mixed().test({
      name: 'radioOrTextArea',
      test: function(value) {
        const { estiloMural, estiloMuralOpcional } = this.parent;
        return (!!estiloMural || !!estiloMuralOpcional) && (!estiloMuralOpcional || estiloMuralOpcional.length >= 5);
      },
      message: 'Por favor, selecciona una opción del radio o escribe algo con al menos 5 caracteres en el textarea.',
    }),

  },
  {
    superficieMural: Yup.string().nullable(),
    superficieMuralOpcional: Yup.string().nullable(),
    custom: Yup.mixed().test({
      name: 'radioOrTextArea',
      test: function(value) {
        const { superficieMural, superficieMuralOpcional } = this.parent;
        return (!!superficieMural || !!superficieMuralOpcional) && (!superficieMuralOpcional || superficieMuralOpcional.length >= 5);
      },
      message: 'Por favor, selecciona una opción del radio o escribe algo con al menos 5 caracteres en el textarea.',
    }),
  },
  {
    espacioMural: Yup.string().nullable(),
    espacioMuralOpcional: Yup.string().nullable(),
    custom: Yup.mixed().test({
      name: 'radioOrTextArea',
      test: function(value) {
        const { espacioMural, espacioMuralOpcional } = this.parent;
        return (!!espacioMural || !!espacioMuralOpcional) && (!espacioMuralOpcional || espacioMuralOpcional.length >= 5);
      },
      message: 'Por favor, selecciona una opción del radio o escribe algo con al menos 5 caracteres en el textarea.',
    }),
  },
  {
    ancho: Yup.number().min(1, '').required('Este campo es requerido'),
    alto: Yup.number().min(1, '').required('Este campo es requerido'),
  },
  {
    nombreUsuario: Yup.string()
      .min(2, 'Debe tener al menos 2 caracteres')
      .max(80, 'No puede tener más de 80 caracteres')
      .required('Este campo es requerido'),
    fechaRequerida: Yup.date()
      .transform(function (value, originalValue) {
        if (this.isType(value)) return value
        const result = parse(originalValue, 'dd/MM/yyyy', new Date())
        return result
      })
      .typeError('Debe ingresar una fecha válida')
      .min(new Date(), 'No es posible reservas de fechas pasadas')
      .required('La fecha es requerida'),
    direccionUsuario: Yup.string()
      .min(2, 'Debe tener al menos 2 caracteres')
      .max(200, 'No puede tener más de 200 caracteres')
      .required('Este campo es requerido'),
    celularUsuario: Yup.string()
      .min(5, 'Debe tener al menos 5 números')
      .max(15, 'No puede tener más de 15 caracteres')
      .required('Este campo es requerido'),
    emailUsuario: Yup.string()
      .email('El email no tiene un formato valido')
      .required('Este campo es requerido'),
    descripcion: Yup.string()
      .min(5, 'Debe tener al menos 5 números')
      .required('Este campo es requerido'),
  },
]

export default validators

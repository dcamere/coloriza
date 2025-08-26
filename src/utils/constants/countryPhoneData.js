// Ejemplo mínimo, puedes expandirlo con más países y banderas SVG/emoji
const countryData = [
  // 🔝 Prioridad
  { code: 'PE', name: 'Perú', prefix: '+51', flag: '🇵🇪' },
  { code: 'CO', name: 'Colombia', prefix: '+57', flag: '🇨🇴' },
  { code: 'CL', name: 'Chile', prefix: '+56', flag: '🇨🇱' },
  { code: 'EC', name: 'Ecuador', prefix: '+593', flag: '🇪🇨' },
  { code: 'SV', name: 'El Salvador', prefix: '+503', flag: '🇸🇻' },
  { code: 'MX', name: 'México', prefix: '+52', flag: '🇲🇽' },
  { code: 'PA', name: 'Panamá', prefix: '+507', flag: '🇵🇦' },

  // 🇦🇷 Sudamérica
  { code: 'AR', name: 'Argentina', prefix: '+54', flag: '🇦🇷' },
  { code: 'BO', name: 'Bolivia', prefix: '+591', flag: '🇧🇴' },
  { code: 'BR', name: 'Brasil', prefix: '+55', flag: '🇧🇷' },
  { code: 'GY', name: 'Guyana', prefix: '+592', flag: '🇬🇾' },
  { code: 'PY', name: 'Paraguay', prefix: '+595', flag: '🇵🇾' },
  { code: 'SR', name: 'Surinam', prefix: '+597', flag: '🇸🇷' },
  { code: 'UY', name: 'Uruguay', prefix: '+598', flag: '🇺🇾' },
  { code: 'VE', name: 'Venezuela', prefix: '+58', flag: '🇻🇪' },

  // 🇨🇷 Centroamérica
  { code: 'BZ', name: 'Belice', prefix: '+501', flag: '🇧🇿' },
  { code: 'CR', name: 'Costa Rica', prefix: '+506', flag: '🇨🇷' },
  { code: 'GT', name: 'Guatemala', prefix: '+502', flag: '🇬🇹' },
  { code: 'HN', name: 'Honduras', prefix: '+504', flag: '🇭🇳' },
  { code: 'NI', name: 'Nicaragua', prefix: '+505', flag: '🇳🇮' },

  // 🇨🇺 Caribe
  { code: 'CU', name: 'Cuba', prefix: '+53', flag: '🇨🇺' },
  { code: 'DO', name: 'República Dominicana', prefix: '+1-809', flag: '🇩🇴' },
  { code: 'PR', name: 'Puerto Rico', prefix: '+1-787', flag: '🇵🇷' },
  { code: 'JM', name: 'Jamaica', prefix: '+1-876', flag: '🇯🇲' },
  { code: 'TT', name: 'Trinidad y Tobago', prefix: '+1-868', flag: '🇹🇹' },
  { code: 'HT', name: 'Haití', prefix: '+509', flag: '🇭🇹' },
  { code: 'BS', name: 'Bahamas', prefix: '+1-242', flag: '🇧🇸' },
  { code: 'BB', name: 'Barbados', prefix: '+1-246', flag: '🇧🇧' },
  { code: 'GD', name: 'Granada', prefix: '+1-473', flag: '🇬🇩' },
  { code: 'LC', name: 'Santa Lucía', prefix: '+1-758', flag: '🇱🇨' },
  { code: 'VC', name: 'San Vicente y las Granadinas', prefix: '+1-784', flag: '🇻🇨' },
  { code: 'AG', name: 'Antigua y Barbuda', prefix: '+1-268', flag: '🇦🇬' },
  { code: 'DM', name: 'Dominica', prefix: '+1-767', flag: '🇩🇲' },
  { code: 'KN', name: 'San Cristóbal y Nieves', prefix: '+1-869', flag: '🇰🇳' },

  // 🇺🇸 Norteamérica
  { code: 'US', name: 'Estados Unidos', prefix: '+1', flag: '🇺🇸' },
  { code: 'CA', name: 'Canadá', prefix: '+1', flag: '🇨🇦' },

  // 🇪🇺 Europa añadida
  { code: 'ES', name: 'España', prefix: '+34', flag: '🇪🇸' },
  { code: 'PT', name: 'Portugal', prefix: '+351', flag: '🇵🇹' },
  { code: 'FR', name: 'Francia', prefix: '+33', flag: '🇫🇷' },
  { code: 'IT', name: 'Italia', prefix: '+39', flag: '🇮🇹' }
];

export default countryData;


/**
 * Formatea un número como moneda según la configuración regional y la moneda especificada
 * @param amount - Cantidad a formatear
 * @param currency - Código de moneda ISO 4217 (por defecto: 'USD')
 * @param locale - Configuración regional (por defecto: 'es-ES')
 * @returns Cadena formateada como moneda
 */
export const formatCurrency = (
  amount: number, 
  currency = 'USD', 
  locale = 'es-ES'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Formatea un valor de moneda como número
 * @param currencyString - Cadena formateada como moneda
 * @returns Número sin formato
 */
export const parseCurrency = (currencyString: string): number => {
  // Eliminar símbolos de moneda y separadores de miles, reemplazar coma decimal por punto
  const numericString = currencyString
    .replace(/[^\d.,]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  
  return parseFloat(numericString);
};

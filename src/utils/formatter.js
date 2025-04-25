/**
 * Format a number with thousand separator
 * @param {number} value - The number to format
 * @param {boolean} withDecimals - Whether to include decimal places (default: false)
 * @param {number} decimalPlaces - Number of decimal places (default: 2)
 * @returns {string} - Formatted number string
 */
export const formatNumber = (value, withDecimals = false, decimalPlaces = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  const parsedValue = parseFloat(value);

  if (withDecimals) {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimalPlaces,
      maximumFractionDigits: decimalPlaces
    }).format(parsedValue);
  } else {
    return new Intl.NumberFormat('en-US').format(parsedValue);
  }
};

/**
 * Format a number as currency with a currency symbol
 * @param {number} value - The number to format
 * @param {string} currencySymbol - The currency symbol (default: '$')
 * @param {number} decimalPlaces - Number of decimal places (default: 2)
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (value, currencySymbol = '$', decimalPlaces = 2) => {
  if (value === null || value === undefined || isNaN(value)) {
    return `${currencySymbol} 0`;
  }

  const parsedValue = parseFloat(value);

  return `${currencySymbol} ${new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(parsedValue)}`;
};

/**
 * Format a number with suffix (K, M, B, T)
 * @param {number} value - The number to format
 * @param {number} precision - Number of decimal places for the result (default: 1)
 * @returns {string} - Formatted number with suffix
 */
export const formatNumberWithSuffix = (value, precision = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  const parsedValue = parseFloat(value);
  
  if (parsedValue < 1000) {
    return parsedValue.toString();
  }
  
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  const suffixNum = Math.floor(Math.log10(Math.abs(parsedValue)) / 3);
  
  const shortValue = (parsedValue / Math.pow(1000, suffixNum)).toFixed(precision);
  
  return shortValue + suffixes[suffixNum];
}; 
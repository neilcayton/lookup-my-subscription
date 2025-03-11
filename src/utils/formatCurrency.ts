/**
 * Formats a number as currency with the specified locale and currency code
 * @param amount - The amount to format
 * @param locale - The locale to use for formatting (default: 'en-US')
 * @param currencyCode - The currency code to use (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  locale: string = 'en-US',
  currencyCode: string = 'USD'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Parses a currency string back to a number
 * @param currencyString - The currency string to parse
 * @returns The parsed number value
 */
export const parseCurrencyToNumber = (currencyString: string): number => {
  // Remove currency symbols and other non-numeric characters except decimal point
  const numericString = currencyString.replace(/[^0-9.-]/g, '');
  return parseFloat(numericString);
};

export default formatCurrency;
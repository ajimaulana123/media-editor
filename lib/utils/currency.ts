const exchangeRates = {
    USD_TO_IDR: 15500, // Update sesuai kurs terkini
    IDR_TO_USD: 1 / 15500
}

export function formatCurrency(
    amount: number, 
    fromCurrency: 'USD' | 'IDR', 
    toCurrency: 'USD' | 'IDR'
): string {
    let convertedAmount = amount
    
    if (fromCurrency !== toCurrency) {
        const rate = fromCurrency === 'USD' ? 
            exchangeRates.USD_TO_IDR : 
            exchangeRates.IDR_TO_USD
        convertedAmount = amount * rate
    }

    const formatter = new Intl.NumberFormat(toCurrency === 'IDR' ? 'id-ID' : 'en-US', {
        style: 'currency',
        currency: toCurrency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2
    })

    return formatter.format(convertedAmount)
} 
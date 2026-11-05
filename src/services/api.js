const API_KEY = 'e0375d0b19b346c9ee197f9b';
const BASE_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}`;

// Nomes amigáveis em português para as moedas mais comuns
export const COMMON_CURRENCY_NAMES = {
  BRL: 'Real Brasileiro',
  USD: 'Dólar Americano',
  EUR: 'Euro',
  GBP: 'Libra Esterlina',
  JPY: 'Iene Japonês',
  ARS: 'Peso Argentino',
  CAD: 'Dólar Canadense',
  AUD: 'Dólar Australiano',
  CHF: 'Franco Suíço',
  CNY: 'Yuan Chinês',
  CLP: 'Peso Chileno',
  COP: 'Peso Colombiano',
  MXN: 'Peso Mexicano',
  UYU: 'Peso Uruguaio',
  PYG: 'Guarani Paraguaio',
  PEN: 'Sol Peruano',
  BOB: 'Boliviano',
  INR: 'Rúpia Indiana',
  KRW: 'Won Sul-Coreano',
  RUB: 'Rublo Russo',
  NZD: 'Dólar Neozelandês',
  SGD: 'Dólar de Cingapura',
  ZAR: 'Rand Sul-Africano',
  SEK: 'Coroa Sueca',
  NOK: 'Coroa Norueguesa',
  DKK: 'Coroa Dinamarquesa',
  TRY: 'Lira Turca',
  ILS: 'Novo Shekel Israelense',
  SAR: 'Riyal Saudita',
  AED: 'Dirham dos Emirados',
  BTC: 'Bitcoin',
};

// Símbolos das moedas principais
export const CURRENCY_SYMBOLS = {
  BRL: 'R$',
  USD: '$',
  EUR: '€',
  GBP: '£',
  JPY: '¥',
  ARS: '$',
  CAD: 'C$',
  AUD: 'A$',
  CHF: 'CHF',
  CNY: '¥',
  CLP: '$',
  INR: '₹',
  KRW: '₩',
  RUB: '₽',
  BTC: '₿',
};

/**
 * Retorna o nome amigável da moeda (priorizando o nome em português)
 */
export function getCurrencyName(code, apiName = '') {
  if (COMMON_CURRENCY_NAMES[code]) {
    return COMMON_CURRENCY_NAMES[code];
  }
  return apiName || code;
}

/**
 * Busca a lista de códigos e nomes suportados pela API
 */
export async function getSupportedCurrencies() {
  try {
    const response = await fetch(`${BASE_URL}/codes`);
    const data = await response.json();

    if (data.result === 'success' && Array.isArray(data.supported_codes)) {
      return {
        success: true,
        codes: data.supported_codes.map(([code, name]) => ({
          code,
          name: getCurrencyName(code, name),
          originalName: name,
        })),
      };
    } else {
      return {
        success: false,
        error: data['error-type'] || 'Não foi possível carregar as moedas suportadas.',
      };
    }
  } catch (error) {
    console.error('Erro no serviço getSupportedCurrencies:', error);
    return {
      success: false,
      error: 'Erro de conexão ao buscar moedas suportadas.',
    };
  }
}

/**
 * Busca as taxas de câmbio mais recentes com base em uma moeda padrão (default USD)
 */
export async function getLatestRates(baseCurrency = 'USD') {
  try {
    const response = await fetch(`${BASE_URL}/latest/${baseCurrency}`);
    const data = await response.json();

    if (data.result === 'success') {
      return {
        success: true,
        baseCurrency: data.base_code,
        rates: data.conversion_rates,
        lastUpdateUtc: data.time_last_update_utc,
      };
    } else {
      return {
        success: false,
        error: data['error-type'] || 'Erro ao carregar taxas de câmbio.',
      };
    }
  } catch (error) {
    console.error('Erro no serviço getLatestRates:', error);
    return {
      success: false,
      error: 'Erro de conexão ao buscar taxas de câmbio.',
    };
  }
}

/**
 * Realiza a conversão direta entre duas moedas com valor informado
 */
export async function convertCurrency(fromCurrency, toCurrency, amount) {
  try {
    const sanitizedAmount = parseFloat(String(amount).replace(',', '.'));
    if (isNaN(sanitizedAmount) || sanitizedAmount <= 0) {
      return {
        success: false,
        error: 'Informe um valor numérico válido maior que zero.',
      };
    }

    const response = await fetch(
      `${BASE_URL}/pair/${fromCurrency}/${toCurrency}/${sanitizedAmount}`
    );
    const data = await response.json();

    if (data.result === 'success') {
      return {
        success: true,
        baseCode: data.base_code,
        targetCode: data.target_code,
        conversionRate: data.conversion_rate,
        targetValue: data.conversion_result,
        lastUpdateUtc: data.time_last_update_utc,
      };
    } else {
      return {
        success: false,
        error: data['error-type'] || 'Erro ao realizar a conversão na API.',
      };
    }
  } catch (error) {
    console.error('Erro no serviço convertCurrency:', error);
    return {
      success: false,
      error: 'Falha na conexão com a API de câmbio.',
    };
  }
}

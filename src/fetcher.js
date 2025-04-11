const API_KEY = import.meta.env.VITE_API_KEY

export class SiteAPI{
  BASE_URL = "https://api.marketstack.com/v2"
  constructor(){
    this.fetchCurrencyRate = this.fetchCurrencyRate.bind(this);
    this.fetchStock = this.fetchStock.bind(this);
  }

  async fetchCurrencyRate() {
    const currencyList = document.getElementById('currencyList');

    try {

      let currencies = await fetch(this.BASE_URL + `/currencies?access_key=${API_KEY}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Сетевая ошибка');
        }
        return response.json();
      })
      .then(data => {
        return data.data
      })
      .catch(error => {
        console.error('Произошла ошибка:', error);
      });
      
      currencyList.innerHTML = '';

      currencies.forEach(currency => {
          const currencyItem = document.createElement('div');
          currencyItem.className = 'currency-item';
          currencyItem.innerHTML = `<span>${currency.name} (${currency.code})</span>`;
          currencyList.appendChild(currencyItem);
      });
      
  } catch (error) {
      currencyList.innerHTML = `
          <div class="error">Ошибка загрузки курсов валют</div>
      `;
      console.error('Ошибка загрузки курсов валют:', error);
  }
  }


  async fetchStock() {
    const exchange = document.getElementById('exchangeSelect').value;
    const ticker = document.getElementById('tickerInput').value.trim();
    const errorMessage = document.getElementById('errorMessage');
    const stockInfo = document.getElementById('stockInfo');
    const stockName = document.getElementById('stockName');
    const stockDetails = document.getElementById('stockDetails');
    const searchButton = document.getElementById('searchButton');
    
    if (!ticker) {
        errorMessage.textContent = 'Пожалуйста, введите тикер акции';
        return;
    }
    
    errorMessage.textContent = '';
    stockInfo.style.display = 'none';
    searchButton.disabled = true;
    searchButton.innerHTML = 'Поиск <span class="loading"></span>';
    
    try {

      const stockData = await fetch(this.BASE_URL + `/tickers/${ticker}/eod/latest?access_key=${API_KEY}&exchange=${exchange}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Сетевая ошибка');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Произошла ошибка:', error);
      });
        
        
      if (!stockData) {
          throw new Error('Акция не найдена');
      }
        
      stockName.textContent = `${stockData.name} (${stockData.symbol})`;
      let currency = stockData.price_currency
      let stockPriceChange = stockData.close - stockData.open
      let changePercent = (stockData.open / stockPriceChange) * 100
        
      stockDetails.innerHTML = `
            <div class="info-item">
                <div class="info-label">Цена</div>
                <div>${stockData.close.toFixed(2)} ${currency}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Изменение</div>
                <div style="color: ${stockPriceChange >= 0 ? 'green' : 'red'}">
                    ${stockPriceChange >= 0 ? '+' : ''}${stockPriceChange.toFixed(2)} 
                    (${changePercent >= 0 ? '+' : ''}${changePercent.toFixed(2)}%)
                </div>
            </div>
            <div class="info-item">
                <div class="info-label">Открытие</div>
                <div>${stockData.open.toFixed(2)} ${currency}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Максимум</div>
                <div>${stockData.high.toFixed(2)} ${currency}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Минимум</div>
                <div>${stockData.low.toFixed(2)} ${currency}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Объем</div>
                <div>${stockData.volume.toLocaleString()}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Биржа</div>
                <div>${stockData.exchange_code}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Дата</div>
                <div>${new Date(stockData.date).toLocaleString()}</div>
            </div>
        `;
        
        stockInfo.style.display = 'block';
        
    } catch (error) {
        errorMessage.textContent = error.message || 'Произошла ошибка при поиске акции';
        console.error('Ошибка поиска акции:', error);
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = 'Поиск';
    }
  }
}


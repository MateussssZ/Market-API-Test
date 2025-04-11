import './style.css'
import { SiteAPI } from './fetcher';
const API = new SiteAPI()

document.addEventListener('DOMContentLoaded', () => {
    API.fetchCurrencyRate();
    
    const exchangeSelect = document.getElementById('exchangeSelect');
    const tickerSearch = document.getElementById('tickerSearch');
    
    exchangeSelect.addEventListener('change', () => {
        if (exchangeSelect.value) {
            tickerSearch.style.display = 'block';
        } else {
            tickerSearch.style.display = 'none';
            document.getElementById('stockInfo').style.display = 'none';
        }
    });
    
    document.getElementById('searchButton').addEventListener('click', API.fetchStock);
    
    document.getElementById('tickerInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            API.fetchStock();
        }
    });
});
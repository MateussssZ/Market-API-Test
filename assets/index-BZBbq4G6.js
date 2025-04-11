var y=Object.defineProperty;var g=(s,t,i)=>t in s?y(s,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):s[t]=i;var v=(s,t,i)=>g(s,typeof t!="symbol"?t+"":t,i);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const e of document.querySelectorAll('link[rel="modulepreload"]'))c(e);new MutationObserver(e=>{for(const o of e)if(o.type==="childList")for(const r of o.addedNodes)r.tagName==="LINK"&&r.rel==="modulepreload"&&c(r)}).observe(document,{childList:!0,subtree:!0});function i(e){const o={};return e.integrity&&(o.integrity=e.integrity),e.referrerPolicy&&(o.referrerPolicy=e.referrerPolicy),e.crossOrigin==="use-credentials"?o.credentials="include":e.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function c(e){if(e.ep)return;e.ep=!0;const o=i(e);fetch(e.href,o)}})();const h="6dbcdd0edc98fa7dcb86fda574f415a1";class p{constructor(){v(this,"BASE_URL","https://api.marketstack.com/v2");this.fetchCurrencyRate=this.fetchCurrencyRate.bind(this),this.fetchStock=this.fetchStock.bind(this)}async fetchCurrencyRate(){const t=document.getElementById("currencyList");try{let i=await fetch(this.BASE_URL+`/currencies?access_key=${h}`).then(c=>{if(!c.ok)throw new Error("Сетевая ошибка");return c.json()}).then(c=>c.data).catch(c=>{console.error("Произошла ошибка:",c)});t.innerHTML="",i.forEach(c=>{const e=document.createElement("div");e.className="currency-item",e.innerHTML=`<span>${c.name} (${c.code})</span>`,t.appendChild(e)})}catch(i){t.innerHTML=`
          <div class="error">Ошибка загрузки курсов валют</div>
      `,console.error("Ошибка загрузки курсов валют:",i)}}async fetchStock(){const t=document.getElementById("exchangeSelect").value,i=document.getElementById("tickerInput").value.trim(),c=document.getElementById("errorMessage"),e=document.getElementById("stockInfo"),o=document.getElementById("stockName"),r=document.getElementById("stockDetails"),d=document.getElementById("searchButton");if(!i){c.textContent="Пожалуйста, введите тикер акции";return}c.textContent="",e.style.display="none",d.disabled=!0,d.innerHTML='Поиск <span class="loading"></span>';try{const n=await fetch(this.BASE_URL+`/tickers/${i}/eod/latest?access_key=${h}&exchange=${t}`).then(f=>{if(!f.ok)throw new Error("Сетевая ошибка");return f.json()}).catch(f=>{console.error("Произошла ошибка:",f)});if(!n)throw new Error("Акция не найдена");o.textContent=`${n.name} (${n.symbol})`;let a=n.price_currency,l=n.close-n.open,m=l/n.open*100;r.innerHTML=`
            <div class="info-item">
                <div class="info-label">Цена</div>
                <div>${n.close.toFixed(2)} ${a}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Изменение</div>
                <div style="color: ${l>=0?"green":"red"}">
                    ${l>=0?"+":""}${l.toFixed(2)} 
                    (${m>=0?"+":""}${m.toFixed(2)}%)
                </div>
            </div>
            <div class="info-item">
                <div class="info-label">Открытие</div>
                <div>${n.open.toFixed(2)} ${a}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Максимум</div>
                <div>${n.high.toFixed(2)} ${a}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Минимум</div>
                <div>${n.low.toFixed(2)} ${a}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Объем</div>
                <div>${n.volume.toLocaleString()}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Биржа</div>
                <div>${n.exchange_code}</div>
            </div>
            <div class="info-item">
                <div class="info-label">Дата</div>
                <div>${new Date(n.date).toLocaleString()}</div>
            </div>
        `,e.style.display="block"}catch(n){c.textContent=n.message||"Произошла ошибка при поиске акции",console.error("Ошибка поиска акции:",n)}finally{d.disabled=!1,d.textContent="Поиск"}}}const u=new p;document.addEventListener("DOMContentLoaded",()=>{u.fetchCurrencyRate();const s=document.getElementById("exchangeSelect"),t=document.getElementById("tickerSearch");s.addEventListener("change",()=>{s.value?t.style.display="block":(t.style.display="none",document.getElementById("stockInfo").style.display="none")}),document.getElementById("searchButton").addEventListener("click",u.fetchStock),document.getElementById("tickerInput").addEventListener("keypress",i=>{i.key==="Enter"&&u.fetchStock()})});

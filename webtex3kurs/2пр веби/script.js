
// script.js — робота з API (fetch для України, axios для списку країн)
// Ключові вимоги виконано:
// 1) fetch — отримання інформації про Україну
// 2) axios — отримання списку країн
// 3) Кнопки "Оновити" / "Завантажити", обробка помилок, оновлення без перезавантаження
document.addEventListener('DOMContentLoaded', () => {
  const ukraineLoading = document.getElementById('ukraine-loading');
  const ukraineError = document.getElementById('ukraine-error');
  const ukraineData = document.getElementById('ukraine-data');
  const ukraineFlag = document.getElementById('ukraine-flag');
  const ukraineInfo = document.getElementById('ukraine-info');
  const fetchBtn = document.getElementById('fetch-ukraine-btn');

  const allLoading = document.getElementById('all-loading');
  const allError = document.getElementById('all-error');
  const countriesContainer = document.getElementById('countries-container');
  const axiosBtn = document.getElementById('axios-all-btn');
  const searchInput = document.getElementById('search');

  // --- HELPERS ---
  function formatNumber(n){ return n?.toLocaleString('en-US') ?? '—'; }
  function formatCurrencies(obj){
    if(!obj) return '—';
    try {
      return Object.entries(obj).map(([code, val]) => `${val.name} (${code})`).join(', ');
    } catch(e){ return '—'; }
  }
  function formatLanguages(obj){
    if(!obj) return '—';
    try { return Object.values(obj).join(', '); } catch(e){ return '—'; }
  }

  // --- FETCH: info about Ukraine ---
  async function fetchUkraine(){
    ukraineError.hidden = true;
    ukraineData.hidden = true;
    ukraineLoading.hidden = false;
    try {
      const response = await fetch('https://restcountries.com/v3.1/name/ukraine');
      if(!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();
      if(!Array.isArray(data) || data.length === 0) throw new Error('Порожня відповідь від API');
      const u = data[0];
      ukraineFlag.src = u.flags?.svg || u.flags?.png || '';
      ukraineFlag.alt = 'Прапор ' + (u.name?.common || 'Україна');
      const html = `
        <h3>${u.name?.common || 'Україна'}</h3>
        <p><strong>Офіційна назва:</strong> ${u.name?.official || '—'}</p>
        <p><strong>Столиця:</strong> ${(u.capital && u.capital[0]) || '—'}</p>
        <p><strong>Регіон / Субрегіон:</strong> ${u.region || '—'} / ${u.subregion || '—'}</p>
        <p><strong>Населення:</strong> ${formatNumber(u.population)}</p>
        <p><strong>Площа (км²):</strong> ${formatNumber(u.area)}</p>
        <p><strong>Мови:</strong> ${formatLanguages(u.languages)}</p>
        <p><strong>Валюти:</strong> ${formatCurrencies(u.currencies)}</p>
        <p><a href="${u.maps?.googleMaps || '#'}" target="_blank">Показати на карті</a></p>
      `;
      ukraineInfo.innerHTML = html;
      ukraineData.hidden = false;
    } catch (err){
      ukraineError.hidden = false;
      ukraineError.textContent = 'Помилка при отриманні даних України: ' + err.message;
      console.error(err);
    } finally {
      ukraineLoading.hidden = true;
    }
  }

  // --- AXIOS: всі країни ---
  let allCountriesCache = null;
  async function loadAllCountriesAxios(force=false){
    allError.hidden = true;
    countriesContainer.innerHTML = '';
    allLoading.hidden = false;
    try {
      if(allCountriesCache && !force){
        renderCountries(allCountriesCache);
        return;
      }
      const resp = await axios.get('https://restcountries.com/v3.1/all');
      if(!Array.isArray(resp.data)) throw new Error('Невірний формат відповіді');
      // sort by name for predictability
      const list = resp.data.sort((a,b)=>{
        const na = a.name?.common || ''; const nb = b.name?.common || '';
        return na.localeCompare(nb);
      });
      allCountriesCache = list;
      renderCountries(list);
    } catch(err){
      allError.hidden = false;
      allError.textContent = 'Помилка при отриманні списку країн: ' + (err.message || err);
      console.error(err);
    } finally {
      allLoading.hidden = true;
    }
  }

  function renderCountries(list){
    countriesContainer.innerHTML = '';
    if(!Array.isArray(list) || list.length === 0){
      countriesContainer.innerHTML = '<p>Країн не знайдено.</p>';
      return;
    }
    const query = (searchInput.value || '').trim().toLowerCase();
    const filtered = list.filter(c => (c.name?.common || '').toLowerCase().includes(query));
    if(filtered.length === 0){
      countriesContainer.innerHTML = '<p>За вашим запитом нічого не знайдено.</p>';
      return;
    }
    for(const c of filtered){
      const card = document.createElement('div');
      card.className = 'country-card';
      const img = document.createElement('img');
      img.src = c.flags?.png || c.flags?.svg || '';
      img.alt = 'Прапор ' + (c.name?.common || 'Країна');
      const name = document.createElement('h4');
      name.textContent = c.name?.common || '—';
      const meta = document.createElement('div');
      meta.className = 'meta';
      meta.innerHTML = `Регіон: ${c.region || '—'}<br/>Населення: ${formatNumber(c.population)}`;
      const more = document.createElement('div');
      more.className = 'meta';
      more.innerHTML = `<strong>Столиця:</strong> ${(c.capital && c.capital[0]) || '—'}<br/><strong>Мови:</strong> ${formatLanguages(c.languages)}`;

      card.appendChild(img);
      card.appendChild(name);
      card.appendChild(meta);
      card.appendChild(more);
      countriesContainer.appendChild(card);
    }
  }

  // Події
  fetchBtn.addEventListener('click', ()=>fetchUkraine());
  axiosBtn.addEventListener('click', ()=>loadAllCountriesAxios(true));

  // Пошук (живий)
  searchInput.addEventListener('input', ()=>{
    if(!allCountriesCache) return;
    renderCountries(allCountriesCache);
  });

  // Завантажимо початкові дані автоматично
  fetchUkraine();
  // список країн — завантажу тільки коли користувач натисне кнопку (щоб уникнути подвійних запитів при тестуванні)
});

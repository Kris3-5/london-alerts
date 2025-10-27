const categories = [
  {id: 'police-list', url: './data/police.json'},
  {id: 'fire-list', url: './data/fire.json'},
  {id: 'nhs-list', url: './data/nhs.json'},
  {id: 'weather-list', url: './data/weather.json'}
];

async function fetchAlerts() {
  const now = new Date();
  document.getElementById('last-updated').innerText = `Last updated: ${now.toLocaleString()}`;

  for (const cat of categories) {
    try {
      const res = await fetch(cat.url);
      const data = await res.json();
      const container = document.getElementById(cat.id);
      container.innerHTML = '';

      data.alerts.forEach(alert => {
        const li = document.createElement('li');
        li.className = 'alert-card';

        const dot = document.createElement('span');
        dot.className = 'dot';
        const titleLower = alert.title.toLowerCase();
        if (titleLower.includes('alert') || titleLower.includes('emergency')) dot.style.backgroundColor = 'red';
        else if (titleLower.includes('warning')) dot.style.backgroundColor = 'yellow';
        else dot.style.backgroundColor = 'green';

        const title = document.createElement('span');
        title.innerText = alert.title;

        li.appendChild(dot);
        li.appendChild(title);

        if (alert.description) {
          const desc = document.createElement('div');
          desc.className = 'alert-description';
          desc.innerHTML = alert.description;
          li.appendChild(desc);

          li.addEventListener('click', () => {
            desc.classList.toggle('open');
          });
        }

        container.appendChild(li);
      });
    } catch(err) {
      console.error(err);
      const container = document.getElementById(cat.id);
      container.innerHTML = `<li class="alert-card">Error loading alerts.</li>`;
    }
  }
}

// Initial fetch
fetchAlerts();
// Refresh every 30 minutes
setInterval(fetchAlerts, 1800000);

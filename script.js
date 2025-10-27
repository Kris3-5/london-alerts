async function fetchData(url, containerId, collapsible = false) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.json();
    const container = document.getElementById(containerId);
    container.innerHTML = '';

    data.alerts.forEach(alert => {
      let dotColor = 'green';
      const titleLower = alert.title.toLowerCase();
      if (titleLower.includes('warning')) dotColor = 'yellow';
      if (titleLower.includes('alert') || titleLower.includes('emergency')) dotColor = 'red';

      const card = document.createElement('div');
      card.className = 'alert-card';

      const dot = document.createElement('span');
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.borderRadius = '50%';
      dot.style.display = 'inline-block';
      dot.style.marginRight = '8px';
      dot.style.backgroundColor = dotColor;

      const title = document.createElement('strong');
      title.innerText = alert.title;

      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.appendChild(dot);
      header.appendChild(title);
      card.appendChild(header);

      if (collapsible && alert.description) {
        const desc = document.createElement('div');
        desc.innerHTML = alert.description;
        desc.style.display = 'none';
        desc.style.marginTop = '6px';
        desc.style.fontSize = '0.9rem';
        card.appendChild(desc);

        card.addEventListener('click', () => {
          desc.style.display = desc.style.display === 'none' ? 'block' : 'none';
        });
      }

      container.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    const container = document.getElementById(containerId);
    container.innerHTML = `<div class="alert-card" style="background-color:#333;">Error loading alerts.</div>`;
  }
}

const categories = [
  {id: 'police-list', url: './data/police.json', collapsible: true},
  {id: 'fire-list', url: './data/fire.json', collapsible: true},
  {id: 'nhs-list', url: './data/nhs.json', collapsible: true},
  {id: 'weather-list', url: './data/weather.json', collapsible: true}
];

categories.forEach(cat => fetchData(cat.url, cat.id, cat.collapsible));

setInterval(() => {
  categories.forEach(cat => fetchData(cat.url, cat.id, cat.collapsible));
}, 1800000);

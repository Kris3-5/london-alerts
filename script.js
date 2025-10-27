// Fetch data and render alerts
async function fetchData(url, containerId, collapsible = false) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.json();
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // clear previous content

    data.alerts.forEach(alert => {
      // Dot color based on category logic
      let dotColor = 'green';
      if (alert.title.toLowerCase().includes('warning')) dotColor = 'yellow';
      if (alert.title.toLowerCase().includes('alert') || alert.title.toLowerCase().includes('emergency')) dotColor = 'red';

      // Card container
      const card = document.createElement('div');
      card.className = 'alert-card p-4 rounded mb-2 shadow-md cursor-pointer';
      card.style.position = 'relative';
      card.style.backgroundColor = '#111'; // default dark card background

      // Colored dot
      const dot = document.createElement('span');
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.borderRadius = '50%';
      dot.style.display = 'inline-block';
      dot.style.marginRight = '8px';
      dot.style.backgroundColor = dotColor;

      // Title
      const title = document.createElement('strong');
      title.innerText = alert.title;

      // Header (dot + title)
      const header = document.createElement('div');
      header.style.display = 'flex';
      header.style.alignItems = 'center';
      header.appendChild(dot);
      header.appendChild(title);
      card.appendChild(header);

      // Collapsible description
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
  }
}

// Map category IDs to JSON paths
const categories = [
  {id: 'police-list', url: './data/police.json', collapsible: true},
  {id: 'fire-list', url: './data/fire.json', collapsible: true},
  {id: 'nhs-list', url: './data/nhs.json', collapsible: true},
  {id: 'weather-list', url: './data/weather.json', collapsible: true}
];

// Initial fetch
categories.forEach(cat => fetchData(cat.url, cat.id, cat.collapsible));

// Auto-update every 30 minutes (1800000 ms)
setInterval(() => {
  categories.forEach(cat => fetchData(cat.url, cat.id, cat.collapsible));
}, 1800000);

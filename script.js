// =====================
// Fetch and Render Alerts
// =====================
async function fetchData(url, containerId, collapsible = false) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch ${url}`);
    const data = await res.json();
    const container = document.getElementById(containerId);
    container.innerHTML = ''; // Clear previous content

    data.alerts.forEach(alert => {
      // Determine dot color based on alert title
      let dotColor = 'green';
      const titleLower = alert.title.toLowerCase();
      if (titleLower.includes('warning')) dotColor = 'yellow';
      if (titleLower.includes('alert') || titleLower.includes('emergency')) dotColor = 'red';

      // Create alert card
      const card = document.createElement('div');
      card.className = 'alert-card';

      // Dot element
      const dot = document.createElement('span');
      dot.style.width = '12px';
      dot.style.height = '12px';
      dot.style.borderRadius = '50%';
      dot.style.display = 'inline-block';
      dot.style.marginRight = '8px';
      dot.style.backgroundColor = dotColor;

      // Title element
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

        // Toggle on click
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

// =====================
// Categories
// =====================
const categories = [
  {id: 'police-list', url: './data/police.json', collapsible: true},
  {id: 'fire-list', url: './data/fire.json', collapsible: true},
  {id: 'nhs-list', url: './data/nhs.json', collapsible: true},
  {id: 'weather-list', url: './data/weather.json', collapsible: true}
];

// =====================
// Initial Fetch
// =====================
categories.forEach(cat => fetchData(cat.url, cat.id, cat.collapsible));

// =====================
// Auto-Update Every 30 Minutes
// =====================
setInterval(() => {
  categories.forEach(cat => fetchData(cat.url, cat.id, cat.collapsible));
}, 30 * 60 * 1000); // 30 minutes

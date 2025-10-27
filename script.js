async function loadAlerts(type) {
  const url = `data/${type}.json?_=${Date.now()}`;
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Network response not ok");
    const text = await response.text();
    const data = JSON.parse(text);
    renderAlerts(type, data);
  } catch (e) {
    console.error(`Error loading ${type}:`, e);
    document.getElementById(`${type}-list`).innerHTML = `<li>Error loading alerts</li>`;
  }
}

function renderAlerts(type, data) {
  const list = document.getElementById(`${type}-list`);
  list.innerHTML = '';
  if (!data || data.length === 0) {
    list.innerHTML = '<li>No recent alerts.</li>';
    return;
  }

  data.forEach(item => {
    const li = document.createElement('li');
    li.className = 'alert-card';
    li.innerHTML = `
      <div><span class="dot" style="color:${getDotColor(type)}"></span>
      <strong>${item.title || 'Untitled Alert'}</strong></div>
      <div class="alert-description">${item.description || ''}</div>
    `;
    li.addEventListener('click', () => {
      const desc = li.querySelector('.alert-description');
      desc.classList.toggle('open');
    });
    list.appendChild(li);
  });
}

function getDotColor(type) {
  switch (type) {
    case 'police': return '#60A5FA';
    case 'fire': return '#F87171';
    case 'nhs': return '#3B82F6';
    case 'weather': return '#FACC15';
    default: return '#fff';
  }
}

function filterSections(target) {
  const sections = document.querySelectorAll('.alert-section');
  sections.forEach(sec => {
    if (target === 'all' || sec.id.includes(target)) sec.style.display = 'block';
    else sec.style.display = 'none';
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => filterSections(btn.dataset.target));
});

async function init() {
  await Promise.all(['police', 'fire', 'nhs', 'weather'].map(loadAlerts));
  document.getElementById('last-updated').textContent =
    'Last updated: ' + new Date().toLocaleString();
}

init();

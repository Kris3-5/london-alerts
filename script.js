function getAlertColor(title) {
  const lower = title.toLowerCase();
  if (lower.includes("warning") || lower.includes("fire") || lower.includes("accident")) return "bg-red-100 text-red-800";
  if (lower.includes("advice") || lower.includes("notice")) return "bg-yellow-100 text-yellow-800";
  return "bg-green-100 text-green-800";
}

async function fetchData(file, elementId) {
  try {
    const response = await fetch(file);
    const data = await response.json();
    const list = document.getElementById(elementId);
    list.innerHTML = "";
    data.forEach(item => {
      const li = document.createElement("li");
      const colorClass = getAlertColor(item.title);
      li.className = `p-2 mb-1 rounded ${colorClass}`;
      li.innerHTML = `<strong>${item.title}</strong> <span class="text-sm text-gray-600">(${item.date})</span>`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(`Error loading ${file}`, err);
  }
}

async function updateAlerts() {
  await fetchData('data/police.json', 'police-list');
  await fetchData('data/fire.json', 'fire-list');
  await fetchData('data/nhs.json', 'nhs-list');
  await fetchData('data/weather.json', 'weather-list');

  document.getElementById("last-updated").textContent = `Last updated: ${new Date().toLocaleString()}`;
}

// Initial load
updateAlerts();

// Optional: auto-refresh every 15 minutes
setInterval(updateAlerts, 15 * 60 * 1000);


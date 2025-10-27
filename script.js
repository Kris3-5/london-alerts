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
      li.className = `p-2 mb-1 rounded cursor-pointer ${colorClass}`;

      // Collapsible details
      li.innerHTML = `
        <div class="font-semibold">${item.title}</div>
        <div class="text-sm text-gray-600 hidden">${item.date}</div>
      `;

      li.addEventListener("click", () => {
        const detail = li.querySelector("div:last-child");
        detail.classList.toggle("hidden");
      });

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

// Auto-refresh every 15 minutes
setInterval(updateAlerts, 15 * 60 * 1000);

// --- Filter Tabs ---
const tabs = document.querySelectorAll(".filter-btn");
tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    const target = tab.getAttribute("data-target");
    document.querySelectorAll(".alert-section").forEach(section => {
      if (target === "all") {
        section.classList.remove("hidden");
      } else {
        section.classList.toggle("hidden", !section.id.startsWith(target));
      }
    });
  });
});

async function loadAlerts() {
  const categories = ["police", "fire", "nhs", "weather"];
  for (const category of categories) {
    try {
      const response = await fetch(`data/${category}.json?_=${Date.now()}`);
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      renderAlerts(category, data.alerts);
      if (data.last_updated) {
        document.getElementById("last-updated").textContent =
          "Last updated: " + new Date(data.last_updated).toLocaleString();
      }
    } catch (err) {
      document.getElementById(`${category}-list`).innerHTML = `<li>Error loading alerts: ${err.message}</li>`;
    }
  }
}

function renderAlerts(category, alerts) {
  const list = document.getElementById(`${category}-list`);
  list.innerHTML = "";
  alerts.forEach((alert) => {
    const li = document.createElement("li");
    li.className = "alert-card";
    li.innerHTML = `
      <div class="flex items-center">
        <span class="dot" style="background-color:${getRandomSeverityColor()}"></span>
        <span class="font-semibold">${alert.title}</span>
      </div>
      <div class="alert-description">${alert.description}</div>
    `;
    li.addEventListener("click", () => {
      li.querySelector(".alert-description").classList.toggle("open");
    });
    list.appendChild(li);
  });
}

function getRandomSeverityColor() {
  const colors = ["red", "yellow", "green"];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Filter buttons
document.querySelectorAll(".filter-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;
    document.querySelectorAll(".alert-section").forEach((section) => {
      section.style.display =
        target === "all" || section.id.startsWith(target) ? "block" : "none";
    });
  });
});

loadAlerts();
setInterval(loadAlerts, 1800000); // 30 min

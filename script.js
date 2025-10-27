async function fetchData(file, elementId) {
  try {
    const response = await fetch(file);
    const data = await response.json();
    const list = document.getElementById(elementId);
    list.innerHTML = "";
    data.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.title} - ${item.date}`;
      list.appendChild(li);
    });
  } catch (err) {
    console.error(`Error loading ${file}`, err);
  }
}

fetchData('data/police.json', 'police-list');
fetchData('data/fire.json', 'fire-list');
fetchData('data/nhs.json', 'nhs-list');
fetchData('data/weather.json', 'weather-list');


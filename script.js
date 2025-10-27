function getAlertSeverity(title){
  const lower = title.toLowerCase();
  if(lower.includes("warning")||lower.includes("fire")||lower.includes("accident")) return "critical";
  if(lower.includes("advice")||lower.includes("notice")||lower.includes("minor")) return "moderate";
  if(lower.includes("reminder")||lower.includes("update")||lower.includes("information")) return "info";
  return "safe";
}

function getDotColor(severity){
  switch(severity){
    case "critical": return "red";
    case "moderate": return "orange";
    case "info": return "blue";
    case "safe": return "green";
    default: return "gray";
  }
}

async function fetchData(file, elementId, showDescription=false){
  try{
    const response = await fetch(file);
    const data = await response.json();
    const list = document.getElementById(elementId);
    list.innerHTML="";
    data.forEach(item=>{
      const severity = getAlertSeverity(item.title);
      const dotColor = getDotColor(severity);
      const li = document.createElement("li");
      li.className="alert-card p-3 mb-2 rounded cursor-pointer flex flex-col";

      const titleDiv=document.createElement("div");
      titleDiv.className="flex items-center";
      titleDiv.innerHTML=`<span class="dot" style="background-color:${dotColor}"></span><strong>${item.title}</strong>`;
      li.appendChild(titleDiv);

      if(showDescription && item.description){
        const descDiv=document.createElement("div");
        descDiv.className="text-gray-300 text-sm mt-1 hidden";
        descDiv.innerHTML=`${item.description} <br><em>${item.date}</em>`;
        li.appendChild(descDiv);
        li.addEventListener("click",()=>descDiv.classList.toggle("hidden"));
      }else{
        const dateDiv=document.createElement("div");
        dateDiv.className="text-gray-400 text-sm mt-1";
        dateDiv.textContent=item.date;
        li.appendChild(dateDiv);
      }

      list.appendChild(li);
    });
  }catch(err){
    console.error(`Error loading ${file}`,err);
  }
}

async function updateAlerts(){
  await fetchData('data/police.json','police-list');
  await fetchData('data/fire.json','fire-list',true);
  await fetchData('data/nhs.json','nhs-list',true);
  await fetchData('data/weather.json','weather-list',true);
  document.getElementById("last-updated").textContent=`Last updated: ${new Date().toLocaleString()}`;
}

updateAlerts();
setInterval(updateAlerts,15*60*1000); // Frontend auto-refresh every 15 minutes

// Filter Tabs
const tabs=document.querySelectorAll(".filter-btn");
tabs.forEach(tab=>{
  tab.addEventListener("click",()=>{
    const target=tab.getAttribute("data-target");
    document.querySelectorAll(".alert-section").forEach(section=>{
      if(target==="all") section.classList.remove("hidden");
      else section.classList.toggle("hidden",!section.id.startsWith(target));
    });
  });
});

async function loadAlerts(type){
  const url=`data/${type}.json?_=${Date.now()}`;  // prevent caching
  try{
    const res=await fetch(url);
    if(!res.ok)throw new Error("Network error");
    const text=await res.text();
    const data=JSON.parse(text);
    renderAlerts(type,data);
  }catch(e){
    console.error(type,e);
    document.getElementById(`${type}-list`).innerHTML='<li>Error loading alerts</li>';
  }
}

function renderAlerts(type, data){
  const list=document.getElementById(`${type}-list`);
  list.innerHTML='';
  if(!data || data.length===0){list.innerHTML='<li>No recent alerts</li>';return;}

  data.forEach(item=>{
    const li=document.createElement('li');
    li.className='alert-card';

    const description = item.description || '';
    const title = item.title || 'Untitled Alert';
    const timestamp = item.published || ''; // will use if available

    // Create inner HTML
    li.innerHTML = `
      <div>
        <span class="dot" style="color:${getDotColor(type)}"></span>
        <strong>${title}</strong>
        ${timestamp ? `<span class="text-gray-300 text-sm ml-2">(${formatDate(timestamp)})</span>` : ''}
      </div>
      <div class="alert-description collapsed">${description}</div>
      <button class="read-more-btn">Read More</button>
    `;

    const descDiv = li.querySelector('.alert-description');
    const btn = li.querySelector('.read-more-btn');

    // Toggle Read More / Less
    btn.addEventListener('click', ()=>{
      descDiv.classList.toggle('open');
      if(descDiv.classList.contains('open')){
        btn.textContent='Read Less';
      } else {
        btn.textContent='Read More';
      }
    });

    list.appendChild(li);
  });
}

// Dot colors
function getDotColor(type){
  switch(type){
    case 'police': return '#60A5FA';
    case 'fire': return '#F87171';
    case 'nhs': return '#3B82F6';
    case 'weather': return '#FACC15';
    default: return '#fff';
  }
}

// Filter buttons
document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>filterSections(btn.dataset.target));
});
function filterSections(target){
  document.querySelectorAll('.alert-section').forEach(sec=>{
    sec.style.display=(target==='all'||sec.id.includes(target))?'block':'none';
  });
}

// Format timestamp if present
function formatDate(dateStr){
  try{
    const d = new Date(dateStr);
    return d.toLocaleString();
  }catch(e){ return dateStr; }
}

async function init(){
  await Promise.all(['police','fire','nhs','weather'].map(loadAlerts));
  document.getElementById('last-updated').textContent='Last updated: '+new Date().toLocaleString();
}
init();

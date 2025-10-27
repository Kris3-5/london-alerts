async function loadAlerts(type){
  const url=`data/${type}.json?_=${Date.now()}`;
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

function renderAlerts(type,data){
  const list=document.getElementById(`${type}-list`);
  list.innerHTML='';
  if(!data||data.length===0){list.innerHTML='<li>No recent alerts</li>';return;}
  data.forEach(item=>{
    const li=document.createElement('li');
    li.className='alert-card';
    li.innerHTML=`<div><span class="dot" style="color:${getDotColor(type)}"></span>
      <strong>${item.title||'Untitled Alert'}</strong></div>
      <div class="alert-description">${item.description||''}</div>`;
    li.addEventListener('click',()=>li.querySelector('.alert-description').classList.toggle('open'));
    list.appendChild(li);
  });
}

function getDotColor(type){
  switch(type){
    case 'police':return '#60A5FA';
    case 'fire':return '#F87171';
    case 'nhs':return '#3B82F6';
    case 'weather':return '#FACC15';
    default:return '#fff';
  }
}

document.querySelectorAll('.filter-btn').forEach(btn=>{
  btn.addEventListener('click',()=>filterSections(btn.dataset.target));
});
function filterSections(target){
  document.querySelectorAll('.alert-section').forEach(sec=>{
    sec.style.display=(target==='all'||sec.id.includes(target))?'block':'none';
  });
}

async function init(){
  await Promise.all(['police','fire','nhs','weather'].map(loadAlerts));
  document.getElementById('last-updated').textContent='Last updated: '+new Date().toLocaleString();
}
init();

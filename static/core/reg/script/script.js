const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

let selectedDate = new Date();

const months = ['jan','fev','mar','abr','mai','jun','jul','ago','set','out','nov','dez'];

function pad(n){ return n < 10 ? "0"+n : n; }

/* ---------- DATE DISPLAY ---------- */
function updateDateText(){
  let d = selectedDate.getDate();
  let m = months[selectedDate.getMonth()];
  let y = selectedDate.getFullYear();
  $("#dateDisplay").textContent = `${d} de ${m}. de ${y}`;
}
updateDateText();

/* ---------- ACCORDION ---------- */
$$('.acc-row').forEach(row => {
  row.addEventListener('click', () => {
    let target = row.dataset.target;
    let box = $("#body-"+target);

    $$('.acc-body').forEach(b => b.classList.remove('active'));
    box.classList.toggle('active');
  });
});

/* ---------- WHEEL PICKER ---------- */
const dayWheel = $("#dayWheel");
const monthWheel = $("#monthWheel");
const yearWheel = $("#yearWheel");

function buildWheel(container, items){
  container.innerHTML = "";

  for(let i=0;i<3;i++){
    let p = document.createElement("div");
    p.className = "wheel-item";
    p.style.opacity = "0";
    container.appendChild(p);
  }

  items.forEach(v=>{
    let el = document.createElement("div");
    el.className = "wheel-item";
    el.textContent = v;
    container.appendChild(el);
  });

  for(let i=0;i<3;i++){
    let p = document.createElement("div");
    p.className = "wheel-item";
    p.style.opacity = "0";
    container.appendChild(p);
  }
}

buildWheel(dayWheel, Array.from({length:31},(_,i)=>pad(i+1)));
buildWheel(monthWheel, months);
buildWheel(yearWheel, Array.from({length:31},(_,i)=>String(2010+i)));

function initWheel(wheel){
  wheel.addEventListener("scroll", ()=>{
    if(wheel._timer) clearTimeout(wheel._timer);
    wheel._timer = setTimeout(()=>{
      fixWheel(wheel);
    },120);
  });

  wheel.addEventListener("click", e=>{
    let item = e.target.closest(".wheel-item");
    if(!item || item.style.opacity === "0") return;

    let center = wheel.getBoundingClientRect().top + wheel.offsetHeight/2;
    let ir = item.getBoundingClientRect();
    let offset = (ir.top + ir.height/2) - center;

    wheel.scrollBy({top: offset, behavior: "smooth"});
  });
}

function fixWheel(wheel){
  let items = [...wheel.querySelectorAll(".wheel-item")];
  let center = wheel.getBoundingClientRect().top + wheel.offsetHeight/2;

  let closest = null;
  let min = Infinity;

  items.forEach(it=>{
    if(it.style.opacity === "0") return;
    let r = it.getBoundingClientRect();
    let dist = Math.abs((r.top + r.height/2) - center);
    if(dist < min){ min = dist; closest = it; }
  });

  items.forEach(i=>i.classList.remove("selected"));
  if(closest){
    closest.classList.add("selected");

    let r = closest.getBoundingClientRect();
    let offset = (r.top + r.height/2) - center;
    wheel.scrollBy({top: offset, behavior:"smooth"});
  }
}

initWheel(dayWheel);
initWheel(monthWheel);
initWheel(yearWheel);

/* ---------- DATE PICKER OPEN/CLOSE ---------- */
const pickerBackdrop = $("#pickerBackdrop");

$("#dateTrigger").addEventListener("click", ()=>{
  pickerBackdrop.style.display = "flex";
});

$("#cancelPick").addEventListener("click", ()=>{
  pickerBackdrop.style.display = "none";
});

$("#okPick").addEventListener("click", ()=>{
  let d = getSelected(dayWheel);
  let m = getSelected(monthWheel);
  let y = getSelected(yearWheel);

  selectedDate = new Date(y, months.indexOf(m), d);
  updateDateText();

  pickerBackdrop.style.display = "none";
});

function getSelected(wheel){
  let sel = wheel.querySelector(".selected");
  return sel ? sel.textContent.trim() : null;
}

/* ---------- SAVE BUTTON ALWAYS ACTIVE ---------- */
$("#saveBtn").addEventListener("click", ()=>{
  console.log("SALVANDO...");
  $("#saveBtn").textContent = "Salvo ";

  setTimeout(()=> $("#saveBtn").textContent = "Salvar", 1500);
});

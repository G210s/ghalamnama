const CDN_FONTS=[
{name:"Vazir",url:"https://cdn.jsdelivr.net/gh/rastikerdar/vazir-font@v30.1.0/dist/font-face.css"},
{name:"Sahel",url:"https://cdn.jsdelivr.net/gh/rastikerdar/sahel-font@v3.4.0/dist/font-face.css"},
{name:"Samim",url:"https://cdn.jsdelivr.net/gh/rastikerdar/samim-font@v4.0.5/dist/font-face.css"},
{name:"Shabnam",url:"https://cdn.jsdelivr.net/gh/rastikerdar/shabnam-font@v5.0.1/dist/font-face.css"},
{name:"Nahid",url:"https://cdn.jsdelivr.net/gh/rastikerdar/nahid-font@v0.3.0/dist/font-face.css"},
{name:"Gandom",url:"https://cdn.jsdelivr.net/gh/rastikerdar/gandom-font@v0.8/dist/font-face.css"},
{name:"Tanha",url:"https://cdn.jsdelivr.net/gh/rastikerdar/tanha-font@v0.10/dist/font-face.css"},
{name:"Parastoo",url:"https://cdn.jsdelivr.net/gh/rastikerdar/parastoo-font@v2.0.1/dist/font-face.css"}
];
const GOOGLE_FONTS=["Vazirmatn","Estedad","Noto Naskh Arabic","Noto Sans Arabic","Noto Kufi Arabic","Noto Nastaliq Urdu","IBM Plex Sans Arabic","Readex Pro","Alexandria","Alkalami","Almarai","Alyamama","Amiri","Amiri Quran","Aref Ruqaa","Aref Ruqaa Ink","Badeen Display","Baloo Bhaijaan 2","Beiruti","Blaka","Blaka Hollow","Blaka Ink","Cairo","Cairo Play","Changa","El Messiri","Fustat","Gulzar","Handjet","Harmattan","Jomhuria","Katibeh","Kufam","Lalezar","Lateef","Lemonada","Mada","Marhey","Markazi Text","Mirza","Oi","Playpen Sans Arabic","Qahiri","Rakkas","Reem Kufi","Reem Kufi Fun","Reem Kufi Ink","Rubik","Ruwudu","Scheherazade New","Tajawal","Vibes","Zain"];
const ALL_FONTS=[];
const WEB_FONTS=[...CDN_FONTS.map(f=>({name:f.name,family:f.name,source:"IRANIAN",link:`https://github.com/${f.url.match(/\/gh\/([^@]+)@/)[1]}`})),...GOOGLE_FONTS.map(name=>({name,family:name,source:"GOOGLE",link:`https://fonts.google.com/specimen/${name.replace(/ /g,"+")}`}))];
const $=id=>document.getElementById(id);
const input=$("input"),fontName=$("fontName"),fontSource=$("fontSource"),fontIndex=$("fontIndex"),bigFontName=$("bigFontName"),count=$("count"),sizeValue=$("sizeValue"),fontCard=$("fontCard");
let currentIndex=0,fontSize=52,fontWeight=700,changingTimer=null;
const requested=new Set();
function loadWebFonts(){for(const f of CDN_FONTS){const l=document.createElement("link");l.rel="stylesheet";l.href=f.url;document.head.appendChild(l)}for(let i=0;i<GOOGLE_FONTS.length;i+=10){const families=GOOGLE_FONTS.slice(i,i+10).map(n=>`family=${encodeURIComponent(n).replace(/%20/g,"+")}`).join("&");const l=document.createElement("link");l.rel="stylesheet";l.href=`https://fonts.googleapis.com/css2?${families}&display=swap`;document.head.appendChild(l)}}
function loadLocalFont(font){if(!font.web||requested.has(font.family))return;requested.add(font.family);new FontFace(font.family,`url("fonts-woff2/${encodeURIComponent(font.web)}") format("woff2")`).load().then(face=>document.fonts.add(face)).catch(()=>{})}
function animateFontChange(){fontCard.classList.add("changing");clearTimeout(changingTimer);changingTimer=setTimeout(()=>fontCard.classList.remove("changing"),170)}
function showFont(index,animate=true){if(!ALL_FONTS.length)return;currentIndex=(index+ALL_FONTS.length)%ALL_FONTS.length;const f=ALL_FONTS[currentIndex];if(animate)animateFontChange();fontName.textContent=f.name;bigFontName.textContent=f.name;fontSource.textContent=f.source||"LOCAL";fontIndex.textContent=`${String(currentIndex+1).padStart(2,"0")} / ${String(ALL_FONTS.length).padStart(2,"0")}`;input.style.fontFamily=`"${f.family}",sans-serif`;input.style.fontSize=`${fontSize}px`;input.style.fontWeight=fontWeight;sizeValue.textContent=fontSize;if(f.file&&f.web)loadLocalFont(f)}
function next(){showFont(currentIndex+1)}function prev(){showFont(currentIndex-1)}
$("nextFont").onclick=next;$("prevFont").onclick=prev;
$("randomBtn").onclick=()=>showFont(Math.floor(Math.random()*ALL_FONTS.length));
$("sizeUp").onclick=()=>{fontSize=Math.min(120,fontSize+4);showFont(currentIndex,false)};
$("sizeDown").onclick=()=>{fontSize=Math.max(16,fontSize-4);showFont(currentIndex,false)};
document.querySelectorAll("[data-weight]").forEach(b=>b.onclick=()=>{document.querySelectorAll("[data-weight]").forEach(x=>x.classList.remove("active"));b.classList.add("active");fontWeight=Number(b.dataset.weight);showFont(currentIndex,false)});
$("centerBtn").onclick=()=>{input.style.textAlign=input.style.textAlign==="center"?"right":"center"};
input.addEventListener("input",()=>{input.style.transform="scale(1.003)";setTimeout(()=>input.style.transform="",90)});
document.addEventListener("keydown",e=>{if(e.target.matches("textarea,input"))return;if(e.key==="ArrowRight")next();if(e.key==="ArrowLeft")prev();if(e.key===" "){e.preventDefault();showFont(Math.floor(Math.random()*ALL_FONTS.length))}if(e.key==="Enter")showToast("فونت انتخاب شد · "+(ALL_FONTS[currentIndex]?.name||""));if(e.key==="/"){e.preventDefault();openSearch()}});
const overlay=$("searchOverlay"),filter=$("filter"),results=$("searchResults");
function openSearch(){overlay.classList.add("open");filter.focus();renderSearch()}function closeSearch(){overlay.classList.remove("open");filter.value=""}$("searchBtn").onclick=openSearch;$("closeSearch").onclick=closeSearch;overlay.onclick=e=>{if(e.target===overlay)closeSearch()};filter.oninput=renderSearch;
function renderSearch(){const q=filter.value.trim().toLowerCase();const list=ALL_FONTS.map((font,index)=>({font,index})).filter(x=>!q||x.font.name.toLowerCase().includes(q)).slice(0,18);results.innerHTML=list.map(({font,index})=>`<div class="search-result" data-index="${index}"><span>${escapeHtml(font.name)}</span><small>${escapeHtml(font.source||"")}</small></div>`).join("");results.querySelectorAll(".search-result").forEach(el=>el.onclick=()=>{showFont(Number(el.dataset.index));closeSearch()})}
$("downloadBtn").onclick=()=>{const f=ALL_FONTS[currentIndex];if(!f)return;if(f.file&&f.open){const a=document.createElement("a");a.href=`fonts/${encodeURIComponent(f.file)}`;a.download=f.file;a.click();showToast("دانلود شروع شد · "+f.name)}else{window.open(f.link,"_blank","noopener,noreferrer");showToast("منبع فونت باز شد")}};
function escapeHtml(s){const d=document.createElement("div");d.textContent=s;return d.innerHTML}
let toastTimer;function showToast(t){const el=$("toast");el.textContent=t;el.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove("show"),1800)}
async function init(){loadWebFonts();let pack=[];try{const r=await fetch("fonts.json");if(r.ok)pack=await r.json()}catch{}ALL_FONTS.push(...pack.map(f=>({...f,source:"LOCAL"})),...WEB_FONTS);count.textContent=ALL_FONTS.length;showFont(0,false)}init();

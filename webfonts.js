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
const WEB_FONTS=[...CDN_FONTS.map(f=>({name:f.name,family:f.name,source:"IRANIAN",link:`https://github.com/${f.url.match(/\/gh\/([^@]+)@/)[1]}`})),...GOOGLE_FONTS.map(name=>({name,family:name,source:"GOOGLE",link:`https://fonts.google.com/specimen/${name.replace(/ /g,"+")}`}))];

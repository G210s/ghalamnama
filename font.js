const $=id=>document.getElementById(id);
const params=new URLSearchParams(location.search);
const requestedFamily=params.get("f")||"";
const initialLanguage=params.get("lang")==="en"?"en":"fa";
const scriptContext=params.get("context")==="ar"?"ar":"fa";
let currentLanguage=initialLanguage;
let currentFont=null,currentContent=null,currentMetadata=null;
let fontCatalog=[];

const COPY={
  fa:{
    home:"بازگشت به صفحه اصلی",title:"معرفی، طراح و تاریخچه فونت",loading:"در حال بارگذاری اطلاعات فونت…",
    source:"منبع",format:"فرمت فایل",designer:"طراح",foundry:"استودیو / پروژه",year:"سال انتشار",updated:"آخرین به‌روزرسانی",category:"دسته‌بندی",license:"مجوز",variable:"فونت متغیر",yes:"بله",repository:"مخزن کد منبع",
    about:"دربارهٔ این فونت",technical:"مشخصات فنی",embedded:"اطلاعات ثبت‌شده داخل فایل",related:"فونت‌های مرتبط",
    embeddedFamily:"نام خانواده در فایل",style:"سبک / وزن",vendor:"سازنده / ناشر",description:"توضیحات داخل فایل",copyright:"حق نشر",trademark:"نشان تجاری",vendorUrl:"وب‌سایت سازنده",designerUrl:"وب‌سایت طراح",licenseUrl:"لینک مجوز",version:"نسخه",
    embeddedNote:"این موارد مستقیماً از جدول نام OpenType استخراج شده‌اند. قلم‌نما صحت ادعاهای سازنده، مالکیت یا مجوز را مستقلاً تأیید نکرده است.",
    descriptionNote:"این توضیح از داده‌های داخلی فایل فونت استخراج شده، به زبان اصلی نمایش داده می‌شود و به‌طور مستقل تأیید نشده است.",
    unknown:"در حال حاضر تاریخچهٔ مستند و تأییدشده‌ای برای این فونت در دسترس نیست. اطلاعات ثبت‌شده داخل فایل فونت در ادامه آمده و می‌توانید برای پژوهش بیشتر از لینک منبع استفاده کنید.",
    preview:name=>`سلام دنیا، این یک متن نمونه برای فونت ${name} است.`,arabicPreview:name=>`مرحباً بالعالم، هذا نص تجريبي لعرض خط ${name}.`,previewLabel:"پیش‌نمایش فونت",download:"↓ دانلود فونت",viewSource:"↗ دریافت از Google Fonts",viewRepository:"↗ مشاهدهٔ مخزن کد",back:"← بازگشت به کاوشگر فونت",notFound:"فونت پیدا نشد",notFoundText:"این فونت در فهرست قلم‌نما موجود نیست.",
    local:"فونت محلی (آپلود شده در قلم‌نما)",iranian:"پروژه متن‌باز ایرانی (CDN)",descriptionMeta:name=>`فونت ${name} را آنلاین پیش‌نمایش کنید و اطلاعات طراح، نسخه، منبع، مجوز و تاریخچهٔ آن را در قلم‌نما بخوانید.`
  },
  en:{
    home:"Back to home",title:"Overview, designer and font history",loading:"Loading font information…",
    source:"Source",format:"File format",designer:"Designer",foundry:"Studio / project",year:"Release year",updated:"Last updated",category:"Category",license:"License",variable:"Variable font",yes:"Yes",repository:"Source repository",
    about:"About this font",technical:"Technical details",embedded:"Metadata embedded in the file",related:"Related fonts",
    embeddedFamily:"Family name in file",style:"Style / weight",vendor:"Vendor / publisher",description:"Embedded description",copyright:"Copyright",trademark:"Trademark",vendorUrl:"Vendor website",designerUrl:"Designer website",licenseUrl:"License URL",version:"Version",
    embeddedNote:"These fields were extracted directly from the OpenType name table. Ghalamnama has not independently verified claims about authorship, ownership, or licensing.",
    descriptionNote:"This description was extracted from the font file, is shown in its original language, and has not been independently verified.",
    unknown:"No independently verified history is currently available for this font. Metadata recorded inside the font file appears below, and the source link can help with further research.",
    preview:name=>`Hello world, this is sample text set in ${name}.`,arabicPreview:name=>`مرحباً بالعالم، هذا نص تجريبي لعرض خط ${name}.`,previewLabel:"Font preview",download:"↓ Download font",viewSource:"↗ Get on Google Fonts",viewRepository:"↗ View source repository",back:"← Back to font explorer",notFound:"Font not found",notFoundText:"This font is not available in the Ghalamnama catalog.",
    local:"Local font (hosted by Ghalamnama)",iranian:"Iranian open-source project (CDN)",descriptionMeta:name=>`Preview the ${name} font online and explore its designer, version, source, license, technical details, and history on Ghalamnama.`
  }
};

function escapeHtml(s){const d=document.createElement("div");d.textContent=s??"";return d.innerHTML}
function slugFileName(name){return name.replace(/[^\w.\-]+/g,"-")}
function metadataValue(value,isUrl=false){
  if(!isUrl)return escapeHtml(value);
  try{
    const url=new URL(value);
    if(!["http:","https:"].includes(url.protocol))return escapeHtml(value);
    return `<a href="${escapeHtml(url.href)}" target="_blank" rel="noopener noreferrer">${escapeHtml(value)}</a>`;
  }catch{return escapeHtml(value)}
}
function isUsefulDescription(value){
  if(!value||value.length<50||/^https?:|^[\w.+-]+@[\w.-]+$/i.test(value))return false;
  if(/^(copyright|©|\(c\))/i.test(value)&&value.length<180)return false;
  return /(design|create|develop|based|typeface|font family|inspir|طراح|طراحی|ساخت|فونت)/i.test(value);
}

function loadPreviewFont(font){
  if(font.source==="LOCAL"&&font.web){
    new FontFace(font.family,`url("fonts-woff2/${encodeURIComponent(font.web)}") format("woff2")`).load().then(face=>{document.fonts.add(face)}).catch(()=>{});
    return;
  }
  if(font.source==="IRANIAN"){
    const cdn=CDN_FONTS.find(c=>c.name===font.family);
    if(cdn){const l=document.createElement("link");l.rel="stylesheet";l.href=cdn.url;document.head.appendChild(l)}
    return;
  }
  if(font.source==="GOOGLE"){
    const l=document.createElement("link");l.rel="stylesheet";l.href=`https://fonts.googleapis.com/css2?family=${encodeURIComponent(font.family).replace(/%20/g,"+")}:wght@400;700&display=swap`;document.head.appendChild(l);
  }
}

function sourceLabel(source,lang){
  if(source==="LOCAL")return COPY[lang].local;
  if(source==="IRANIAN")return COPY[lang].iranian;
  if(source==="GOOGLE")return"Google Fonts";
  return"—";
}

function localizedValue(field,value,lang){
  if(lang==="en")return value;
  if(field==="category")return ({"Sans Serif":"بدون سریف","Serif":"سریف","Display":"نمایشی","Handwriting":"دست‌نویس","Display / Sans Serif":"نمایشی / بدون سریف"})[value]||value;
  return value
    .replace(" (open-source)"," (متن‌باز)")
    .replace(" (added to Google Fonts)"," (افزوده‌شدن به Google Fonts)")
    .replace(" (renamed Vazirmatn in 2021)"," (تغییر نام به Vazirmatn در ۲۰۲۱)")
    .replace(/^Independent$/, "مستقل")
    .replace(/^Multiple type designers$/, "چند طراح حروف");
}

function buildKeywords(font,content,metadata,lang){
  const name=font.name;
  const category=content?.category||metadata?.style||"";
  const people=content?.designer||metadata?.designer||metadata?.vendor||"";
  const common=lang==="fa"
    ? [`فونت ${name}`,`دانلود فونت ${name}`,`پیش نمایش فونت ${name}`,`طراح فونت ${name}`,`تاریخچه فونت ${name}`,"فونت فارسی","فونت عربی","تایپوگرافی فارسی"]
    : [`${name} font`,`${name} typeface`,`${name} font download`,`${name} font preview`,`${name} font designer`,`${name} font history`,"Persian font","Arabic font","Persian typography"];
  const factual=[category,people,font.format,sourceLabel(font.source,lang)];
  return [...new Set([...common,...factual].filter(value=>value!=null&&value!=="").map(value=>String(value).trim()).filter(Boolean))].slice(0,14);
}

function setMetaContent(id,value){
  $(id).setAttribute("content",value);
}

function metaExcerpt(value,maxLength=160){
  if(value.length<=maxLength)return value;
  const excerpt=value.slice(0,maxLength+1);
  const lastSpace=excerpt.lastIndexOf(" ");
  return `${excerpt.slice(0,lastSpace>100?lastSpace:maxLength).replace(/[\s,;:.-]+$/u,"")}…`;
}

function renderPage(font,content,metadata){
  const lang=currentLanguage;
  const copy=COPY[lang];
  const homeHref=scriptContext==="ar"?"index.html?context=ar":"index.html";
  const history=content?.history?.[lang]||content?.history?.en||"";
  const usefulDescription=isUsefulDescription(metadata?.description);
  const title=lang==="fa"
    ? `${font.name}: معرفی، طراح و پیش‌نمایش فونت | قلم‌نما`
    : `${font.name} Font: Designer, History & Preview | Ghalamnama`;
  const desc=history
    ? metaExcerpt(history)
    : usefulDescription
      ? metaExcerpt(metadata.description)
      : copy.descriptionMeta(font.name);
  const contextSuffix=scriptContext==="ar"?"&context=ar":"";
  const canonicalUrl=`https://ghalamnama.online/font?f=${encodeURIComponent(font.family)}&lang=${lang}${contextSuffix}`;
  const keywords=buildKeywords(font,content,metadata,lang);
  document.documentElement.lang=lang;
  document.documentElement.dir=lang==="fa"?"rtl":"ltr";
  document.title=title;
  $("pageTitle").textContent=title;
  setMetaContent("pageDescription",desc);
  setMetaContent("pageKeywords",keywords.join(", "));
  setMetaContent("pageRobots","index, follow, max-image-preview:large");
  $("pageCanonical").setAttribute("href",canonicalUrl);
  setMetaContent("pageOgLocale",lang==="fa"?"fa_IR":"en_US");
  setMetaContent("pageOgLocaleAlternate",lang==="fa"?"en_US":"fa_IR");
  setMetaContent("pageOgSiteName",lang==="fa"?"قلم‌نما":"Ghalamnama");
  setMetaContent("pageOgTitle",title);
  setMetaContent("pageOgDescription",desc);
  setMetaContent("pageOgUrl",canonicalUrl);
  setMetaContent("pageTwitterTitle",title);
  setMetaContent("pageTwitterDescription",desc);
  $("loadingMsg")?.setAttribute("lang",lang);
  document.querySelector(".icon-btn").setAttribute("aria-label",copy.home);
  document.querySelector(".brand").href=homeHref;
  document.querySelector(".icon-btn").href=homeHref;
  document.querySelectorAll("[data-lang]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.lang===lang)));

  loadPreviewFont(font);

  const rows=[];
  rows.push([copy.source,escapeHtml(sourceLabel(font.source,lang))]);
  if(font.format)rows.push([copy.format,escapeHtml(font.format)]);
  if(content?.designer)rows.push([copy.designer,escapeHtml(content.designer)]);
  if(content?.foundry)rows.push([copy.foundry,escapeHtml(localizedValue("foundry",content.foundry,lang))]);
  if(content?.year)rows.push([copy.year,escapeHtml(localizedValue("year",content.year,lang))]);
  else if(font.dateAdded)rows.push([copy.year,escapeHtml(font.dateAdded)]);
  if(font.lastModified)rows.push([copy.updated,escapeHtml(font.lastModified)]);
  if(content?.category)rows.push([copy.category,escapeHtml(localizedValue("category",content.category,lang))]);
  else if(font.category)rows.push([copy.category,escapeHtml(localizedValue("category",font.category,lang))]);
  if(content?.license)rows.push([copy.license,escapeHtml(content.license)]);
  else if(font.license)rows.push([copy.license,escapeHtml(font.license)]);
  if(font.variable)rows.push([copy.variable,copy.yes]);
  if(font.sourceRepository)rows.push([copy.repository,metadataValue(font.sourceRepository,true)]);

  const metadataRows=[];
  const embeddedFields=[
    [copy.embeddedFamily,"embeddedFamily"],
    [copy.style,"style"],
    [copy.version,"version"],
    [copy.designer,"designer"],
    [copy.vendor,"vendor"],
    [copy.description,"description"],
    [copy.copyright,"copyright"],
    [copy.trademark,"trademark"],
    [copy.license,"license"],
    [copy.vendorUrl,"vendorUrl",true],
    [copy.designerUrl,"designerUrl",true],
    [copy.licenseUrl,"licenseUrl",true]
  ];
  for(const [label,key,isUrl] of embeddedFields){
    if(metadata?.[key])metadataRows.push([label,metadataValue(metadata[key],isUrl)]);
  }

  const historyHtml=history
    ? `<p class="font-history">${escapeHtml(history)}</p>`
    : usefulDescription
      ? `<p class="font-history" dir="auto">${escapeHtml(metadata.description)}</p><p class="metadata-note">${copy.descriptionNote}</p>`
      : `<p class="font-history font-history-unknown">${copy.unknown}</p>`;

  const sourceLink=font.link||content?.homepage||`https://www.google.com/search?q=%22${encodeURIComponent(font.name)}%22%20font`;
  const downloadHtml=(font.file&&font.open)
    ? `<a class="font-action" href="fonts/${encodeURIComponent(font.file)}" download="${escapeHtml(font.file)}">${copy.download}</a>`
    : `<a class="font-action" href="${sourceLink}" target="_blank" rel="noopener noreferrer">${copy.viewSource}</a>`;
  const repositoryHtml=font.sourceRepository
    ? `<a class="font-action ghost" href="${escapeHtml(font.sourceRepository)}" target="_blank" rel="noopener noreferrer">${copy.viewRepository}</a>`
    : "";
  const relatedFonts=fontCatalog
    .filter(candidate=>candidate.family!==font.family)
    .sort((left,right)=>Number(right.source===font.source)-Number(left.source===font.source)||left.name.localeCompare(right.name))
    .slice(0,6);

  $("fontDetail").innerHTML=`
    <div class="font-page-head">
      <h1>${escapeHtml(font.name)}</h1>
      <p class="font-page-kicker">${escapeHtml(sourceLabel(font.source,lang))}</p>
    </div>
    <div class="font-preview-box">
      <textarea id="previewInput" dir="${scriptContext==="ar"?"rtl":lang==="fa"?"rtl":"ltr"}" lang="${scriptContext==="ar"?"ar":lang}" spellcheck="false" style="font-family:'${font.family}',sans-serif" aria-label="${copy.previewLabel}">${scriptContext==="ar"?copy.arabicPreview(escapeHtml(font.name)):copy.preview(escapeHtml(font.name))}</textarea>
    </div>
    <div class="font-actions">
      ${downloadHtml}
      ${repositoryHtml}
      <a class="font-action ghost" href="${homeHref}">${copy.back}</a>
    </div>
    <h2>${copy.about}</h2>
    ${historyHtml}
    <h2>${copy.technical}</h2>
    <table class="font-info-table">
      ${rows.map(([k,v])=>`<tr><th>${k}</th><td>${v}</td></tr>`).join("")}
    </table>
    ${metadataRows.length?`
      <h2>${copy.embedded}</h2>
      <p class="metadata-note">${copy.embeddedNote}</p>
      <table class="font-info-table">
        ${metadataRows.map(([k,v])=>`<tr><th>${k}</th><td dir="auto">${v}</td></tr>`).join("")}
      </table>
    `:""}
    ${relatedFonts.length?`
      <nav class="related-fonts" aria-label="${copy.related}">
        <h2>${copy.related}</h2>
        <div class="related-font-list">
          ${relatedFonts.map(candidate=>`<a href="font?f=${encodeURIComponent(candidate.family)}&lang=${lang}&context=${scriptContext}">${escapeHtml(candidate.name)}</a>`).join("")}
        </div>
      </nav>
    `:""}
  `;

  const ld={
    "@context":"https://schema.org",
    "@graph":[
      {
        "@type":"WebPage",
        "@id":`${canonicalUrl}#webpage`,
        "url":canonicalUrl,
        "name":title,
        "description":desc,
        "inLanguage":lang,
        "keywords":keywords.join(", "),
        "isPartOf":{"@id":"https://ghalamnama.online/#website"},
        "mainEntity":{"@id":`${canonicalUrl}#font`}
      },
      {
        "@type":"CreativeWork",
        "@id":`${canonicalUrl}#font`,
        "name":font.name,
        "url":canonicalUrl,
        "description":history||desc,
        "inLanguage":lang,
        "genre":content?.category||metadata?.style||undefined,
        "isAccessibleForFree":font.open===true||font.source==="GOOGLE"||font.source==="IRANIAN"
      },
      {
        "@type":"WebSite",
        "@id":"https://ghalamnama.online/#website",
        "url":"https://ghalamnama.online/",
        "name":lang==="fa"?"قلم‌نما":"Ghalamnama",
        "inLanguage":["fa","en"]
      }
    ]
  };
  const fontEntity=ld["@graph"][1];
  const designer=content?.designer||metadata?.designer;
  if(designer)fontEntity.creator={"@type":"Person","name":designer};
  if(content?.license||metadata?.license)fontEntity.license=content?.license||metadata.license;
  if(content?.year)fontEntity.dateCreated=content.year.match(/\d{4}/)?.[0];
  const authoritativeSource=content?.homepage||(["GOOGLE","IRANIAN"].includes(font.source)?font.link:null);
  if(authoritativeSource)fontEntity.sameAs=authoritativeSource;
  let ldScript=document.getElementById("fontStructuredData");
  if(!ldScript){ldScript=document.createElement("script");ldScript.id="fontStructuredData";ldScript.type="application/ld+json";document.head.appendChild(ldScript)}
  ldScript.textContent=JSON.stringify(ld);
}

function renderNotFound(){
  const copy=COPY[currentLanguage];
  const title=`${copy.notFound} | ${currentLanguage==="fa"?"قلم‌نما":"Ghalamnama"}`;
  const description=copy.notFoundText;
  document.documentElement.lang=currentLanguage;
  document.documentElement.dir=currentLanguage==="fa"?"rtl":"ltr";
  document.title=title;
  $("pageTitle").textContent=title;
  setMetaContent("pageDescription",description);
  setMetaContent("pageRobots","noindex, follow");
  setMetaContent("pageOgTitle",title);
  setMetaContent("pageOgDescription",description);
  setMetaContent("pageTwitterTitle",title);
  setMetaContent("pageTwitterDescription",description);
  $("fontDetail").innerHTML=`
    <div class="font-page-head">
      <h1>${copy.notFound}</h1>
      <p class="font-page-kicker">${copy.notFoundText}</p>
    </div>
    <div class="font-actions">
      <a class="font-action ghost" href="index.html">${copy.back}</a>
    </div>
  `;
}

function setLanguage(lang){
  currentLanguage=lang;
  const url=new URL(location.href);
  url.searchParams.set("lang",lang);
  history.replaceState(null,"",url);
  if(currentFont)renderPage(currentFont,currentContent,currentMetadata);
  else renderNotFound();
}

function addAlternateLanguageLinks(){
  for(const lang of ["fa","en","x-default"]){
    const link=document.createElement("link");
    link.rel="alternate";
    link.hreflang=lang;
    link.href=`https://ghalamnama.online/font?f=${encodeURIComponent(requestedFamily)}&lang=${lang==="x-default"?"fa":lang}${scriptContext==="ar"?"&context=ar":""}`;
    document.head.appendChild(link);
  }
}

function applyLanguageShell(){
  const copy=COPY[currentLanguage];
  document.documentElement.lang=currentLanguage;
  document.documentElement.dir=currentLanguage==="fa"?"rtl":"ltr";
  $("loadingMsg").textContent=copy.loading;
  document.querySelector('.icon-btn[href="index.html"]').setAttribute("aria-label",copy.home);
  document.querySelectorAll("[data-lang]").forEach(button=>button.setAttribute("aria-pressed",String(button.dataset.lang===currentLanguage)));
}

async function init(){
  let local=[],content={},metadata={},arabic=[];
  applyLanguageShell();
  try{
    const responses=await Promise.all([fetch("fonts.json"),fetch("font-content.json"),fetch("font-metadata.json"),fetch("arabic-fonts.json")]);
    if(responses[0].ok)local=await responses[0].json();
    if(responses[1].ok)content=await responses[1].json();
    if(responses[2].ok)metadata=await responses[2].json();
    if(responses[3].ok)arabic=await responses[3].json();
  }catch{}

  const localMatch=local.find(f=>f.family===requestedFamily);
  const webMatch=WEB_FONTS.find(f=>f.family===requestedFamily);
  const arabicMatch=arabic.find(f=>f.family===requestedFamily);
  const font=scriptContext==="ar"&&arabicMatch?{...webMatch,...arabicMatch,link:arabicMatch.sourceUrl}:localMatch?{...localMatch,source:"LOCAL"}:webMatch;
  fontCatalog=[...local.map(item=>({...item,source:"LOCAL"})),...WEB_FONTS];

  addAlternateLanguageLinks();
  document.querySelectorAll("[data-lang]").forEach(button=>button.addEventListener("click",()=>setLanguage(button.dataset.lang)));
  if(!font){renderNotFound();return}
  currentFont=font;
  currentContent=content[font.family];
  currentMetadata=metadata[font.family];
  renderPage(currentFont,currentContent,currentMetadata);
}
init();

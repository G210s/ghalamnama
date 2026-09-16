(function(){
  const storageKey="ghalamnama-consent";
  const consent=localStorage.getItem(storageKey);
  const copy={
    fa:{title:"حریم خصوصی و کوکی‌ها",text:"قلم‌نما برای بهبود تجربه و نمایش آمار بازدید از ابزارهای تحلیلی و تبلیغاتی استفاده می‌کند. با انتخاب «می‌پذیرم» با استفاده از این ابزارها موافقت می‌کنید.",accept:"می‌پذیرم",reject:"رد می‌کنم",more:"اطلاعات بیشتر"},
    ar:{title:"الخصوصية وملفات تعريف الارتباط",text:"يستخدم قلم‌نما أدوات التحليل والإعلانات لتحسين التجربة وقياس الزيارات. اختر «أوافق» للسماح بهذه الأدوات.",accept:"أوافق",reject:"لا أوافق",more:"مزيد من المعلومات"},
    en:{title:"Privacy and cookies",text:"Ghalamnama uses analytics and advertising tools to improve the experience and measure visits. Choose “Accept” to allow these tools.",accept:"Accept",reject:"Reject",more:"Learn more"}
  };
  const language=document.documentElement.lang.startsWith("ar")?"ar":document.documentElement.lang.startsWith("en")?"en":"fa";
  function loadOptionalServices(){
    window.dataLayer=window.dataLayer||[];
    window.gtag=function(){window.dataLayer.push(arguments)};
    window.gtag("js",new Date());
    window.gtag("config","G-893DZJQ17K");
    const analytics=document.createElement("script");
    analytics.async=true;
    analytics.src="https://www.googletagmanager.com/gtag/js?id=G-893DZJQ17K";
    document.head.appendChild(analytics);
    const ads=document.createElement("script");
    ads.async=true;
    ads.src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX";
    ads.crossOrigin="anonymous";
    document.head.appendChild(ads);
  }
  function saveChoice(value){
    localStorage.setItem(storageKey,value);
    document.querySelector(".consent-banner")?.remove();
    if(value==="accepted")loadOptionalServices();
  }
  function mountBanner(){
    if(consent==="accepted"){loadOptionalServices();return}
    if(consent==="rejected")return;
    const strings=copy[language];
    const banner=document.createElement("section");
    banner.className="consent-banner";
    banner.setAttribute("role","dialog");
    banner.setAttribute("aria-modal","false");
    banner.setAttribute("aria-labelledby","consentTitle");
    banner.innerHTML=`<div class="consent-copy"><p class="consent-kicker">PRIVACY</p><h2 id="consentTitle">${strings.title}</h2><p>${strings.text}</p><a href="https://policies.google.com/technologies/cookies" target="_blank" rel="noopener noreferrer">${strings.more}</a></div><div class="consent-actions"><button class="consent-reject" type="button">${strings.reject}</button><button class="consent-accept" type="button">${strings.accept}</button></div>`;
    banner.querySelector(".consent-accept").onclick=()=>saveChoice("accepted");
    banner.querySelector(".consent-reject").onclick=()=>saveChoice("rejected");
    document.body.appendChild(banner);
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mountBanner,{once:true});
  else mountBanner();
})();
(function(){
  const layouts={
    fa:["ض","ص","ث","ق","ف","غ","ع","ه","خ","ح","ج","چ","ش","س","ی","ب","ل","ا","ت","ن","م","ک","گ","ظ","ط","ز","ر","ذ","د","پ","و","ژ"],
    ar:["ض","ص","ث","ق","ف","غ","ع","ه","خ","ح","ج","د","ش","س","ي","ب","ل","ا","ت","ن","م","ك","ط","ئ","ء","ؤ","ر","لا","ى","ة","و","ز","ظ"]
  };
  const symbols=["َ","ِ","ُ","ّ","ْ","ً","ٍ","ٌ","ـ","،","؛","؟","."];
  const keyMaps={
    fa:{q:"ض",w:"ص",e:"ث",r:"ق",t:"ف",y:"غ",u:"ع",i:"ه",o:"خ",p:"ح","[":"ج","]":"چ",a:"ش",s:"س",d:"ی",f:"ب",g:"ل",h:"ا",j:"ت",k:"ن",l:"م",";":"ک","'":"گ",z:"ظ",x:"ط",c:"ز",v:"ر",b:"ذ",n:"د",m:"پ",",":"و",".":"ژ","/":"؟"},
    ar:{q:"ض",w:"ص",e:"ث",r:"ق",t:"ف",y:"غ",u:"ع",i:"ه",o:"خ",p:"ح","[":"ج","]":"د",a:"ش",s:"س",d:"ي",f:"ب",g:"ل",h:"ا",j:"ت",k:"ن",l:"م",";":"ك","'":"ط",z:"ئ",x:"ء",c:"ؤ",v:"ر",b:"لا",n:"ى",m:"ة",",":"و",".":"ز","/":"ظ"}
  };
  const key=value=>({label:value,value}), special=(label,action,className="")=>({label,action,className});
  const keyboardRows={
    fa:[
      [special("Esc","noop"),key("۱"),key("۲"),key("۳"),key("۴"),key("۵"),key("۶"),key("۷"),key("۸"),key("۹"),key("۰"),key("-"),key("="),special("⌫","backspace","wide")],
      [special("Tab","noop"),key("ض"),key("ص"),key("ث"),key("ق"),key("ف"),key("غ"),key("ع"),key("ه"),key("خ"),key("ح"),key("ج"),key("چ"),special("↵","enter","enter-key")],
      [special("Caps","noop"),key("ش"),key("س"),key("ی"),key("ب"),key("ل"),key("ا"),key("ت"),key("ن"),key("م"),key("ک"),key("گ"),key("؛"),special("⌫","backspace")],
      [special("⇧","noop","shift-key"),key("ظ"),key("ط"),key("ز"),key("ر"),key("ذ"),key("د"),key("پ"),key("و"),key("ژ"),key("؟"),key("،"),special("⇧","noop","shift-key")],
    ],
    ar:[
      [special("Esc","noop"),key("١"),key("٢"),key("٣"),key("٤"),key("٥"),key("٦"),key("٧"),key("٨"),key("٩"),key("٠"),key("-"),key("="),special("⌫","backspace","wide")],
      [special("Tab","noop"),key("ض"),key("ص"),key("ث"),key("ق"),key("ف"),key("غ"),key("ع"),key("ه"),key("خ"),key("ح"),key("ج"),key("د"),special("↵","enter","enter-key")],
      [special("Caps","noop"),key("ش"),key("س"),key("ي"),key("ب"),key("ل"),key("ا"),key("ت"),key("ن"),key("م"),key("ك"),key("ط"),special("⌫","backspace")],
      [special("⇧","noop","shift-key"),key("ئ"),key("ء"),key("ؤ"),key("ر"),key("لا"),key("ى"),key("ة"),key("و"),key("ز"),key("ظ"),special("⇧","noop","shift-key")],
    ]
  };
  const labels={fa:{show:"⌨ صفحه‌کلید فارسی",hide:"⌨ بستن صفحه‌کلید",mapOn:"تبدیل کلیدها: روشن",mapOff:"تبدیل کلیدها: خاموش",space:"فاصله",backspace:"⌫",enter:"↵",clear:"پاک‌کردن"},ar:{show:"⌨ لوحة المفاتيح العربية",hide:"⌨ إغلاق لوحة المفاتيح",mapOn:"تحويل المفاتيح: مفعّل",mapOff:"تحويل المفاتيح: متوقف",space:"مسافة",backspace:"⌫",enter:"↵",clear:"مسح"}};
  const attached=new WeakSet();
  function languageFor(textarea){return textarea.lang.startsWith("ar")?"ar":"fa"}
  function insert(textarea,value){
    const start=textarea.selectionStart??textarea.value.length;
    const end=textarea.selectionEnd??start;
    textarea.setRangeText(value,start,end,"end");
    textarea.dispatchEvent(new Event("input",{bubbles:true}));
    textarea.focus();
  }
  function backspace(textarea){
    const start=textarea.selectionStart??0;
    const end=textarea.selectionEnd??start;
    if(start!==end){insert(textarea,"");return}
    if(start===0)return;
    const previous=[...textarea.value].slice(0,start-1).join("");
    textarea.setSelectionRange(previous.length,start);
    insert(textarea,"");
  }
  function mapPhysicalKeys(value,lang){
    const map=keyMaps[lang];
    return [...value].map(character=>map[character.toLowerCase()]||character).join("");
  }
  function mapInput(textarea,event,lang){
    if(!event.data||!/[a-z\[\];',./]/i.test(event.data))return;
    const end=textarea.selectionStart??textarea.value.length;
    const start=Math.max(0,end-event.data.length);
    const mapped=mapPhysicalKeys(event.data,lang);
    if(mapped===event.data)return;
    textarea.setRangeText(mapped,start,end,"end");
    textarea.dispatchEvent(new Event("input",{bubbles:true}));
  }
  function attach(textarea){
    if(attached.has(textarea))return;
    attached.add(textarea);
    const wrapper=document.createElement("div");
    wrapper.className="virtual-keyboard-wrap";
    textarea.parentNode.insertBefore(wrapper,textarea.nextSibling);
    const controls=document.createElement("div");
    controls.className="virtual-keyboard-controls";
    const toggle=document.createElement("button");
    toggle.type="button";
    toggle.className="virtual-keyboard-toggle";
    toggle.setAttribute("aria-expanded","false");
    controls.appendChild(toggle);
    const panel=document.createElement("div");
    panel.className="virtual-keyboard";
    panel.hidden=true;
    panel.setAttribute("aria-label","صفحه‌کلید مجازی");
    wrapper.append(controls,panel);
    let keyMappingEnabled=languageFor(textarea)!=="en";
    let transforming=false;
    textarea.addEventListener("input",event=>{
      if(!keyMappingEnabled||transforming)return;
      transforming=true;
      mapInput(textarea,event,languageFor(textarea));
      transforming=false;
    });
    function render(){
      const lang=languageFor(textarea),copy=labels[lang];
      toggle.textContent=panel.hidden?copy.show:copy.hide;
      panel.dir="rtl";
      const rows=keyboardRows[lang].map(row=>`<div class="virtual-keyboard-row">${row.map(item=>item.action?`<button type="button" data-action="${item.action}" class="virtual-keyboard-key ${item.className}">${item.label}</button>`:`<button type="button" data-key="${item.value}" class="virtual-keyboard-key">${item.label}</button>`).join("")}</div>`).join("");
      panel.innerHTML=`<div class="virtual-keyboard-modes"><button type="button" data-action="key-mapping" aria-pressed="${keyMappingEnabled}">${keyMappingEnabled?copy.mapOn:copy.mapOff}</button></div><div class="virtual-keyboard-keys">${rows}</div><div class="virtual-keyboard-actions"><button type="button" data-action="ctrl">Ctrl</button><button type="button" data-action="alt">Alt</button><button type="button" data-action="space" class="virtual-keyboard-space">${copy.space}</button><button type="button" data-action="alt">Alt</button><button type="button" data-action="clear">${copy.clear}</button></div>`;
      panel.querySelector('[data-action="key-mapping"]').onclick=()=>{keyMappingEnabled=!keyMappingEnabled;render();textarea.focus()};
      panel.querySelectorAll("[data-key]").forEach(button=>button.onclick=()=>insert(textarea,button.dataset.key));
      panel.querySelector('[data-action="space"]').onclick=()=>insert(textarea," ");
      panel.querySelectorAll('[data-action="backspace"]').forEach(button=>button.onclick=()=>backspace(textarea));
      panel.querySelector('[data-action="enter"]').onclick=()=>insert(textarea,"\n");
      panel.querySelector('[data-action="clear"]').onclick=()=>{textarea.value="";textarea.dispatchEvent(new Event("input",{bubbles:true}));textarea.focus()};
    }
    toggle.onclick=()=>{panel.hidden=!panel.hidden;toggle.setAttribute("aria-expanded",String(!panel.hidden));render();if(!panel.hidden)textarea.focus()};
    render();
    new MutationObserver(()=>{keyMappingEnabled=languageFor(textarea)!=="en";render()}).observe(textarea,{attributes:true,attributeFilter:["lang"]});
  }
  function scan(){document.querySelectorAll("textarea[lang]").forEach(attach)}
  scan();
  new MutationObserver(scan).observe(document.body,{childList:true,subtree:true});
})();
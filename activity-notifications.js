(()=>{
  const consentKey="live-share-activity-consent-v1";
  const banner=document.getElementById("activity-consent");
  if(!banner)return;
  const allow=document.getElementById("activity-allow");
  const deny=document.getElementById("activity-deny");
  const detect=()=>{
    const ua=navigator.userAgent||"";
    const device=/Android.*Mobile|iPhone/i.test(ua)?"Android phone":/iPad|Tablet/i.test(ua)?"Tablet":/Android/i.test(ua)?"Tablet":/Windows|Macintosh|Linux/i.test(ua)?"Desktop":"Other";
    const browser=/Edg\//i.test(ua)?"Edge":/Firefox\//i.test(ua)?"Firefox":/Chrome\//i.test(ua)?"Chrome":/Safari\//i.test(ua)?"Safari":"Other";
    return {device,browser};
  };
  const send=(event,control="")=>{
    if(localStorage.getItem(consentKey)!=="yes")return;
    const {device,browser}=detect();
    fetch("/api/project-event",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({event,page:location.pathname,control,device,browser,consent:true}),keepalive:true}).catch(()=>{});
  };
  const saved=localStorage.getItem(consentKey);
  if(!saved)banner.hidden=false;
  if(saved==="yes")send("visit");
  allow?.addEventListener("click",()=>{
    localStorage.setItem(consentKey,"yes");banner.hidden=true;send("visit");
  });
  deny?.addEventListener("click",()=>{
    localStorage.setItem(consentKey,"no");banner.hidden=true;
  });
  document.addEventListener("click",e=>{
    if(localStorage.getItem(consentKey)!=="yes")return;
    const el=e.target.closest("button,a,[role='button']");
    if(!el||el.closest("#activity-consent"))return;
    const label=(el.innerText||el.getAttribute("aria-label")||el.getAttribute("title")||"Button").replace(/\s+/g," ").trim().slice(0,60);
    send("click",label);
  },true);
})();
const V='bk-v6';
const PRE=['./','index.html','manifest.json','icon-192.png','icon-512.png','logo.png','jameel.ttf'];
const EXT=['https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-auth-compat.js','https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore-compat.js','https://fonts.googleapis.com/css2?family=Noto+Nastaliq+Urdu:wght@400..700&family=Gulzar&display=swap'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(async c=>{
  await Promise.all(PRE.map(u=>c.add(u).catch(()=>{})));
  await Promise.all(EXT.map(u=>fetch(u,{mode:'no-cors'}).then(x=>c.put(u,x)).catch(()=>{})))}));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);
  if(!(u.origin==location.origin||['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)))return;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(u.origin==location.origin?new Request(r,{cache:'no-store'}):r).then(x=>{if(x&&(x.ok||x.type=='opaque'))c.put(r,x.clone());return x}).catch(()=>null);
    if(r.mode=='navigate'){const x=await Promise.race([net,new Promise(y=>setTimeout(()=>y(null),4000))]);return x||hit||c.match('index.html')}
    return hit||(await net)||Response.error()}))});

const V='bk-v3';
self.addEventListener('install',e=>{e.waitUntil(caches.open(V).then(c=>Promise.all(['./','index.html','manifest.json','icon-192.png','jameel.ttf'].map(u=>c.add(u).catch(()=>{})))));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!=V).map(x=>caches.delete(x)))).then(()=>clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request;if(r.method!='GET')return;const u=new URL(r.url);
  if(!(u.origin==location.origin||['www.gstatic.com','fonts.googleapis.com','fonts.gstatic.com'].includes(u.hostname)))return;
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r,{ignoreSearch:true});
    const net=fetch(r).then(x=>{if(x&&(x.ok||x.type=='opaque'))c.put(r,x.clone());return x}).catch(()=>null);
    if(r.mode=='navigate'){const x=await net;return x||hit||c.match('index.html')}
    return hit||(await net)||Response.error()}))});

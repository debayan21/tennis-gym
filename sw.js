const C="tennis-gym-v4";
self.addEventListener("install",e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(["./","index.html","manifest.webmanifest","icon-180.png","icon-512.png"].map(u=>new Request(u,{cache:"reload"})))));self.skipWaiting();});
self.addEventListener("activate",e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==C).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",e=>{
  const r=e.request; if(r.method!=="GET") return;
  const u=new URL(r.url);
  if(u.hostname.endsWith("supabase.co")) return; // never cache API/auth calls
  const same=u.origin===self.location.origin;
  const req=same?new Request(r,{cache:"no-cache"}):r; // always revalidate our own files so updates show up
  e.respondWith(fetch(req).then(res=>{ if(res.ok&&(res.type==="basic"||res.type==="cors")){const cp=res.clone();caches.open(C).then(c=>c.put(r,cp));} return res; })
    .catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||(r.mode==="navigate"?caches.match("index.html"):undefined))));
});

/* Kill-switch: the game no longer uses a service worker. This removes any old one
   (and its cached copy of an outdated index.html) from visitors' browsers. */
self.addEventListener('install',()=>self.skipWaiting());
self.addEventListener('activate',e=>{e.waitUntil(
 caches.keys().then(k=>Promise.all(k.map(x=>caches.delete(x))))
 .then(()=>self.registration.unregister())
 .then(()=>self.clients.matchAll({type:'window'}))
 .then(cs=>cs.forEach(c=>{try{c.navigate(c.url)}catch(e){}}))
)});

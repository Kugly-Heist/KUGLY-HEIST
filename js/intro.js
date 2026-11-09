/* ---------- intro video: first PLAY only, SKIP, replay from the menu ---------- */
(function(){const ov=$('intro'),v=$('introv');let act=0,after=null,tmo,ready=0;
/* intro.mp4 is embedded in this file (like the model and music) -> decode once into a blob: URL */
function ensure(){if(ready)return true;try{const bin=atob(INTRO_B64),n=bin.length,u=new Uint8Array(n);for(let i=0;i<n;i++)u[i]=bin.charCodeAt(i);v.src=URL.createObjectURL(new Blob([u],{type:'video/mp4'}));ready=1;return true}catch(e){console.warn('[intro] decode failed',e);return false}}
if(!save.intro){setTimeout(()=>{if(ensure()){v.preload='auto';try{v.load()}catch(e){}}},0)}
function toast(m){const d=document.createElement('div');d.textContent=m;d.style.cssText='position:fixed;left:50%;bottom:max(24px,env(safe-area-inset-bottom));transform:translateX(-50%);z-index:1001;background:#000c;border:2px solid #f2b544;color:#f7e8cc;padding:10px 18px;border-radius:10px;font:700 14px system-ui,sans-serif;max-width:88vw;text-align:center;pointer-events:none';document.body.appendChild(d);setTimeout(()=>d.remove(),6000)}
function finish(why){if(!act)return;act=0;clearTimeout(tmo);v.pause();
 if(why){const e=v.error;console.warn('[intro] video skipped:',why,e?e.code+' '+e.message:'',v.currentSrc);toast('Intro video could not be played ('+why+(e?' '+e.code:'')+').')}const f=after;after=null;
 if(f)f();else{startMusic('lobby')} /* replay from menu -> back to the menu */
 ov.classList.add('out');setTimeout(()=>{if(!act){ov.classList.remove('on','out');try{v.currentTime=0}catch(e){}}},600)}
function run(next){if(act)return;if(!ensure()){if(next)next();return}act=1;after=next;stopMusic();
 ov.classList.remove('out');ov.classList.add('on');v.currentTime=0;v.volume=cl(save.mv/100,0,1);v.muted=false;
 tmo=setTimeout(()=>{if(v.readyState<2&&act)finish('timeout')},15000); /* video can't load -> don't block the game */
 const pr=v.play();if(pr&&pr.catch)pr.catch(()=>{v.muted=true;const q=v.play();if(q&&q.catch)q.catch(()=>finish('blocked'))})}
v.addEventListener('playing',()=>{clearTimeout(tmo);if(!save.intro){save.intro=1;persist()}});
v.addEventListener('ended',()=>finish());v.addEventListener('error',()=>{if(act)finish('load error')});
$('skip').addEventListener('click',e=>{e.stopPropagation();sfx.click();finish()});
addEventListener('keydown',e=>{if(!act)return;e.preventDefault();e.stopImmediatePropagation();if(['Escape','Enter','Space'].includes(e.code))finish()},true);
window.introGate=play=>{if(act)return;if(save.intro)play();else run(play)};
$('introb').addEventListener('click',()=>{A();if(state=='menu')run(null)});
})();

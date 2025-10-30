let ctx;
function lazy(){ if(!ctx) ctx=new(window.AudioContext||window.webkitAudioContext)() }
export function ding(){
  lazy();
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type="sine";o.frequency.value=880;g.gain.value=0.001;
  o.connect(g).connect(ctx.destination);o.start();
  const t=ctx.currentTime;
  g.gain.exponentialRampToValueAtTime(0.15,t+0.01);
  g.gain.exponentialRampToValueAtTime(0.00001,t+0.3);
  o.stop(t+0.31);
}
export function whoosh(){
  lazy();
  const buf=ctx.createBuffer(1,ctx.sampleRate*0.4,ctx.sampleRate);
  const d=buf.getChannelData(0);
  for(let i=0;i<d.length;i++) d[i]=(Math.random()*2-1)*Math.pow(1-i/d.length,2);
  const s=ctx.createBufferSource();s.buffer=buf;
  const f=ctx.createBiquadFilter();f.type="highpass";f.frequency.value=500;
  const g=ctx.createGain();g.gain.value=0.35;
  s.connect(f).connect(g).connect(ctx.destination);s.start();
}
export function error(){
  lazy();
  const o=ctx.createOscillator(),g=ctx.createGain();
  o.type="sawtooth";o.frequency.value=200;g.gain.value=0.06;
  o.connect(g).connect(ctx.destination);o.start();
  const t=ctx.currentTime;
  o.frequency.exponentialRampToValueAtTime(60,t+0.35);
  g.gain.exponentialRampToValueAtTime(0.00001,t+0.35);
  o.stop(t+0.36);
}
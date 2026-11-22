/* ================= 포근 마을 3D (코드로 지은 옛날 동네 × 육아) ================= */
const V3D=(()=>{
let ok=false,on=false,R3,S3,C3,comp3,cv,BU,raf=0,mode='map',cur=null,last=performance.now();
try{BU=T.BufferGeometryUtils;const c=document.createElement('canvas');ok=!!(c.getContext('webgl')||c.getContext('experimental-webgl'))&&!!BU}catch(e){ok=false}
if(!ok)return{ok:()=>false};
const rnd=(a,b)=>a+Math.random()*(b-a),V=(x,y,z)=>new T.Vector3(x,y,z),E=(x,y,z)=>new T.Euler(x||0,y||0,z||0);
let seed=7;const sr=()=>{seed=(seed*16807)%2147483647;return seed/2147483647},srn=(a,b)=>a+sr()*(b-a);
/* ---------- 질감 ---------- */
function ctex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.encoding=T.sRGBEncoding;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=4;return t}
function clay(g,w,h,base,amt){g.fillStyle=base;g.fillRect(0,0,w,h);for(let i=0;i<w*h/7;i++){const v=srn(-amt,amt);g.fillStyle=v>0?`rgba(255,255,255,${v})`:`rgba(70,45,20,${-v})`;g.beginPath();g.arc(sr()*w,sr()*h,srn(1,4),0,7);g.fill()}}
const tClay=ctex(256,256,(g,w,h)=>clay(g,w,h,'#fff',.05));
const tWood=ctex(256,64,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);for(let y=0;y<h;y+=3){g.strokeStyle=`rgba(120,75,35,${srn(.04,.12)})`;g.lineWidth=srn(1,2);g.beginPath();g.moveTo(0,y);for(let x=0;x<=w;x+=20)g.lineTo(x,y+Math.sin(x*.05+y)*1.5);g.stroke()}});
const tHanji=ctex(256,256,(g,w,h)=>{clay(g,w,h,'#fbf3e6',.03);g.strokeStyle='#b8875a';g.lineWidth=7;g.lineCap='round';for(let i=1;i<4;i++){g.beginPath();g.moveTo(i*w/4,6);g.lineTo(i*w/4,h-6);g.stroke()}for(let j=1;j<6;j++){g.beginPath();g.moveTo(6,j*h/6);g.lineTo(w-6,j*h/6);g.stroke()}g.lineWidth=14;g.strokeRect(7,7,w-14,h-14)});
const tStraw=ctex(128,128,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);for(let i=0;i<500;i++){g.strokeStyle=`rgba(140,100,40,${srn(.08,.25)})`;g.lineWidth=1;const x=sr()*w,y=sr()*h;g.beginPath();g.moveTo(x,y);g.lineTo(x+srn(-2,2),y+srn(6,14));g.stroke()}});
const tGlow=ctex(64,64,(g,w,h)=>{const r=g.createRadialGradient(32,32,1,32,32,31);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.4,'rgba(255,255,255,.45)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h)});
const S=(c,o)=>new T.MeshStandardMaterial(Object.assign({vertexColors:true,map:tClay,roughness:.9,color:c},o||{}));
const M={tile:S('#56688c',{roughness:.7}),ridge:S('#3b4963',{side:T.DoubleSide}),wall:S('#f3e2c4',{side:T.DoubleSide}),wood:S('#e0a874',{map:tWood,roughness:.8}),woodD:S('#b8794a',{map:tWood}),
 hanji:S('#ffffff',{map:tHanji,side:T.DoubleSide,emissive:new T.Color('#ffb54a'),emissiveIntensity:0}),stone:S('#b8aa94',{roughness:.95}),ground:S('#94bb6c',{roughness:1}),sand:S('#e8c795',{roughness:1}),
 grass:S('#94ba76',{map:null,roughness:1}),leaf:S('#ffffff',{roughness:.95}),path:S('#ead2a6',{map:null,roughness:1}),onggi:S('#5a3624',{roughness:.32,metalness:.05}),flower:S('#ffffff',{map:null,roughness:.8}),pot:S('#9b6a48',{roughness:.7}),straw:S('#f0c878',{map:tStraw,roughness:1,side:T.DoubleSide}),
 cloth:S('#fffaf2',{map:null,side:T.DoubleSide}),ondol:S('#f3c27a',{vertexColors:false,map:tClay,emissive:new T.Color('#ff5a1e'),emissiveIntensity:0}),water:S('#8fc9e6',{map:null,roughness:.2,metalness:.1}),
 iron:S('#4a4a52',{map:null,roughness:.5,metalness:.4}),red:S('#e0524a',{map:null,roughness:.6}),paper:S('#fffdf6',{map:null,side:T.DoubleSide})};
/* ---------- 조각을 재질별로 모았다가 합쳐서 한 번에 그림 ---------- */
class Kit{constructor(){this.b={}}
 put(geo,mat,pos,rot,scl,tint){let g=geo.index?geo.toNonIndexed():geo.clone();g.applyMatrix4(new T.Matrix4().compose(pos||V(0,0,0),new T.Quaternion().setFromEuler(rot||E()),scl||V(1,1,1)));
  const n=g.attributes.position.count,c=new Float32Array(n*3),col=new T.Color(tint||'#fff');for(let i=0;i<n;i++){c[i*3]=col.r;c[i*3+1]=col.g;c[i*3+2]=col.b}
  const ng=new T.BufferGeometry();ng.setAttribute('position',g.attributes.position);ng.setAttribute('normal',g.attributes.normal);ng.setAttribute('uv',g.attributes.uv||new T.BufferAttribute(new Float32Array(n*2),2));ng.setAttribute('color',new T.BufferAttribute(c,3));(this.b[mat]=this.b[mat]||[]).push(ng);return this}
 build(dark,shadow){const grp=new T.Group();for(const k in this.b){const g=BU.mergeBufferGeometries(this.b[k]);if(dark!==false){const p=g.attributes.position,c=g.attributes.color;for(let i=0;i<p.count;i++){const y=p.getY(i),f=.7+.3*Math.min(1,Math.max(0,y/.55));c.setXYZ(i,c.getX(i)*f,c.getY(i)*f,c.getZ(i)*f)}}
  const m=new T.Mesh(g,M[k]);m.castShadow=shadow!==false;m.receiveShadow=true;grp.add(m)}return grp}}
function rb(w,h,d,r){r=Math.min(r,w/2-.002,h/2-.002,d/2-.002);w-=2*r*.98;h-=2*r*.98;const s=new T.Shape(),x=-w/2+r,y=-h/2+r,W=w-2*r,H=h-2*r;
 s.moveTo(x,y-r);s.lineTo(x+W,y-r);s.absarc(x+W,y,r,-Math.PI/2,0);s.lineTo(x+W+r,y+H);s.absarc(x+W,y+H,r,0,Math.PI/2);s.lineTo(x,y+H+r);s.absarc(x,y+H,r,Math.PI/2,Math.PI);s.lineTo(x-r,y);s.absarc(x,y,r,Math.PI,Math.PI*1.5);
 const g=new T.ExtrudeGeometry(s,{depth:Math.max(.001,d-2*r),bevelEnabled:true,bevelThickness:r,bevelSize:r*.98,bevelSegments:3,curveSegments:4});g.translate(0,0,-(d-2*r)/2);return g}
const cyl=(a,b,h,s)=>new T.CylinderGeometry(a,b,h,s||12),sph=(r,s)=>new T.SphereGeometry(r,s||12,Math.max(6,(s||12)*.7|0));
const qDir=d=>new T.Euler().setFromQuaternion(new T.Quaternion().setFromUnitVectors(V(0,1,0),d.clone().normalize()));
/* ---------- 집 한 채: 몸채 / 앞벽 / 지붕을 따로 만들어 지붕·앞벽만 사라지게 ---------- */
function house(o){const W=o.W,D=o.D,H=o.H||1.7,y0=.6,y1=y0+H,body=new Kit(),front=new Kit(),roof=new Kit();
 body.put(rb(W+1.3,.48,D+(o.porch?2.5:1.3),.2),'stone',V(0,.24,o.porch?.6:0),null,null,'#f6f1ea');
 const cx=[];for(let i=0;i<=o.bays;i++)cx.push(-W/2+i*W/o.bays);
 cx.forEach(x=>[-D/2,D/2].forEach(z=>{const kk=z>0&&!o.openFront?front:body;kk.put(cyl(.25,.3,.18,12),'stone',V(x,.57,z));kk.put(cyl(.15,.16,H,12),'woodD',V(x,y0+H/2,z))}));
 body.put(rb(W+.1,.14,D+.1,.05),'wood',V(0,y0+.07,0),null,null,'#f0ddc4');
 for(let i=0;i<o.bays;i++){const a=cx[i],b=cx[i+1],m=(a+b)/2,w=b-a-.28;body.put(rb(w,H-.08,.16,.06),'wall',V(m,(y0+y1)/2,-D/2+.02));body.put(rb(w,.5,.2,.05),'wood',V(m,y0+.32,-D/2+.06),null,null,'#c9a27a');body.put(new T.PlaneGeometry(.55,.4),'hanji',V(m,y0+1.15,-D/2+.13));
  if(!o.openFront){front.put(rb(w,H-.08,.16,.06),'wall',V(m,(y0+y1)/2,D/2-.02));front.put(rb(w+.1,.15,.2,.06),'woodD',V(m,y0+.52,D/2+.03));
   const dw=o.door===i?Math.min(1.5,w-.15):Math.min(1.1,w-.25),dh=o.door===i?1.15:.62,dy=o.door===i?y0+.66:y0+.98;front.put(new T.PlaneGeometry(dw,dh),'hanji',V(m,dy,D/2+.13));front.put(rb(dw+.14,dh+.14,.08,.04),'woodD',V(m,dy,D/2+.09))}}
 [-W/2,W/2].forEach(x=>{body.put(rb(.16,H-.08,D-.28,.06),'wall',V(x,(y0+y1)/2,0));body.put(rb(.2,.5,D-.3,.05),'wood',V(x+(x<0?.04:-.04),y0+.32,0),null,null,'#c9a27a');body.put(new T.PlaneGeometry(.8,.6).rotateY(Math.PI/2),'hanji',V(x+(x<0?-.1:.1),y0+.98,0))});
 roof.put(rb(W+.6,.26,.32,.1),'woodD',V(0,y1+.1,D/2));roof.put(rb(W+.6,.26,.32,.1),'woodD',V(0,y1+.1,-D/2));roof.put(rb(.32,.26,D+.4,.1),'woodD',V(-W/2,y1+.1,0));roof.put(rb(.32,.26,D+.4,.1),'woodD',V(W/2,y1+.1,0));
 if(o.porch){const z0=D/2+.18,z1=D/2+1.35,n=Math.round(W/.6);for(let i=0;i<n;i++){const w=(W+.3)/n;body.put(rb(w-.05,.15,z1-z0,.05),'wood',V(-W/2-.15+w*(i+.5),y0+.28,(z0+z1)/2),null,null,i%2?'#fff':'#f3e6d6')}
  body.put(rb(W+.4,.15,.18,.07),'woodD',V(0,y0+.15,z1));cx.forEach(x=>body.put(cyl(.08,.08,.45,8),'woodD',V(x,y0-.05,z1-.06)));body.put(rb(1,.2,.55,.1),'stone',V(0,.55,D/2+1.75))}
 if(o.roof==='straw'){const g=new T.SphereGeometry(1,24,12,0,Math.PI*2,0,Math.PI/2);roof.put(g,'straw',V(0,y1+.05,0),null,V(W/2+.95,2.1,D/2+.95),'#ffffff');
  for(let i=-2;i<=2;i++){const pts=[];for(let k=0;k<=16;k++){const a=k/16*Math.PI;pts.push(V(i*W/5.5,y1+.05+Math.sin(a)*2.12,-Math.cos(a)*(D/2+.97)))}roof.put(new T.TubeGeometry(new T.CatmullRomCurve3(pts),20,.035,5),'woodD',null,null,null,'#9a7040')}
  roof.put(new T.TorusGeometry(1,.06,6,30).rotateX(Math.PI/2),'woodD',V(0,y1+.1,0),null,V(W/2+.95,1,D/2+.95),'#9a7040');
  roof.put(cyl(.14,.14,W*.45,8).rotateZ(Math.PI/2),'straw',V(0,y1+2.17,0),null,null,'#d8a860')}
 else{const OH=1.25,rY=y1+1.95,eY=y1+.36,RW=W/2+OH,RD=D/2+OH,Wr=W/2+.25,Gz=Math.min(1,D/3),gY=rY-.9,pf=v=>Math.pow(v,.7),lf=(u,v)=>Math.pow(Math.abs(u),4.5)*.7*v*v;
  const fP=(u,v,s)=>V(u*(Wr+v*(RW-Wr)),rY-(rY-eY)*pf(v)+lf(u,v),s*v*RD),eP=(u,v,s)=>V(s*(Wr+v*(RW-Wr)),gY-(gY-eY)*pf(v)+lf(u,v),u*(Gz+v*(RD-Gz)));
  const slope=(fn,s,cols)=>{roof.put(new T.ParametricGeometry((u,v,t)=>{const p=fn(u*2-1,v,s);t.set(p.x,p.y-.06,p.z)},20,8),'ridge',null,null,null,'#9aa3b4');
   for(let i=0;i<=cols;i++){const u=(i/cols*2-1)*.985,pts=[];for(let k=0;k<=8;k++)pts.push(fn(u,.03+k/8*.97,s));roof.put(new T.TubeGeometry(new T.CatmullRomCurve3(pts),12,.095,6),'tile',null,null,null,i%2?'#fff':'#e6ecf6');
    const e=pts[8],d=e.clone().sub(pts[7]);roof.put(cyl(.11,.11,.07,10),'ridge',e,qDir(d));if(i%2==0){const p=fn(u,.9,s);p.y-=.2;roof.put(cyl(.06,.06,.4,6),'wood',p,qDir(d))}}};
  const cols=Math.round(W*3.8);slope(fP,1,cols);slope(fP,-1,cols);slope(eP,1,Math.round(D*2.6));slope(eP,-1,Math.round(D*2.6));
  [-1,1].forEach(s=>{const sh=new T.Shape();sh.moveTo(-Gz,0);sh.lineTo(Gz,0);sh.lineTo(0,rY-gY+.05);sh.closePath();roof.put(new T.ShapeGeometry(sh).rotateY(s*Math.PI/2),'wall',V(s*(Wr-.03),gY,0))});
  const pts=[];for(let k=0;k<=16;k++){const u=k/16*2-1;pts.push(V(u*(Wr+.2),rY+.12+Math.pow(Math.abs(u),6)*.38,0))}roof.put(new T.TubeGeometry(new T.CatmullRomCurve3(pts),24,.21,10),'ridge');
  roof.put(new T.TubeGeometry(new T.CatmullRomCurve3(pts.map(p=>p.clone().add(V(0,.16,0)))),24,.12,8),'tile');[-1,1].forEach(s=>roof.put(sph(.25,12),'ridge',V(s*(Wr+.28),rY+.58,0),null,V(.75,1.1,.7)));
  [[-1,1],[1,1],[-1,-1],[1,-1]].forEach(([sx,sz])=>{const q=[];for(let k=0;k<=8;k++){const p=fP(sx,k/8,sz);p.y+=.08;q.push(p)}roof.put(new T.TubeGeometry(new T.CatmullRomCurve3(q),14,.13,8),'ridge')})}
 const g=new T.Group(),b=body.build(),f=front.build(),r=roof.build(false);g.add(b,f,r);return{g,front:f,roof:r,y0,H,W,D}}
/* ---------- 소품 ---------- */
function sh(c){const o=new T.Color(c);o.offsetHSL(0,0,.06);return '#'+o.getHexString()}
function stroller(k,x,z,a){const q=(g,m,p,c)=>{g.rotateY(a);p.applyAxisAngle(V(0,1,0),a);k.put(g,m,V(x,0,z).add(p),null,null,c)};q(rb(.75,.45,1,.18),'cloth',V(0,.62,0),'#f4a6b5');q(new T.SphereGeometry(.55,14,8,0,Math.PI,0,Math.PI/2).rotateY(Math.PI/2).scale(1,.9,1),'cloth',V(0,.8,-.3),'#fff1c6');[[-.32,-.38],[.32,-.38],[-.32,.38],[.32,.38]].forEach(([u,v])=>q(cyl(.15,.15,.08,12).rotateZ(Math.PI/2),'iron',V(u,.15,v),'#ffffff'));q(cyl(.03,.03,.7,6).rotateX(.5),'iron',V(0,.95,.6),'#ffffff')}
function tree(k,x,z,s,c){k.put(cyl(.16*s,.24*s,1.6*s,8),'woodD',V(x,.8*s,z));[[0,2.1,0,1],[.7,1.8,.2,.75],[-.6,1.75,-.1,.8],[.1,2.6,-.2,.7],[-.2,1.9,.6,.7]].forEach(([a,b,cc,r])=>k.put(sph(.95*s*r,12),'leaf',V(x+a*s,b*s,z+cc*s),null,null,c?(r>.8?c:sh(c)):(r>.8?'#5f9e58':'#7db86a')))}
function bush(k,x,z,r,t){k.put(sph(r,10),'leaf',V(x,r*.55,z),null,V(1,.75,1),t||'#ffffff');k.put(sph(r*.7,10),'leaf',V(x+r*.7,r*.35,z+.15),null,V(1,.75,1),'#e2eed4')}
function flowers(k,x,z,n,rad){const fc=['#f4a6b5','#f7d27a','#c9b4f0','#ffffff','#ffb3a1'];for(let i=0;i<n;i++){const a=sr()*7,r=sr()*rad,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;k.put(sph(.11,7),'flower',V(px,.24,pz),null,null,fc[i%5]);k.put(cyl(.012,.012,.22,4),'grass',V(px,.11,pz))}}
function jar(k,x,z,s,y){y=y||0;k.put(sph(.42*s,14),'onggi',V(x,y+.42*s,z),null,V(1,1.1,1),'#ffffff');k.put(cyl(.26*s,.3*s,.1*s,14),'onggi',V(x,y+.88*s,z),null,null,'#8a5a40');k.put(sph(.06*s,6),'onggi',V(x,y+.96*s,z),null,null,'#8a5a40')}
function stones(k,x,z,n,rad,y){for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=rad;k.put(sph(srn(.16,.24),8),'stone',V(x+Math.cos(a)*r,(y||0)+.12,z+Math.sin(a)*r),null,V(1,.7,1),i%2?'#fff':'#ece6dc')}}
function glow(c,s){const m=new T.Sprite(new T.SpriteMaterial({map:tGlow,color:c,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));m.scale.set(s,s,1);return m}
/* ---------- 세계 ---------- */
let world,DYN=[],SMOKE=[],FIRE=[],STAR=[],FLY=[],PL3={},HOT=[],LBL={},avs={},lastSync=0,bubble=null;
const P={home:V(-7.5,0,11.5),post:V(1.2,0,15),store:V(9,0,11),pyeong:V(0,0,3),sarang:V(-9.5,0,-3.5),madang:V(2,0,-7),hall:V(10,0,-2),jangdok:V(-2,1.75,-16)};
const SPOTS={home:[V(-1,.75,-.5),V(.6,.75,-.4),V(1.6,.75,-.6),V(-1.8,.75,-.5)],sarang:[V(-.9,.75,-.5),V(.9,.75,-.6),V(0,.75,-.3)],hall:[V(-.6,.75,-.5),V(.6,.75,-.4),V(1.4,.75,-.6)],store:[V(-.7,.2,2.4),V(.6,.2,2.6),V(1.6,.2,2.2)],
 madang:[V(-1.4,0,.4),V(1.4,0,.6),V(0,0,2.2),V(-1.8,0,1.8)],pyeong:[V(-1,1.0,1.0),V(.4,1.0,1.2),V(1.5,1.0,.9),V(-.3,1.0,1.8),V(2.6,0,3.6),V(-2.6,0,3.5)],jangdok:[V(-1.4,0,2),V(.4,0,2.3),V(1.6,0,1.8)],vil:[V(1.2,0,13),V(-1,0,10),V(3,0,8),V(-2,0,7)]};
const VIEW={map:{t:V(0,0,0),w:31},home:{t:V(-7.5,1,11.4),w:6.0},sarang:{t:V(-9.6,.9,-3.4),w:5.1},hall:{t:V(9.8,1,-1.8),w:5.6},store:{t:V(9,1.2,11.4),w:6.3},madang:{t:V(1.6,.9,-7.2),w:6.5},pyeong:{t:V(.6,1.2,3.8),w:8.0},jangdok:{t:V(-1.6,2,-16.4),w:6.8},post:{t:V(1.4,1,14.6),w:6.4}};
const VDIR=V(0,.74,.67).normalize(),PDIR=V(0,.46,.89).normalize();function dist(w){const hf=Math.atan(Math.tan(C3.fov*Math.PI/360)*C3.aspect);return (w/2)/Math.tan(hf)}
const NAMES={home:'우리 집',post:'빨간 우체통',store:'구멍가게',pyeong:'정자나무 평상',sarang:'새벽 사랑방',madang:'부엌 마당',hall:'마을회관',jangdok:'장독대 언덕'};
const SUB={home:'도감·도장판',post:'쓰담 편지',store:'오늘의 선물',pyeong:'쓰담·우물 목욕',sarang:'수유·재우기',madang:'아궁이·식판',hall:'노무사 이장',jangdok:'위로 한 줄'};
const PATH=[V(1.2,0,17),V(1.2,0,13),V(-1,0,9.5),V(1.6,0,6.8),V(2.95,0,4.6),V(2.95,0,1.2),V(1.5,0,-.6),V(-3,0,-3),V(-1.4,0,-6.6),V(-2,0,-11),V(-2,.8,-12.8),V(-2,1.6,-14.2)];
const MP={};function MV(n){if(!MP[n]){MP[n]=M[n].clone();MP[n].vertexColors=false}return MP[n]}
function hot(mesh,key,place,fn){mesh.userData.hot={key,place,fn};HOT.push(mesh);return mesh}
function hbox(w,h,d,x,y,z,parent){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshBasicMaterial({visible:false}));m.position.set(x,y,z);(parent||world).add(m);return m}
function build(){world=new T.Group();S3.add(world);const K=new Kit();
 /* 섬: 둥근 땅 + 흙길 */
 const sh=new T.Shape();const N=48;for(let i=0;i<=N;i++){const a=i/N*Math.PI*2,rx=17+Math.sin(a*3)*.7,rz=22+Math.cos(a*2)*.8,x=Math.cos(a)*rx,z=Math.sin(a)*rz;i?sh.lineTo(x,z):sh.moveTo(x,z)}
 const ig=new T.ExtrudeGeometry(sh,{depth:1.2,bevelEnabled:true,bevelThickness:.5,bevelSize:.6,bevelSegments:4,curveSegments:8});ig.rotateX(Math.PI/2);K.put(ig,'ground',V(0,-.5,0));
 const cliff=new T.ExtrudeGeometry(sh,{depth:2.5,bevelEnabled:false,curveSegments:8});cliff.rotateX(Math.PI/2);K.put(cliff,'sand',V(0,-2.2,0),null,V(.985,1,.985),'#c9a070');
 const pc=new T.CatmullRomCurve3(PATH.filter(v=>v.y<.1)),pp=pc.getSpacedPoints(110);const pos=[],nor=[],uv=[],L=[],R=[];pp.forEach((a,i)=>{const b=pp[Math.min(pp.length-1,i+1)],c=pp[Math.max(0,i-1)],d=b.clone().sub(c).setY(0).normalize(),n=V(-d.z,0,d.x).multiplyScalar(1.25+Math.sin(i*.7)*.12),y=a.y+.05;L.push(a.clone().add(n).setY(y));R.push(a.clone().sub(n).setY(y))});
 for(let i=0;i<pp.length-1;i++){const q=[L[i],R[i],L[i+1],R[i+1]];[[0,2,1],[2,3,1]].forEach(tr=>tr.forEach(j=>{const v=q[j];pos.push(v.x,v.y,v.z);nor.push(0,1,0);uv.push(j%2,i/10)}))}
 const pg=new T.BufferGeometry();pg.setAttribute('position',new T.Float32BufferAttribute(pos,3));pg.setAttribute('normal',new T.Float32BufferAttribute(nor,3));pg.setAttribute('uv',new T.Float32BufferAttribute(uv,2));K.put(pg,'path');
 pp.forEach((a,i)=>{if(i%3)return;[L[i],R[i]].forEach((v,s)=>{if(sr()<.55)K.put(sph(srn(.12,.22),8),'stone',v.clone().setY(v.y+.03),null,V(1,.5,1),s?'#ffffff':'#ece4d8')})});
 
 for(let i=0;i<70;i++){const x=srn(-15,15),z=srn(-19,19);if(x*x/225+z*z/361>.85)continue;K.put(new T.CircleGeometry(srn(.8,2),14).rotateX(-Math.PI/2),'ground',V(x,.015,z),null,null,i%2?'#b8d090':'#f4ffe0')}
 for(let i=0;i<160;i++){const x=srn(-15,15),z=srn(-19,19);if(x*x/225+z*z/361>.9)continue;K.put(new T.ConeGeometry(.07,.28,4),'grass',V(x,.12,z),E(srn(-.3,.3),0,srn(-.3,.3)),null,i%3?'#ffffff':'#d8f0a0')}
 [[-1.8,9.8,.6],[-3.4,6.4,.6],[2.6,14.2,1.2]].forEach(([x,z,a])=>stroller(K,x,z,a));
 /* 장독대 언덕 */
 K.put(sph(6,24).scale(1,.36,.85),'ground',V(-2,-.3,-16.5));
 /* 나무·덤불·꽃·돌 흩뿌리기 */
 [[-14,6],[-13,-10],[13,-12],[14,4],[-12,17],[12,18],[6,-17],[-9,-18],[5.5,7.8],[-5,-9]].forEach(([x,z],i)=>tree(K,x,z,srn(.9,1.3),['#5f9e58','#7db86a','#e0965a','#4f9050','#e49a8a'][i%5]));
 for(let i=0;i<34;i++){const x=srn(-15,15),z=srn(-19,19);if(Math.hypot(x,z*.8)>15.5)continue;let near=false;for(const k in P)if(Math.hypot(P[k].x-x,P[k].z-z)<4.6)near=true;if(near)continue;bush(K,x,z,srn(.3,.6),['#6aa860','#8cc276','#eca878','#ee9fb0'][i%4])}
 flowers(K,-3.5,15,22,1.4);flowers(K,5,6,16,1.2);flowers(K,-6,1,14,1.1);flowers(K,6.5,-11,14,1.2);
 for(let i=0;i<60;i++){const x=srn(-15,15),z=srn(-19,19);if(Math.hypot(x,z*.8)>15)continue;K.put(sph(srn(.08,.15),6),'stone',V(x,.03,z),null,V(1,.5,1),i%2?'#fff':'#e8e0d4')}
 world.add(K.build());
 /* --- 장소 --- */
 const add=(k,obj)=>{const g=new T.Group();g.position.copy(P[k]);world.add(g);PL3[k]=Object.assign({g},obj||{});return g};
 { // 우리 집
  const h=house({W:6.4,D:3.4,bays:3,door:1,porch:true,roof:'tile'}),g=add('home',{h});g.add(h.g);const k=new Kit();
  k.put(rb(2.6,.9,.35,.08),'woodD',V(0,h.y0+1.05,-1.45));for(let i=0;i<3;i++)k.put(rb(2.5,.06,.32,.02),'wood',V(0,h.y0+.66+i*.36,-1.45));
  k.put(rb(1.2,.35,.7,.08),'wood',V(1.9,h.y0+.3,-.5));k.put(rb(1.1,.5,.8,.18),'cloth',V(-2.1,h.y0+.25,-.9),null,null,'#f6dbe0');k.put(rb(1.1,.18,.8,.08),'cloth',V(-2.1,h.y0+.58,-.9),null,null,'#dbe8f4');
  const px=[-5.5,-3.9],pz=2.4;px.forEach(x=>k.put(cyl(.07,.08,2.1,8),'woodD',V(x,1.05,pz)));
  [[-6,-3],[-6,-1],[-6,1],[-6,3.6],[5,-2.6],[5,0],[5,2.6]].forEach(([x,z])=>{for(let j=0;j<4;j++)k.put(sph(.32,8),'stone',V(x,.25,z-.9+j*.6),null,V(1,.75,1),j%2?'#fff':'#ece4d8')});
  bush(k,-4.6,4.2,.5);bush(k,4.2,4.4,.45);g.add(k.build());
  {const k2=new Kit();k2.put(sph(.28,12),'cloth',V(-1.1,h.y0+.45,.3),null,null,'#d9a878');k2.put(sph(.2,12),'cloth',V(-1.1,h.y0+.85,.3),null,null,'#d9a878');[-1,1].forEach(s=>k2.put(sph(.08,8),'cloth',V(-1.1+s*.15,h.y0+1.02,.3),null,null,'#c8925f'));k2.put(cyl(.012,.012,.6,4),'woodD',V(.9,h.y0+1.5,.4));[0,1,2,3].forEach(i=>k2.put(sph(.09,8),'flower',V(.9+Math.cos(i*1.57)*.25,h.y0+1.15,.4+Math.sin(i*1.57)*.25),null,null,['#f4a6b5','#f7d27a','#c9b4f0','#a9d2f0'][i]));g.add(k2.build())}
  {const k3=new Kit();k3.put(rb(1.3,.16,.9,.08),'cloth',V(.2,h.y0+.2,.5),null,null,'#f6dbe0');k3.put(rb(.4,.14,.3,.07),'cloth',V(-.2,h.y0+.33,.25),null,null,'#ffffff');k3.put(rb(1.2,.04,.6,.02),'cloth',V(.3,h.y0+.3,.7),null,null,'#dbe8f4');k3.put(cyl(.24,.2,.32,12),'wood',V(1.3,h.y0+.24,-.4),null,null,'#e8c08a');for(let i=0;i<4;i++)k3.put(rb(.18,.1,.14,.03),'cloth',V(1.24+(i%2)*.12,h.y0+.44+(i>1?.1:0),-.4),null,null,'#ffffff');[['#f4a6b5',-.6],['#f7d27a',-.38],['#a9d2f0',-.49]].forEach(([c,x],i)=>k3.put(rb(.18,.18,.18,.04),'cloth',V(x,h.y0+.17+(i==2?.18:0),1.1),E(0,i*.4,0),null,c));k3.put(rb(.4,.5,.04,.02),'paper',V(-.9,h.y0+1.4,-1.42),null,null,'#ffffff');k3.put(rb(.4,.12,.05,.02),'red',V(-.9,h.y0+1.6,-1.4));g.add(k3.build())}
  hot(hbox(2.8,1.4,.6,0,h.y0+1,-1.4,g),'shelf','home',()=>openDogam());
  {const dk=new Kit();dk.put(new T.PlaneGeometry(.9,1.15),'hanji',V(1.6,h.y0+.75,-1.35));dk.put(rb(1,1.25,.06,.03),'woodD',V(1.6,h.y0+.75,-1.39));g.add(dk.build())}hot(hbox(1.1,1.3,.4,1.6,h.y0+.75,-1.35,g),'door','home',()=>plAct('grow'));
  hot(hbox(1.4,.6,1,1.9,h.y0+.3,-.5,g),'desk','home',()=>openHome(myId,me.nick,true));
  hot(hbox(1.6,2,1,-4.7,1.3,2.4,g),'line','home',()=>openSchool());
  const rope=new T.CatmullRomCurve3([0,1,2,3,4,5,6].map(i=>V(px[0]+(px[1]-px[0])*i/6,2-Math.sin(i/6*Math.PI)*.14,pz)));g.add(new T.Mesh(new T.TubeGeometry(rope,12,.014,4),MV('cloth')));
  [[.2,'#fffaf2',.55],[.45,'#f9d9de',.38],[.7,'#dcebf7',.5],[.88,'#fff3c8',.3]].forEach(([t,c,hh])=>{const gg=new T.PlaneGeometry(.42,hh,3,4);gg.translate(0,-hh/2,0);const m=new T.Mesh(gg,new T.MeshStandardMaterial({color:c,side:T.DoubleSide,roughness:.95}));m.position.copy(rope.getPoint(t));g.add(m);DYN.push(t=>{m.rotation.x=Math.sin(t*1.7+hh*9)*.15})});
  PL3.home.giftAt=V(0,h.y0+.75,-1.45);smoke(g,V(-3.9,3.4,-1.2),.6)}
 { // 새벽 사랑방(초가)
  const h=house({W:4.6,D:3.2,bays:2,door:0,roof:'straw'}),g=add('sarang',{h});g.add(h.g);const k=new Kit();
  const fl=new T.Mesh(rb(4.3,.08,2.9,.04),M.ondol);fl.position.set(0,h.y0+.18,0);fl.receiveShadow=true;g.add(fl);
  for(let i=0;i<3;i++)k.put(rb(1,.16,.7,.07),'cloth',V(-1.5,h.y0+.32+i*.17,-1),null,null,['#f6dbe0','#fff4dc','#dbe8f4'][i]);
  k.put(new T.TorusGeometry(.32,.1,8,16).rotateX(Math.PI/2),'cloth',V(-.4,h.y0+.33,-1.1),null,null,'#f2d0c8');
  k.put(new T.SphereGeometry(.55,14,8,0,Math.PI*2,Math.PI/2,Math.PI/2),'wood',V(.8,h.y0+.75,-.9),null,V(1.2,.7,.8),'#e8c08a');k.put(rb(1,.12,.6,.05),'cloth',V(.8,h.y0+.5,-.9),null,null,'#fff8ee');
  k.put(rb(.7,.4,.4,.08),'woodD',V(1.6,h.y0+.4,-1.15));k.put(rb(.5,.3,.25,.06),'pot',V(1.6,h.y0+.75,-1.1),null,null,'#c9a27a');
  k.put(rb(.9,.7,.7,.25),'stone',V(-2.9,.55,.4),null,null,'#ece2d4');k.put(cyl(.25,.28,.2,12),'iron',V(-2.9,.95,.4));
  [[-1.2,-1.55],[1.2,-1.55]].forEach(([x,z])=>{const l=glow('#ffc46b',1.1);l.position.set(x,h.y0+1.3,z);g.add(l);DYN.push(()=>{l.material.opacity=nightK()*.9+.1})});g.add(k.build());
  const f=new T.Mesh(sph(.18,8),new T.MeshBasicMaterial({color:'#ff8a3a'}));f.position.set(-3.35,.55,.4);g.add(f);FIRE.push({m:f,base:.6,key:'ondol'});
  const pl=new T.PointLight(0xffb54a,0,7,2);pl.position.set(0,h.y0+1.5,0);g.add(pl);PL3.sarang.lamp=pl;{const k2=new Kit();k2.put(cyl(.15,.15,.5,12),'cloth',V(-.9,h.y0+.4,.3),null,null,'#fff');k2.put(cyl(.155,.155,.1,12),'cloth',V(-.9,h.y0+.68,.3),null,null,'#a9d2f0');k2.put(cyl(.04,.08,.16,10),'cloth',V(-.9,h.y0+.8,.3),null,null,'#ffd84a');k2.put(cyl(.22,.22,.36,14),'cloth',V(-.4,h.y0+.33,.5),null,null,'#7ec8f0');k2.put(cyl(.23,.23,.06,14),'cloth',V(-.4,h.y0+.53,.5),null,null,'#ffffff');for(let i=0;i<4;i++)k2.put(rb(.42,.12,.3,.05),'cloth',V(1.5,h.y0+.28+i*.12,.5),null,null,'#ffffff');g.add(k2.build())}
  {const k4=new Kit();[[-1.3,1],[1.4,-.6]].forEach(([x,z])=>{k4.put(cyl(.12,.16,.08,10),'woodD',V(x,h.y0+.08,z));k4.put(cyl(.03,.03,.55,6),'woodD',V(x,h.y0+.38,z));k4.put(cyl(.16,.16,.25,10),'paper',V(x,h.y0+.7,z),null,null,'#fff1c6')});k4.put(rb(.6,.12,.6,.06),'cloth',V(.6,h.y0+.13,.9),null,null,'#f6dbe0');k4.put(rb(.6,.12,.6,.06),'cloth',V(-.4,h.y0+.13,1.1),null,null,'#dbe8f4');g.add(k4.build());[[-1.3,1],[1.4,-.6]].forEach(([x,z])=>{const gl=glow('#ffb54a',.7);gl.position.set(x,h.y0+.72,z);g.add(gl)})}
  hot(hbox(1.2,1,1,.8,h.y0+.6,-.9,g),'cradle','sarang',()=>plAct('dunga'));hot(hbox(.8,.9,.6,1.6,h.y0+.6,-1.1,g),'radio','sarang',()=>soundMenu());
  hot(hbox(1.2,1,1,-2.9,.6,.4,g),'agungi2','sarang',()=>plAct('feed'));PL3.sarang.floor=fl;smoke(g,V(-2.9,1.4,-1.7),.5)}
 { // 부엌 마당
  const g=add('madang'),k=new Kit(),h=house({W:4.8,D:2.6,bays:2,openFront:true,roof:'tile'});h.g.position.set(0,0,-2.2);g.add(h.g);PL3.madang.h=h;
  k.put(rb(3.4,.75,1.1,.3),'stone',V(0,.95,-2.6),null,null,'#ece0cf');[-.8,.8].forEach(x=>{k.put(sph(.48,14),'iron',V(x,1.42,-2.6),null,V(1,.55,1));k.put(cyl(.5,.5,.08,16),'woodD',V(x,1.62,-2.6));k.put(rb(.5,.32,.12,.12),'iron',V(x,.85,-2.04),null,null,'#2b2b30')});
  for(let r=0;r<3;r++)for(let i=0;i<4-r;i++)k.put(cyl(.13,.13,1,8).rotateZ(Math.PI/2),'woodD',V(2.35,.15+r*.24,-1.2+i*.27+r*.13),null,null,i%2?'#fff':'#e8c8a8');
  k.put(cyl(.16,.12,.14,12),'cloth',V(-.3,.74,1.3),null,null,'#ffd8a8');k.put(cyl(.06,.06,.3,10),'cloth',V(.35,.83,1.5),null,null,'#ffffff');k.put(cyl(.065,.065,.06,10),'pot',V(.35,1,1.5),null,null,'#f4a6b5');k.put(rb(.5,.06,.36,.03),'cloth',V(.1,.69,1.0),null,null,'#dbe8f4');
  k.put(cyl(1,1,.1,24),'wood',V(0,.62,1.4));[[-.6,.6],[.6,.6],[-.6,2.2],[.6,2.2]].forEach(([x,z])=>k.put(cyl(.06,.06,.55,6),'woodD',V(x,.3,z)));
  k.put(cyl(.6,.45,.3,16),'cloth',V(-2.8,.15,0),null,null,'#9fd0ee');k.put(cyl(.52,.52,.04,16),'water',V(-2.8,.28,0));flowers(k,3,1.6,10,.8);g.add(k.build());
  [-.8,.8].forEach((x,i)=>{const f=new T.Mesh(new T.ConeGeometry(.16,.4,8),new T.MeshBasicMaterial({color:'#ff9a3a'}));f.position.set(x,.92,-1.9);g.add(f);FIRE.push({m:f,base:.45,key:'wood'});const gl=glow('#ff9a3a',1.2);gl.position.set(x,.95,-1.75);g.add(gl);DYN.push(tt=>{gl.material.opacity=.45+Math.min(1,wood()/3)*.5+Math.sin(tt*12+x)*.08})});
  const st=[];[-.8,.8].forEach(x=>{for(let i=0;i<3;i++){const s=new T.Sprite(new T.SpriteMaterial({map:tGlow,color:'#fff',transparent:true,depthWrite:false}));s.userData.t=i/3;s.userData.x=x;g.add(s);st.push(s)}});PL3.madang.steam=st;
  hot(hbox(3.6,1,1.3,0,1,-2.4,g),'agungi','madang',()=>addWood());hot(hbox(2.2,.8,2.2,0,.5,1.4,g),'table','madang',()=>openMeal());hot(hbox(1.8,1,1.6,-2.7,.5,-.4,g),'jars','madang',()=>bath())}
 { // 마을회관
  const h=house({W:5.6,D:3.2,bays:3,door:1,porch:false,roof:'tile'}),g=add('hall',{h});g.add(h.g);const k=new Kit();
  k.put(rb(2.6,1.3,.12,.06),'woodD',V(0,h.y0+1,-1.45));[[-.8,.2],[-.2,.35],[.4,.15],[.9,.3],[-.5,-.25],[.2,-.3],[.8,-.2]].forEach(([x,y],i)=>k.put(new T.PlaneGeometry(.42,.48),'paper',V(x,h.y0+1+y,-1.38),E(0,0,srn(-.1,.1)),null,['#fffdf6','#fff1c6','#ffe1e1','#e4f1ff'][i%4]));
  k.put(rb(1.3,.3,.7,.08),'wood',V(-1.6,h.y0+.25,-.6));k.put(rb(.32,.16,.22,.06),'pot',V(-1.6,h.y0+.5,-.6),null,null,'#5b3a2a');
  k.put(rb(.9,.6,.6,.25),'cloth',V(1.8,h.y0+.4,-.8),null,null,'#f4b8a6');k.put(rb(.4,.18,.62,.05),'cloth',V(1.8,h.y0+.72,-.8),null,null,'#f7d27a');
  k.put(rb(1.6,1.1,.12,.06),'woodD',V(-2.4,1.2,2.6));k.put(cyl(.06,.06,1.2,6),'woodD',V(-2.9,.6,2.6));k.put(cyl(.06,.06,1.2,6),'woodD',V(-1.9,.6,2.6));k.put(new T.PlaneGeometry(.5,.55),'paper',V(-2.6,1.25,2.67));k.put(new T.PlaneGeometry(.5,.55),'paper',V(-2.05,1.2,2.67),null,null,'#fff1c6');
  g.add(k.build());try{const npc=makeAv({kind:'work',ex:{},hair:'#2b2118',carrier:0});npc.root.scale.setScalar(1.1);npc.root.position.set(.3,0,2.5);{const hb=new T.Mesh(cyl(.42,.42,.04,20),new T.MeshStandardMaterial({color:'#2B2118',roughness:.7}));hb.position.y=1.98;npc.root.add(hb);const ht=new T.Mesh(cyl(.2,.22,.32,16),new T.MeshStandardMaterial({color:'#2B2118',roughness:.7}));ht.position.y=2.15;npc.root.add(ht)}npc.root.rotation.y=.3;const mg=new T.Mesh(new T.CylinderGeometry(.05,.22,.4,12,1,true),new T.MeshStandardMaterial({color:'#e0524a',roughness:.6}));mg.rotation.x=-1.2;mg.position.set(.35,1.35,.35);npc.root.add(mg);g.add(npc.root);PL3.hall.npc=npc;hot(hbox(1.2,2.4,1.2,.3,1.2,2.5,g),'ijang','hall',()=>ijang())}catch(e){}
  hot(hbox(2.8,1.5,.6,0,h.y0+1,-1.3,g),'board','hall',()=>openBoard());hot(hbox(1.8,1.4,.6,-2.4,1,2.6,g),'board2','hall',()=>openBoard());hot(hbox(1.1,1,1,1.8,h.y0+.5,-.8,g),'bundle','hall',()=>{if(me.kind==='preg')openBag();else{toast('출산 보따리는 예비맘용이야 · 이장님 게시판 볼래?');setTimeout(()=>openBoard(),900)}});hot(hbox(1.4,.8,1,-1.6,h.y0+.4,-.6,g),'phone','hall',()=>{aTab='ask';openAide()})}
 { // 구멍가게
  const g=add('store'),h=house({W:4,D:2.6,bays:2,openFront:true,roof:'tile'});g.add(h.g);PL3.store.h=h;const k=new Kit();
  for(let i=0;i<3;i++){k.put(rb(3.4,.08,.6,.03),'wood',V(0,h.y0+.5+i*.48,-1.05));for(let j=0;j<7;j++){const x=-1.4+j*.46,y=h.y0+.54+i*.48,z=-1.05,ty=(i+j)%3;if(ty===0){k.put(cyl(.15,.15,.34,12),'cloth',V(x,y+.17,z),null,null,['#7ec8f0','#ffffff','#f6dbe0'][j%3]);k.put(cyl(.155,.155,.06,12),'cloth',V(x,y+.36,z),null,null,'#ffd84a')}else if(ty===1){k.put(rb(.38,.36,.26,.06),'cloth',V(x,y+.18,z),null,null,j%2?'#a9d2f0':'#f4a6b5');k.put(rb(.39,.08,.27,.02),'cloth',V(x,y+.2,z),null,null,'#ffffff')}else{k.put(rb(.3,.34,.12,.08),'cloth',V(x,y+.17,z),E(0,0,.08),null,['#ff9a5a','#ffd84a','#8fd18a'][j%3])}}}
  [-1.6,-1.05,-.5].forEach((x,i)=>{k.put(cyl(.2,.2,.42,12),'water',V(x,h.y0+.55,.7),null,null,'#e9f6ff');for(let j=0;j<5;j++)k.put(sph(.06,6),'flower',V(x+srn(-.1,.1),h.y0+.42+srn(0,.2),.7+srn(-.1,.1)),null,null,['#f4a6b5','#f7d27a','#c9b4f0','#ffb3a1'][(i+j)%4])});
  k.put(rb(1.2,.6,.6,.08),'woodD',V(-1.1,h.y0+.3,.7));
  for(let i=0;i<8;i++){const a=i/8;k.put(rb(.52,.06,1.5,.02),'cloth',V(-1.82+a*4.16,h.y0+1.85,2.25),E(-.4,0,0),null,i%2?'#e0524a':'#fff8ee')}
  {const sc=document.createElement('canvas');sc.width=512;sc.height=128;const sg=sc.getContext('2d');sg.fillStyle='#2f6db5';sg.fillRect(0,0,512,128);sg.strokeStyle='#fff8ee';sg.lineWidth=8;sg.strokeRect(8,8,496,112);sg.fillStyle='#fff8ee';sg.font='bold 72px Jua, sans-serif';sg.textAlign='center';sg.textBaseline='middle';sg.fillText('구멍가게',256,68);const tx=new T.CanvasTexture(sc);tx.encoding=T.sRGBEncoding;const sm=new T.Mesh(new T.PlaneGeometry(2.6,.65),new T.MeshBasicMaterial({map:tx}));sm.position.set(0,h.y0+2.35,2.5);g.add(sm);setTimeout(()=>{if(document.fonts)document.fonts.ready.then(()=>{sg.fillStyle='#2f6db5';sg.fillRect(16,16,480,96);sg.fillStyle='#fff8ee';sg.fillText('구멍가게',256,68);tx.needsUpdate=true})},500)}
  k.put(rb(2,.14,.5,.06),'wood',V(1.2,.62,2.6));[0.4,2].forEach(x=>k.put(cyl(.06,.06,.4,6),'woodD',V(x,.4,2.6)));g.add(k.build());
  hot(hbox(3.6,1.6,.8,0,h.y0+.9,-1,g),'shelf','store',()=>{vTab=1;openVoice()});hot(hbox(1.6,1,.8,-1.1,h.y0+.5,.7,g),'candy','store',()=>{if(giftReady())openGift();else toast('오늘 선물은 이미 받았어 · 내일 또 와')});hot(hbox(2.2,.6,.8,1.2,.5,2.6,g),'bench','store',()=>{vTab=0;openVoice()})}
 { // 정자나무 평상
  const g=add('pyeong'),k=new Kit();tree(k,-2.6,-1.4,2.6,'#5f9e58');k.put(cyl(.7,1.15,2.2,12),'woodD',V(-2.6,1.1,-1.4),null,null,'#8a6a52');[0,2.1,4.2].forEach(a=>k.put(cyl(.1,.25,1.3,6).rotateZ(1.2),'woodD',V(-2.6+Math.cos(a)*.7,.15,-1.4+Math.sin(a)*.7),E(0,-a,0),null,'#a88060'));k.put(sph(.22,10),'pot',V(-.6,1.2,1.4),null,V(1,.8,1),'#e8e0d4');k.put(cyl(.04,.04,.18,6).rotateZ(1),'pot',V(-.38,1.25,1.4),null,null,'#e8e0d4');k.put(rb(4.6,.22,3.2,.08),'wood',V(.3,.95,1.9));for(let i=0;i<9;i++)k.put(rb(.06,.04,3.1,.02),'woodD',V(-1.7+i*.5,1.07,1.9));
  [[-1.8,.5],[2.4,.5],[-1.8,3.3],[2.4,3.3]].forEach(([x,z])=>k.put(rb(.2,.9,.2,.06),'woodD',V(x,.45,z)));
  k.put(cyl(.8,.9,.7,18),'stone',V(4.3,.35,-1),null,null,'#ece6dc');stones(k,4.3,-1,12,.85,.4);k.put(cyl(.65,.65,.05,16),'water',V(4.3,.62,-1));[3.6,5].forEach(x=>k.put(cyl(.06,.06,1.6,6),'woodD',V(x,1.15,-1)));k.put(cyl(.05,.05,1.5,6).rotateZ(Math.PI/2),'woodD',V(4.3,1.95,-1));
  k.put(new T.SphereGeometry(.6,14,8,0,Math.PI*2,Math.PI/2,Math.PI/2),'wood',V(1.6,1.45,1.2),null,V(1,.55,1),'#e8c08a');for(let i=0;i<7;i++)k.put(sph(.17,8),'pot',V(1.6+srn(-.3,.3),1.42,1.2+srn(-.3,.3)),E(0,sr()*3,0),V(1.5,.8,.8),'#9a4a6a');
  flowers(k,-4,2.5,12,1);g.add(k.build());
  const bk=new T.Mesh(cyl(.18,.14,.26,10),MV('wood'));bk.position.set(4.3,1.6,-1);g.add(bk);PL3.pyeong.bucket=bk;
  hot(hbox(4.8,.6,3.4,.3,1,1.9,g),'pyeong','pyeong',()=>sit());hot(hbox(2,2.2,2,4.3,1,-1,g),'well','pyeong',()=>bath());PL3.pyeong.shoes=[];for(let i=0;i<8;i++){const s=new T.Group();[-.1,.1].forEach(o=>{const m=new T.Mesh(sph(.2,10),i%2?MV('cloth'):MV('paper'));m.scale.set(.8,.5,1.8);m.position.set(o*1.6,.1,0);s.add(m)});s.position.set(-1.8+i*.7,0,4.25);s.rotation.y=srn(-.3,.3);g.add(s);PL3.pyeong.shoes.push(s)}
  hot(hbox(1.4,.8,1.4,1.6,1.4,1.2,g),'goguma','pyeong',()=>allSd())}
 { // 장독대 언덕
  const g=add('jangdok'),k=new Kit();k.put(rb(4.4,.4,2.4,.18),'stone',V(.6,.2,-.6),null,null,'#ece4d8');[[-.9,-1,1.1],[.1,-1.1,1.25],[1.2,-1,1],[2.1,-.9,.8],[-.5,-.1,.8],[.6,-.1,.9],[1.6,-.1,.7],[2.5,-.2,.6],[-1.3,-.2,.6],[3,-1,.9]].forEach(([x,z,s])=>jar(k,x,z,s,.4));
  k.put(rb(1.6,.12,.5,.06),'wood',V(-2.6,.62,1));[-3.2,-2].forEach(x=>k.put(cyl(.06,.06,.55,6),'woodD',V(x,.3,1)));flowers(k,2.8,1.4,10,.8);g.add(k.build());
  hot(hbox(4.4,1.4,2.4,.6,.9,-.6,g),'jangdok','jangdok',()=>openJar());hot(hbox(1.8,.8,.8,-2.6,.6,1,g),'bench','jangdok',()=>sit())}
 { // 우체통 + 확성기 전봇대
  const g=add('post'),k=new Kit();k.put(cyl(.32,.32,1,16),'red',V(0,.7,0));k.put(sph(.32,16),'red',V(0,1.2,0),null,V(1,.6,1));k.put(rb(.4,.06,.1,.02),'iron',V(0,1.05,.3),null,null,'#3a2a22');k.put(cyl(.1,.12,.2,8),'stone',V(0,.1,0));
  k.put(cyl(.09,.11,4.2,8),'woodD',V(1.4,2.1,-.3));k.put(rb(.8,.08,.08,.03),'woodD',V(1.4,3.8,-.3));k.put(cyl(.06,.28,.45,12).rotateX(-Math.PI/2.4),'iron',V(1.4,3.6,.0),null,null,'#c9ced6');k.put(cyl(.06,.28,.45,12).rotateZ(Math.PI/2.4),'iron',V(1.75,3.55,-.3),null,null,'#c9ced6');g.add(k.build());
  hot(hbox(.9,1.6,.9,0,.8,0,g),'post','map',()=>{if(mode==='map')go('post');else plAct('mail')});hot(hbox(1,4.4,1,1.4,2.2,-.3,g),'speaker','map',()=>{vTab=0;openVoice()})}
 /* 장소 큰 터치 영역(지도용) */
 for(const k in P){if(k==='post')continue;const t=hbox(k==='pyeong'?9:7.5,4,7.5,0,1.5,0,PL3[k].g);t.userData.hot={key:'go',place:'map',fn:()=>go(k)};HOT.push(t)}
 /* 하늘 별(장독대 위)·반딧불 */
 for(let i=0;i<60;i++){const s=glow('#fff3c4',srn(.25,.5));s.position.set(srn(-16,16),srn(7,12),srn(-26,-6));s.userData.p=sr()*6;world.add(s);STAR.push(s)}
 {const mo=glow('#fff4dc',4);mo.position.set(4,9,-19);world.add(mo);STAR.push(mo);const mc=new T.Mesh(sph(.9,16),new T.MeshBasicMaterial({color:'#fff4dc'}));mc.position.set(4,9,-19.2);world.add(mc);FLY.push(Object.assign(mc,{userData:{moon:1}}))}
 [['pyeong',V(4.3,1.6,-1)],['jangdok',V(.6,1.6,-.6)],['post',V(.4,2.2,.4)]].forEach(([k,o])=>{const p=PL3[k];if(!p)return;const gl=glow('#ffd15c',3);gl.position.copy(o);p.g.add(gl);DYN.push(tt=>{gl.visible=nightK()>.3;gl.material.opacity=.85*nightK()*(.85+Math.sin(tt*3+o.x)*.15)})});
 ['home','sarang','hall','store','madang'].forEach(k=>{const p=PL3[k];if(!p)return;const gl=glow('#ffb54a',4.6);gl.position.set(0,1.3,(p.h?p.h.D/2:1.5)+.4);p.g.add(gl);DYN.push(()=>{gl.visible=nightK()>.3&&mode!=='place';gl.material.opacity=.95*nightK()})});
 for(let i=0;i<24;i++){const s=glow('#d9ff7a',.35);s.userData.c=V(srn(-13,13),srn(.6,2),srn(-17,17));s.userData.p=sr()*9;world.add(s);FLY.push(s)}}
function smoke(g,at,k){for(let i=0;i<5;i++){const s=new T.Sprite(new T.SpriteMaterial({map:tGlow,color:'#ffffff',transparent:true,depthWrite:false}));s.userData={t:i/5,at,k};g.add(s);SMOKE.push(s)}}
/* ---------- 빛·시간대 ---------- */
let hemi,sun,rim,lastPh='';const PHC={dawn:{bg:'#2f3266',h:[0xb4b8f0,0x5a4a5a,.82],s:[0x9fb0ff,.3],r:.12},morn:{bg:'#f6e3cf',h:[0xfff2e0,0x7fa860,.5],s:[0xffd8a8,1.1],r:.3},day:{bg:'#cfe6ee',h:[0xfff0d8,0x7fa860,.55],s:[0xffe6c0,1.0],r:.3},dusk:{bg:'#f0c2a8',h:[0xffd6b8,0xb08878,.8],s:[0xffa070,.9],r:.5}};
const nightK=()=>(window.__phase||phaseNow())=='dawn'?1:(window.__phase||phaseNow())=='dusk'?.4:0;
function sky(){const k=window.__phase||phaseNow(),p=(PHC[k]||PHC.day);S3.background=new T.Color(p.bg);hemi.color.setHex(p.h[0]);hemi.groundColor.setHex(p.h[1]);hemi.intensity=p.h[2];sun.color.setHex(p.s[0]);sun.intensity=p.s[1];rim.intensity=p.r;
 const n=nightK();document.body.classList.toggle('dawnmode',n>.5);M.hanji.emissiveIntensity=n*1.1;STAR.forEach((s,i)=>s.visible=n>.9&&i<Math.min(60,40+(typeof DAWN_PATS!='undefined'?DAWN_PATS:0)));FLY.forEach(s=>s.visible=n>.3);R3.shadowMap.needsUpdate=true}
/* ---------- 엄마들 ---------- */
const hash=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)};
function spotFor(id,pl){const L=SPOTS[pl]||SPOTS.vil,b=P[pl]||V(0,0,0),h=hash(id),s=L[h%L.length].clone();s.x+=((h>>4)%7-3)*.18;s.z+=((h>>8)%5-2)*.18;const w=b.clone().add(s);if(pl==='vil'||!P[pl]){const q=PATH[1+(h>>3)%5].clone();q.x+=((h>>5)%5-2)*.5;return q}return w}
function plOf3(st){const p=st&&st.ex&&st.ex.pl;return p==='room'?'home':(p&&P[p])?p:'vil'}
function ensureAv(id,st,isMe){let o=avs[id];const sig=(st.kind||'')+'|'+avSig(st);if(o&&o.sig!==sig){kill(o);o=null}
 if(!o){let a;try{a=makeAv(st)}catch(e){return null}a.root.scale.setScalar(1.5);a.root.traverse(m=>{if(m.isMesh)m.castShadow=false});const bl=new T.Mesh(new T.CircleGeometry(.4,16),new T.MeshBasicMaterial({color:0x2b2118,transparent:true,opacity:.2,depthWrite:false}));bl.rotation.x=-Math.PI/2;bl.position.y=.03;a.root.add(bl);
  const sp=spotFor(id,plOf3(st));a.root.position.copy(sp);world.add(a.root);o=avs[id]={a,sig,id,me:isMe,pos:sp.clone(),route:[],pl:plOf3(st)};if(isMe)try{xray(a.root)}catch(e){}a.root.traverse(m=>{if(m.isMesh)m.userData.av=id})}
 o.st=st;o.seen=1;return o}
function kill(o){world.remove(o.a.root);o.a.root.traverse(m=>{if(m.isMesh&&m.geometry)m.geometry.dispose()})}
function routeTo(o,pl,target){const from=o.pos.clone(),to=target||spotFor(o.id,pl);o.route=[];if(from.distanceTo(to)>3.5){const near=v=>{let bi=0,bd=1e9;PATH.forEach((p,i)=>{const d=p.distanceTo(v);if(d<bd){bd=d;bi=i}});return bi};let a=near(from),b=near(to);const st=a<b?1:-1;for(let i=a;i!==b;i+=st)o.route.push(PATH[i].clone());o.route.push(PATH[b].clone())}o.route.push(to);o.pl=pl}
function sync(){if(!world)return;Object.values(avs).forEach(o=>o.seen=0);
 others().filter(p=>p.state&&p.state.room===me.room&&p.state.kind).slice(0,24).forEach(p=>{const id=p.state.id||p.id,o=ensureAv(id,p.state,false);if(o){const pl=plOf3(p.state);if(pl!==o.pl)routeTo(o,pl)}});
 const mo=ensureAv(myId,meState(),true);if(mo){const pl=on&&mode!=='map'&&cur?cur:'vil';if(pl!==mo.pl&&!mo.route.length)routeTo(mo,pl)}
 Object.values(avs).forEach(o=>{if(!o.seen){kill(o);delete avs[o.id]}});labels()}


/* ---------- 오늘의 동네 일 (3개, 놓쳐도 벌 없음) ---------- */
const CHORE=[['wood','🔥','아궁이에 장작 하나','madang'],['sd','♥','엄마 한 명 쓰담','pyeong'],['jar','🏺','장독 뚜껑 열어보기','jangdok']];
function chores(){const c=LS.get('cp_chore',{d:'',k:[]});return c.d===ymd(new Date())?c.k:[]}
function chore(k){const ks=chores();if(ks.includes(k))return;ks.push(k);LS.set('cp_chore',{d:ymd(new Date()),k:ks});if(ks.length===CHORE.length){const n=(LS.get('cp_ijang',0)||0)+1;LS.set('cp_ijang',n);setTimeout(()=>{toast('📢 오늘 동네 일 다 했네! 이장님 도장 '+n+'개째');try{burst((avs[myId]?avs[myId].pos:V(0,0,0)).clone().add(V(0,2.6,0)),'이장님 도장 쾅 🟥')}catch(e){}},500)}choreChip()}
function choreChip(){try{flag()}catch(e){}let c=$('v3chore');if(!c){c=document.createElement('button');c.id='v3chore';c.onclick=e=>{e.stopPropagation();choreSheet()};$('v3').appendChild(c)}const n=chores().length;c.innerHTML='🌾 오늘 동네 일 <b>'+n+'/3</b>'+(n>=3?' · 다 했다!':'');c.classList.toggle('done',n>=3);c.style.display=mode==='map'?'':'none'}
function choreSheet(){const ks=chores();openSheet('오늘 동네 일');sb.innerHTML='<div class="box"><div class="t">하루 3개 · 안 해도 괜찮아</div><p class="note">다 하면 이장님 도장 하나. 못 한 날도 사라지는 건 없어 · 지금까지 도장 '+(LS.get('cp_ijang',0)||0)+'개</p>'+CHORE.map(([k,e,n,pl])=>'<button data-ch="'+pl+'" style="display:flex;align-items:center;gap:10px;width:100%;margin-top:8px;padding:12px;border:2.5px solid #2B2118;border-radius:16px;background:'+(ks.includes(k)?'#e8f3dc':'#fff')+';font:16px Jua,sans-serif;color:#2B2118;text-align:left"><span style="font-size:24px">'+e+'</span><span style="flex:1">'+n+'</span><span>'+(ks.includes(k)?'✅':'가기 ›')+'</span></button>').join('')+'</div>';sb.querySelectorAll('[data-ch]').forEach(b=>b.onclick=()=>{closeSheet();go(b.dataset.ch)})}

/* ---------- 우리 집 선반에 받은 선물 놓기 ---------- */
const GS=[];function shelfGifts(){const p=PL3.home;if(!p||!p.h)return;const gs=(typeof myGifts==='function'?myGifts():[]).slice(-12);while(GS.length>gs.length){p.g.remove(GS.pop())}
 gs.forEach((x,i)=>{if(GS[i]&&GS[i].userData.k===x.k)return;if(GS[i])p.g.remove(GS[i]);const g=GIFTS[x.k];if(!g)return;const c=document.createElement('canvas');c.width=c.height=96;const cg=c.getContext('2d');cg.font='72px sans-serif';cg.textAlign='center';cg.textBaseline='middle';cg.fillText(g[0],48,54);const tx=new T.CanvasTexture(c);const s=new T.Sprite(new T.SpriteMaterial({map:tx,transparent:true}));s.scale.setScalar(.62);const row=Math.floor(i/6),col=i%6;s.position.set(-1.15+col*.46,p.h.y0+.95+row*.5,-1.2);s.userData.k=x.k;p.g.add(s);GS[i]=s})}
let FLAG=null;function flag(){if(!FLAG){const g=new T.Group();const pole=new T.Mesh(cyl(.05,.05,3.2,8),MV('woodD'));pole.position.y=1.6;g.add(pole);const cl=new T.Mesh(new T.PlaneGeometry(1,.62),new T.MeshStandardMaterial({color:'#e0524a',side:T.DoubleSide,roughness:.8}));cl.position.set(.52,2.85,0);g.add(cl);const c=document.createElement('canvas');c.width=128;c.height=80;const cg=c.getContext('2d');cg.fillStyle='#fff8ee';cg.font='bold 40px Jua, sans-serif';cg.textAlign='center';cg.fillText('도장',64,54);const lb=new T.Mesh(new T.PlaneGeometry(.7,.44),new T.MeshBasicMaterial({map:new T.CanvasTexture(c),transparent:true,side:T.DoubleSide}));lb.position.set(.52,2.85,.01);g.add(lb);g.position.copy(P.hall).add(V(-3.6,0,2.2));world.add(g);FLAG=g;DYN.push(tt=>{cl.rotation.y=Math.sin(tt*2)*.15;lb.rotation.y=cl.rotation.y})}FLAG.visible=chores().length>=3}


/* ---------- 방 안 자유 이동: 벽·가구 통과 금지 + 가까이 가면 '하기' 버튼 ---------- */
const HL={agungi:'🔥 장작 넣기',agungi2:'🔥 아궁이 지피기',bench:'🪑 앉기',board:'📋 게시판 보기',board2:'📋 게시판 보기',bundle:'🧳 보따리 열기',candy:'🍬 사탕 단지',cradle:'💤 요람 재우기',desk:'✏️ 책상 보기',door:'🚪 장지문 열기',goguma:'🍠 고구마 나눠 먹기',ijang:'📢 이장님께 말 걸기',jangdok:'🏺 장독 뚜껑 열기',jars:'💧 물동이 목욕',line:'👕 빨랫줄 보기',phone:'☎️ 이장님께 전화(노무 상담)',pyeong:'🪑 평상에 앉기',radio:'📻 라디오 켜기',shelf:'🎁 선반 보기',table:'🍚 밥상 차리기',well:'🪣 우물 목욕',home:'🏠 들어가기',hall:'🏛 들어가기'};
let NEARH=null;const BX=new T.Box3(),BV=V();
function hotBox(m){m.updateMatrixWorld();BX.setFromObject(m);return BX}
function placeBounds(){const g=PL3[cur].g.position,h=PL3[cur].h;return h?{h:1,x0:g.x-h.W/2+.4,x1:g.x+h.W/2-.4,z0:g.z-h.D/2+.4,z1:g.z+h.D/2-.4,y:g.y+h.y0,g}:{h:0,R:5.2,y:g.y,g}}
function constrain(p){if(mode!=='place'||!cur||!PL3[cur])return;const B=placeBounds();if(B.h){p.x=Math.max(B.x0,Math.min(B.x1,p.x));p.z=Math.max(B.z0,Math.min(B.z1,p.z));p.y=B.y}else{BV.set(p.x-B.g.x,0,p.z-B.g.z);const L=BV.length();if(L>B.R){BV.multiplyScalar(B.R/L);p.x=B.g.x+BV.x;p.z=B.g.z+BV.z}p.y=B.y}}
/* 방 안 길찾기: 0.25m 격자 BFS로 가구를 돌아서 간다 */
function navRoute(from,to){if(!cur||!PL3[cur])return [to];const B=placeBounds(),c=.25;let x0,x1,z0,z1;if(B.h){x0=B.x0;x1=B.x1;z0=B.z0;z1=B.z1}else{x0=B.g.x-B.R;x1=B.g.x+B.R;z0=B.g.z-B.R;z1=B.g.z+B.R}
 const nx=Math.max(2,Math.ceil((x1-x0)/c)+1),nz=Math.max(2,Math.ceil((z1-z0)/c)+1);const boxes=[];HOT.forEach(m=>{const hh=m.userData.hot;if(hh.place!==cur||hh.key==='go')return;const b=hotBox(m);boxes.push([b.min.x-.25,b.max.x+.25,b.min.z-.25,b.max.z+.25])});
 const bl=new Uint8Array(nx*nz);for(let i=0;i<nx;i++)for(let j=0;j<nz;j++){const x=x0+i*c,z=z0+j*c;let b=0;if(!B.h&&Math.hypot(x-B.g.x,z-B.g.z)>B.R)b=1;for(const q of boxes)if(x>q[0]&&x<q[1]&&z>q[2]&&z<q[3]){b=1;break}bl[i*nz+j]=b}
 const cellOf=v=>[Math.max(0,Math.min(nx-1,Math.round((v.x-x0)/c))),Math.max(0,Math.min(nz-1,Math.round((v.z-z0)/c)))];
 const free=([i,j])=>{if(!bl[i*nz+j])return[i,j];let best=null,bd=1e9;for(let a=0;a<nx;a++)for(let b2=0;b2<nz;b2++)if(!bl[a*nz+b2]){const d=(a-i)*(a-i)+(b2-j)*(b2-j);if(d<bd){bd=d;best=[a,b2]}}return best||[i,j]};
 const s=free(cellOf(from)),gl=free(cellOf(to));const prev=new Int32Array(nx*nz).fill(-1);const q=[s[0]*nz+s[1]];prev[q[0]]=q[0];let found=false;
 for(let k=0;k<q.length;k++){const cu=q[k];if(cu===gl[0]*nz+gl[1]){found=true;break}const i=Math.floor(cu/nz),j=cu%nz;for(const [di,dj] of [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]]){const a=i+di,b2=j+dj;if(a<0||b2<0||a>=nx||b2>=nz)continue;const id=a*nz+b2;if(bl[id]||prev[id]>=0)continue;if(di&&dj&&(bl[(i+di)*nz+j]||bl[i*nz+j+dj]))continue;prev[id]=cu;q.push(id)}}
 const P2=v=>V(x0+Math.floor(v/nz)*c,B.y,z0+(v%nz)*c);if(!found)return [P2(gl[0]*nz+gl[1])];
 const cells=[];for(let cu=gl[0]*nz+gl[1];;cu=prev[cu]){cells.push(cu);if(cu===prev[cu])break}cells.reverse();
 const los=(a,b2)=>{const A=P2(a),Bp=P2(b2),n=Math.ceil(A.distanceTo(Bp)/(c*.5));for(let k=1;k<n;k++){const v=A.clone().lerp(Bp,k/n);const [i,j]=cellOf(v);if(bl[i*nz+j])return false}return true};
 const out=[];let a=0;while(a<cells.length-1){let b2=cells.length-1;while(b2>a+1&&!los(cells[a],cells[b2]))b2--;out.push(P2(cells[b2]));a=b2}
 if(!bl[cellOf(to)[0]*nz+cellOf(to)[1]]&&out.length){const tt=to.clone();tt.y=B.y;out[out.length-1]=tt}return out.length?out:[P2(gl[0]*nz+gl[1])]}
function walkToHot(m){const mo=avs[myId];if(!mo)return;const b=hotBox(m),c=b.getCenter(V());const d=mo.pos.clone().sub(c).setY(0);if(d.lengthSq()<.01)d.set(0,0,1);d.normalize();const half=Math.max(b.max.x-b.min.x,b.max.z-b.min.z)/2;const q=c.clone().add(d.multiplyScalar(half+.45));constrain(q);mo.route=navRoute(mo.pos,q);mo.sitAfter=false;mo.a.sit=0;NEARH=m;actBtn()}
function actBtn(){let b=$('v3a');const mo=avs[myId];let near=null,nd=1e9;
 if(mode==='place'&&mo&&!B3&&!STR){HOT.forEach(m=>{const hh=m.userData.hot;if(hh.place!==cur||hh.key==='go')return;const bx=hotBox(m);const c=bx.getCenter(V());const half=Math.max(bx.max.x-bx.min.x,bx.max.z-bx.min.z)/2;const d=Math.hypot(mo.pos.x-c.x,mo.pos.z-c.z)-half;if(d<1.1&&d<nd){nd=d;near=m}})}
 if(NEARH&&mo&&mo.route.length)near=null;
 if(!near){if(b)b.style.display='none';return}
 if(!b){b=document.createElement('button');b.id='v3a';$('v3').appendChild(b);b.onclick=e=>{e.stopPropagation();const m=b._m;if(!m)return;const hh=m.userData.hot;const mo2=avs[myId];if(mo2){const c=hotBox(m).getCenter(V());const f=c.sub(mo2.pos);mo2.a.root.rotation.y=Math.atan2(f.x,f.z)}hh.fn()}}
 b._m=near;const k=near.userData.hot.key;b.textContent=(HL[k]||'👆 해보기');b.style.display=''}
/* ---------- 아기띠·유모차 동네 산책 (걸어야 아기가 잠든다) ---------- */
const XM=new T.MeshBasicMaterial({color:0x6b4a32,transparent:true,opacity:.5,depthWrite:false,depthFunc:T.GreaterDepth});function xray(r){const ms=[];r.traverse(o=>{if(o.isMesh&&!o.userData.xr)ms.push(o)});ms.forEach(o=>{const g=new T.Mesh(o.geometry,XM);g.userData.xr=1;g.renderOrder=5;g.raycast=()=>{};o.add(g)})}
const SDIR=V(0,.74,.67).normalize();let STR=null;function stroll(){const mo=avs[myId];if(!mo){toast('잠깐만 · 다시 눌러줘');return}if(STR)return;try{v3cardOff()}catch(_){}
 if(mode!=='map')back();STR={i:0,mz:zoom};const L0=PATH.filter(v=>v.y<.1);STR.loop=L0.concat(L0.slice(1,-1).reverse());let bi=0,bd=1e9;STR.loop.forEach((v,i)=>{const d=v.distanceTo(mo.pos);if(d<bd){bd=d;bi=i}});STR.i=bi;zoom=.36;
 const ui=document.createElement('div');ui.id='b4';ui.innerHTML='<div class="b3t">'+(me.carrier==2?'👶 유모차 밀고 동네 한 바퀴':'🤱 아기띠 메고 동네 한 바퀴')+'</div><div class="b4bar"><i></i></div><div class="b3s"></div><div class="b4r"><button class="b4s">🎵 자장가</button><button class="b4w">🌊 백색소음</button><button class="b4x">산책 끝</button></div>';$('v3').appendChild(ui);document.body.classList.add('v3stroll');
 ui.querySelector('.b4x').onclick=()=>stopStroll(true);ui.querySelector('.b4s').onclick=()=>{try{plAct('lul')}catch(e){}};ui.querySelector('.b4w').onclick=()=>{try{plAct('wn')}catch(e){}};STR.ui=ui;M.leaf.transparent=true;M.leaf.opacity=.45;M.leaf.depthWrite=false;M.leaf.needsUpdate=true;strollTick();camT.copy(camTT);camO.copy(camOO);strollUI()}
function strollUI(){if(!STR)return;const s=Math.round(Math.min(100,me.steps||0));STR.ui.querySelector('.b4bar i').style.width=s+'%';STR.ui.querySelector('.b3s').textContent=s>=100?'꿀잠 성공 zZ · 살살 내려놔도 돼':'꿀잠 '+s+'% · 엄마가 걷는 만큼 아기가 스르륵';if(s>=100&&!STR.done){STR.done=1;const mo=avs[myId];if(mo){mo.route=[];burst(mo.pos.clone().add(V(0,2.6,0)),'꿀잠 성공 zZ')}try{chore&&0}catch(e){}}}
function stopStroll(user){if(!STR)return;Object.values(PL3).forEach(p=>{if(p.h)p.fade=1});STR.ui.remove();M.leaf.transparent=false;M.leaf.opacity=1;M.leaf.depthWrite=true;M.leaf.needsUpdate=true;document.body.classList.remove('v3stroll');zoom=1;const mo=avs[myId];if(mo)mo.route=[];STR=null;if(user){me.carrier=0;me.st='';me.steps=0;try{pushP();ensure(myId,meState(),true)}catch(e){}}setView('map')}
function strollTick(){if(!STR)return;const mo=avs[myId];if(!mo)return;if(!STR.done&&!mo.route.length){STR.i=(STR.i+1)%STR.loop.length;mo.route=[STR.loop[STR.i].clone()]}camTT.copy(mo.pos);camTT.y=0;camOO.copy(SDIR).multiplyScalar(dist(31));Object.values(PL3).forEach(p=>{if(p.h&&p.g)p.fade=Math.hypot(p.g.position.x-mo.pos.x,p.g.position.z-mo.pos.z)<5.5?0:1});if(!strollTick.t||performance.now()-strollTick.t>300){strollTick.t=performance.now();strollUI()}}
/* ---------- 우물 목욕 (러베 탑투토 워시) ---------- */
let B3=null;function anim(d,f,done){const t0=performance.now();const s=()=>{const k=Math.min(1,(performance.now()-t0)/d);f(k);if(k<1)requestAnimationFrame(s);else if(done)done()};requestAnimationFrame(s)}
let RUUVE=null;function ruuveTex(){if(!RUUVE){RUUVE=new T.TextureLoader().load('img/ruuve_ttw.png');RUUVE.encoding=T.sRGBEncoding}return RUUVE}
function bath(){if(B3)return;try{v3cardOff()}catch(_){}
 if(me.kind==='preg'){toast('아기 태어나면 우물물로 같이 씻기자 🛁');return}
 if(!(mode==='place'&&cur==='pyeong')){go('pyeong');setTimeout(bath,window.__snap?600:2300);return}
 const g=PL3.pyeong.g,grp=new T.Group(),BASIN=V(3.2,0,1.0);grp.position.copy(BASIN);g.add(grp);const K2=new Kit();
 K2.put(cyl(.8,.62,.42,28),'cloth',V(0,.21,0),null,null,'#8fc6ea');K2.put(new T.TorusGeometry(.78,.06,8,28).rotateX(Math.PI/2),'cloth',V(0,.42,0),null,null,'#6fb0de');K2.put(rb(.6,.06,.4,.03),'cloth',V(-1.15,.03,.2),null,null,'#f6dbe0');grp.add(K2.build());
 const wm=new T.MeshStandardMaterial({color:'#9fd8f5',transparent:true,opacity:.85,roughness:.15});const wat=new T.Mesh(new T.CircleGeometry(.72,28).rotateX(-Math.PI/2),wm);wat.position.y=.06;wat.visible=false;grp.add(wat);
 // 내가 안고 있는 우리 아기 → 대야로 (새 아기를 만들지 않고 엄마 품의 아기를 옮긴다)
 const mo=avs[myId],ma=mo&&mo.a,carry=ma&&(ma.cb||ma.kid);
 const baby=new T.Group();const sk='#ffe1cf',hairC='#7a5030',bm=c=>new T.MeshStandardMaterial({color:c,roughness:.8});
 const bd=new T.Mesh(sph(.26,16),bm(sk));bd.scale.set(1,.9,.85);bd.position.y=.3;baby.add(bd);const hd=new T.Mesh(sph(.24,16),bm(sk));hd.position.set(0,.66,0);baby.add(hd);const hr=new T.Mesh(sph(.245,16),bm(hairC));hr.scale.set(1,.62,1);hr.position.set(0,.76,-.03);baby.add(hr);
 [-1,1].forEach(s=>{const e=new T.Mesh(sph(.025,8),bm('#2B2118'));e.position.set(s*.08,.68,.21);baby.add(e);const c=new T.Mesh(sph(.04,8),bm('#f4a6b5'));c.position.set(s*.14,.61,.19);c.scale.z=.4;baby.add(c);const a=new T.Mesh(sph(.08,10),bm(sk));a.position.set(s*.27,.38,.08);baby.add(a)});
 baby.visible=false;baby.scale.setScalar(1.2);grp.add(baby);
 // 러베 탑투토 워시: 실제 제품 사진 그대로
 const bot=new T.Sprite(new T.SpriteMaterial({map:ruuveTex(),transparent:true}));bot.scale.set(.5,1.07,1);bot.position.set(.95,.54,.4);bot.visible=false;grp.add(bot);
 const foam=[],tow=new T.Mesh(sph(.42,16),bm('#f6c7d2'));tow.scale.set(1,.95,.9);tow.position.y=.42;tow.visible=false;grp.add(tow);
 B3={grp,end:d=>end(d)};camTT.copy(g.position).add(V(3.5,.6,.3));camOO.copy(V(-.12,.66,.74).normalize()).multiplyScalar(dist(5.2));yaw=0;zoom=1;
 const ui=document.createElement('div');ui.id='b3';ui.innerHTML='<div class="b3t"></div><div class="b3s"></div><button class="b3b"></button><button class="b3x">그만하기</button>';$('v3').appendChild(ui);document.body.classList.add('v3bath');
 const T1=ui.querySelector('.b3t'),S1=ui.querySelector('.b3s'),BT1=ui.querySelector('.b3b');ui.querySelector('.b3x').onclick=()=>end(false);const bk=PL3.pyeong.bucket;
 function walkTo(loc,face,cb){if(!mo){cb();return}const w=g.position.clone().add(loc);mo.route=[w];const t0=performance.now();const chk=()=>{if(!mo.route.length||performance.now()-t0>3500){mo.route=[];if(face){const f=g.position.clone().add(face).sub(mo.pos);ma.root.rotation.y=Math.atan2(f.x,f.z)}cb()}else setTimeout(chk,80)};chk()}
 function addFoam(c){for(let j=0;j<c;j++){const f=new T.Mesh(sph(srn(.06,.12),10),bm('#ffffff'));const a=sr()*7,r=srn(.05,.25);f.position.set(Math.cos(a)*r,.5+sr()*.45,Math.sin(a)*r*.7+.08);grp.add(f);foam.push(f);const s=glow('#e8f6ff',.35);s.position.copy(g.position).add(BASIN).add(f.position);world.add(s);anim(1400,k=>{s.position.y+=.012;s.material.opacity=1-k},()=>world.remove(s))}}
 function splash(c){for(let j=0;j<c;j++){const s=glow('#9fd8f5',.3);s.position.copy(g.position).add(BASIN).add(V(srn(-.4,.4),.5,srn(-.4,.4)));world.add(s);const vx=srn(-.02,.02),vz=srn(-.02,.02);anim(700,k=>{s.position.x+=vx;s.position.z+=vz;s.position.y+=.03-k*.06;s.material.opacity=1-k},()=>world.remove(s))}}
 const WELL=V(4.3,0,-1),WELLFRONT=V(4.3,0,-.1),BASINSIDE=V(3.3,0,.05);
 const G=[
  ['엄마가 우물물 긷기','두레박 내려서 물 길어 대야에 두 번 붓기','🪣 물 길러 가기',seq=>{
    S1.textContent='우물로 가는 중…';walkTo(WELLFRONT,WELL,()=>{S1.textContent='영차 영차 두레박 당기는 중';anim(1300,k=>{bk.position.y=1.6-Math.sin(k*Math.PI)*1.0;if(ma)ma.wave=Math.sin(k*Math.PI*4)},()=>{S1.textContent='대야로 가서 붓는 중';walkTo(BASINSIDE,BASIN,()=>{wat.visible=true;splash(6);anim(800,k=>{wat.position.y=.06+k*.07},()=>{splash(6);anim(700,k=>{wat.position.y=.13+k*.06},seq)})})})})}],
  ['우리 아기 뽀득뽀득','품에 안은 아기 대야에 쏙 → 러베 탑투토 워시로 머리부터 발끝까지','🫧 아기 씻기기',seq=>{
    if(carry)carry.visible=false;baby.visible=true;const from=mo?mo.pos.clone().sub(g.position).sub(BASIN).add(V(0,1,0)):V(0,1,0);anim(800,k=>{baby.position.lerpVectors(from,V(0,.02,0),k);baby.position.y+=Math.sin(k*Math.PI)*.4},()=>{
     bot.visible=true;S1.textContent='러베 워시 꾹꾹';anim(500,k=>{bot.position.y=.54-Math.sin(k*Math.PI)*.08},()=>{addFoam(4);S1.textContent='문질문질 거품 놀이';let n=0;const rub=()=>{addFoam(2);anim(300,k=>{baby.rotation.y=Math.sin(k*Math.PI*2)*.18},()=>{if(++n<4)rub();else{S1.textContent='물 끼얹어 헹구기';splash(10);anim(700,k=>foam.forEach(f=>{f.scale.setScalar(Math.max(.01,1-k))}),()=>{foam.forEach(f=>grp.remove(f));foam.length=0;seq()})}})};rub()})})}],
  ['수건으로 폭 감싸서 안기','보송보송 · 로션은 3분 안에','🧺 수건으로 감싸 안기',seq=>{tow.visible=true;tow.scale.setScalar(.01);anim(600,k=>{tow.scale.set(k,.95*k,.9*k);baby.position.y=.02+k*.05},()=>{const to=mo?mo.pos.clone().sub(g.position).sub(BASIN).add(V(0,1,0)):V(0,1,0);anim(700,k=>{const p=V(0,.07,0).lerp(to,k);baby.position.copy(p);tow.position.copy(p).add(V(0,.4,0));baby.scale.setScalar(1.2*(1-k*.6));tow.scale.setScalar(1-k*.6)},()=>{baby.visible=false;tow.visible=false;if(carry)carry.visible=true;seq()})})}]];
 let i=0,busy=0;function show(){if(i>=G.length)return end(true);const s=G[i];T1.textContent=(i+1)+'/3 · '+s[0];S1.textContent=s[1];BT1.textContent=s[2];BT1.disabled=false;BT1.style.opacity=1}
 BT1.onclick=()=>{if(busy)return;busy=1;BT1.disabled=true;BT1.style.opacity=.6;G[i][3](()=>{busy=0;i++;show()})};show();
 function end(done){ui.remove();document.body.classList.remove('v3bath');if(carry)carry.visible=true;if(mo)mo.route=[];setTimeout(()=>{g.remove(grp)},done?2500:0);B3=null;setView('pyeong');
  if(!done)return;const st=LS.get('cp_bath',[]);const kd=ymd(new Date());if(!st.includes(kd))st.push(kd);LS.set('cp_bath',st);try{homeStamp('bath',st)}catch(e){}burst(g.position.clone().add(V(3.2,1.8,1.0)),'보송보송 목욕 끝 ♥');
  setTimeout(()=>{try{const P=BATH_PROD;const nb=(LS.get('cp_bath',[])||[]).length;openSheet('뽀득 목욕 끝');sb.innerHTML='<div class="box" style="text-align:center"><div style="font-size:56px;line-height:1.1">🛁</div><div class="t" style="font-size:22px">보송보송 목욕 도장 쾅</div><p class="note">우물 물 길어서 오늘도 씻겼다 · 지금까지 목욕 도장 '+nb+'개</p><div style="display:inline-block;margin:8px 0 4px;padding:6px 14px;border:3px solid #d8453a;border-radius:50%;color:#d8453a;font:15px Jua,sans-serif;transform:rotate(-8deg)">이장 확인</div></div><details class="box" style="padding:10px 14px"><summary style="font:14px Jua,sans-serif;color:#4a7fb5;list-style:none;display:flex;align-items:center;gap:8px"><img src="'+P.img+'" alt="" style="width:36px;height:36px;object-fit:contain;border-radius:8px;background:#f4f9fd">오늘 쓴 워시 · '+esc(P.brand)+' '+esc(P.name)+' ›</summary><div style="font-size:12px;margin-top:8px">'+P.feats.map(f=>f[0]+' '+esc(f[1])).join(' · ')+'</div><a href="'+P.url+'" target="_blank" rel="noopener sponsored" style="display:block;margin-top:8px;padding:10px;border-radius:14px;background:#FFD84D;border:2.5px solid #2B2118;color:#2B2118;font:15px Jua,sans-serif;text-decoration:none;text-align:center">🧴 제품 보기</a><p class="note" style="margin-top:6px;font-size:11px">'+esc(P.disc)+'</p></details>'}catch(e){toast('🛁 보송보송 목욕 끝! 도장 쾅')}},900)}}
/* ---------- 상호작용 ---------- */
function ijang(){const due=(()=>{try{return LS.get('cp_due','')}catch(e){return''}})();burst(PL3.hall.g.position.clone().add(V(-1.1,3.4,2.9)),'📢 이장입니다~');setTimeout(()=>{openBoard()},700)}
function soundMenu(){openSheet('사랑방 라디오');sb.innerHTML='<div class="box"><div class="t">뭐 틀어줄까</div><div class="vhg"><button data-s="wn"><span>🌧</span><b>백색소음</b><small>빗소리·쉬~</small></button><button data-s="lul"><span>🎵</span><b>자장가</b><small>오르골</small></button></div></div>';sb.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{closeSheet();plAct(b.dataset.s)})}
let woodC=null,woodT=0;const wood=()=>{const nw=performance.now();if(woodC!==null&&nw-woodT<2000)return woodC;woodT=nw;const w=LS.get('cp_wood',{d:'',n:0});woodC=w.d===ymd(new Date())?w.n:0;return woodC};
function addWood(){chore('wood');woodC=null;const n=wood()+1;woodC=n;LS.set('cp_wood',{d:ymd(new Date()),n});burst(PL3.madang.g.position.clone().add(V(0,1.2,-2)),'🔥 장작 하나 쏙');{const c=$('woodc');if(c)c.innerHTML='<b>🔥 장작 '+Math.min(3,n)+'/3</b><i>'+(n>=3?'가마솥 밥 다 됐다':'3개면 가마솥 밥')+'</i>'}toast(n>=3?'가마솥 밥 다 됐다! 오늘 '+n+'끼 기록':'장작 '+n+'개 · 3개 모이면 가마솥 밥이 지어져');setTimeout(()=>openMeal(),600)}
function drawWater(){if(drawWater.on)return;drawWater.on=1;setTimeout(()=>drawWater.on=0,1600);const b=PL3.pyeong.bucket;let t=0;const id=setInterval(()=>{t+=.05;b.position.y=1.6-Math.sin(Math.min(1,t)*Math.PI)*.9;if(t>=1){clearInterval(id);toast('두레박 물 길었다 · 아기 씻기러 가자');setTimeout(()=>{try{openBath()}catch(e){}},400)}},30)}
function openJar(){chore('jar');burst(PL3.jangdok.g.position.clone().add(V(.6,2,-.6)),'뚜껑 열었다');setTimeout(()=>{document.body.classList.add('v3jang');showComfort()},400)}
function sit(){const mo=avs[myId];if(!mo)return;const t=cur==='pyeong'?PL3.pyeong.g.position.clone().add(V(srn(-1.4,2),1.07,srn(1.2,2.6))):PL3.jangdok.g.position.clone().add(V(-2.6,.68,1));mo.route=[mo.pos.clone().lerp(t,.5).setY(mo.pos.y),t];mo.sitAfter=true;toast(cur==='pyeong'?'평상에 걸터앉았어 · 고구마 바구니 누르면 다 같이 쓰담':'장독대 벤치에 앉았어')}
const HF=[];function allSd(){chore('sd');const mo=avs[myId],tg=Object.values(avs).filter(o=>!o.me&&o.a.root.visible!==false);const from=mo?mo.pos.clone().add(V(0,2.2,0)):C3.position.clone().add(V(0,-3,-6));
 if(!tg.length){burst(from,'지금은 조용하네 · 다음 엄마한테 쓰담 남겨둘게');try{roomSd()}catch(e){}return}
 tg.slice(0,12).forEach((o,i)=>{const s=glow('#ff8fa3',1.1);s.position.copy(from);world.add(s);HF.push({s,a:from.clone(),b:o.pos.clone().add(V(0,2,0)),t0:performance.now()/1000+i*.12,o})});try{roomSd()}catch(e){}}
function snap(){try{if(LITE)R3.render(S3,C3);else comp3.render();const src=R3.domElement,W=1080,H=1350,c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.fillStyle='#fff8ee';g.fillRect(0,0,W,H);
 const sw=src.width,sh=src.height,side=Math.min(sw,sh*.9),sx=(sw-side)/2,sy=Math.max(0,(sh-side)/2-sh*.05);g.save();g.beginPath();g.roundRect?g.roundRect(60,60,960,960,36):g.rect(60,60,960,960);g.clip();g.drawImage(src,sx,sy,side,side,60,60,960,960);g.restore();
 g.strokeStyle='#2B2118';g.lineWidth=6;g.strokeRect(60,60,960,960);const no=Math.max(1,Math.floor((Date.now()-new Date(2026,10,19))/864e5)+1);g.fillStyle='#fff8ee';g.fillRect(90,84,520,74);g.strokeRect(90,84,520,74);g.fillStyle='#2B2118';g.font='40px Jua, sans-serif';g.textAlign='left';g.fillText('우리 동네 새벽 회보 제 '+String(no).padStart(3,'0')+'호',112,136);const d=new Date(),hh=d.getHours(),mm=String(d.getMinutes()).padStart(2,'0');const n=Math.max(1,Object.keys(avs).length),w=wood();
 const tm=(hh<6?'새벽 ':hh<12?'오전 ':hh<18?'오후 ':'밤 ')+((hh%12)||12)+':'+mm;g.fillStyle='#2B2118';g.font='52px Jua, sans-serif';g.textAlign='left';g.fillText(d.getFullYear()+'.'+(d.getMonth()+1)+'.'+d.getDate()+' '+tm,80,1110);
 g.font='44px Jua, sans-serif';const CFs=(typeof COMFORT!='undefined'?COMFORT:[]).filter(x=>!/돈|권리|급여|신청|지원금|회사|법|부업|월급|수입|커리어/.test(x));const cm=CFs.length?CFs[new Date().getDate()%CFs.length]:'';g.fillText('깨어 있는 엄마 '+n+'명이랑 같이 버티는 중',80,1180);g.fillStyle='#8a6a52';g.font='38px Jua, sans-serif';g.fillText(w>=3?'오늘 아궁이 장작 3/3 · 가마솥 밥 완성':'오늘 아궁이 장작 '+w+'/3',80,1240);g.fillText((cm.length>24?cm.slice(0,23)+'…':cm)||'온라인 공동육아방 · 옛날 동네에서 같이 키워요',80,1295);
 g.save();g.translate(930,1180);g.rotate(-.2);g.strokeStyle='#d8453a';g.fillStyle='#d8453a';g.lineWidth=7;g.beginPath();g.arc(0,0,82,0,7);g.stroke();g.lineWidth=3;g.beginPath();g.arc(0,0,70,0,7);g.stroke();g.textAlign='center';g.font='34px Jua, sans-serif';g.fillText('이장',0,-8);g.fillText('확인',0,32);g.restore();
 c.toBlob(b=>{const f=new File([b],'우리동네_'+ymd(d)+'.png',{type:'image/png'});if(navigator.canShare&&navigator.canShare({files:[f]})){navigator.share({files:[f],text:'새벽 수유 동지들 여기 모여 있어 🕯️'}).catch(e=>{if(e&&e.name!=='AbortError')shw()})}else shw();function shw(){const u=c.toDataURL('image/png');openSheet('마을 사진관');sb.innerHTML='<div class="box" style="text-align:center"><img src="'+u+'" style="width:100%;border-radius:14px;border:3px solid #2B2118"><div style="margin-top:8px;font:14px Jua,sans-serif">사진을 꾹 눌러 저장해서 단톡에 보내줘</div></div>'}},'image/png')}catch(e){toast('사진을 못 찍었어 · 다시 눌러줘')}}
function burst(at,txt){const e=document.createElement('div');e.className='v3fx';e.textContent=txt;app.appendChild(e);const v=at.clone().project(C3);e.style.left=((v.x+1)/2*app.clientWidth)+'px';e.style.top=((1-v.y)/2*app.clientHeight)+'px';setTimeout(()=>e.remove(),1500)}
/* ---------- 카메라 ---------- */
const camT=V(0,0,0),camO=V(0,44,36),camTT=V(0,0,0),camOO=V(0,44,36);let pan=V(0,0,0),fitK=1;
function setView(k){const v=VIEW[k]||VIEW.map;camTT.copy(v.t);camOO.copy(k==='map'?VDIR:PDIR).multiplyScalar(dist(v.w));if(k==='map')camTT.z-=2.5}
function go(k){if(B3&&B3.end)B3.end(false);if(STR)stopStroll(false);if(!on)show();cur=k;mode='walk';pan.set(0,0,0);setPl(k);const mo=avs[myId];if(mo){routeTo(mo,k);mo.sitAfter=false;if(mo.route.length>3){mo.pos.copy(mo.route[mo.route.length-3]);mo.route=mo.route.slice(-2)}{const pp=PL3[k];if(pp&&pp.h&&mo.route.length){mo.route[mo.route.length-1]=pp.g.position.clone().add(V(-.2,pp.h.y0,pp.h.D/2-.7))}}}
 camTT.copy(P[k]).add(V(0,1,0));camOO.copy(VDIR).multiplyScalar(dist(18));hideLabels(true);
 const wait=window.__snap?50:mo?Math.min(1800,300+mo.route.reduce((s,p,i,a)=>s+(i?p.distanceTo(a[i-1]):p.distanceTo(mo.pos)),0)/14*1000):300;setTimeout(()=>{if(cur===k&&mode==='walk')enter(k)},wait)}
function enter(k){{const mo=avs[myId];if(mo&&mo.route.length){mo.pos.copy(mo.route[mo.route.length-1]);mo.route=[]}}if(k!=='jangdok')document.body.classList.remove('v3jang');if(k==='home')try{shelfGifts()}catch(e){};mode='place';try{v3cardOff()}catch(_){}mz=[zoom,yaw];zoom=1;yaw=0;setTimeout(rbtn,0);document.body.classList.add('v3place');setTimeout(()=>{if(R3)R3.shadowMap.needsUpdate=true},50);setTimeout(()=>{if(R3)R3.shadowMap.needsUpdate=true},1400);setView(k);const tp=PL3[k]&&PL3[k].g.position;Object.entries(PL3).forEach(([kk,p])=>{if(p.g&&tp)p.g.visible=kk===k||!(p.g.position.z>tp.z+2&&Math.abs(p.g.position.x-tp.x)<7.5)});Object.entries(PL3).forEach(([kk,p])=>{if(p.h){p.fade=kk===k?0:1}});placeUI(k);
 const tip={home:'선반·책상·빨랫줄·문을 눌러봐',sarang:'온돌 바닥을 누르면 수유 시작 · 요람·라디오도 돼',madang:'아궁이에 장작을 넣으면 식판 기록',hall:'게시판에 우리 집 공고가 붙어 있어',store:'사탕 단지에 오늘의 선물',pyeong:'평상에 앉고 · 우물에서 물 긷기',jangdok:'장독 뚜껑을 열면 숙성된 위로 한 줄'}[k];if(tip)toast(tip)}
function back(){if(B3&&B3.end)B3.end(false);mode='map';try{v3cardOff()}catch(_){}if(cur){zoom=mz[0];yaw=mz[1]}setTimeout(rbtn,0);document.body.classList.remove('v3place');setTimeout(()=>{if(R3)R3.shadowMap.needsUpdate=true},50);setTimeout(()=>{if(R3)R3.shadowMap.needsUpdate=true},1400);document.body.classList.remove('v3jang');Object.values(PL3).forEach(p=>{if(p.g)p.g.visible=true});cur=null;setPl('vil');setView('map');Object.values(PL3).forEach(p=>{if(p.h)p.fade=1});const u=$('plui');if(u)u.remove();hideLabels(false);const mo=avs[myId];if(mo)routeTo(mo,'vil')}
function placeUI(k){let u=$('plui');if(u)u.remove();u=document.createElement('div');u.id='plui';app.appendChild(u);const P2=(typeof PLACES!='undefined'&&PLACES[k])||{n:NAMES[k],btn:[]};
 u.innerHTML='<div class="pt"><button id="plback">‹ 마을</button><span class="pn"><b>'+NAMES[k]+'</b><i id="plcnt"></i></span></div><div class="pb">'+(P2.btn||[]).filter(b=>b[0]!=='bag'||me.kind==='preg').map((b,i)=>'<button data-a="'+b[0]+'"'+(i>1?' class="sm"':'')+'>'+b[1]+'</button>').join('')+'</div>';
 $('plback').onclick=back;if(k==='madang'){const c=document.createElement('span');c.className='pn';c.id='woodc';c.innerHTML='<b>🔥 장작 '+Math.min(3,wood())+'/3</b><i>3개면 가마솥 밥</i>';u.querySelector('.pt').appendChild(c)}u.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>plAct(b.dataset.a,b));document.body.classList.add('pl');try{plCnt();plFeedLbl()}catch(e){}}
/* ---------- 장소 안 엄마 이름표 ---------- */
const CH={};function chips(){let box=$('v3k');if(!box){box=document.createElement('div');box.id='v3k';box.style.cssText='position:absolute;inset:0;pointer-events:none;z-index:5';$('v3').appendChild(box)}if(!box)return;const show=mode==='place'||!!STR;const seen={};Object.values(avs).forEach(o=>{if(!show||(!STR&&o.pl!==cur)||(STR&&!o.me))return;seen[o.id]=1;let e=CH[o.id];if(!e){e=document.createElement('div');e.className='v3chip';box.appendChild(e);CH[o.id]=e}
 const st=o.st||{},ic=st.st=='feed'||st.st=='bottle'?'🍼 ':st.st=='dunga'?'💤 ':st.st=='yukte'?'🍺 ':'';e.textContent=o.me?(me.st==='feed'?'🍼 나 · '+Math.max(0,Math.floor((Date.now()-me.stAt)/60000))+'분':me.st==='dunga'?'💤 나 · 꿀잠 '+Math.round(Math.min(100,me.steps||0))+'%':'나'):ic+(st.nick||'엄마');e.classList.toggle('me',!!o.me);const p=o.pos.clone().add(V(0,o.a.root.scale.x*1.8+.1,0)).project(C3);e.style.left=((p.x+1)/2*app.clientWidth)+'px';e.style.top=((1-p.y)/2*app.clientHeight)+'px';e.style.display=''});
 for(const id in CH)if(!seen[id]){CH[id].style.display='none';if(!avs[id]){CH[id].remove();delete CH[id]}}}
/* ---------- 지도 아래 엄지 버튼 ---------- */
function quick(){let q=$('v3q');if(!q){q=document.createElement('div');q.id='v3q';q.innerHTML='<button data-q="feed">🍼<b>수유 시작</b></button><button data-q="meal">🔥<b>장작·식판</b></button><button data-q="sd">♥<b>다 같이 쓰담</b></button><button data-q="snap" class="snap">📸</button>';$('v3').appendChild(q);
 q.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>({feed:()=>{go('sarang');setTimeout(()=>{if(me.st!='feed')plAct('feed')},2200)},meal:()=>go('madang'),sd:()=>allSd(),snap:()=>snap()})[b.dataset.q]())}q.style.display=mode==='map'?'':'none'}
/* ---------- 이름표(지도) ---------- */
function labels(){if(!world)return;const box=$('v3l');if(!box)return;for(const k in P){let e=LBL[k];if(!e){e=document.createElement('button');e.className='vl v3';e.innerHTML='<b>'+NAMES[k]+'</b><i></i>';e.onclick=()=>go(k);box.appendChild(e);LBL[k]=e}
  const n=k==='post'?0:Object.values(avs).filter(o=>!o.me&&o.pl===k).length+((avs[myId]&&avs[myId].pl===k)?1:0);const nm=k==='post'?(LS.get('cp_mbnew',0)||0):0;e.querySelector('i').textContent=k==='post'?(nm?'새 쓰담 '+nm:''):(n?'엄마 '+n+'명':SUB[k])}}
function hideLabels(h){const b=$('v3l');if(b)b.style.display=h?'none':''}
function placeLabels(){if(mode!=='map')return;const W=app.clientWidth,H=app.clientHeight,ar=app.getBoundingClientRect(),occ=[];['v3chore','giftb','v3q','v3r'].forEach(id=>{const el=$(id);if(el&&el.offsetWidth){const r=el.getBoundingClientRect();occ.push([r.left-ar.left,r.top-ar.top,r.right-ar.left,r.bottom-ar.top])}});
 const L=[];for(const k in LBL){const p=P[k].clone().add(V(0,k==='post'?4.6:k==='pyeong'?8:6.6,0)).project(C3);L.push([k,(p.x+1)/2*W,(1-p.y)/2*H,p.z])}L.sort((a,b)=>a[3]-b[3]);
 L.forEach(([k,x,y])=>{const e=LBL[k];e.style.left=x+'px';e.style.top=y+'px';const w=(e.offsetWidth||90)/2+4,h=(e.offsetHeight||36)+4;const bx=[x-w,y-h,x+w,y];const hit=x<10||x>W-10||y-h<56||y>H-80||occ.some(o=>bx[0]<o[2]&&bx[2]>o[0]&&bx[1]<o[3]&&bx[3]>o[1]);e.style.visibility=hit?'hidden':'';if(!hit)occ.push(bx)})}
/* ---------- 입력 ---------- */
const ray=new T.Raycaster(),mv=new T.Vector2();let down=null,moved=false;
function pick(e){const r=cv.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,C3)}
function tap(e){pick(e);const avM=[];Object.values(avs).forEach(o=>{if(!o.me)o.a.root.traverse(m=>{if(m.isMesh&&m.geometry.type!=='CircleGeometry')avM.push(m)})});
 const ha=mode==='place'?ray.intersectObjects(avM,false)[0]:null;if(ha){const id=ha.object.userData.av;chore('sd');try{sendPat(id)}catch(err){}burst(avs[id].a.root.position.clone().add(V(0,2,0)),'쓰담 ♥');return}
 const list=HOT.filter(m=>{const h=m.userData.hot;return mode==='map'?h.place==='map'||h.key==='go':h.place===cur||h.place==='map'});const hh=ray.intersectObjects(list,false);
 for(const x of hh){const h=x.object.userData.hot;if(mode!=='map'&&h.key==='go')continue;const nw=performance.now();if(nw-(tap.lt||0)<500)return;tap.lt=nw;if(mode==='place'&&!B3&&!STR){walkToHot(x.object);return}h.fn();return}
 if(mode==='place'&&!B3&&!STR){const g=ray.intersectObject(world.children[0],true)[0];const mo=avs[myId];if(g&&mo&&g.point.distanceTo(P[cur])<8){const q=g.point.clone();constrain(q);mo.route=navRoute(mo.pos,q);mo.sitAfter=false;mo.a.sit=0;NEARH=null}}
}
const PT=new Map(),YA=V(0,1,0),TMP=V();let zoom=1,yaw=0,g0=null,mz=[1,0];
function gest(){const a=[...PT.values()];const dx=a[1][0]-a[0][0],dy=a[1][1]-a[0][1];return{d:Math.hypot(dx,dy)||1,a:Math.atan2(dy,dx)}}
function zlim(){return mode==='map'?[.42,1.45]:[.6,1.35]}
function resetView(){zoom=1;yaw=0;rbtn()}
function rbtn(){let b=$('v3r');if(!b){b=document.createElement('button');b.id='v3r';b.textContent='↺ 처음 보기';b.onclick=e=>{e.stopPropagation();resetView();pan.set(0,0,0)};$('v3').appendChild(b)}b.style.display=(Math.abs(yaw)>.06||Math.abs(zoom-1)>.06||pan.lengthSq()>4)?'':'none'}
function bindInput(){cv.style.touchAction='none';
 cv.addEventListener('pointerdown',e=>{if(e.isPrimary){PT.clear();g0=null}try{cv.setPointerCapture(e.pointerId)}catch(_){}PT.set(e.pointerId,[e.clientX,e.clientY]);if(PT.size===1){down=[e.clientX,e.clientY,pan.clone()];moved=false}else if(PT.size===2){moved=true;down=null;const g=gest();g0={d:g.d,a:g.a,zoom,yaw}}});
 const end=e=>{const had=PT.has(e.pointerId);PT.delete(e.pointerId);if(PT.size<2)g0=null;if(e.type==='pointerup'&&had&&down&&!moved&&PT.size===0)tap(e);if(PT.size>=2){const g=gest();g0={d:g.d,a:g.a,zoom,yaw}}else if(PT.size===1&&e.type!=='pointerup'||PT.size===1){const q=[...PT.values()][0];down=[q[0],q[1],pan.clone()];moved=true}else down=null};
 cv.addEventListener('pointerup',end);cv.addEventListener('pointercancel',end);cv.addEventListener('lostpointercapture',e=>{if(!PT.has(e.pointerId))return;PT.delete(e.pointerId);if(PT.size<2)g0=null;if(!PT.size)down=null});document.addEventListener('gesturestart',e=>e.preventDefault(),{passive:false});
 cv.addEventListener('pointermove',e=>{if(!PT.has(e.pointerId))return;PT.set(e.pointerId,[e.clientX,e.clientY]);
  if(PT.size>=2&&g0){const g=gest(),L=zlim(),raw=g0.zoom*g0.d/g.d;if(pinchJump(raw))return;zoom=Math.max(L[0],Math.min(L[1],raw));let da=g.a-g0.a;if(da>Math.PI)da-=2*Math.PI;if(da<-Math.PI)da+=2*Math.PI;yaw=g0.yaw+da;if(mode!=='map')yaw=Math.max(-.7,Math.min(.7,yaw));rbtn();return}
  if(!down)return;const dx=e.clientX-down[0],dy=e.clientY-down[1];if(Math.hypot(dx,dy)>10)moved=true;
  if(moved&&mode==='map'){const k=dist(31)/app.clientWidth*.6*zoom;TMP.set(-dx*k,0,-dy*k).applyAxisAngle(YA,yaw);const lim=9+(1-zoom)*10;pan.set(Math.max(-lim,Math.min(lim,down[2].x+TMP.x)),0,Math.max(-lim-3,Math.min(lim+3,down[2].z+TMP.z)));rbtn()}});
 cv.addEventListener('wheel',e=>{e.preventDefault();const L=zlim(),raw=zoom*Math.exp(e.deltaY*.0015);if(pinchJump(raw))return;zoom=Math.max(L[0],Math.min(L[1],raw));rbtn()},{passive:false})}
let pjT=0;function pinchJump(raw){const nw=performance.now();if(nw-pjT<1200)return true;
 if(mode==='place'&&raw>1.55&&!B3){pjT=nw;g0=null;PT.clear();down=null;zoom=1;yaw=0;back();toast('마을 전체 보기');return true}
 if(mode==='map'&&raw<.4){let best=null,bd=1e9;const c=camT.clone();for(const k in P){const d=P[k].distanceTo(c);if(d<bd){bd=d;best=k}}if(best&&bd<7){pjT=nw;g0=null;PT.clear();down=null;zoom=1;yaw=0;go(best);return true}}
 return false}
/* ---------- 루프 ---------- */
function frame(){raf=on?requestAnimationFrame(frame):0;if(!on)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;if(sheet.classList.contains('on')&&mode!=='walk'&&now-(frame.l||0)<400)return;frame.l=now;
 const cl=window.__snap?1:Math.min(1,dt*3.2);camT.lerp(camTT.clone().add(pan),cl);camO.lerp(camOO,cl);C3.position.copy(camT).add(TMP.copy(camO).applyAxisAngle(YA,yaw).multiplyScalar(zoom));C3.lookAt(camT);
 Object.values(PL3).forEach(p=>{if(!p.h)return;const f=p.fade==null?1:p.fade,cf=p.cf==null?1:p.cf,nf=window.__snap?f:cf+(f-cf)*Math.min(1,dt*5);p.cf=nf;p.h.roof.visible=nf>.05;p.h.roof.position.y=(1-nf)*3;p.h.front.visible=nf>.5});
 Object.values(avs).forEach(o=>{const a=o.a;if(o.route.length){const tg=o.route[0],d=tg.clone().sub(o.pos),L=d.length(),sp=(o.me?7:4.5)*dt;if(L<=sp){o.pos.copy(tg);o.route.shift();if(!o.route.length&&o.sitAfter){a.sit=1}}else{o.pos.addScaledVector(d.normalize(),sp);if(o.me&&mode==='place'&&!B3&&!o.sitAfter){constrain(o.pos)}if(o.me&&me.st==='dunga'&&me.steps<100){me.steps=Math.min(100,(me.steps||0)+sp*7);if(me.steps>=100)burst(o.pos.clone().add(V(0,2.4,0)),'꿀잠 성공 zZ');try{renderCardSoft()}catch(_){}}a.root.rotation.y=Math.atan2(d.x,d.z)}a.sit=0;a.walk=Math.min(1,a.walk+dt*6)}else a.walk=Math.max(0,a.walk-dt*6);
  if(!o.route.length){const pp=PL3[o.pl];if(pp&&pp.h)o.pos.y=pp.g.position.y+pp.h.y0;if(o.me&&mode==='place'&&!B3&&!o.sitAfter&&!a.sit)constrain(o.pos)}
  if(!o.route.length&&(o.sitAfter||(o.me&&me.st==='feed')))a.sit=1;a.root.position.copy(o.pos);try{animA(a,dt)}catch(e){}});
 SMOKE.forEach(s=>{const u=s.userData,k=(u.t+t*.13)%1,sc=(.3+k*1.1)*u.k*1.6;s.position.set(u.at.x+Math.sin(k*6+u.t)*.3*k,u.at.y+k*2.4,u.at.z+k*.3);s.scale.set(sc,sc,1);s.material.opacity=(1-k)*.75});
 const w=wood(),fe=me.st=='feed';FIRE.forEach(f=>{const k=f.key==='wood'?.35+Math.min(1,w/3)*.65:fe?1:.5;const s=f.base*k*(1+Math.sin(t*14+f.m.position.x)*.12);f.m.scale.setScalar(s*2.2)});
 if(PL3.madang&&PL3.madang.steam)PL3.madang.steam.forEach(s=>{const u=s.userData,k=(u.t+t*.25)%1,on2=w>=3;s.visible=on2;s.position.set(u.x+Math.sin(k*7)*.15,1.7+k*1.4,-2.6);const sc=.3+k*.7;s.scale.set(sc,sc,1);s.material.opacity=(1-k)*.8});
 if(PL3.sarang&&PL3.sarang.floor){const g=Math.min(1,(typeof DAWN_PATS!='undefined'?DAWN_PATS:0)/40)*.35+(fe?.35:0)+.08*nightK()+(cur==='sarang'?.06:0);PL3.sarang.floor.material.emissiveIntensity=g*(.85+Math.sin(t*2)*.15)}
 STAR.forEach(s=>{if(s.visible&&s.material.map)s.material.opacity=.55+.45*Math.sin(t*2+s.userData.p)});FLY.forEach(s=>{if(!s.visible||s.userData.moon)return;const u=s.userData;s.position.set(u.c.x+Math.sin(t*.6+u.p)*1.2,u.c.y+Math.sin(t*1.3+u.p)*.4,u.c.z+Math.cos(t*.5+u.p)*1.2);s.material.opacity=.4+.6*Math.abs(Math.sin(t*3+u.p))});
 if(PL3.pyeong&&PL3.pyeong.shoes){const n=Object.values(avs).filter(o=>o.pl==='pyeong').length;PL3.pyeong.shoes.forEach((s,i)=>s.visible=i<Math.max(1,n))}
 if(PL3.sarang&&PL3.sarang.lamp)PL3.sarang.lamp.intensity=cur==='sarang'?(.25+nightK()*.45):0;
 chips();strollTick();if(!frame.ab||now-frame.ab>200){frame.ab=now;actBtn()}
 Object.values(avs).forEach(o=>{if(!o.ph)o.ph=Math.random()*6;{const S=(o.me&&B3)?1.0:mode==='place'&&(cur==='sarang'||cur==='home'||cur==='hall')?1.12:1.5;o.a.root.scale.set(S,S*(1+Math.sin(t*2.2+o.ph)*.025),S)}});
 for(let i=HF.length-1;i>=0;i--){const h=HF[i],k=(t-h.t0)/.9;if(k<0){h.s.visible=false;continue}h.s.visible=true;if(k>=1){world.remove(h.s);burst(h.b,'마음이 전해졌어요 ♥');HF.splice(i,1);continue}h.s.position.lerpVectors(h.a,h.b,k);h.s.position.y+=Math.sin(k*Math.PI)*2.2}
 DYN.forEach(f=>f(t));{const ph=window.__phase||phaseNow();if(ph!==lastPh){lastPh=ph;sky()}}if(now-lastSync>600){lastSync=now;sync()}placeLabels();quick();if(!frame.cc||now-frame.cc>1000){frame.cc=now;choreChip()}if(LITE)R3.render(S3,C3);else comp3.render()}
/* ---------- 시작 ---------- */
const LITE=/iPhone|iPad|iPod|Android|Mobile/i.test(navigator.userAgent)||(navigator.maxTouchPoints>1&&/Mac/.test(navigator.platform))||window.__lite||/lite=1/.test(location.search);
function init(){if(R3)return true;try{
 R3=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});R3.setPixelRatio(Math.min(1.5,devicePixelRatio));R3.outputEncoding=LITE?T.LinearEncoding:T.sRGBEncoding;R3.toneMapping=T.LinearToneMapping;R3.toneMappingExposure=1;R3.shadowMap.enabled=true;R3.shadowMap.type=T.PCFSoftShadowMap;R3.shadowMap.autoUpdate=false;
 cv=R3.domElement;cv.addEventListener('webglcontextlost',e=>{e.preventDefault();try{hide()}catch(_){}ok=false;try{vilShow()}catch(_){}});cv.id='v3c';const host=document.createElement('div');host.id='v3';host.innerHTML='<div id="v3l"></div>';host.prepend(cv);app.appendChild(host);
 S3=new T.Scene();C3=new T.PerspectiveCamera(38,1,1,400);hemi=new T.HemisphereLight(0xfff8ee,0xe6d2b0,1.15);S3.add(hemi);sun=new T.DirectionalLight(0xfff0dc,1.05);sun.position.set(-14,30,18);sun.castShadow=true;sun.shadow.mapSize.set(1536,1536);sun.shadow.radius=10;sun.shadow.bias=-.0008;sun.shadow.normalBias=.04;
 Object.assign(sun.shadow.camera,{left:-22,right:22,top:26,bottom:-26,near:1,far:90});S3.add(sun);rim=new T.DirectionalLight(0xffe2c4,.45);rim.position.set(14,8,-14);S3.add(rim);
 build();comp3=new T.EffectComposer(R3);comp3.addPass(new T.RenderPass(S3,C3));const hT=new T.ShaderPass(T.HorizontalTiltShiftShader),vT=new T.ShaderPass(T.VerticalTiltShiftShader);hT.uniforms.r.value=vT.uniforms.r.value=.52;comp3.addPass(hT);comp3.addPass(vT);const vg=new T.ShaderPass(T.VignetteShader);vg.uniforms.offset.value=.95;vg.uniforms.darkness.value=.42;comp3.addPass(vg);
 const rs=()=>{const w=app.clientWidth,h=app.clientHeight;R3.setSize(w,h);comp3.setSize(w,h);C3.aspect=w/h;C3.updateProjectionMatrix();hT.uniforms.h.value=1.1/w;vT.uniforms.v.value=1.1/h;fitK=Math.max(1,.62/C3.aspect*.82);if(mode==='map')setView('map')};rs();addEventListener('resize',rs);
 bindInput();sky();setInterval(sky,30000);return true}catch(e){console.warn('v3d',e);ok=false;try{if(R3)R3.dispose()}catch(_){}R3=null;return false}}
function show(){if(!ok||!init())return false;on=true;window.__v3on=1;document.body.classList.add('v3on');document.body.classList.add('vil');if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}sync();if(mode==='map'){setView('map');hideLabels(false)}R3.shadowMap.needsUpdate=true;
 if(LS.get('cp_bcast','')!==ymd(new Date())){LS.set('cp_bcast',ymd(new Date()));setTimeout(()=>{const n=typeof DAWN_PATS!='undefined'?DAWN_PATS:0;toast('📢 아 아~ 이장입니다. 오늘 새벽 쓰담 '+n+'개, 장독대에 별 '+Math.min(60,10+n)+'개 떴어요')},1800)}return true}
function hide(){on=false;window.__v3on=0;document.body.classList.remove('v3on');const u=$('plui');if(u&&mode!=='map')u.remove();mode='map';cur=null}
return{constrain,stroll,stopStroll,chore,bath,snap,allSd,ok:()=>ok,show,hide,go:k=>{if(show())go(k)},map:()=>{if(!show())return false;back();return true},sync,isOn:()=>on,_:{avs,P,PL3,setView,enter,soundMenu,shelfGifts,chore}}})();
window.V3D=V3D;

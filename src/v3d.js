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
const M={tile:S('#56688c',{roughness:.7}),ridge:S('#3b4963',{side:T.DoubleSide}),wall:S('#fbecd2',{side:T.DoubleSide}),wood:S('#e0a874',{map:tWood,roughness:.8}),woodD:S('#b8794a',{map:tWood}),
 hanji:S('#ffffff',{map:tHanji,side:T.DoubleSide,emissive:new T.Color('#ffb54a'),emissiveIntensity:0}),stone:S('#e3dccf',{roughness:.95}),ground:S('#8cc46a',{roughness:1}),sand:S('#e8c795',{roughness:1}),
 grass:S('#7fb85a',{map:null,roughness:1}),leaf:S('#7fb85a',{roughness:.95}),flower:S('#ffffff',{map:null,roughness:.8}),pot:S('#9b6a48',{roughness:.7}),straw:S('#f0c878',{map:tStraw,roughness:1,side:T.DoubleSide}),
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
 cx.forEach(x=>[-D/2,D/2].forEach(z=>{body.put(cyl(.25,.3,.18,12),'stone',V(x,.57,z));body.put(cyl(.15,.16,H,12),'woodD',V(x,y0+H/2,z))}));
 body.put(rb(W+.1,.14,D+.1,.05),'wood',V(0,y0+.07,0),null,null,'#f0ddc4');
 for(let i=0;i<o.bays;i++){const a=cx[i],b=cx[i+1],m=(a+b)/2,w=b-a-.28;body.put(rb(w,H-.08,.16,.06),'wall',V(m,(y0+y1)/2,-D/2+.02));
  if(!o.openFront){front.put(rb(w,H-.08,.16,.06),'wall',V(m,(y0+y1)/2,D/2-.02));front.put(rb(w+.1,.15,.2,.06),'woodD',V(m,y0+.52,D/2+.03));
   const dw=o.door===i?Math.min(1.5,w-.15):Math.min(1.1,w-.25),dh=o.door===i?1.15:.62,dy=o.door===i?y0+.66:y0+.98;front.put(new T.PlaneGeometry(dw,dh),'hanji',V(m,dy,D/2+.13));front.put(rb(dw+.14,dh+.14,.08,.04),'woodD',V(m,dy,D/2+.09))}}
 [-W/2,W/2].forEach(x=>{body.put(rb(.16,H-.08,D-.28,.06),'wall',V(x,(y0+y1)/2,0));body.put(new T.PlaneGeometry(.8,.6).rotateY(Math.PI/2),'hanji',V(x+(x<0?-.1:.1),y0+.98,0))});
 body.put(rb(W+.6,.26,.32,.1),'woodD',V(0,y1+.1,D/2));body.put(rb(W+.6,.26,.32,.1),'woodD',V(0,y1+.1,-D/2));body.put(rb(.32,.26,D+.4,.1),'woodD',V(-W/2,y1+.1,0));body.put(rb(.32,.26,D+.4,.1),'woodD',V(W/2,y1+.1,0));
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
function tree(k,x,z,s,c){k.put(cyl(.16*s,.24*s,1.6*s,8),'woodD',V(x,.8*s,z));[[0,2.1,0,1],[.7,1.8,.2,.75],[-.6,1.75,-.1,.8],[.1,2.6,-.2,.7],[-.2,1.9,.6,.7]].forEach(([a,b,cc,r])=>k.put(sph(.95*s*r,12),'leaf',V(x+a*s,b*s,z+cc*s),null,null,c||(r>.8?'#ffffff':'#e8f2dc')))}
function bush(k,x,z,r,t){k.put(sph(r,10),'leaf',V(x,r*.55,z),null,V(1,.75,1),t||'#ffffff');k.put(sph(r*.7,10),'leaf',V(x+r*.7,r*.35,z+.15),null,V(1,.75,1),'#e2eed4')}
function flowers(k,x,z,n,rad){const fc=['#f4a6b5','#f7d27a','#c9b4f0','#ffffff','#ffb3a1'];for(let i=0;i<n;i++){const a=sr()*7,r=sr()*rad,px=x+Math.cos(a)*r,pz=z+Math.sin(a)*r;k.put(sph(.11,7),'flower',V(px,.24,pz),null,null,fc[i%5]);k.put(cyl(.012,.012,.22,4),'grass',V(px,.11,pz))}}
function jar(k,x,z,s,y){y=y||0;k.put(sph(.42*s,14),'pot',V(x,y+.42*s,z),null,V(1,1.1,1),'#ffffff');k.put(cyl(.26*s,.3*s,.1*s,14),'pot',V(x,y+.88*s,z),null,null,'#d7b097');k.put(sph(.06*s,6),'pot',V(x,y+.96*s,z),null,null,'#d7b097')}
function stones(k,x,z,n,rad,y){for(let i=0;i<n;i++){const a=i/n*Math.PI*2,r=rad;k.put(sph(srn(.16,.24),8),'stone',V(x+Math.cos(a)*r,(y||0)+.12,z+Math.sin(a)*r),null,V(1,.7,1),i%2?'#fff':'#ece6dc')}}
function glow(c,s){const m=new T.Sprite(new T.SpriteMaterial({map:tGlow,color:c,transparent:true,depthWrite:false,blending:T.AdditiveBlending}));m.scale.set(s,s,1);return m}
/* ---------- 세계 ---------- */
let world,DYN=[],SMOKE=[],FIRE=[],STAR=[],FLY=[],PL3={},HOT=[],LBL={},avs={},lastSync=0,bubble=null;
const P={home:V(-7.5,0,11.5),post:V(1.2,0,15),store:V(9,0,11),pyeong:V(0,0,3),sarang:V(-9.5,0,-3.5),madang:V(2,0,-7),hall:V(10,0,-2),jangdok:V(-2,1.75,-16)};
const SPOTS={home:[V(-1,.75,.2),V(.6,.75,.3),V(1.6,.75,0),V(-1.8,.75,.1)],sarang:[V(-.6,.75,.2),V(.6,.75,-.2),V(0,.75,.6)],hall:[V(-1,.75,.3),V(.5,.75,.4),V(1.4,.75,0)],store:[V(-.7,.2,2.4),V(.6,.2,2.6),V(1.6,.2,2.2)],
 madang:[V(-1.6,0,2.4),V(1.4,0,2.6),V(0,0,3.6),V(-2.6,0,3.4)],pyeong:[V(-1,1.0,1.6),V(.4,1.0,1.9),V(1.5,1.0,1.4),V(-.3,1.0,2.6),V(2.6,0,3.6),V(-2.6,0,3.5)],jangdok:[V(-1.4,0,2),V(.4,0,2.3),V(1.6,0,1.8)],vil:[V(1.2,0,13),V(-1,0,10),V(3,0,8),V(-2,0,7)]};
const VIEW={map:{t:V(0,0,0),w:29},home:{t:V(-7.5,1.2,11.2),w:8.4},sarang:{t:V(-9.6,1,-3.6),w:7},hall:{t:V(9.8,1.2,-2),w:7.6},store:{t:V(9,1.2,11.4),w:7.4},madang:{t:V(1.6,.9,-7.2),w:7.6},pyeong:{t:V(.6,1.2,3.8),w:9.4},jangdok:{t:V(-1.6,2,-16.4),w:8}};
const VDIR=V(0,.74,.67).normalize(),PDIR=V(0,.52,.85).normalize();function dist(w){const hf=Math.atan(Math.tan(C3.fov*Math.PI/360)*C3.aspect);return (w/2)/Math.tan(hf)}
const NAMES={home:'우리 집',post:'우체통·마을 방송',store:'구멍가게',pyeong:'정자나무 평상',sarang:'새벽 사랑방',madang:'부엌 마당',hall:'마을회관',jangdok:'장독대 언덕'};
const SUB={home:'도감·안방',post:'',store:'오늘의 선물',pyeong:'모두 모이는 곳',sarang:'수유·재우기',madang:'아궁이·식판',hall:'노무사 이장',jangdok:'위로 한 줄'};
const PATH=[V(1.2,0,17),V(1.2,0,13),V(-1,0,9.5),V(0,0,6),V(1.5,0,0),V(-3,0,-3),V(-.5,0,-6.5),V(-2,0,-11),V(-2,.8,-12.8),V(-2,1.6,-14.2)];
function hot(mesh,key,place,fn){mesh.userData.hot={key,place,fn};HOT.push(mesh);return mesh}
function hbox(w,h,d,x,y,z,parent){const m=new T.Mesh(new T.BoxGeometry(w,h,d),new T.MeshBasicMaterial({visible:false}));m.position.set(x,y,z);(parent||world).add(m);return m}
function build(){world=new T.Group();S3.add(world);const K=new Kit();
 /* 섬: 둥근 땅 + 흙길 */
 const sh=new T.Shape();const N=48;for(let i=0;i<=N;i++){const a=i/N*Math.PI*2,rx=17+Math.sin(a*3)*.7,rz=22+Math.cos(a*2)*.8,x=Math.cos(a)*rx,z=Math.sin(a)*rz;i?sh.lineTo(x,z):sh.moveTo(x,z)}
 const ig=new T.ExtrudeGeometry(sh,{depth:1.2,bevelEnabled:true,bevelThickness:.5,bevelSize:.6,bevelSegments:4,curveSegments:8});ig.rotateX(Math.PI/2);K.put(ig,'ground',V(0,-.5,0));
 const cliff=new T.ExtrudeGeometry(sh,{depth:2.5,bevelEnabled:false,curveSegments:8});cliff.rotateX(Math.PI/2);K.put(cliff,'sand',V(0,-2.2,0),null,V(.985,1,.985),'#c9a070');
 const pc=new T.CatmullRomCurve3(PATH),pp=pc.getSpacedPoints(80);const pos=[],nor=[],uv=[];for(let i=0;i<pp.length-1;i++){const a=pp[i],b=pp[i+1],d=b.clone().sub(a).normalize(),n=V(-d.z,0,d.x).multiplyScalar(1.15),y1=a.y+.035,y2=b.y+.035;
  const q=[a.clone().add(n),a.clone().sub(n),b.clone().add(n),b.clone().sub(n)];[[0,1,2],[2,1,3]].forEach(t=>t.forEach(j=>{const v=q[j];pos.push(v.x,j<2?y1:y2,v.z);nor.push(0,1,0);uv.push(j%2,i/10)}))}
 const pg=new T.BufferGeometry();pg.setAttribute('position',new T.Float32BufferAttribute(pos,3));pg.setAttribute('normal',new T.Float32BufferAttribute(nor,3));pg.setAttribute('uv',new T.Float32BufferAttribute(uv,2));K.put(pg,'sand');
 [[2,6],[-3.5,4.2],[3.4,-3],[-1.6,-9]].forEach(([x,z])=>K.put(rb(1.6,.1,1.6,.3),'sand',V(x,.03,z),E(0,sr()*3,0)));
 /* 장독대 언덕 */
 K.put(sph(6,24).scale(1,.36,.85),'ground',V(-2,-.3,-16.5));
 /* 나무·덤불·꽃·돌 흩뿌리기 */
 [[-14,6],[-13,-10],[13,-12],[14,4],[-12,17],[12,18],[6,-17],[-9,-18],[5.5,7.8],[-5,-9]].forEach(([x,z],i)=>tree(K,x,z,srn(.9,1.3),['#ffffff','#c9e08a','#ffd08a','#ffffff','#f6b07a'][i%5]));
 for(let i=0;i<34;i++){const x=srn(-15,15),z=srn(-19,19);if(Math.hypot(x,z*.8)>15.5)continue;let near=false;for(const k in P)if(Math.hypot(P[k].x-x,P[k].z-z)<4.6)near=true;if(near)continue;bush(K,x,z,srn(.3,.6),['#ffffff','#d6eaa0','#ffc6a0','#f7b7c4'][i%4])}
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
  hot(hbox(2.8,1.4,.6,0,h.y0+1,-1.4,g),'shelf','home',()=>openDogam());
  hot(hbox(1.5,1.3,.5,0,h.y0+.7,1.8,g),'door','home',()=>goRoom());
  hot(hbox(1.4,.6,1,1.9,h.y0+.3,-.5,g),'desk','home',()=>openHome(myId,me.nick,true));
  hot(hbox(1.6,2,1,-4.7,1.3,2.4,g),'line','home',()=>openSchool());
  const rope=new T.CatmullRomCurve3([0,1,2,3,4,5,6].map(i=>V(px[0]+(px[1]-px[0])*i/6,2-Math.sin(i/6*Math.PI)*.14,pz)));g.add(new T.Mesh(new T.TubeGeometry(rope,12,.014,4),M.cloth));
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
  const pl=new T.PointLight(0xffb54a,0,7,2);pl.position.set(0,h.y0+1.5,0);g.add(pl);PL3.sarang.lamp=pl;{const k2=new Kit();k2.put(cyl(.07,.07,.3,10),'cloth',V(-.9,h.y0+.38,.3),null,null,'#fff');k2.put(cyl(.075,.075,.06,10),'pot',V(-.9,h.y0+.56,.3),null,null,'#a9d2f0');for(let i=0;i<4;i++)k2.put(rb(.42,.12,.3,.05),'cloth',V(1.5,h.y0+.28+i*.12,.5),null,null,'#ffffff');g.add(k2.build())}
  hot(fl,'ondol','sarang',()=>plAct('feed'));hot(hbox(1.2,1,1,.8,h.y0+.6,-.9,g),'cradle','sarang',()=>goRoom('dunga'));hot(hbox(.8,.9,.6,1.6,h.y0+.6,-1.1,g),'radio','sarang',()=>soundMenu());
  hot(hbox(1.2,1,1,-2.9,.6,.4,g),'agungi2','sarang',()=>plAct('feed'));PL3.sarang.floor=fl;smoke(g,V(-2.9,1.4,-1.7),.5)}
 { // 부엌 마당
  const g=add('madang'),k=new Kit(),h=house({W:4.8,D:2.6,bays:2,openFront:true,roof:'tile'});h.g.position.set(0,0,-2.2);g.add(h.g);PL3.madang.h=h;
  k.put(rb(3.4,.75,1.1,.3),'stone',V(0,.95,-2.6),null,null,'#ece0cf');[-.8,.8].forEach(x=>{k.put(sph(.48,14),'iron',V(x,1.42,-2.6),null,V(1,.55,1));k.put(cyl(.5,.5,.08,16),'woodD',V(x,1.62,-2.6));k.put(rb(.5,.32,.12,.12),'iron',V(x,.85,-2.04),null,null,'#2b2b30')});
  for(let r=0;r<3;r++)for(let i=0;i<4-r;i++)k.put(cyl(.13,.13,1,8).rotateZ(Math.PI/2),'woodD',V(2.35,.15+r*.24,-1.2+i*.27+r*.13),null,null,i%2?'#fff':'#e8c8a8');
  k.put(cyl(.16,.12,.14,12),'cloth',V(-.3,.74,1.3),null,null,'#ffd8a8');k.put(cyl(.06,.06,.3,10),'cloth',V(.35,.83,1.5),null,null,'#ffffff');k.put(cyl(.065,.065,.06,10),'pot',V(.35,1,1.5),null,null,'#f4a6b5');k.put(rb(.5,.06,.36,.03),'cloth',V(.1,.69,1.0),null,null,'#dbe8f4');
  k.put(cyl(1,1,.1,24),'wood',V(0,.62,1.4));[[-.6,.6],[.6,.6],[-.6,2.2],[.6,2.2]].forEach(([x,z])=>k.put(cyl(.06,.06,.55,6),'woodD',V(x,.3,z)));
  jar(k,-2.8,.2,1);jar(k,-2.2,-.6,.8);jar(k,-3.2,-.9,.7);flowers(k,3,1.6,10,.8);g.add(k.build());
  [-.8,.8].forEach((x,i)=>{const f=new T.Mesh(new T.ConeGeometry(.16,.4,8),new T.MeshBasicMaterial({color:'#ff9a3a'}));f.position.set(x,.92,-1.9);g.add(f);FIRE.push({m:f,base:.45,key:'wood'});const gl=glow('#ff9a3a',1.2);gl.position.set(x,.95,-1.75);g.add(gl);DYN.push(tt=>{gl.material.opacity=.45+Math.min(1,wood()/3)*.5+Math.sin(tt*12+x)*.08})});
  const st=[];[-.8,.8].forEach(x=>{for(let i=0;i<3;i++){const s=new T.Sprite(new T.SpriteMaterial({map:tGlow,color:'#fff',transparent:true,depthWrite:false}));s.userData.t=i/3;s.userData.x=x;g.add(s);st.push(s)}});PL3.madang.steam=st;
  hot(hbox(3.6,1,1.3,0,1,-2.4,g),'agungi','madang',()=>addWood());hot(hbox(2.2,.8,2.2,0,.5,1.4,g),'table','madang',()=>openMeal());hot(hbox(1.8,1,1.6,-2.7,.5,-.4,g),'jars','madang',()=>{document.body.classList.add('v3jang');showComfort()})}
 { // 마을회관
  const h=house({W:5.6,D:3.2,bays:3,door:1,porch:false,roof:'tile'}),g=add('hall',{h});g.add(h.g);const k=new Kit();
  k.put(rb(2.6,1.3,.12,.06),'woodD',V(0,h.y0+1,-1.45));[[-.8,.2],[-.2,.35],[.4,.15],[.9,.3],[-.5,-.25],[.2,-.3],[.8,-.2]].forEach(([x,y],i)=>k.put(new T.PlaneGeometry(.42,.48),'paper',V(x,h.y0+1+y,-1.38),E(0,0,srn(-.1,.1)),null,['#fffdf6','#fff1c6','#ffe1e1','#e4f1ff'][i%4]));
  k.put(rb(1.3,.3,.7,.08),'wood',V(-1.6,h.y0+.25,-.6));k.put(rb(.32,.16,.22,.06),'pot',V(-1.6,h.y0+.5,-.6),null,null,'#5b3a2a');
  k.put(rb(.9,.6,.6,.25),'cloth',V(1.8,h.y0+.4,-.8),null,null,'#f4b8a6');k.put(rb(.4,.18,.62,.05),'cloth',V(1.8,h.y0+.72,-.8),null,null,'#f7d27a');
  k.put(rb(1.6,1.1,.12,.06),'woodD',V(-2.4,1.2,2.6));k.put(cyl(.06,.06,1.2,6),'woodD',V(-2.9,.6,2.6));k.put(cyl(.06,.06,1.2,6),'woodD',V(-1.9,.6,2.6));k.put(new T.PlaneGeometry(.5,.55),'paper',V(-2.6,1.25,2.67));k.put(new T.PlaneGeometry(.5,.55),'paper',V(-2.05,1.2,2.67),null,null,'#fff1c6');
  g.add(k.build());try{const npc=makeAv({kind:'work',ex:{},hair:'#2b2118',carrier:0});npc.root.scale.setScalar(1.25);npc.root.position.set(-1.1,0,2.9);npc.root.rotation.y=.3;const mg=new T.Mesh(new T.CylinderGeometry(.05,.22,.4,12,1,true),M.iron);mg.rotation.x=-1.2;mg.position.set(.35,1.35,.35);npc.root.add(mg);g.add(npc.root);PL3.hall.npc=npc;hot(hbox(1.2,2.4,1.2,-1.1,1.2,2.9,g),'ijang','hall',()=>ijang())}catch(e){}
  hot(hbox(2.8,1.5,.6,0,h.y0+1,-1.3,g),'board','hall',()=>openAide());hot(hbox(1.8,1.4,.6,-2.4,1,2.6,g),'board2','hall',()=>openAide());hot(hbox(1.1,1,1,1.8,h.y0+.5,-.8,g),'bundle','hall',()=>openBag());hot(hbox(1.4,.8,1,-1.6,h.y0+.4,-.6,g),'phone','hall',()=>{aTab='ask';openAide()})}
 { // 구멍가게
  const g=add('store'),h=house({W:4,D:2.6,bays:2,openFront:true,roof:'tile'});g.add(h.g);PL3.store.h=h;const k=new Kit();
  for(let i=0;i<3;i++){k.put(rb(3.4,.08,.6,.03),'wood',V(0,h.y0+.5+i*.48,-1.05));for(let j=0;j<7;j++)k.put(rb(.34,.3,.34,.08),'cloth',V(-1.4+j*.46,h.y0+.7+i*.48,-1.05),null,null,['#f6dbe0','#fff4dc','#dbe8f4','#e2f0d6','#ffd9b0','#e6dcf6','#ffffff'][(i*3+j)%7])}
  [-1.6,-1.05,-.5].forEach((x,i)=>{k.put(cyl(.2,.2,.42,12),'water',V(x,h.y0+.55,.7),null,null,'#e9f6ff');for(let j=0;j<5;j++)k.put(sph(.06,6),'flower',V(x+srn(-.1,.1),h.y0+.42+srn(0,.2),.7+srn(-.1,.1)),null,null,['#f4a6b5','#f7d27a','#c9b4f0','#ffb3a1'][(i+j)%4])});
  k.put(rb(1.2,.6,.6,.08),'woodD',V(-1.1,h.y0+.3,.7));
  for(let i=0;i<8;i++){const a=i/8;k.put(rb(.52,.06,1.2,.02),'cloth',V(-1.82+a*4.16,h.y0+2.05,1.85),E(-.45,0,0),null,i%2?'#e0524a':'#fff8ee')}
  k.put(rb(2,.14,.5,.06),'wood',V(1.2,.62,2.6));[0.4,2].forEach(x=>k.put(cyl(.06,.06,.4,6),'woodD',V(x,.4,2.6)));g.add(k.build());
  hot(hbox(3.6,1.6,.8,0,h.y0+.9,-1,g),'shelf','store',()=>{vTab=1;openVoice()});hot(hbox(1.6,1,.8,-1.1,h.y0+.5,.7,g),'candy','store',()=>{if(giftReady())openGift();else toast('오늘 선물은 이미 받았어 · 내일 또 와')});hot(hbox(2.2,.6,.8,1.2,.5,2.6,g),'bench','store',()=>{vTab=0;openVoice()})}
 { // 정자나무 평상
  const g=add('pyeong'),k=new Kit();tree(k,-2.6,-1.4,2.2,'#ffffff');k.put(cyl(.55,.85,1.4,10),'woodD',V(-2.6,.7,-1.4),null,null,'#a88060');[0,2.1,4.2].forEach(a=>k.put(cyl(.1,.25,1.3,6).rotateZ(1.2),'woodD',V(-2.6+Math.cos(a)*.7,.15,-1.4+Math.sin(a)*.7),E(0,-a,0),null,'#a88060'));k.put(sph(.22,10),'pot',V(-.6,1.2,1.4),null,V(1,.8,1),'#e8e0d4');k.put(cyl(.04,.04,.18,6).rotateZ(1),'pot',V(-.38,1.25,1.4),null,null,'#e8e0d4');k.put(rb(4.6,.22,3.2,.08),'wood',V(.3,.95,1.9));for(let i=0;i<9;i++)k.put(rb(.06,.04,3.1,.02),'woodD',V(-1.7+i*.5,1.07,1.9));
  [[-1.8,.5],[2.4,.5],[-1.8,3.3],[2.4,3.3]].forEach(([x,z])=>k.put(rb(.2,.9,.2,.06),'woodD',V(x,.45,z)));
  k.put(cyl(.8,.9,.7,18),'stone',V(4.3,.35,-1),null,null,'#ece6dc');stones(k,4.3,-1,12,.85,.4);k.put(cyl(.65,.65,.05,16),'water',V(4.3,.62,-1));[3.6,5].forEach(x=>k.put(cyl(.06,.06,1.6,6),'woodD',V(x,1.15,-1)));k.put(cyl(.05,.05,1.5,6).rotateZ(Math.PI/2),'woodD',V(4.3,1.95,-1));
  k.put(new T.SphereGeometry(.6,14,8,0,Math.PI*2,Math.PI/2,Math.PI/2),'wood',V(1.6,1.45,1.2),null,V(1,.55,1),'#e8c08a');for(let i=0;i<7;i++)k.put(sph(.17,8),'pot',V(1.6+srn(-.3,.3),1.42,1.2+srn(-.3,.3)),E(0,sr()*3,0),V(1.5,.8,.8),'#9a4a6a');
  flowers(k,-4,2.5,12,1);g.add(k.build());
  const bk=new T.Mesh(cyl(.18,.14,.26,10),M.wood);bk.position.set(4.3,1.6,-1);g.add(bk);PL3.pyeong.bucket=bk;
  hot(hbox(4.8,.6,3.4,.3,1,1.9,g),'pyeong','pyeong',()=>sit());hot(hbox(2,2.2,2,4.3,1,-1,g),'well','pyeong',()=>drawWater());PL3.pyeong.shoes=[];for(let i=0;i<8;i++){const s=new T.Group();[-.1,.1].forEach(o=>{const m=new T.Mesh(sph(.12,10),M.cloth);m.scale.set(.7,.45,1.5);m.position.set(o,.08,0);s.add(m)});s.position.set(-1.6+i*.55,0,3.75);s.rotation.y=srn(-.3,.3);g.add(s);PL3.pyeong.shoes.push(s)}
  hot(hbox(1.4,.8,1.4,1.6,1.4,1.2,g),'goguma','pyeong',()=>{try{roomSd()}catch(e){}})}
 { // 장독대 언덕
  const g=add('jangdok'),k=new Kit();k.put(rb(4.4,.4,2.4,.18),'stone',V(.6,.2,-.6),null,null,'#ece4d8');[[-.9,-1,1.1],[.1,-1.1,1.25],[1.2,-1,1],[2.1,-.9,.8],[-.5,-.1,.8],[.6,-.1,.9],[1.6,-.1,.7],[2.5,-.2,.6],[-1.3,-.2,.6],[3,-1,.9]].forEach(([x,z,s])=>jar(k,x,z,s,.4));
  k.put(rb(1.6,.12,.5,.06),'wood',V(-2.6,.62,1));[-3.2,-2].forEach(x=>k.put(cyl(.06,.06,.55,6),'woodD',V(x,.3,1)));flowers(k,2.8,1.4,10,.8);g.add(k.build());
  hot(hbox(4.4,1.4,2.4,.6,.9,-.6,g),'jangdok','jangdok',()=>openJar());hot(hbox(1.8,.8,.8,-2.6,.6,1,g),'bench','jangdok',()=>sit())}
 { // 우체통 + 확성기 전봇대
  const g=add('post'),k=new Kit();k.put(cyl(.32,.32,1,16),'red',V(0,.7,0));k.put(sph(.32,16),'red',V(0,1.2,0),null,V(1,.6,1));k.put(rb(.4,.06,.1,.02),'iron',V(0,1.05,.3),null,null,'#3a2a22');k.put(cyl(.1,.12,.2,8),'stone',V(0,.1,0));
  k.put(cyl(.09,.11,4.2,8),'woodD',V(1.4,2.1,-.3));k.put(rb(.8,.08,.08,.03),'woodD',V(1.4,3.8,-.3));k.put(cyl(.06,.28,.45,12).rotateX(-Math.PI/2.4),'iron',V(1.4,3.6,.0),null,null,'#c9ced6');k.put(cyl(.06,.28,.45,12).rotateZ(Math.PI/2.4),'iron',V(1.75,3.55,-.3),null,null,'#c9ced6');g.add(k.build());
  hot(hbox(.9,1.6,.9,0,.8,0,g),'post','map',()=>vPost());hot(hbox(1,4.4,1,1.4,2.2,-.3,g),'speaker','map',()=>{vTab=0;openVoice()})}
 /* 장소 큰 터치 영역(지도용) */
 for(const k in P){if(k==='post')continue;const t=hbox(k==='pyeong'?9:7.5,4,7.5,0,1.5,0,PL3[k].g);t.userData.hot={key:'go',place:'map',fn:()=>go(k)};HOT.push(t)}
 /* 하늘 별(장독대 위)·반딧불 */
 for(let i=0;i<60;i++){const s=glow('#fff3c4',srn(.25,.5));s.position.set(-2+srn(-5,5),srn(5,9),-16+srn(-3,3));s.userData.p=sr()*6;world.add(s);STAR.push(s)}
 {const mo=glow('#fff4dc',4);mo.position.set(4,9,-19);world.add(mo);STAR.push(mo);const mc=new T.Mesh(sph(.9,16),new T.MeshBasicMaterial({color:'#fff4dc'}));mc.position.set(4,9,-19.2);world.add(mc);FLY.push(Object.assign(mc,{userData:{moon:1}}))}
 ['home','sarang','hall','store','madang'].forEach(k=>{const p=PL3[k];if(!p)return;const gl=glow('#ffb54a',3.2);gl.position.set(0,1.3,(p.h?p.h.D/2:1.5)+.4);p.g.add(gl);DYN.push(()=>{gl.visible=nightK()>.3;gl.material.opacity=.7*nightK()})});
 for(let i=0;i<24;i++){const s=glow('#d9ff7a',.35);s.userData.c=V(srn(-13,13),srn(.6,2),srn(-17,17));s.userData.p=sr()*9;world.add(s);FLY.push(s)}}
function smoke(g,at,k){for(let i=0;i<5;i++){const s=new T.Sprite(new T.SpriteMaterial({map:tGlow,color:'#ffffff',transparent:true,depthWrite:false}));s.userData={t:i/5,at,k};g.add(s);SMOKE.push(s)}}
/* ---------- 빛·시간대 ---------- */
let hemi,sun,rim,lastPh='';const PHC={dawn:{bg:'#1e2238',h:[0x8f9cd8,0x2a3a3a,.5],s:[0x9fb0ff,.3],r:.12},morn:{bg:'#f6e3cf',h:[0xfff2e0,0x8fb46a,.6],s:[0xffd8a8,1.3],r:.35},day:{bg:'#cfe6ee',h:[0xfff4e0,0x8fb46a,.6],s:[0xffe6c0,1.35],r:.35},dusk:{bg:'#f0c2a8',h:[0xffd6b8,0xb08878,.8],s:[0xffa070,.9],r:.5}};
const nightK=()=>(window.__phase||phaseNow())=='dawn'?1:(window.__phase||phaseNow())=='dusk'?.4:0;
function sky(){const k=window.__phase||phaseNow(),p=PHC[k];S3.background=new T.Color(p.bg);hemi.color.setHex(p.h[0]);hemi.groundColor.setHex(p.h[1]);hemi.intensity=p.h[2];sun.color.setHex(p.s[0]);sun.intensity=p.s[1];rim.intensity=p.r;
 const n=nightK();M.hanji.emissiveIntensity=n*.9;STAR.forEach((s,i)=>s.visible=n>.9&&i<Math.min(60,10+(typeof DAWN_PATS!='undefined'?DAWN_PATS:0)));FLY.forEach(s=>s.visible=n>.3);R3.shadowMap.needsUpdate=true}
/* ---------- 엄마들 ---------- */
const hash=s=>{let h=0;for(const c of String(s))h=(h*31+c.charCodeAt(0))|0;return Math.abs(h)};
function spotFor(id,pl){const L=SPOTS[pl]||SPOTS.vil,b=P[pl]||V(0,0,0),h=hash(id),s=L[h%L.length].clone();s.x+=((h>>4)%7-3)*.18;s.z+=((h>>8)%5-2)*.18;const w=b.clone().add(s);if(pl==='vil'||!P[pl]){const q=PATH[1+(h>>3)%5].clone();q.x+=((h>>5)%5-2)*.5;return q}return w}
function plOf3(st){const p=st&&st.ex&&st.ex.pl;return p==='room'?'home':(p&&P[p])?p:'vil'}
function ensureAv(id,st,isMe){let o=avs[id];const sig=(st.kind||'')+'|'+avSig(st);if(o&&o.sig!==sig){world.remove(o.a.root);o=null}
 if(!o){let a;try{a=makeAv(st)}catch(e){return null}a.root.scale.setScalar(1.25);const bl=new T.Mesh(new T.CircleGeometry(.4,16),new T.MeshBasicMaterial({color:0x2b2118,transparent:true,opacity:.2,depthWrite:false}));bl.rotation.x=-Math.PI/2;bl.position.y=.03;a.root.add(bl);
  const sp=spotFor(id,plOf3(st));a.root.position.copy(sp);world.add(a.root);o=avs[id]={a,sig,id,me:isMe,pos:sp.clone(),route:[],pl:plOf3(st)};a.root.traverse(m=>{if(m.isMesh)m.userData.av=id})}
 o.st=st;o.seen=1;return o}
function routeTo(o,pl,target){const from=o.pos.clone(),to=target||spotFor(o.id,pl);o.route=[];if(from.distanceTo(to)>3.5){const near=v=>{let bi=0,bd=1e9;PATH.forEach((p,i)=>{const d=p.distanceTo(v);if(d<bd){bd=d;bi=i}});return bi};let a=near(from),b=near(to);const st=a<b?1:-1;for(let i=a;i!==b;i+=st)o.route.push(PATH[i].clone());o.route.push(PATH[b].clone())}o.route.push(to);o.pl=pl}
function sync(){if(!world)return;Object.values(avs).forEach(o=>o.seen=0);
 others().filter(p=>p.state&&p.state.room===me.room&&p.state.kind).slice(0,24).forEach(p=>{const id=p.state.id||p.id,o=ensureAv(id,p.state,false);if(o){const pl=plOf3(p.state);if(pl!==o.pl)routeTo(o,pl)}});
 const mo=ensureAv(myId,meState(),true);if(mo){const pl=on&&mode!=='map'&&cur?cur:'vil';if(pl!==mo.pl&&!mo.route.length)routeTo(mo,pl)}
 Object.values(avs).forEach(o=>{if(!o.seen){world.remove(o.a.root);delete avs[o.id]}});labels()}
/* ---------- 상호작용 ---------- */
function ijang(){const due=(()=>{try{return LS.get('cp_due','')}catch(e){return''}})();burst(PL3.hall.g.position.clone().add(V(-1.1,3.4,2.9)),'📢 이장입니다~');setTimeout(()=>{openAide()},700)}
function soundMenu(){openSheet('사랑방 라디오');sb.innerHTML='<div class="box"><div class="t">뭐 틀어줄까</div><div class="vhg"><button data-s="wn"><span>🌧</span><b>백색소음</b><small>빗소리·쉬~</small></button><button data-s="lul"><span>🎵</span><b>자장가</b><small>오르골</small></button></div></div>';sb.querySelectorAll('[data-s]').forEach(b=>b.onclick=()=>{closeSheet();plAct(b.dataset.s)})}
const wood=()=>{const w=LS.get('cp_wood',{d:'',n:0});return w.d===ymd(new Date())?w.n:0};
function addWood(){const n=wood()+1;LS.set('cp_wood',{d:ymd(new Date()),n});burst(PL3.madang.g.position.clone().add(V(0,1.2,-2)),'🔥 장작 하나 쏙');{const c=$('woodc');if(c)c.innerHTML='<b>🔥 장작 '+Math.min(3,n)+'/3</b><i>'+(n>=3?'가마솥 밥 다 됐다':'3개면 가마솥 밥')+'</i>'}toast(n>=3?'가마솥 밥 다 됐다! 오늘 '+n+'끼 기록':'장작 '+n+'개 · 3개 모이면 가마솥 밥이 지어져');setTimeout(()=>openMeal(),600)}
function drawWater(){const b=PL3.pyeong.bucket;let t=0;const id=setInterval(()=>{t+=.05;b.position.y=1.6-Math.sin(Math.min(1,t)*Math.PI)*.9;if(t>=1){clearInterval(id);toast('두레박 물 길었다 · 아기 씻기러 가자');setTimeout(()=>{try{openBath()}catch(e){}},400)}},30)}
function openJar(){burst(PL3.jangdok.g.position.clone().add(V(.6,2,-.6)),'뚜껑 열었다');setTimeout(()=>{document.body.classList.add('v3jang');showComfort()},400)}
function sit(){const mo=avs[myId];if(!mo)return;const t=cur==='pyeong'?PL3.pyeong.g.position.clone().add(V(srn(-1.4,2),1.07,srn(1.2,2.6))):PL3.jangdok.g.position.clone().add(V(-2.6,.68,1));routeTo(mo,cur,t);mo.sitAfter=true;toast(cur==='pyeong'?'평상에 걸터앉았어 · 고구마 바구니 누르면 다 같이 쓰담':'장독대 벤치에 앉았어')}
function burst(at,txt){const e=document.createElement('div');e.className='v3fx';e.textContent=txt;app.appendChild(e);const v=at.clone().project(C3);e.style.left=((v.x+1)/2*innerWidth)+'px';e.style.top=((1-v.y)/2*app.clientHeight)+'px';setTimeout(()=>e.remove(),1500)}
/* ---------- 카메라 ---------- */
const camT=V(0,0,0),camO=V(0,44,36),camTT=V(0,0,0),camOO=V(0,44,36);let pan=V(0,0,0),fitK=1;
function setView(k){const v=VIEW[k]||VIEW.map;camTT.copy(v.t);camOO.copy(k==='map'?VDIR:PDIR).multiplyScalar(dist(v.w));if(k==='map')camTT.z-=2.5}
function go(k){if(!on)show();cur=k;mode='walk';pan.set(0,0,0);setPl(k);const mo=avs[myId];if(mo){routeTo(mo,k);mo.sitAfter=false}
 camTT.copy(P[k]).add(V(0,1,0));camOO.copy(VDIR).multiplyScalar(dist(18));hideLabels(true);
 const wait=window.__snap?50:mo?Math.min(1800,300+mo.route.reduce((s,p,i,a)=>s+(i?p.distanceTo(a[i-1]):p.distanceTo(mo.pos)),0)/14*1000):300;setTimeout(()=>{if(cur===k&&mode==='walk')enter(k)},wait)}
function enter(k){mode='place';setView(k);const tp=PL3[k]&&PL3[k].g.position;Object.entries(PL3).forEach(([kk,p])=>{if(p.g&&tp)p.g.visible=kk===k||!(p.g.position.z>tp.z+2&&Math.abs(p.g.position.x-tp.x)<7.5)});Object.entries(PL3).forEach(([kk,p])=>{if(p.h){p.fade=kk===k?0:1}});placeUI(k);
 const tip={home:'선반·책상·빨랫줄·문을 눌러봐',sarang:'온돌 바닥을 누르면 수유 시작 · 요람·라디오도 돼',madang:'아궁이에 장작을 넣으면 식판 기록',hall:'게시판에 우리 집 공고가 붙어 있어',store:'사탕 단지에 오늘의 선물',pyeong:'평상에 앉고 · 우물에서 물 긷기',jangdok:'장독 뚜껑을 열면 숙성된 위로 한 줄'}[k];if(tip)toast(tip)}
function back(){mode='map';document.body.classList.remove('v3jang');Object.values(PL3).forEach(p=>{if(p.g)p.g.visible=true});cur=null;setPl('vil');setView('map');Object.values(PL3).forEach(p=>{if(p.h)p.fade=1});const u=$('plui');if(u)u.remove();hideLabels(false);const mo=avs[myId];if(mo)routeTo(mo,'vil')}
function placeUI(k){let u=$('plui');if(u)u.remove();u=document.createElement('div');u.id='plui';app.appendChild(u);const P2=(typeof PLACES!='undefined'&&PLACES[k])||{n:NAMES[k],btn:[]};
 u.innerHTML='<div class="pt"><button id="plback">‹ 마을</button><span class="pn"><b>'+NAMES[k]+'</b><i id="plcnt"></i></span></div><div class="pb">'+(P2.btn||[]).filter(b=>b[0]!=='room'||k==='home'||k==='sarang').map(b=>'<button data-a="'+b[0]+'">'+b[1]+'</button>').join('')+'</div>';
 $('plback').onclick=back;if(k==='madang'){const c=document.createElement('span');c.className='pn';c.id='woodc';c.innerHTML='<b>🔥 장작 '+Math.min(3,wood())+'/3</b><i>3개면 가마솥 밥</i>';u.querySelector('.pt').appendChild(c)}u.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>plAct(b.dataset.a,b));document.body.classList.add('pl');try{plCnt();plFeedLbl()}catch(e){}}
/* ---------- 장소 안 엄마 이름표 ---------- */
const CH={};function chips(){const box=$('v3l');if(!box)return;const show=mode==='place';const seen={};Object.values(avs).forEach(o=>{if(!show||o.pl!==cur)return;seen[o.id]=1;let e=CH[o.id];if(!e){e=document.createElement('div');e.className='v3chip';box.appendChild(e);CH[o.id]=e}
 const st=o.st||{},ic=st.st=='feed'||st.st=='bottle'?'🍼 ':st.st=='dunga'?'💤 ':st.st=='yukte'?'🍺 ':'';e.textContent=o.me?'나':ic+(st.nick||'엄마');e.classList.toggle('me',!!o.me);const p=o.pos.clone().add(V(0,2.7,0)).project(C3);e.style.left=((p.x+1)/2*innerWidth)+'px';e.style.top=((1-p.y)/2*app.clientHeight)+'px';e.style.display=''});
 for(const id in CH)if(!seen[id]){CH[id].style.display='none';if(!avs[id]){CH[id].remove();delete CH[id]}}}
/* ---------- 지도 아래 엄지 버튼 ---------- */
function quick(){let q=$('v3q');if(!q){q=document.createElement('div');q.id='v3q';q.innerHTML='<button data-q="feed">🍼<b>수유 시작</b></button><button data-q="meal">🔥<b>장작·식판</b></button><button data-q="sd">♥<b>다 같이 쓰담</b></button>';$('v3').appendChild(q);
 q.querySelectorAll('[data-q]').forEach(b=>b.onclick=()=>({feed:()=>{go('sarang');setTimeout(()=>{if(me.st!='feed')plAct('feed')},2200)},meal:()=>go('madang'),sd:()=>{try{roomSd()}catch(e){}}})[b.dataset.q]())}q.style.display=mode==='map'?'':'none'}
/* ---------- 이름표(지도) ---------- */
function labels(){if(!world)return;const box=$('v3l');if(!box)return;for(const k in P){let e=LBL[k];if(!e){e=document.createElement('button');e.className='vl v3';e.innerHTML='<b>'+NAMES[k]+'</b><i></i>';e.onclick=()=>k==='post'?vPost():go(k);box.appendChild(e);LBL[k]=e}
  const n=k==='post'?0:Object.values(avs).filter(o=>!o.me&&o.pl===k).length+((avs[myId]&&avs[myId].pl===k)?1:0);const nm=k==='post'?(LS.get('cp_mbnew',0)||0):0;e.querySelector('i').textContent=k==='post'?(nm?'새 쓰담 '+nm:''):(n?'엄마 '+n+'명':SUB[k])}}
function hideLabels(h){const b=$('v3l');if(b)b.style.display=h?'none':''}
function placeLabels(){if(mode!=='map')return;for(const k in LBL){const p=P[k].clone().add(V(0,k==='post'?4.6:k==='pyeong'?6.5:5.2,0)).project(C3);const e=LBL[k];e.style.left=((p.x+1)/2*innerWidth)+'px';e.style.top=((1-p.y)/2*app.clientHeight)+'px'}}
/* ---------- 입력 ---------- */
const ray=new T.Raycaster(),mv=new T.Vector2();let down=null,moved=false;
function pick(e){const r=cv.getBoundingClientRect();mv.set((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);ray.setFromCamera(mv,C3)}
function tap(e){pick(e);const avM=[];Object.values(avs).forEach(o=>{if(!o.me)o.a.root.traverse(m=>{if(m.isMesh&&m.geometry.type!=='CircleGeometry')avM.push(m)})});
 const ha=ray.intersectObjects(avM,false)[0];if(ha){const id=ha.object.userData.av;try{sendPat(id)}catch(err){}burst(avs[id].a.root.position.clone().add(V(0,2,0)),'쓰담 ♥');return}
 const list=HOT.filter(m=>{const h=m.userData.hot;return mode==='map'?h.place==='map'||h.key==='go':h.place===cur||h.place==='map'});const hh=ray.intersectObjects(list,false);
 for(const x of hh){const h=x.object.userData.hot;if(mode!=='map'&&h.key==='go')continue;h.fn();return}
 if(mode==='place'){const g=ray.intersectObject(world.children[0],true)[0];if(g&&g.point.distanceTo(P[cur])<6){const mo=avs[myId];if(mo){routeTo(mo,cur,g.point.clone().setY(P[cur].y+(SPOTS[cur][0].y||0)));mo.sitAfter=false}}}}
function bindInput(){cv.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY,pan.clone()];moved=false});
 cv.addEventListener('pointermove',e=>{if(!down)return;const dx=e.clientX-down[0],dy=e.clientY-down[1];if(Math.hypot(dx,dy)>10)moved=true;if(moved&&mode==='map'){const k=dist(31)/innerWidth*.6;pan.set(Math.max(-9,Math.min(9,down[2].x-dx*k)),0,Math.max(-12,Math.min(12,down[2].z-dy*k)))}});
 cv.addEventListener('pointerup',e=>{if(down&&!moved)tap(e);down=null})}
/* ---------- 루프 ---------- */
function frame(){raf=on?requestAnimationFrame(frame):0;if(!on)return;const now=performance.now(),dt=Math.min(.05,(now-last)/1000);last=now;const t=now/1000;
 const cl=window.__snap?1:Math.min(1,dt*3.2);camT.lerp(camTT.clone().add(pan),cl);camO.lerp(camOO,cl);C3.position.copy(camT).add(camO);C3.lookAt(camT);
 Object.values(PL3).forEach(p=>{if(!p.h)return;const f=p.fade==null?1:p.fade,cf=p.cf==null?1:p.cf,nf=window.__snap?f:cf+(f-cf)*Math.min(1,dt*5);p.cf=nf;p.h.roof.visible=nf>.05;p.h.roof.position.y=(1-nf)*3;p.h.front.visible=nf>.5});
 Object.values(avs).forEach(o=>{const a=o.a;if(o.route.length){const tg=o.route[0],d=tg.clone().sub(o.pos),L=d.length(),sp=(o.me?7:4.5)*dt;if(L<=sp){o.pos.copy(tg);o.route.shift();if(!o.route.length&&o.sitAfter){a.sit=1}}else{o.pos.addScaledVector(d.normalize(),sp);a.root.rotation.y=Math.atan2(d.x,d.z)}a.sit=0;a.walk=Math.min(1,a.walk+dt*6)}else a.walk=Math.max(0,a.walk-dt*6);
  if(!o.route.length&&o.sitAfter)a.sit=1;a.root.position.copy(o.pos);try{animA(a,dt)}catch(e){}});
 SMOKE.forEach(s=>{const u=s.userData,k=(u.t+t*.13)%1,sc=(.3+k*1.1)*u.k*1.6;s.position.set(u.at.x+Math.sin(k*6+u.t)*.3*k,u.at.y+k*2.4,u.at.z+k*.3);s.scale.set(sc,sc,1);s.material.opacity=(1-k)*.75});
 const w=wood(),fe=me.st=='feed';FIRE.forEach(f=>{const k=f.key==='wood'?.35+Math.min(1,w/3)*.65:fe?1:.5;const s=f.base*k*(1+Math.sin(t*14+f.m.position.x)*.12);f.m.scale.setScalar(s*2.2)});
 if(PL3.madang&&PL3.madang.steam)PL3.madang.steam.forEach(s=>{const u=s.userData,k=(u.t+t*.25)%1,on2=w>=3;s.visible=on2;s.position.set(u.x+Math.sin(k*7)*.15,1.7+k*1.4,-2.6);const sc=.3+k*.7;s.scale.set(sc,sc,1);s.material.opacity=(1-k)*.8});
 if(PL3.sarang&&PL3.sarang.floor){const g=Math.min(1,(typeof DAWN_PATS!='undefined'?DAWN_PATS:0)/40)*.35+(fe?.35:0)+.08*nightK();PL3.sarang.floor.material.emissiveIntensity=g*(.85+Math.sin(t*2)*.15)}
 STAR.forEach(s=>{if(s.visible&&s.material.map)s.material.opacity=.55+.45*Math.sin(t*2+s.userData.p)});FLY.forEach(s=>{if(!s.visible||s.userData.moon)return;const u=s.userData;s.position.set(u.c.x+Math.sin(t*.6+u.p)*1.2,u.c.y+Math.sin(t*1.3+u.p)*.4,u.c.z+Math.cos(t*.5+u.p)*1.2);s.material.opacity=.4+.6*Math.abs(Math.sin(t*3+u.p))});
 if(PL3.pyeong&&PL3.pyeong.shoes){const n=Object.values(avs).filter(o=>o.pl==='pyeong').length;PL3.pyeong.shoes.forEach((s,i)=>s.visible=i<Math.max(1,n))}
 if(PL3.sarang&&PL3.sarang.lamp)PL3.sarang.lamp.intensity=cur==='sarang'?(.6+nightK()*1.2):0;
 chips();
 DYN.forEach(f=>f(t));{const ph=window.__phase||phaseNow();if(ph!==lastPh){lastPh=ph;sky()}}if(now-lastSync>600){lastSync=now;sync()}placeLabels();quick();comp3.render()}
/* ---------- 시작 ---------- */
function init(){if(R3)return true;try{
 R3=new T.WebGLRenderer({antialias:true,powerPreference:'high-performance'});R3.setPixelRatio(Math.min(2,devicePixelRatio));R3.outputEncoding=T.sRGBEncoding;R3.toneMapping=T.LinearToneMapping;R3.toneMappingExposure=1;R3.shadowMap.enabled=true;R3.shadowMap.type=T.PCFSoftShadowMap;R3.shadowMap.autoUpdate=false;
 cv=R3.domElement;cv.id='v3c';const host=document.createElement('div');host.id='v3';host.innerHTML='<div id="v3l"></div>';host.prepend(cv);app.appendChild(host);
 S3=new T.Scene();C3=new T.PerspectiveCamera(38,1,1,400);hemi=new T.HemisphereLight(0xfff8ee,0xe6d2b0,1);S3.add(hemi);sun=new T.DirectionalLight(0xfff0dc,1.05);sun.position.set(-14,30,18);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.radius=6;sun.shadow.bias=-.0008;sun.shadow.normalBias=.04;
 Object.assign(sun.shadow.camera,{left:-22,right:22,top:26,bottom:-26,near:1,far:90});S3.add(sun);rim=new T.DirectionalLight(0xffe2c4,.45);rim.position.set(14,8,-14);S3.add(rim);
 build();comp3=new T.EffectComposer(R3);comp3.addPass(new T.RenderPass(S3,C3));const hT=new T.ShaderPass(T.HorizontalTiltShiftShader),vT=new T.ShaderPass(T.VerticalTiltShiftShader);hT.uniforms.r.value=vT.uniforms.r.value=.52;comp3.addPass(hT);comp3.addPass(vT);const vg=new T.ShaderPass(T.VignetteShader);vg.uniforms.offset.value=.95;vg.uniforms.darkness.value=.42;comp3.addPass(vg);
 const rs=()=>{const w=app.clientWidth,h=app.clientHeight;R3.setSize(w,h);comp3.setSize(w,h);C3.aspect=w/h;C3.updateProjectionMatrix();hT.uniforms.h.value=1.1/w;vT.uniforms.v.value=1.1/h;fitK=Math.max(1,.62/C3.aspect*.82);if(mode==='map')setView('map')};rs();addEventListener('resize',rs);
 bindInput();sky();setInterval(sky,30000);return true}catch(e){console.warn('v3d',e);ok=false;return false}}
function show(){if(!init())return false;on=true;window.__v3on=1;document.body.classList.add('v3on');document.body.classList.add('vil');if(!raf){last=performance.now();raf=requestAnimationFrame(frame)}sync();if(mode==='map'){setView('map');hideLabels(false)}R3.shadowMap.needsUpdate=true;
 if(LS.get('cp_bcast','')!==ymd(new Date())){LS.set('cp_bcast',ymd(new Date()));setTimeout(()=>{const n=typeof DAWN_PATS!='undefined'?DAWN_PATS:0;toast('📢 아 아~ 이장입니다. 오늘 새벽 쓰담 '+n+'개, 장독대에 별 '+Math.min(60,10+n)+'개 떴어요')},1800)}return true}
function hide(){on=false;window.__v3on=0;document.body.classList.remove('v3on');const u=$('plui');if(u&&mode!=='map')u.remove();mode='map';cur=null}
return{ok:()=>ok,show,hide,go:k=>{show();go(k)},map:()=>{show();back()},sync,isOn:()=>on,_:{avs,P,PL3,setView,enter}}})();
window.V3D=V3D;

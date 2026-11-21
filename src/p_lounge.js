/* 빛 */
const HEMI=new T.HemisphereLight(0xb7c0ff,0x4a3326,.38);S.add(HEMI);
const moon=new T.DirectionalLight(0x9fb0ff,.55);moon.position.set(-6,8,-2);moon.castShadow=true;moon.shadow.mapSize.set(2048,2048);moon.shadow.bias=-.0004;moon.shadow.normalBias=.02;Object.assign(moon.shadow.camera,{left:-12,right:12,top:12,bottom:-12});S.add(moon);
const warm=(x,y,z,i,d,ns)=>{const L=new T.PointLight(0xffb86a,i,d,1.6);L.position.set(x,y,z);L.castShadow=!ns;L.shadow.mapSize.set(512,512);S.add(L)};
warm(3.2,2.2,-2,1.6,9);warm(-3,1.8,1.5,.9,7);warm(6.2,2.4,-5.6,1.1,6,1);warm(-7,2.2,-5.6,1.1,6,1);warm(-6,2,3,.8,8,1);warm(6,2,4,.8,8,1);
/* 방: 둥근 모서리 섬 */
const RW=18,RD=14;
const fl=box(RW,.4,RD,new T.MeshStandardMaterial({map:ctex(1024,1024,(g,w,h)=>{
  const base=['#d6a473','#cf9b68','#dcae80','#c9925c','#d4a06d','#e0b487'];let seed=7;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
  const ph=64;for(let r=0;r<h/ph;r++){let x=-Math.floor(rnd()*300);while(x<w){const L=260+rnd()*360;g.fillStyle=base[Math.floor(rnd()*base.length)];g.fillRect(x,r*ph,L,ph);
    for(let k=0;k<9;k++){g.strokeStyle='rgba(110,65,30,'+(.05+rnd()*.09)+')';g.lineWidth=1+rnd()*1.5;g.beginPath();const y0=r*ph+4+rnd()*(ph-8);g.moveTo(x,y0);g.bezierCurveTo(x+L*.3,y0+(rnd()-.5)*8,x+L*.7,y0+(rnd()-.5)*8,x+L,y0+(rnd()-.5)*6);g.stroke()}
    if(rnd()<.25){g.fillStyle='rgba(95,55,25,.18)';g.beginPath();g.ellipse(x+L*rnd(),r*ph+ph/2,6,3,0,0,7);g.fill()}
    g.fillStyle='rgba(70,40,18,.35)';g.fillRect(x,r*ph,2,ph);x+=L}
    g.fillStyle='rgba(70,40,18,.32)';g.fillRect(0,r*ph,w,2);g.fillStyle='rgba(255,240,215,.12)';g.fillRect(0,r*ph+2,w,1)}
 },3,2.4),roughness:.55,metalness:0}),0,-.2,0);S.add(fl);
const wm=new T.MeshStandardMaterial({map:ctex(256,256,(g,w,h)=>{g.fillStyle='#f3e6d6';g.fillRect(0,0,w,h);for(let x=0;x<w;x+=32){g.fillStyle='#ead9c4';g.fillRect(x,0,14,h)}for(let i=0;i<40;i++){g.fillStyle='#f6c7b4';g.beginPath();g.arc(Math.random()*w,Math.random()*h,3,0,7);g.fill()}},3,1),roughness:.95});
S.add(mesh(new T.BoxGeometry(RW,3.2,.25),wm,0,1.6,-RD/2-.12));S.add(mesh(new T.BoxGeometry(.25,3.2,RD),wm,-RW/2-.12,1.6,0));
S.add(box(RW,.14,.06,'#e7d5bf',0,.07,-RD/2+.02));
/* 창문 + 달 */
var WSKY=new T.MeshBasicMaterial({color:'#2b3470'}),WSTARS=[],WMOON,WMG,WSUN,WHILL;
{const g=new T.Group();g.add(mesh(new T.PlaneGeometry(2.6,1.7),WSKY,0,0,0,0));
 WHILL=new T.Mesh(new T.CircleGeometry(1.1,32,0,Math.PI),new T.MeshBasicMaterial({color:'#b8c9af'}));WHILL.position.set(-.5,-.85,.008);WHILL.scale.set(1.4,.42,1);g.add(WHILL);{const h2=new T.Mesh(new T.CircleGeometry(1,32,0,Math.PI),new T.MeshBasicMaterial({color:'#a3b99a'}));h2.position.set(.8,-.85,.009);h2.scale.set(1.1,.3,1);WHILL.userData.h2=h2;g.add(h2)}
 for(let i=0;i<60;i++){const st=new T.Mesh(new T.CircleGeometry(.014+Math.random()*.014,6),new T.MeshBasicMaterial({color:'#fff',transparent:true}));st.position.set((Math.random()-.5)*2.4,(Math.random()-.2)*1.2,.01);st.userData.tw=Math.random()*6;g.add(st);WSTARS.push(st)}
 const mo=new T.Mesh(new T.CircleGeometry(.28,32),new T.MeshBasicMaterial({color:'#fff3c4'}));mo.position.set(.7,.4,.02);g.add(mo);const mg=GL('rgba(255,240,180,.6)',1.6);mg.position.set(.7,.4,.05);g.add(mg);WMOON=mo;WMG=mg;
 WSUN=new T.Mesh(new T.CircleGeometry(.24,32),new T.MeshBasicMaterial({color:'#ffd27a'}));WSUN.position.set(-.6,.35,.02);g.add(WSUN);
 [[0,.86,2.75,.1],[0,-.86,2.75,.1],[-1.33,0,.1,1.8],[1.33,0,.1,1.8],[0,0,.08,1.7]].forEach(([x,y,w,h])=>g.add(box(w,h,.08,'#fffaf0',x,y,.03)));
 g.add(box(2.9,.08,.25,'#fffaf0',0,-.95,.1));
 for(const x of[-1.65,1.65])g.add(box(.45,2.3,.08,'#c9a6e0',x,-.15,.12));
 g.position.set(.6,1.75,-RD/2+.02);S.add(g)}
/* 액자·선반 */
{const t=ctex(256,200,(g,w,h)=>{g.fillStyle='#fff';g.fillRect(0,0,w,h);g.fillStyle='#FFD43B';g.beginPath();g.arc(128,80,46,0,7);g.fill();g.fillStyle='#2B2118';g.font='bold 30px sans-serif';g.textAlign='center';g.fillText('같이 키워요',128,170)});
 const p=mesh(new T.PlaneGeometry(1.1,.86),new T.MeshStandardMaterial({map:t}),-3.1,2,-RD/2+.03,0);S.add(box(1.18,.94,.04,'#fffaf0',-3.1,2,-RD/2+.01));S.add(p)}
S.add(box(1.8,.08,.35,'#c98b5a',-3.1,1.2,-RD/2+.2));for(let i=0;i<6;i++)S.add(box(.18,.3+((i*7)%3)*.05,.22,['#E5484D','#33407A','#2E9D5B','#FFD43B','#f6a7b8','#9fd3ff'][i],-3.8+i*.25,1.4,-RD/2+.2));
/* 러그 */
{const rg=new T.Mesh(new T.CircleGeometry(2.6,48),new T.MeshStandardMaterial({map:ctex(256,256,(g)=>{['#f6c7b4','#fbe2d6','#f6c7b4','#fff3ea'].forEach((c,i)=>{g.fillStyle=c;g.beginPath();g.arc(128,128,128-i*28,0,7);g.fill()})}),roughness:1}));rg.rotation.x=-Math.PI/2;rg.position.set(.4,.01,.6);rg.receiveShadow=true;S.add(rg)}
/* 흔들의자 */
function rocker(x,z,ry,col){const g=G(box(.9,.12,.8,col,0,.5,0),box(.9,.85,.12,col,0,.92,-.36),box(.1,.35,.75,col,-.45,.68,0),box(.1,.35,.75,col,.45,.68,0),box(.75,.1,.6,'#fff3ea',0,.6,.05));
 for(const sx of[-.42,.42]){const rk=mesh(new T.TorusGeometry(.6,.04,8,24,1.6),'#9a6a46',sx,.6,0);rk.rotation.set(0,Math.PI/2,Math.PI*1.25);g.add(rk)}
 g.position.set(x,0,z);g.rotation.y=ry;S.add(g);return g}
const chairs=[rocker(-2.6,-1.6,.5,'#c98b5a'),rocker(2.4,-1.7,-.5,'#b07f50'),rocker(-3.2,1.6,1.3,'#c98b5a')];
/* 수유 쿠션·빈백 */
S.add(sph(.55,'#9fd3ff',3.4,.35,1.4,1,.6,1));S.add(sph(.5,'#ffe28a',1.4,.3,2.6,1.1,.55,1));
/* 아기침대 */
{const g=new T.Group();g.add(box(1.3,.1,.75,'#f6f1e7',0,.45,0));g.add(box(1.2,.12,.65,'#dfeaf5',0,.53,0));for(let i=0;i<12;i++){g.add(cyl(.018,.018,.5,'#f0e4d4',-.6+i*.109,.72,-.36,6));g.add(cyl(.018,.018,.5,'#f0e4d4',-.6+i*.109,.72,.36,6))}
 g.add(box(1.32,.05,.05,'#f0e4d4',0,.97,-.36));g.add(box(1.32,.05,.05,'#f0e4d4',0,.97,.36));g.add(box(.05,1,.75,'#f0e4d4',-.64,.5,0));g.add(box(.05,1,.75,'#f0e4d4',.64,.5,0));
 const bb=G(sph(.13,'#fbfaf6',0,0,0,1,.75,1.5),sph(.075,'#ffdcc2',0,.04,.17));bb.position.set(0,.66,0);bb.rotation.y=Math.PI/2;g.add(bb);
 const mob=G(cyl(.01,.01,.5,'#999',0,1.4,0,4),sph(.06,'#FFD43B',-.15,1.15,0),sph(.06,'#f6a7b8',.15,1.15,0),sph(.06,'#9fd3ff',0,1.15,.15));g.add(mob);g.position.set(4,0,-2.9);g.rotation.y=-.3;S.add(g)}
/* 스탠드 */
S.add(cyl(.15,.18,.03,'#3a3330',4.2,.015,-1));S.add(cyl(.015,.015,1.6,'#3a3330',4.2,.8,-1));S.add(cyl(.16,.25,.3,'#f3e3c4',4.2,1.65,-1,20,{emissive:'#ffcf8a',emissiveIntensity:1}));{const gl=GL('rgba(255,200,120,.6)',2.2);gl.position.set(4.2,1.65,-1);S.add(gl)}
/* 화분 */
{const g=G(cyl(.22,.17,.4,'#c98e6b',0,.2,0));for(let i=0;i<8;i++){const l=sph(.16,i%2?'#4f9a55':'#3f8a4c',Math.cos(i)*.15,.6+Math.random()*.3,Math.sin(i*1.7)*.15,1,1.6,.6);g.add(l)}g.position.set(-4.4,0,-3.3);S.add(g)}

/* ===== 넓어진 방: 모유수유실 · 분유존 · 앉는 자리 ===== */
const XBLOCK=[],SEATS=[],SEATHIT=[],BOOTHS=[],FEEDSEATS=[],KET={steam:[],t:0,y:1.35,glow:null};
const seatHit=(x,z,w,d,y)=>{const m=new T.Mesh(new T.BoxGeometry(w,.9,d),new T.MeshBasicMaterial({visible:false}));m.position.set(x,(y||.4),z);m.userData.seat=SEATS.length-1;S.add(m);SEATHIT.push(m)};
function addSeat(x,z,ry,y,w,d){SEATS.push({x,z,ry,y:y||.3});seatHit(x,z,w||.7,d||.7,y)}
function sign(txt,x,y,z,ry,w){const tx=ctex(512,128,(g,W,H)=>{g.fillStyle='#fffaf0';g.fillRect(0,0,W,H);g.fillStyle='#2B2118';g.font='bold 64px sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,W/2,H/2+4)});
 const p=mesh(new T.PlaneGeometry(w||2.2,(w||2.2)/4),new T.MeshStandardMaterial({map:tx,emissive:'#ffffff',emissiveIntensity:.25}),x,y,z,0);p.rotation.y=ry||0;S.add(p);return p}
/* 모유수유실: 뒷벽 오른쪽, 커튼 달린 독방 3칸 */
{const z0=-RD/2,zf=-RD/2+1.95,xs=[4.6,6.25,7.9];
 for(const px of[3.78,5.43,7.08,8.72]){S.add(box(.08,2.2,1.95,'#f3e3d3',px,1.1,(z0+zf)/2));XBLOCK.push([px-.12,z0,px+.12,zf+.05])}
 S.add(box(4.98,.06,.06,'#c9a27e',6.25,2.2,zf));
 sign('모유수유실',6.25,2.75,z0+.03,0,2.4);
 xs.forEach((bx,i)=>{
  S.add(box(1.5,.02,1.85,'#f7d9df',bx,.02,(z0+zf)/2));
  const ch=G(box(.85,.42,.7,'#e9b6c2',0,.21,0),box(.85,.6,.16,'#e9b6c2',0,.7,-.3),box(.14,.3,.7,'#dca1b0',-.44,.5,0),box(.14,.3,.7,'#dca1b0',.44,.5,0),sph(.16,'#fff3ea',-.25,.55,.05,1.3,.6,1));ch.position.set(bx,0,z0+.75);S.add(ch);
  S.add(cyl(.16,.16,.5,'#c98b5a',bx+.6,.25,z0+.45));S.add(cyl(.05,.05,.2,'#9fd3ff',bx+.6,.6,z0+.45,10));
  const gl=GL('rgba(255,190,200,.5)',1.4);gl.position.set(bx,1.9,z0+.6);S.add(gl);
  const seatI=SEATS.length;addSeat(bx,z0+.8,0,.32,.85,.7);
  const cm=new T.MeshStandardMaterial({color:'#f6b8c8',roughness:1,side:T.DoubleSide});
  const mk=()=>{const g=new T.Group();for(let k=0;k<5;k++){const f=mesh(new T.BoxGeometry(.16,2.05,.03),cm,-.31+k*.155,0,(k%2)*.04);g.add(f)}return g};
  const L=mk(),R=mk(),cg=new T.Group();cg.add(L,R);cg.position.set(bx,1.1,zf+.02);S.add(cg);
  BOOTHS.push({x:bx,L,R,c:0,seat:seatI})})}
/* 분유존: 뒷벽 왼쪽 */
{const z0=-RD/2;S.add(box(3.2,.9,.7,'#f3ead9',-7.05,.45,z0+.38));S.add(box(3.3,.06,.78,'#c98b5a',-7.05,.93,z0+.38));
 S.add(box(.5,.32,.38,'#ffffff',-8.3,1.12,z0+.38));S.add(box(.46,.04,.34,'#9fd3ff',-8.3,1.3,z0+.38));
 KET.g=G(cyl(.15,.17,.3,'#f3f3f3',0,.15,0),cyl(.12,.12,.04,'#bfc5cc',0,.32,0),box(.06,.18,.05,'#555',.18,.18,0),cyl(.025,.035,.16,'#f3f3f3',-.17,.22,0).rotateZ(.9));KET.g.position.set(-7.8,.96,z0+.36);S.add(KET.g);S.add(cyl(.2,.2,.03,'#9aa3ad',-7.55,.675,z0+1.7));
  KET.y=1.35;KET.glow=GL('rgba(255,140,90,.9)',.7);KET.glow.position.set(-7.8,1.05,z0+.42);KET.glow.material.opacity=0;S.add(KET.glow);
 for(let i=0;i<3;i++){const s=new T.Sprite(new T.SpriteMaterial({map:ctex(64,64,(g)=>{const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(255,255,255,.9)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)}),transparent:true,depthWrite:false}));s.scale.set(.35,.35,1);s.position.set(-7.8+(i-1)*.05,1.35,z0+.36);s.visible=false;S.add(s);KET.steam.push(s)}
 [['#9fd3ff',-5.88],['#f6a7b8',-5.61]].forEach(([c,x])=>{S.add(cyl(.11,.11,.24,c,x,1.08,z0+.32));S.add(cyl(.115,.115,.04,'#fff',x,1.22,z0+.32))});
 for(let i=0;i<4;i++){S.add(cyl(.05,.05,.2,'#fffaf0',-7.45+i*.12,1.06,z0+.2,10,{transparent:true,opacity:.85}));S.add(sph(.04,'#f2c48d',-7.45+i*.12,1.2,z0+.2))}
 S.add(box(.45,1.3,.45,'#e9eef5',-8.35,.65,z0+1.25));S.add(box(.2,.1,.05,'#7fb3e8',-8.35,1,z0+1.48));
 S.add(box(1.9,.6,.6,'#f3ead9',-7.0,.3,z0+1.78));S.add(box(2.0,.06,.68,'#c98b5a',-7.0,.63,z0+1.78));S.add(box(1.9,.34,.02,'#ffe28a',-7.0,.3,z0+2.09));
 sign('분유 바',-7.0,.3,z0+2.11,0,.9);
 S.add(cyl(.45,.45,.06,'#c98b5a',-7.9,.75,z0+3.8));S.add(cyl(.05,.05,.72,'#9a6a46',-7.9,.37,z0+3.8));
 sign('분유존',-7.05,2.4,z0+.03,0,1.6);
 XBLOCK.push([-8.75,z0,-5.4,z0+.8],[-8.65,z0+.95,-8.05,z0+1.55],[-8.0,z0+1.46,-6.0,z0+2.12],[-8.4,z0+3.3,-7.4,z0+4.3]);
 for(const a of[0,1.6,3.6]){const x=-7.9+Math.sin(a)*.85,z=z0+3.8+Math.cos(a)*.85;S.add(cyl(.2,.2,.42,'#ffe28a',x,.21,z));addSeat(x,z,Math.atan2(-7.9-x,z0+3.8-z),.28,.5,.5)}}
/* 소파 2개 */
function sofa(x,z,ry,col,n){const g=new T.Group();const w=n*.75+.3;g.add(box(w,.4,.85,col,0,.2,0),box(w,.6,.2,col,0,.7,-.35),box(.18,.55,.85,col,-w/2+.09,.45,0),box(.18,.55,.85,col,w/2-.09,.45,0));
 for(let i=0;i<n;i++)g.add(box(.68,.12,.6,'#fff3ea',-((n-1)*.75)/2+i*.75,.46,.05));g.position.set(x,0,z);g.rotation.y=ry;S.add(g);
 const c=Math.cos(ry),s=Math.sin(ry);for(let i=0;i<n;i++){const lx=-((n-1)*.75)/2+i*.75;addSeat(x+lx*c+.05*s,z-lx*s+.05*c,ry,.33,.68,.7)}
 const hw=w/2,hd=.45,ax=Math.abs(c)*hw+Math.abs(s)*hd,az=Math.abs(s)*hw+Math.abs(c)*hd;XBLOCK.push([x-ax,z-az,x+ax,z+az])}
sofa(-7.6,1.6,Math.PI/2,'#b9a6d9',3);sofa(7.7,3,-Math.PI/2,'#9fc9b8',3);
/* 러그 둘레 푸프 */
[[-1.6,4.6],[.4,5.1],[2.4,4.6],[-1.2,-3.6]].forEach(([x,z],i)=>{const pc=['#f2b26b','#a9c6a0','#f0a8a0','#b9aee0'][i];S.add(cyl(.3,.32,.36,pc,x,.18,z,28,{roughness:.95}));{const c=new T.Mesh(new T.SphereGeometry(.3,28,14,0,Math.PI*2,0,Math.PI/2),M(pc,{roughness:1}));c.scale.y=.35;c.position.set(x,.36,z);c.castShadow=true;S.add(c)}addSeat(x,z,Math.atan2(.4-x,.6-z),.3,.6,.6)});
/* 흔들의자 3개도 앉기 */
[[-2.6,-1.6,.5],[2.4,-1.7,-.5],[-3.2,1.6,1.3]].forEach(([x,z,ry])=>addSeat(x,z,ry,.4,.9,.8));
/* 큰 러그 하나 더 + 화분 */
{const rg=new T.Mesh(new T.CircleGeometry(2.2,40),new T.MeshStandardMaterial({color:'#e8d9f3',roughness:1}));rg.rotation.x=-Math.PI/2;rg.position.set(-6.4,.012,1.6);rg.receiveShadow=true;S.add(rg)}
for(const [x,z] of[[8.4,-4.4],[-8.4,5.8],[8.3,6.1]]){const g=G(cyl(.24,.18,.42,'#c98e6b',0,.21,0));for(let i=0;i<8;i++)g.add(sph(.17,i%2?'#4f9a55':'#3f8a4c',Math.cos(i)*.16,.62+Math.random()*.3,Math.sin(i*1.7)*.16,1,1.6,.6));g.position.set(x,0,z);S.add(g);XBLOCK.push([x-.3,z-.3,x+.3,z+.3])}
/* 같이 일하는 책상: 앉으면 카메라를 보고 일한다 */
const DESKSEATS=[];
{const tz=5.4;S.add(box(3.4,.06,.8,'#c98b5a',5.0,.74,tz));S.add(box(3.3,.7,.7,'#f3ead9',5.0,.36,tz+.03));S.add(box(3.3,.36,.02,'#bfe3ff',5.0,.4,tz+.4));
 sign('같이 일하는 책상',5.0,.42,tz+.42,0,1.0);XBLOCK.push([3.25,tz-.45,6.75,tz+.45]);
 for(const x of[3.9,5.0,6.1]){S.add(box(.5,.05,.5,'#ffe28a',x,.46,tz-.75));S.add(box(.5,.5,.06,'#ffe28a',x,.72,tz-1.0));S.add(cyl(.04,.04,.44,'#9aa3ad',x,.22,tz-.75));
  const lap=G(box(.42,.02,.3,'#d9dde3',0,0,0),box(.42,.28,.02,'#e7ebf0',0,.14,.15));lap.position.set(x,.78,tz-.1);S.add(lap);S.add(sph(.02,'#ffffff',x,.92,tz+.06));
  DESKSEATS.push(SEATS.length);addSeat(x,tz-.75,0,.46,.6,.6);SEATS[SEATS.length-1].back=1}}
function seatApp(s){const k=s.back?-.8:.8;return clampXZ(s.x+Math.sin(s.ry)*k,s.z+Math.cos(s.ry)*k)}
function zoneAt(x,z){if(z<-RD/2+1.9){for(let i=0;i<BOOTHS.length;i++)if(Math.abs(x-BOOTHS[i].x)<.75)return'b'+i}if(x<-5.3&&z<-RD/2+2.6)return'formula';return''}

/* 수유의자 2개 (캠핑의자 느낌 리클라이너) */
function feedChair(x,z,ry){const g=new T.Group(),fr='#5b5f63',fb='#c9b48f';
 for(const sx of[-.38,.38]){g.add(cyl(.025,.025,.95,fr,sx,.42,.1,8).rotateX(.35));g.add(cyl(.025,.025,.9,fr,sx,.42,-.15,8).rotateX(-.4));g.add(box(.05,.05,.7,fr,sx,.66,0))}
 g.add(box(.76,.06,.55,fb,0,.42,.05));const back=box(.76,.75,.06,fb,0,.82,-.32);back.rotation.x=-.32;g.add(back);
 g.add(sph(.18,'#fff3ea',0,1.12,-.42,2,.6,.6));g.add(cyl(.06,.05,.1,'#2b2b2b',.42,.72,.25,10));
 g.add(box(.5,.05,.4,fb,0,.2,.6));
 g.position.set(x,0,z);g.rotation.y=ry;S.add(g);
 FEEDSEATS.push(SEATS.length);addSeat(x,z,ry,.34,.8,.8);XBLOCK.push([x-.45,z-.45,x+.45,z+.45])}
feedChair(-4.5,-5.2,.25);feedChair(-3.1,-5.2,-.15);
sign('수유의자',-3.8,2.78,-RD/2+.03,0,1.3);
/* 유축존: 연보라 러그 위 안락의자 2개 + 유축기 테이블 */
const PUMPSEATS=[];
{const rz=1.35;
 for(const x of[-6.2,-4.8]){const g=G(box(.82,.36,.7,'#f6c7d8',0,.24,0),box(.82,.72,.16,'#f6c7d8',0,.66,-.3),box(.12,.3,.7,'#eeb3c8',-.41,.5,0),box(.12,.3,.7,'#eeb3c8',.41,.5,0),box(.6,.08,.5,'#fff3ea',0,.45,.04));g.position.set(x,0,rz);S.add(g);
  PUMPSEATS.push(SEATS.length);addSeat(x,rz,0,.42,.8,.7);XBLOCK.push([x-.45,rz-.4,x+.45,rz+.3])}
 S.add(cyl(.2,.2,.04,'#c98b5a',-5.5,.56,rz));S.add(cyl(.03,.03,.56,'#9a6a46',-5.5,.28,rz));S.add(box(.18,.13,.15,'#ffffff',-5.5,.645,rz));S.add(sph(.025,'#7fd3a8',-5.5,.68,rz+.08));S.add(cyl(.035,.035,.12,'#eaf4ff',-5.43,.64,rz+.05,10));XBLOCK.push([-5.75,rz-.25,-5.25,rz+.25]);
 S.add(cyl(.025,.025,1.9,'#c9a27e',-5.5,.95,rz-.55));sign('유축존',-5.5,1.95,rz-.53,0,1.1)}

/* 분유 만들기 소품: 캐릭터 손이 직접 스푼·포트를 잡는다 */
const FSPOT=[-7.0,-RD/2+1.12];
const FPROP=(()=>{const z0=-RD/2,bx=-6.75,bz=z0+1.68,by=.66;
 const milk=cyl(.07,.07,.26,'#eaf4ff',0,.13,0,14);const lv=v=>{milk.scale.y=v;milk.position.y=.13*v};lv(.01);
 const wb=G(cyl(.078,.078,.3,'#ffffff',0,.15,0,14,{transparent:true,opacity:.4}),milk,cyl(.082,.082,.05,'#f6a7b8',0,.32,0,14));wb.position.set(bx,by,bz);wb.visible=false;S.add(wb);
 const can=new T.Vector3(-7.1,.94,z0+1.75);S.add(cyl(.11,.11,.24,'#FFD43B',can.x,.78,can.z));S.add(cyl(.115,.115,.03,'#fff',can.x,.91,can.z));
 const sc=G(box(.03,.03,.24,'#ffffff',0,0,.12),sph(.055,'#ffffff',0,0,-.02,1,.6,1),sph(.04,'#fff3d6',0,.02,-.02,1,.5,1));sc.position.copy(can).add(new T.Vector3(0,.05,0));S.add(sc);
 const pw=[];for(let i=0;i<6;i++){const p=sph(.02,'#fff3d6',0,0,0);p.visible=false;S.add(p);pw.push(p)}
 const st=cyl(.016,.016,1,'#bfe3ff',0,0,0,8,{transparent:true,opacity:.85});st.visible=false;S.add(st);
 const kHome=new T.Vector3(-7.55,.66,z0+1.7);KET.g.position.copy(kHome);
 const scHome=sc.position.clone();
 const SH=new T.Vector3(.26,.62,0),tmp=new T.Vector3();
 let ph=null;
 function hand(a,w,reach){a.root.updateMatrixWorld(true);const loc=a.bod.worldToLocal(w.clone()).sub(SH);if(loc.length()>reach)loc.setLength(reach);a.arms[1].position.copy(SH).add(loc);a.root.updateMatrixWorld(true);return a.arms[1].getWorldPosition(tmp).clone()}
 const lerp=(p,q,u)=>p.clone().lerp(q,Math.max(0,Math.min(1,u)));
 return{reset(){ph=null;wb.visible=false;lv(.01);sc.position.copy(scHome);sc.rotation.set(0,0,0);pw.forEach(p=>p.visible=false);st.visible=false;KET.g.position.copy(kHome);KET.g.rotation.set(0,0,0);this.boil(-1)},
  boil(f){const on=f>=0&&f<1;KET.glow.material.opacity=on?.9:0;KET.glow.position.set(KET.g.position.x,KET.g.position.y+.09,KET.g.position.z+.06);KET.steam.forEach((s,i)=>{s.visible=f>=0;if(f>=0){const u=(KET.t+i*.33)%1;s.position.set(KET.g.position.x+(i-1)*.05,KET.g.position.y+.39+u*.6,KET.g.position.z);s.material.opacity=.5*(1-u)}});KET.t+=.016;if(f>=0)wb.visible=true},
  set(k,f){ph=k?{k,f}:null;if(!k){pw.forEach(p=>p.visible=false);st.visible=false}},
  pose(a){if(!ph)return;const f=ph.f;wb.visible=true;
   if(ph.k=='scoop'){const n=Math.min(2,Math.floor(f*3)),u=(f*3)-n;const top=new T.Vector3(bx,by+.42,bz);
    let tgt=u<.3?lerp(scHome.clone().add(new T.Vector3(0,.12,0)),can.clone().add(new T.Vector3(0,.02,0)),u/.3):u<.6?lerp(can.clone().add(new T.Vector3(0,.15,0)),top,(u-.3)/.3):top.clone();
    const h=hand(a,tgt,.8);sc.position.copy(h);sc.rotation.set(0,Math.PI/2,u>.6&&u<.9?-1.3:0);
    pw.forEach((p,i)=>{const on=u>.62&&u<.9;p.visible=on;if(on){const v=(u-.62)/.28;p.position.set(bx+(i%3-1)*.02,by+.4-v*.32-i*.015,bz+(i%2)*.02)}});lv(Math.max(.01,.07*n+.07*Math.min(1,Math.max(0,(u-.62)/.28))))}
   if(ph.k=='pour'){const grab=KET.g.position.clone();const top=new T.Vector3(bx+.18,by+.55,bz);
    if(f<.25){hand(a,lerp(new T.Vector3(FSPOT[0]+.3,.6,FSPOT[1]+.3),kHome.clone().add(new T.Vector3(.12,.25,0)),f/.25),.8)}
    else{const k=lerp(kHome,top,(f-.25)/.25);const h=hand(a,k.clone().add(new T.Vector3(.12,.25,0)),.8);KET.g.position.copy(h).add(new T.Vector3(-.12,-.25,0));KET.g.rotation.z=f>.5?Math.min(.9,(f-.5)*4):0}
    st.visible=f>.55&&f<.92;st.scale.y=.3;st.position.set(bx,by+.48,bz);lv(Math.min(1,.21+Math.max(0,(f-.55)/.37)*.79));milk.material.color.set('#fff6e2')}},
  endPour(){ph=null;st.visible=false;KET.g.position.copy(kHome);KET.g.rotation.set(0,0,0)},
  endScoop(){ph=null;pw.forEach(p=>p.visible=false);sc.position.copy(scHome);sc.rotation.set(0,0,0)},
  hideBottle(){wb.visible=false;lv(.01)}}})();

/* ── 화질 손질 (11/19): 환경광 반사 · 접지 그림자 · 배경 그라데이션 ── */
(function(){try{
 const pm=new T.PMREMGenerator(R);const es=new T.Scene();es.background=new T.Color('#2a2440');
 const add=(c,i,x,y,z,sx,sy,sz)=>{const m=new T.Mesh(new T.BoxGeometry(sx,sy,sz),new T.MeshBasicMaterial({color:new T.Color(c).multiplyScalar(i)}));m.position.set(x,y,z);es.add(m)};
 add('#ffd6a8',1.3,0,7,0,8,.2,8);add('#a9b8ff',1.1,-9,3,0,.2,5,7);add('#ffb878',1.2,9,2.5,2,.2,3,5);add('#c9b49c',.45,0,-1.5,0,24,.1,24);add('#fff0e0',.6,0,3,-9,8,3,.2);
 const env=pm.fromScene(es,.04).texture;S.environment=env;pm.dispose();
 S.traverse(o=>{if(o.isMesh&&o.material&&o.material.isMeshStandardMaterial&&o.material.envMapIntensity===1)o.material.envMapIntensity=.28});
 // 배경: 위는 보랏빛 밤, 아래는 깊은 남색
 S.background=ctex(4,256,(g,w,h)=>{const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#3a2f5c');gr.addColorStop(.55,'#22203f');gr.addColorStop(1,'#0f0e1f');g.fillStyle=gr;g.fillRect(0,0,w,h)});
 S.fog=new T.Fog('#1d1a33',26,48);
 // 접지 그림자: 바닥에 닿은 작은 물건 밑에 부드러운 그림자
 const bt=ctex(128,128,(g,w,h)=>{const gr=g.createRadialGradient(64,64,6,64,64,64);gr.addColorStop(0,'rgba(45,25,12,.42)');gr.addColorStop(.6,'rgba(45,25,12,.16)');gr.addColorStop(1,'rgba(45,25,12,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)});
 const bm=new T.MeshBasicMaterial({map:bt,transparent:true,depthWrite:false,fog:false});const bb=new T.Box3();
 S.children.slice().forEach(o=>{if(!(o.isMesh||o.isGroup)||o===fl)return;bb.setFromObject(o);const sx=bb.max.x-bb.min.x,sz=bb.max.z-bb.min.z,sy=bb.max.y-bb.min.y;
  if(!isFinite(sx)||bb.min.y>.12||bb.min.y<-.05||sx>3.2||sz>3.2||sx<.15||sz<.15||sy<.12)return;
  const p=new T.Mesh(new T.PlaneGeometry(sx*1.55,sz*1.55),bm);p.rotation.x=-Math.PI/2;p.position.set((bb.min.x+bb.max.x)/2,.012,(bb.min.z+bb.max.z)/2);p.renderOrder=1;S.add(p)});
// 방 아래 바닥 받침: 섬이 허공에 뜬 느낌 대신 디오라마처럼
 const gt=ctex(256,256,(g,w,h)=>{const gr=g.createRadialGradient(128,128,10,128,128,128);gr.addColorStop(0,'rgba(120,80,60,.55)');gr.addColorStop(.55,'rgba(70,50,70,.35)');gr.addColorStop(1,'rgba(30,26,55,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)});
 const gp=new T.Mesh(new T.PlaneGeometry(46,40),new T.MeshBasicMaterial({map:gt,transparent:true,depthWrite:false,fog:false}));gp.rotation.x=-Math.PI/2;gp.position.y=-.42;S.add(gp);
}catch(e){console.warn('quality',e)}})();

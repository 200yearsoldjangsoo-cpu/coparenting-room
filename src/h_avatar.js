/* ---------- 엄마 아바타 ---------- */
const SKIN='#ffdcc2';
function avatar(o){o=Object.assign({hair:'#4a3020',top:'#ff8a8a',kind:'preg',bun:1},o);
 const root=new T.Group(),bod=new T.Group();root.add(bod);
 const feet=[sph(.13,'#5a4033',-.14,.11,.05,1,.7,1.35),sph(.13,'#5a4033',.14,.11,.05,1,.7,1.35)];feet.forEach(f=>bod.add(f));
 const body=sph(.33,o.top,0,.52,0,1,1.05,.92);bod.add(body);
 bod.add(sph(.34,o.top,0,.36,0,1.12,.5,1.05));
 let belly=null;if(o.kind=='preg'){belly=sph(.31,o.top,0,.45,.27,1.05,.95,1);bod.add(belly);bod.add(sph(.08,'#ffffff',-.1,.56,.55,1,1,.4,{transparent:true,opacity:.45}))}
 const arms=[sph(.1,o.top,-.34,.58,.02,1,1.5,1),sph(.1,o.top,.34,.58,.02,1,1.5,1)];arms.forEach(a=>bod.add(a));
 const hands=[sph(.08,SKIN,-.36,.4,.08),sph(.08,SKIN,.36,.4,.08)];hands.forEach(a=>bod.add(a));
 const head=new T.Group();head.position.y=1.22;bod.add(head);
 head.add(sph(.44,SKIN,0,0,0,1.02,.96,.96));
 head.add(sph(.465,o.hair,0,.08,-.06,1.03,.92,1));
 head.add(sph(.2,o.hair,-.2,.22,.25,1.2,.6,.6));head.add(sph(.2,o.hair,.22,.24,.24,1.1,.55,.6));
 if(o.bun)head.add(sph(.17,o.hair,0,.48,-.12));
 if(o.long){head.add(sph(.3,o.hair,-.3,-.25,-.1,.7,1.3,.8));head.add(sph(.3,o.hair,.3,-.25,-.1,.7,1.3,.8))}
 if(o.yellow){head.add(sph(.12,'#FFD43B',.28,.36,.1))}
 for(const ex of[-.15,.15]){head.add(sph(.05,'#2B2118',ex,-.02,.4,1,1.25,.5));head.add(sph(.016,'#ffffff',ex+.015,.01,.43));head.add(sph(.06,'#ff9fa6',ex*1.55,-.12,.37,1.2,.6,.4,{transparent:true,opacity:.75}))}
 head.add(sph(.03,'#c25a55',0,-.14,.42,1.4,.6,.5));
 /* 소품 */
 let extra=null;
 if(o.kind=='carrier'){extra=G(sph(.2,'#ffe28a',0,.55,.27,1,1,.7),sph(.16,SKIN,0,.8,.32),sph(.165,'#7a5030',0,.86,.3,1,.7,1),sph(.025,'#2B2118',-.05,.79,.46),sph(.025,'#2B2118',.05,.79,.46));bod.add(extra)}
 if(o.kind=='newborn'){extra=G(sph(.22,'#ffffff',0,.6,.32,1.3,.8,.9),sph(.13,SKIN,.12,.7,.42),sph(.135,'#ffffff',.12,.75,.4,1,.6,1));bod.add(extra);arms[0].position.set(-.22,.6,.3);arms[1].position.set(.22,.6,.3)}
 if(o.kind=='work'){extra=G(box(.32,.24,.1,'#8a5a3c',.42,.35,.05),box(.12,.05,.04,'#5a3a20',.42,.49,.05));bod.add(extra)}
 let cb=(o.kind=='carrier'||o.kind=='newborn')?extra:null;
 let kid=null;if(o.kind=='toddler'){kid=G(sph(.17,'#ffcf8a',0,.3,0,1,1.15,.9),sph(.16,SKIN,0,.56,0),sph(.165,'#7a5030',0,.62,-.02,1,.7,1),sph(.022,'#2B2118',-.05,.55,.15),sph(.022,'#2B2118',.05,.55,.15),cyl(.05,.05,.16,'#5a7fbf',-.07,.08,0,8),cyl(.05,.05,.16,'#5a7fbf',.07,.08,0,8));kid.add(sph(.055,'#ffcf8a',.12,.38,.03,1.9,.8,.8));kid.add(sph(.05,SKIN,.2,.37,.05));kid.position.set(-.64,0,.2);root.add(kid);arms[0].position.set(-.4,.47,.07);arms[0].rotation.z=-.55;hands[0].position.set(-.45,.37,.12)}
 if(o.kind=='work'||o.kind=='home'){const c=o.kind=='work'?'#c9d8f0':'#ffd0dc';cb=G(sph(.19,c,0,.55,.27,1,1,.7),sph(.15,SKIN,0,.79,.32),sph(.155,'#7a5030',0,.85,.3,1,.7,1),sph(.024,'#2B2118',-.05,.78,.45),sph(.024,'#2B2118',.05,.78,.45),box(.05,.3,.04,c,-.17,.72,.18),box(.05,.3,.04,c,.17,.72,.18));bod.add(cb)}
 let stroller=null;if(o.kind=='stroller'){stroller=G(box(.55,.3,.7,'#7fb3e8',0,.55,0),mesh(new T.SphereGeometry(.4,16,10,0,Math.PI*2,0,Math.PI/2),'#5a8fd0',0,.62,-.15),sph(.14,SKIN,0,.8,.1),sph(.145,'#5a4030',0,.85,.08,1,.7,1),cyl(.12,.12,.06,'#2B2118',-.25,.12,.28,12).rotateZ(1.57),cyl(.12,.12,.06,'#2B2118',.25,.12,.28,12).rotateZ(1.57),cyl(.12,.12,.06,'#2B2118',-.25,.12,-.28,12).rotateZ(1.57),cyl(.12,.12,.06,'#2B2118',.25,.12,-.28,12).rotateZ(1.57),box(.5,.04,.04,'#444',0,.95,-.5));stroller.position.z=.75;root.add(stroller);arms[0].position.set(-.24,.6,.28);arms[1].position.set(.24,.6,.28)}
 const milk=cyl(.058,.058,.22,'#fff3d6',0,0,0,12);const bottle=G(cyl(.066,.066,.24,'#9fd3ff',0,0,0,12,{transparent:true,opacity:.55}),milk,cyl(.07,.07,.045,'#ff8fab',0,.13,0,12),sph(.04,'#f2a65a',0,.185,0,1,1.4,1));bottle.visible=false;bottle.position.set(.4,.5,.15);bod.add(bottle);
 const babyF=G(sph(.2,'#ffffff',0,0,0,1.35,.75,.85),sph(.12,SKIN,.18,.07,.06),sph(.125,'#ffffff',.18,.11,.04,1,.6,1),sph(.018,'#2B2118',.25,.08,.15),sph(.018,'#2B2118',.15,.08,.16));babyF.position.set(-.05,.62,.34);babyF.rotation.y=-.2;babyF.visible=false;bod.add(babyF);
 return {root,bod,feet,arms,head,belly,bottle,milk,babyF,cb,kid,shake:0,t:Math.random()*9,walk:0,sit:0,wave:0,o}}
function animA(a,dt){a.t+=dt;const w=a.walk,s=Math.sin(a.t*10);
 a.bod.position.y=a.sit?-.22:Math.abs(s)*.07*w;if(a.kid){if(a.sit){a.kid.position.set(0,.14,.34);a.kid.rotation.y=0;a.kid.scale.setScalar(.82)}else{a.kid.position.set(-.64,Math.abs(Math.sin(a.t*12))*.05*w,.2);a.kid.rotation.z=Math.sin(a.t*12)*.05*w;a.kid.scale.setScalar(1)}}a.bod.rotation.z=s*.06*w;
 a.feet[0].position.z=.05+s*.14*w;a.feet[1].position.z=.05-s*.14*w;
 a.head.rotation.z=Math.sin(a.t*1.3)*.05;a.head.rotation.x=a.sit?.08:0;
 if(a.wave>0){a.wave-=dt;a.arms[1].position.set(.38,.95,.05);a.arms[1].rotation.z=Math.sin(a.t*16)*.5}else if(a.o.kind!='newborn'&&a.o.kind!='stroller'){a.arms[1].position.set(.34,.58,.02);a.arms[1].rotation.z=0;a.arms[0].rotation.x=s*.3*w;a.arms[1].rotation.x=-s*.3*w}}


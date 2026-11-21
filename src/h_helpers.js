/* ---------- 도우미 ---------- */
const MC={};const M=(c,o)=>{const k=c+JSON.stringify(o||{});return MC[k]||(MC[k]=new T.MeshStandardMaterial(Object.assign({color:c,roughness:.85},o||{})))};
function mesh(g,m,x,y,z,sh=1){const o=new T.Mesh(g,typeof m=='string'?M(m):m);o.position.set(x||0,y||0,z||0);o.castShadow=sh;o.receiveShadow=true;return o}
const sph=(r,c,x,y,z,sx=1,sy=1,sz=1,o)=>{const m=mesh(new T.SphereGeometry(r,24,18),o?M(c,o):c,x,y,z);m.scale.set(sx,sy,sz);return m};
const box=(w,h,d,c,x,y,z,o)=>mesh(new T.BoxGeometry(w,h,d),o?M(c,o):c,x,y,z);
const cyl=(a,b,h,c,x,y,z,seg=24,o)=>mesh(new T.CylinderGeometry(a,b,h,seg),o?M(c,o):c,x,y,z);
const G=(...a)=>{const g=new T.Group();a.forEach(x=>g.add(x));return g};
function glow(col,size){const c=document.createElement('canvas');c.width=c.height=64;const g=c.getContext('2d');const gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,col);gr.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=gr;g.fillRect(0,0,64,64);
 const s=new T.Sprite(new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true,depthWrite:false,blending:T.AdditiveBlending}));s.scale.set(size,size,1);return s}


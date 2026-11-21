import os
D=os.path.dirname(os.path.abspath(__file__))
t=open(os.path.join(D,'p_tpl.html')).read()
SB_URL='https://hiqekjtjtycoisjgyrrh.supabase.co'; SB_KEY='sb_publishable_E025XGPHRwWuKHm-Z7DL4A_YARBUw2l'
def rep(a,b):
  global t
  assert a in t, a[:60]
  t=t.replace(a,b)
rep('<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>','<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>\n<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4/dist/umd/supabase.min.js"></script>')
rep("async function loadHome(){if(!DB||!uid)return;try{const d=await DB.doc('homes/'+uid).get();myHome=d&&d.exists!==false?(d.data?d.data():d):null}catch(e){myHome=null}}",
"async function getHome(id){if(!SB||!id)return null;try{const r=await SB.from('homes').select('data').eq('id',id).maybeSingle();return r.data?r.data.data:null}catch(e){return null}}\nasync function putHome(h){if(!SB||!uid)throw 0;h=Object.assign({},h);delete h.kind;const r=await SB.from('homes').upsert({id:uid,data:h,updated_at:new Date().toISOString()});if(r.error)throw r.error}\nasync function loadHome(){myHome=await getHome(uid)}")
rep("async function gotPat(){if(!DB||!uid)return;try{const h=Object.assign({nick:me.nick,pats:0},myHome||{});h.pats=(h.pats||0)+1;myHome=h;await DB.doc('homes/'+uid).set(h)}catch(e){}}",
"async function gotPat(){if(!SB||!uid)return;try{const h=Object.assign({nick:me.nick,pats:0},myHome||{});h.pats=(Math.max(0,parseInt(h.pats,10)||0))+1;myHome=h;await putHome(h)}catch(e){}}")
rep("let h=null;if(DB&&hid){try{const d=await DB.doc('homes/'+hid).get();h=d&&d.exists!==false?(d.data?d.data():d):null}catch(e){}}","let h=await getHome(hid);")
a=t.index(" let notes=[];if(DB){"); b=t.index(" notes=notes.filter(")
t=t[:a]+" let notes=[];if(SB&&hid){try{const r=await SB.from('notes').select('from_nick,text,at').eq('to_id',hid).not('text','like','♥목표%').order('at',{ascending:false}).limit(20);notes=(r.data||[]).map(n=>({from:n.from_nick,text:n.text,at:new Date(n.at).getTime()}))}catch(e){}}\n"+t[b:]
rep("'+(DB&&uid?'저장돼':'체험 모드')","'+(SB&&uid?'저장돼':'연결 중')")
rep("if(DB&&uid){sv.disabled=true;try{await DB.doc('homes/'+uid).set(nh);toast('저장했어')}catch(e){toast('저장 권한이 없어. 체험만 돼')}sv.disabled=false}else toast('체험 모드라 저장은 안 돼');openHome(myId,me.nick)};",
"if(SB&&uid){sv.disabled=true;try{await putHome(nh);toast('저장했어')}catch(e){toast('저장이 안 됐어. 잠시 뒤 다시')}sv.disabled=false}else toast('아직 연결 중이야');openHome(myId,me.nick)};")
a=t.index(" sb.querySelectorAll('[data-s]').forEach(b=>b.onclick=async()=>{"); b=t.index("function drawMini(")
t=t[:a]+" sb.querySelectorAll('[data-s]').forEach(b=>b.onclick=async()=>{if(!SB||!uid||!hid){toast('아직 연결 중이야');return}const r=await SB.from('notes').insert({from_id:uid,from_nick:me.nick,to_id:hid,text:b.dataset.s});if(r.error)toast('남기지 못했어');else{toast('방명록 남겼어');openHome(id,nick)}})}\n"+t[b:]
rep("async function ask(q){q=(q||'').trim();if(!q||busy)return;if(!SAMPLE){toast('지금은 AI 연결이 안 돼. 카톡 상담으로 물어봐');return}",
"""const FAQ={'육아휴직 회사가 거절할 수 있어?':'요건을 갖춘 근로자가 신청하면 회사는 허용해야 해. 거절하면 벌칙 대상이야. 회사가 미루거나 눈치 주면 신청서를 서면으로 남겨두고 노무사랑 상의해.\\n근거 · 남녀고용평등법 제19조①','복직하는데 다른 부서로 가래':'휴직 전과 같은 업무 또는 같은 수준 임금을 받는 직무로 복귀시키는 게 원칙이야. 휴직했다는 이유로 불리하게 대하면 안 돼. 발령 문서를 받아두고 바로 상담해.\\n근거 · 남녀고용평등법 제19조③④','단축근무하면 월급 깎여?':'임신기 근로시간 단축은 임금을 깎을 수 없어. 육아기 근로시간 단축은 줄어든 시간에 비례해서만 임금이 줄 수 있고, 그 밖에 단축을 이유로 근로조건을 불리하게 하면 안 돼.\\n근거 · 근로기준법 제74조 제8항 · 남녀고용평등법 제19조의3 제1항'};
async function ask(q){q=(q||'').trim();if(!q||busy)return;if(!SAMPLE){chat.push({role:'user',content:q});chat.push({role:'assistant',content:FAQ[q]||'좋은 질문이야. 아직 이 질문엔 비서가 바로 답을 못 해. 질문은 노무사 엄마한테 전달됐고, 답변을 모아 비서가 점점 똑똑해질 거야. 내 사건에 딱 맞는 답이 급하면 아래 노무사 상담으로.'});if(!FAQ[q]&&typeof SB!=='undefined'&&SB&&uid){SB.from('requests').insert({uid:uid,name:(me.nick||'익명').slice(0,20),contact:'-',memo:('[육아비서 질문] '+q).slice(0,300),diag:{type:'ask',kind:pubKind()||''}}).then(()=>{},()=>{})}openAide();return}""")
rep("'+(SAMPLE?'AI 답변 · 근거 조문 포함':'지금은 연결 안 됨')+'","'+(SAMPLE?'AI 답변 · 근거 조문 포함':'자주 묻는 질문부터')+'")
a=t.index("/* ---------- 연결 ---------- */"); b=t.index("}\n</script>",a)
conn="""/* ---------- 연결 (Supabase) ---------- */
let SB=null;
(async()=>{if(!window.supabase){$('gnote').textContent+=' 서버 연결이 안 돼서 지금은 나만 보여.';return}
 SB=window.supabase.createClient('"""+SB_URL+"""','"""+SB_KEY+"""',{realtime:{params:{eventsPerSecond:10}}});
 try{let s=(await SB.auth.getSession()).data.session;if(!s){const r=await SB.auth.signInAnonymously();s=r.data&&r.data.session}uid=s&&s.user?s.user.id:null}catch(e){}
 try{const saved=localStorage.getItem('cp_nick');if(saved){me.nick=saved;$('nick').textContent=(me.kind?'지난번 선택 그대로야 · 바뀌었으면 다시 눌러 · ':'별명은 자동으로 붙어 · ')+me.nick}else localStorage.setItem('cp_nick',me.nick)}catch(e){}
 let CH=null,joining=0;
 const joinLobby=()=>{if(joining&&Date.now()-joining<10000)return;joining=Date.now();const old=CH;CH=null;RM=null;try{if(old)SB.removeChannel(old)}catch(e){}
  const ch=SB.channel('lobby',{config:{presence:{key:myId}}});CH=ch;
  ch.on('presence',{event:'sync'},()=>{if(ch!==CH)return;const st=ch.presenceState();onPeers(Object.entries(st).map(([k,arr])=>({you:k===myId,state:(arr&&arr[arr.length-1])||{},id:k})))});
  ch.subscribe(status=>{if(ch!==CH)return;if(status==='SUBSCRIBED'){joining=0;RM={presence:s=>ch.track(s)};lastPush=0;pushP()}else if(status==='CHANNEL_ERROR'||status==='TIMED_OUT'||status==='CLOSED'){joining=0;RM=null;setTimeout(joinLobby,2000)}})};
 const revive=()=>{if(document.visibilityState!=='visible')return;try{if(SB.realtime&&!SB.realtime.isConnected())SB.realtime.connect()}catch(e){}if(!CH||CH.state!=='joined')joinLobby();else{lastPush=0;pushP()}};
 joinLobby();
 document.addEventListener('visibilitychange',revive);window.addEventListener('pageshow',revive);window.addEventListener('online',revive);setInterval(revive,20000);
 renderGate()})();
"""
t=t[:a]+conn+t[b:]
H=open(os.path.join(D,'h_helpers.js')).read();A=open(os.path.join(D,'h_avatar.js')).read();L=open(os.path.join(D,'p_lounge.js')).read();K=open(os.path.join(D,'p_konny.js')).read()
t=t.replace('/*HELPERS*/',H).replace('/*AVATAR*/',A).replace('/*LOUNGE*/',L).replace('/*KONNY*/',K)
import time as _t
_V=str(int(_t.time()))
t=t.replace('</body>','<script>(function(){var V="'+_V+'";function chk(force){fetch("/version.txt?"+Date.now(),{cache:"no-store"}).then(function(r){return r.ok?r.text():""}).then(function(x){x=(x||"").trim();if(!x||x===V)return;if(force||document.visibilityState==="visible"&&!document.hasFocus()){location.reload();return}if(document.getElementById("vbar"))return;var b=document.createElement("button");b.id="vbar";b.textContent="새 기능이 생겼어! 눌러서 새로고침";b.style.cssText="position:fixed;left:50%;top:calc(env(safe-area-inset-top) + 8px);transform:translateX(-50%);z-index:99;font:15px Jua,sans-serif;background:#2B2118;color:#FFD84D;border:0;border-radius:999px;padding:10px 18px;box-shadow:0 4px 12px rgba(0,0,0,.3)";b.onclick=function(){location.reload()};document.body.appendChild(b)}).catch(function(){})}document.addEventListener("visibilitychange",function(){if(document.visibilityState==="visible")chk(true)});setInterval(function(){chk(false)},60000);setTimeout(function(){chk(false)},5000)})();</script></body>',1)
open(os.path.join(D,'..','version.txt'),'w').write(_V)
open(os.path.join(D,'..','index.html'),'w').write(t)
print('built')

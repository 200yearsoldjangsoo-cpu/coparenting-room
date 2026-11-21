function konny(av,col,col2){const b=av.bod;
 /* 크로스 어깨끈 (뒤에서 X) */
 for(const s of[-1,1]){const st=box(.13,.95,.06,col,s*.12,.62,-.3);st.rotation.z=s*.55;b.add(st);const fr=box(.14,.5,.06,col,s*.2,.82,.28);fr.rotation.z=-s*.25;b.add(fr)}
 /* 넓은 천 파우치 (가오리핏) */
 b.add(sph(.34,col,0,.58,.3,1.12,1.0,.62));b.add(sph(.3,col2,0,.52,.36,1.0,.75,.5));
 /* 잠든 아기 + 모자 */
 b.add(sph(.17,'#ffdcc2',0,.88,.38));b.add(sph(.175,col2,0,.95,.36,1,.75,1));b.add(sph(.05,col2,0,1.08,.36));
 for(const ex of[-.055,.055]){const e=box(.05,.012,.01,'#2B2118',ex,.86,.545);b.add(e)}
 b.add(sph(.03,'#ff9fa6',-.09,.83,.52,1.2,.6,.4));b.add(sph(.03,'#ff9fa6',.09,.83,.52,1.2,.6,.4));
 /* 엄마 손: 엉덩이 토닥 */
 av.arms.forEach((a,i)=>{a.position.set(i?.26:-.26,.55,.36)})}

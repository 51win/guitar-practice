/* Seven-day practice uses the existing app's chord parser, tuning and scale data. */
const JazzWeek = (() => {
  const groups = {
    eb: {title:'E♭maj7 · 코드와 스케일', chords:['Ebmaj7'], scales:['ionian']},
    ab: {title:'B♭m7 → E♭7 → A♭maj7', chords:['Bbm7','Eb7','Abmaj7'], scales:['dorian','mixolydian','ionian']},
    c: {title:'Dm7 → G7 → Cmaj7', chords:['Dm7','G7','Cmaj7'], scales:['dorian','mixolydian','ionian']},
    fly: {title:'Am7 → Dm7 → G7 → Cmaj7', chords:['Am7','Dm7','G7','Cmaj7'], scales:['aeolian','dorian','mixolydian','ionian']},
    minor: {title:'Fmaj7 → Bm7♭5 → E7 → Am7', chords:['Fmaj7','Bm7b5','E7','Am7'], scales:['lydian','locrian','phrygianDominant','aeolian']},
    misty: {title:'Misty · 첫 진행 발췌', chords:['Ebmaj7','Bbm7','Eb7','Abmaj7'], scales:['ionian','dorian','mixolydian','ionian']}
  };
  const warm = [5,'3·7도 찾기','eb',[
    '메트로놈 60 BPM. 3번줄 E♭(8프렛) 또는 4번줄 E♭(1·13프렛)를 찾고 이름을 말하세요.',
    '1·2번줄에서 G(3도), D(7도)를 찾으세요. 예: 2번줄 8프렛 G → 1번줄 10프렛 D. 루트와 동시에 잡을 필요는 없습니다.',
    '2분 뒤 B♭m7(Db·Ab), E♭7(G·Db)도 확인하세요. 막히면 박자를 멈추고 찾은 뒤 다시 시작합니다.'
  ]];
  const days = [
    {title:'가이드톤에서 출발',focus:'루트 → 3·7도 → 익숙한 스케일',group:'eb',steps:[warm,
      [8,'메이저·마이너의 3·7도','misty',['E♭maj7의 G·D, A♭maj7의 C·G, B♭m7의 D♭·A♭을 각각 소리 내어 말하세요.','코드 하나당 4박. 1박에는 3도, 3박에는 7도를 연주하고 순서를 바꿉니다.','먼저 1·2번줄을 사용하고, 마지막 2분은 루트를 3번줄에서 4번줄로 옮겨 확인합니다.']],
      [7,'코드톤 주변의 스케일','eb',['표시를 ‘스케일까지’로 바꿔 E♭ major의 E♭ F G A♭ B♭ C D를 확인하세요.','G–F–E♭, D–C–B♭처럼 가이드톤에서 시작하는 3음 조각만 연주합니다.','A♭(11)은 G와 부딪힐 수 있으니 길게 멈추지 말고 G로 연결해 들어보세요.']],
      [10,'Misty 첫 진행에 적용','misty',['연습용 길이: E♭maj7 4박 | B♭m7 2박 E♭7 2박 | A♭maj7 4박. 이 구간을 반복합니다.','처음 5분은 3·7도만, 다음 3분은 쉼표를 넣어 짧게 대답하는 프레이즈를 만드세요.','마지막 2분은 녹음하고, 코드가 바뀔 때 목표음이 들리는지 확인하세요.']]]},
    {title:'ii–V–I 연결',focus:'공통음은 유지하고, 다른 음은 가까이',group:'ab',steps:[warm,
      [10,'A♭ 장조의 ii–V–I','ab',['B♭m7(D♭·A♭) → E♭7(G·D♭) → A♭maj7(C·G). 코드마다 4박으로 반복하세요.','한 줄기는 D♭ → D♭ → C, 다른 줄기는 A♭ → G → G입니다. 먼저 한 음씩 연결합니다.','3·7도가 바뀌는 순간만 듣고, 마지막 2분은 두 음을 함께 쳐보세요.']],
      [8,'C 장조로 옮기기','c',['Dm7(F·C) → G7(B·F) → Cmaj7(E·B). F → F → E와 C → B → B를 각각 연주하세요.','한 위치 안에서 가장 가까운 음을 선택하세요. 손가락 모양보다 음 이름을 먼저 말합니다.','60 BPM에서 3회 연속 연결되면 코드마다 2박으로 줄여보세요.']],
      [7,'스케일로 빈칸 채우기','ab',['A♭ major: A♭ B♭ C D♭ E♭ F G. 세 코드의 공통 음 재료입니다.','가이드톤 사이에 스케일 음을 딱 하나 넣습니다. 8분음표 두 개 뒤에는 쉬세요.','다음 코드의 첫 박에 3도 또는 7도로 도착하는지 녹음해 확인합니다.']]]},
    {title:'아르페지오 확장',focus:'3·5·7·9를 한 줄로 보기',group:'fly',steps:[warm,
      [8,'m7의 ♭3부터 maj7','fly',['Am7 위의 Cmaj7: C E G B = ♭3 5 ♭7 9. Dm7 위의 Fmaj7: F A C E도 같은 원리입니다.','네 음을 4분음표로 올라가고 내려오세요. 음 이름 다음에 원래 코드 기준 도수를 말합니다.','B♭m7 위의 D♭maj7(D♭ F A♭ C)로 옮겨 확인하세요.']],
      [8,'maj7의 3도부터 m7','eb',['E♭maj7 위의 Gm7: G B♭ D F = 3 5 7 9. 지판에서 F(9)를 찾아보세요.','Cmaj7 위에서는 Em7: E G B D입니다. 두 코드를 번갈아 확인합니다.','9도에서 끝내 본 뒤, 3도에 끝냈을 때와 소리의 안정감을 비교하세요.']],
      [9,'도미넌트의 3도부터 m7♭5','c',['G7 위의 Bm7♭5: B D F A = 3 5 ♭7 9. E♭7 위의 Gm7♭5: G B♭ D♭ F.','Dm7의 F A C E → G7의 B D F A → Cmaj7의 E G B D를 천천히 연결하세요.','마지막 3분은 네 음을 모두 쓰려 하지 말고 2~3음으로 줄여 다음 코드의 3도에 도착합니다.']]]},
    {title:'Misty에 적용',focus:'코드별 목표음을 먼저 듣기',group:'misty',steps:[warm,
      [8,'Misty 첫 진행의 가이드톤','misty',['E♭maj7 G·D → B♭m7 D♭·A♭ → E♭7 G·D♭ → A♭maj7 C·G를 찾으세요.','E♭maj7은 4박, B♭m7과 E♭7은 각각 2박, A♭maj7은 4박으로 반복하세요.','D → D♭ → D♭ → C를 부르고 난 뒤 기타로 따라 연주합니다.']],
      [7,'조성 영역과 연결음','misty',['E♭maj7에서는 E♭ major, 뒤의 ii–V–I에서는 A♭ major를 확인합니다.','두 스케일의 차이 D → D♭을 찾아 들어보세요. 지판은 코드 버튼을 누르면 함께 바뀝니다.','가이드톤 사이에 5도나 9도를 하나씩 넣어 짧은 문장을 만드세요.']],
      [10,'반복 연주와 녹음','misty',['3분: 3·7도만 / 3분: 아르페지오 추가 / 2분: 스케일 연결음을 추가합니다.','마지막 2분: 녹음을 듣고 가장 자연스러운 한 구절을 다시 연주하세요.','여기 지판은 첫 진행 발췌입니다. 전체 코러스는 본인이 사용하는 Misty 악보·반주로 적용하세요.']]]},
    {title:'Fly Me to the Moon',focus:'C 장조에서 A 단조까지',group:'fly',steps:[warm,
      [8,'앞 네 코드 연결','fly',['Am7(C·G) → Dm7(F·C) → G7(B·F) → Cmaj7(E·B), 코드마다 4박입니다.','3도 줄기 C → F → B → E와 7도 줄기 G → C → F → B를 따로 확인하세요.','그다음 두 줄기 중 가까운 음을 골라 공통음을 유지하며 연결합니다.']],
      [7,'마이너 종지 듣기','minor',['Fmaj7(A·E) → Bm7♭5(D·A) → E7(G♯·D) → Am7(C·G). G♯ → A 해결을 들어보세요.','E7에서 A harmonic minor의 E F G♯ A B C D를 봅니다. G♯을 G로 잘못 치지 않도록 확인하세요.','E7 위의 Dm7♭5(D F A♭ C)는 ♭7·♭9·3(G♯과 같은 음)·♭13입니다. 이번 주에는 이 확장보다 G♯·D에 집중합니다.']],
      [10,'곡에 연결하고 녹음','fly',['4분: 앞·뒤 두 진행을 연결하고 3·7도만 사용합니다. 4분: 각 코드에 9도를 한 번씩 추가해보세요.','마지막 2분은 녹음과 메모. E7에서는 ♭9(F)를 선택했다면 짧게 쓰고 E나 다음 코드 A로 해결하세요.','전체 곡은 상단 ‘연습’의 Fly Me to the Moon에서 반주와 함께 이어갑니다.']]]},
    {title:'나만의 라인 만들기',focus:'적은 음으로 세 가지 문장',group:'ab',steps:[warm,
      [5,'목표음과 리듬 정하기','ab',['2마디 틀: 첫 마디 B♭m7 2박 + E♭7 2박, 둘째 마디 A♭maj7 4박.','B♭m7의 D♭ 또는 A♭에서 시작하고 A♭maj7의 C 또는 G에서 끝내기로 정합니다.','기타 없이 리듬부터 부르세요. 8분음표를 연속으로 채우지 말고 쉼표를 둡니다.']],
      [12,'2마디 라인 세 개','ab',['라인당 4분. ① 가이드톤만 ② B♭m7의 9도 C 추가 ③ 같은 음을 다른 리듬으로 연주.','예시: 첫 마디 D♭–C(1박의 8분음표), A♭(2박), G(3박), D♭(4박) → 둘째 마디 C(온음표).','예시는 출발점입니다. 마지막 음은 유지하며 시작 위치나 쉼표를 바꾸고 아래 메모에 적으세요.']],
      [8,'반복·녹음·고르기','ab',['각 라인을 2분씩 반복해 녹음합니다. 다음 코드의 첫 박에서 목표음에 도착하는지 확인하세요.','마지막 2분은 가장 마음에 드는 한 라인만 골라 외웁니다.','잘 안 되면 음을 더 넣지 말고 템포를 50 BPM으로 내려보세요.']]]},
    {title:'복습하고 한 번 더',focus:'새로운 음보다 자연스러운 연결',group:'misty',steps:[warm,
      [5,'두 키의 ii–V–I','c',['C 장조와 A♭ 장조를 번갈아 선택합니다. 코드 이름을 보고 3·7도를 먼저 말하세요.','지판을 보지 않고 한 번 연주한 다음, 지판을 열어 확인합니다.','막힌 코드 하나를 메모하고 다음 주의 첫 연습 대상으로 남깁니다.']],
      [10,'Misty 복습','misty',['3분 가이드톤 → 3분 아르페지오 → 2분 자유롭게 연주합니다.','마지막 2분 녹음 확인: D → D♭ → C의 움직임이 들리는지 들어보세요.','전체 악보·반주가 있으면 같은 원리를 다른 마디에도 적용합니다.']],
      [10,'Fly Me 복습과 주간 기록','fly',['4분 앞 네 코드, 4분 마이너 종지를 연습하세요. 토요일에 만든 리듬도 옮겨봅니다.','마지막 2분: ① 3·7도를 찾는 속도 ② 가까운 음 연결 ③ 기억한 라인 한 개를 평가합니다.','속도보다 멈추지 않는 흐름을 기준으로, 다음 주 반복할 구간을 메모하세요.']]]}
  ];
  const key='guitar-jazz-week-20260928-v1', by=id=>document.getElementById(id);
  let saved={}; try{saved=JSON.parse(localStorage.getItem(key))||{};}catch{}
  if(!saved||typeof saved!=='object')saved={};
  const checked={},notes={};
  days.forEach((day,d)=>{notes[d]=typeof saved.notes?.[d]==='string'?saved.notes[d].slice(0,3000):'';day.steps.forEach((s,i)=>{checked[`${d}-${i}`]=saved.checked?.[`${d}-${i}`]===true;});});
  let day=Number.isInteger(saved.day)&&saved.day>=0&&saved.day<7?saved.day:0,step=0,group=days[day].group,chord=0;
  let seconds=days[day].steps[0][0]*60,deadline=null;
  const date=d=>new Date(2026,8,28+d).toLocaleDateString('ko-KR',{month:'numeric',day:'numeric',weekday:'short'});
  const remaining=(end,now=Date.now())=>Math.max(0,Math.ceil((end-now)/1000));
  function save(){try{localStorage.setItem(key,JSON.stringify({day,checked,notes}));by('jw-save').textContent='이 브라우저에 자동 저장됩니다.';}catch{by('jw-save').textContent='저장 공간을 사용할 수 없어 이번 화면에서만 유지됩니다.';}}
  function progress(){const count=Object.values(checked).filter(Boolean).length;by('jw-progress').textContent=`${count} / 28 단계 완료`;by('jw-meter').value=count;document.querySelectorAll('[data-jw-day]').forEach(b=>{const d=+b.dataset.jwDay,n=days[d].steps.filter((_,i)=>checked[`${d}-${i}`]).length;b.querySelector('small').textContent=`${n}/4 완료`;});}
  function pause(){if(deadline!==null){seconds=remaining(deadline);deadline=null;}tick();}
  function selectStep(i){pause();step=i;seconds=days[day].steps[i][0]*60;group=days[day].steps[i][2];chord=0;by('jw-group').value=group;by('jw-status').textContent='단계가 준비되었습니다. 시작을 누르세요.';renderSteps();renderChords();tick();}
  function renderSteps(){let offset=0;by('jw-steps').innerHTML=days[day].steps.map((s,i)=>{const start=offset;offset+=s[0];return `<article class="jw-step ${i===step?'is-current':''}"><div class="jw-step-head"><input type="checkbox" data-jw-check="${i}" aria-label="${s[1]} 완료" ${checked[`${day}-${i}`]?'checked':''}><button class="jw-step-select" data-jw-step="${i}" aria-pressed="${i===step}"><span>${String(i+1).padStart(2,'0')} / ${start}–${offset}분</span><strong>${s[1]}</strong></button><b>${s[0]}분</b></div><ol>${s[3].map(t=>`<li>${t}</li>`).join('')}</ol></article>`;}).join('');}
  function renderDay(){by('jw-title').textContent=days[day].title;by('jw-focus').textContent=days[day].focus;by('jw-date').textContent=`DAY ${day+1} / ${date(day)} · 30 MIN`;by('jw-notes').value=notes[day];document.querySelectorAll('[data-jw-day]').forEach(b=>{b.classList.toggle('active',+b.dataset.jwDay===day);b.setAttribute('aria-pressed',String(+b.dataset.jwDay===day));});selectStep(0);progress();}
  function tick(){if(deadline!==null){seconds=remaining(deadline);if(seconds===0){deadline=null;by('jw-status').textContent='시간이 끝났습니다. 연습을 마쳤다면 완료를 체크하고 다음 단계로 이동하세요.';}}by('jw-time').textContent=`${String(Math.floor(seconds/60)).padStart(2,'0')}:${String(seconds%60).padStart(2,'0')}`;by('jw-start').textContent=deadline===null?'시작':'일시정지';by('jw-start').disabled=seconds===0;by('jw-timer-label').textContent=`${step+1}단계 · ${days[day].steps[step][1]}`;by('jw-next').disabled=step===days[day].steps.length-1;}
  function scaleId(){return by('jw-scale').value||groups[group].scales[chord];}
  function spelled(symbol,iv,scale){const letters='CDEFGAB',natural=[0,2,4,5,7,9,11],offset=({0:0,1:1,2:1,3:2,4:2,5:3,6:scale==='lydian'&&!TYPES[parse(symbol).type].includes(6)?3:4,7:4,8:5,9:5,10:6,11:6})[iv],index=(letters.indexOf(symbol[0])+offset)%7,delta=mod(parse(symbol).root+iv-natural[index]),acc=delta>6?delta-12:delta;return letters[index]+(acc>0?'♯'.repeat(acc):'♭'.repeat(-acc));}
  function noteAt(symbol,scale,s,f){const c=parse(symbol),iv=mod(OPEN[s]+f-c.root),idx=TYPES[c.type].indexOf(iv);return {iv,role:idx===0?'root':idx===1?'third':idx===3?'seventh':idx>=0?'tone':SCALES[scale][1].includes(iv)?'scale':null,note:spelled(symbol,iv,scale),degree:({0:'R',1:'♭9',2:'9',3:'♭3',4:'3',5:'11',6:scale==='lydian'&&!TYPES[c.type].includes(6)?'♯11':'♭5',7:'5',8:'♭13',9:'13',10:'♭7',11:'7'})[iv]};}
  function renderChords(){by('jw-chords').innerHTML=groups[group].chords.map((c,i)=>`<button class="pill ${chord===i?'active':''}" data-jw-chord="${i}" aria-pressed="${chord===i}">${c.replaceAll('b','♭')}</button>`).join('');by('jw-scale').value='';renderBoard();}
  function renderBoard(){const symbol=groups[group].chords[chord],c=parse(symbol),scale=scaleId(),mode=by('jw-layer').value,labels=by('jw-labels').value,end=+by('jw-frets').value||12;
    by('jw-scale-name').textContent=`${symbol.replaceAll('b','♭')} · ${NAMES[c.root]} ${SCALES[scale][0]}`;
    by('jw-tone-list').textContent=`코드톤: ${TYPES[c.type].map(iv=>spelled(symbol,iv,scale)).join(' · ')} / 스케일: ${SCALES[scale][1].map(iv=>spelled(symbol,iv,scale)).join(' · ')}`;
    const width=70+(end+1)*64;let svg=`<svg viewBox="0 0 ${width} 330" style="min-width:${width}px" role="img" aria-labelledby="jw-svg-title jw-svg-desc"><title id="jw-svg-title">${symbol} ${SCALES[scale][0]} 지판</title><desc id="jw-svg-desc">위부터 1번줄 E, B, G, D, A, 6번줄 E. 왼쪽 개방현부터 ${end}프렛까지. 음 이름과 도수는 각 음의 설명에 표시됩니다.</desc>`;
    for(let f=0;f<=end;f++){const x=70+f*64;svg+=`<line x1="${x+32}" y1="34" x2="${x+32}" y2="284" stroke="${f===0?'var(--ink)':'var(--line)'}" stroke-width="${f===0?4:1}"/><text x="${x}" y="315" fill="var(--muted)" text-anchor="middle" font-size="12">${f||'개방'}</text>`;if([3,5,7,9,12,15,17].includes(f))svg+=`<circle cx="${x}" cy="18" r="3" fill="var(--muted)"/>`;}
    OPEN.forEach((_,s)=>{const y=46+s*46;svg+=`<text x="8" y="${y+4}" fill="var(--muted)" font-size="12">${s+1} ${['E','B','G','D','A','E'][s]}</text><line x1="48" y1="${y}" x2="${width-16}" y2="${y}" stroke="var(--string)" stroke-width="${1+s*.25}"/>`;for(let f=0;f<=end;f++){const n=noteAt(symbol,scale,s,f);if(!n.role||mode==='guide'&&!['root','third','seventh'].includes(n.role)||mode==='chord'&&n.role==='scale')continue;const x=70+f*64,small=n.role==='scale',color='var(--ink)';svg+=`<g><title>${s+1}번줄 ${f}프렛 · ${n.note} · ${n.degree}</title><circle cx="${x}" cy="${y}" r="${small?15:20}" fill="${n.role==='root'?'var(--yellow)':'var(--panel)'}" stroke="${color}"/><text x="${x}" y="${y+4}" text-anchor="middle" fill="${color}" font-size="${small?11:12}" font-weight="600">${labels==='degree'?n.degree:n.note}</text></g>`;}});by('jw-board').innerHTML=svg+'</svg>';
  }
  by('jw-days').innerHTML=days.map((d,i)=>`<button class="pill jw-day" data-jw-day="${i}"><span>${date(i)}</span><strong>${d.title}</strong><small>0/4 완료</small></button>`).join('');
  by('jw-group').innerHTML=Object.entries(groups).map(([id,g])=>`<option value="${id}">${g.title}</option>`).join('');
  by('jw-scale').innerHTML='<option value="">진행에 맞는 기본 스케일</option>'+Object.entries(SCALES).filter(([id])=>['ionian','lydian','dorian','aeolian','mixolydian','phrygianDominant'].includes(id)).map(([id,s])=>`<option value="${id}">${s[0]}</option>`).join('');
  by('jw-days').onclick=e=>{const b=e.target.closest('[data-jw-day]');if(!b)return;pause();day=+b.dataset.jwDay;renderDay();save();};
  by('jw-steps').onclick=e=>{const b=e.target.closest('[data-jw-step]');if(b)selectStep(+b.dataset.jwStep);};
  by('jw-steps').onchange=e=>{if(e.target.matches('[data-jw-check]')){checked[`${day}-${e.target.dataset.jwCheck}`]=e.target.checked;save();progress();}};
  by('jw-start').onclick=()=>{if(deadline!==null)pause();else if(seconds>0){deadline=Date.now()+seconds*1000;by('jw-status').textContent='연습 중입니다. 다른 날짜·단계·화면으로 이동하면 일시정지합니다.';tick();}};
  by('jw-reset').onclick=()=>{pause();seconds=days[day].steps[step][0]*60;by('jw-status').textContent='현재 단계의 시간을 초기화했습니다.';tick();};
  by('jw-next').onclick=()=>{if(step<days[day].steps.length-1)selectStep(step+1);};
  by('jw-group').onchange=()=>{group=by('jw-group').value;chord=0;renderChords();};
  by('jw-chords').onclick=e=>{const b=e.target.closest('[data-jw-chord]');if(b){chord=+b.dataset.jwChord;renderChords();}};
  ['jw-layer','jw-labels','jw-frets','jw-scale'].forEach(id=>by(id).onchange=renderBoard);
  by('jw-notes').oninput=()=>{notes[day]=by('jw-notes').value;save();};
  addEventListener('hashchange',()=>{if(location.hash!=='#week')pause();});
  addEventListener('pagehide',pause);
  setInterval(tick,250);renderDay();
  return {days,groups,noteAt,remaining};
})();

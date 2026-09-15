/* index.html 의 실제 스크립트를 최소 DOM 스텁 위에서 돌려 음악 로직만 확인한다.
   프레임워크 없음. `node check.mjs` — 조용히 끝나면 통과. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
import { validateMessage } from './netlify/functions/chat.mjs';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
assert.ok(!html.includes('giscus.app/client.js'), '가입이 필요한 giscus를 화면에서 제거한다');
assert.ok(html.includes('회원가입 없이 닉네임만 정하면'));
const src = html.slice(html.indexOf('<script>') + 8, html.lastIndexOf('</script>'));

// 체크박스 상태는 여기서 조종한다
const CHECKED = { shapeSet: ['drop14'], triadSet: ['0'] };

const noop = () => {};
const mk = (over = {}) => ({
  value: '', checked: true, hidden: false, disabled: false, textContent: '', innerHTML: '',
  children: [], options: [], style: {},
  classList: { toggle: noop, add: noop, remove: noop, contains: () => false },
  add(o) { this.options.push(o); }, setAttribute: noop, getAttribute: () => null,
  querySelectorAll: () => [], querySelector: () => null, addEventListener: noop,
  closest: () => null, scrollIntoView: noop, focus: noop, select: noop, reset: noop, ...over,
});
const reg = {};
for (const [id, v] of Object.entries({
  song: { value: 'blues' }, key: {}, endFret: {}, anchor: {}, radius: { value: '4' },
  pentaType: { value: 'major' }, labels: { value: 'note' }, degColor: { checked: true },
  shapeSet: { querySelectorAll: () => CHECKED.shapeSet.map(v => ({ value: v, checked: true })),
              querySelector: () => (CHECKED.shapeSet.length ? {} : null) },
  triadSet: { querySelectorAll: () => CHECKED.triadSet.map(v => ({ value: v, checked: true })),
              querySelector: () => (CHECKED.triadSet.length ? {} : null) },
})) reg[id] = mk(v);

const sandbox = {
  CHECKED,
  document: { title: '', getElementById: id => (reg[id] ??= mk()), querySelectorAll: () => [], addEventListener: noop },
  window: {}, location: { hash: '' }, localStorage: new Map([['getItem', null]]),
  ResizeObserver: class { observe() {} }, Option: function (text, value) { return { text, textContent:text, value: String(value), remove(){reg.song.options=reg.song.options.filter(o=>o!==this);} }; },
  addEventListener: noop, scrollTo: noop, setInterval: () => 0, clearInterval: noop, setTimeout: noop, clearTimeout: noop,
  confirm: () => false, console,
};
const storage=new Map();
sandbox.localStorage = { getItem: key => storage.get(key)??null, setItem: (key,value)=>storage.set(key,value), removeItem: key=>storage.delete(key) };

const ctx = vm.createContext(sandbox);
vm.runInContext(fs.readFileSync(new URL('./repertoire.js', import.meta.url), 'utf8'),ctx);
vm.runInContext(src + `
;globalThis.probe = { seq, NAMES, KEYS, keyOf, shift, voicings, current, esc, parseBar, name, dotStyle, pentaStyle, fretEdges, cleanSlots, validateSong, upcoming, editedBars, openNewSong, applyBarEdit, saveSong, deleteSong, drawSongs, putTile, selectAnchor: setAnchor, selectTab: setTab, syncTimeline, seekScore, formatTime,
  renderPenta(kind){ tab = 'penta'; document.getElementById('pentaType').value = kind; draw(); },
  setKey(v){ document.getElementById('key').value = String(v); },
  setSong(s){ document.getElementById('song').value = s; fillKeys(); },
  setAnchor(a){ anchor = a; }, setTab(t){ tab = t; } };
`, ctx);
const p = sandbox.probe;

// ── 1. 키 선택 = 절대 키 이조 ───────────────────────────────
const bar = (i, j = 0) => p.name(p.seq()[i][j]);
p.setSong('blues');
assert.equal(bar(0), 'F7', 'F 블루스의 원래 1마디');
p.setKey(0);                                    // C
assert.deepEqual([bar(0), bar(1)], ['C7', 'F7'], 'C 로 옮긴 I–IV');
p.setKey(8);                                    // A♭
assert.deepEqual([bar(0), bar(1)], ['A♭7', 'D♭7'], 'A♭ 로 옮긴 I–IV');
p.setSong('autumn');
assert.equal(p.keyOf('autumn').minor, true, 'Autumn Leaves 는 단조 → 키 목록이 Gm 꼴');
assert.equal(p.NAMES[p.keyOf('autumn').root], 'G');

// ── 2. 쉘 보이싱 줄 묶음 ────────────────────────────────────
// 6번줄 루트 = 6·4·3번줄(index 5,3,2) / 5번줄 루트 = 5·4·3번줄(index 4,3,2)
p.setSong('blues'); p.setKey(5); p.setTab('voicing');
const shellFrets = (shape, anchor) => {
  CHECKED.shapeSet = [shape]; p.setAnchor(anchor);
  const v = p.voicings(p.current())[0];
  // vm 안에서 만든 배열은 프로토타입이 달라 deepStrictEqual 이 거부한다 → 건너온다
  return v && JSON.parse(JSON.stringify(
    { strings: v.notes.map(n => n.s), frets: v.notes.map(n => n.f), ivs: v.notes.map(n => n.iv) }));
};
assert.deepEqual(shellFrets('shell6', 2),
  { strings: [5, 3, 2], frets: [1, 1, 2], ivs: [0, 10, 4] }, 'F7 6번줄 쉘: 루트·♭7·3도');
assert.deepEqual(shellFrets('shell5', 7),
  { strings: [4, 3, 2], frets: [8, 7, 8], ivs: [0, 4, 10] },
  'F7 5번줄 쉘은 2·3·4번줄에 루트·3도·♭7 (F–A–E♭, 8프렛 근처)');

// ── 3. 체크한 모양이 모두 후보에 나온다 ──────────────────────
CHECKED.shapeSet = ['drop14', 'drop25', 'shell6', 'shell5']; p.setAnchor(5);
const shapes = new Set(p.voicings(p.current()).map(v => v.shape));
assert.ok(shapes.size >= 3, `모양 4개를 켰으면 후보에 여러 모양이 섞여야 한다 (지금 ${shapes.size}개)`);
assert.ok(shapes.has('shell5') || shapes.has('shell6'), '쉘도 한 자리는 확보해야 한다');
CHECKED.shapeSet = ['drop14'];
assert.deepEqual([...new Set(p.voicings(p.current()).map(v => v.shape))], ['drop14'], '하나만 켜면 하나만');

// ── 4. 표시 형식 · 이스케이프 ───────────────────────────────
assert.equal(p.esc('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');
assert.deepEqual(validateMessage({nickname:'  재즈  기타 ',message:' 안녕\r\n반가워 ',client:'12345678-abcd'}),{nickname:'재즈 기타',message:'안녕\n반가워',client:'12345678-abcd'});
assert.throws(()=>validateMessage({nickname:'',message:'안녕',client:'12345678'}));
assert.throws(()=>validateMessage({nickname:'재즈',message:'x'.repeat(301),client:'12345678'}));

// 도수 색은 모드를 바꾸어도 유지하고, 색을 끄면 루트만 구분한다.
assert.deepEqual([0, 4, 7, 10].map(iv => p.dotStyle(iv).fill),
  ['var(--yellow)', 'var(--mint)', 'var(--peach)', 'var(--purple)']);
reg.degColor.checked = false;
assert.equal(p.dotStyle(0).fill, 'var(--yellow)');
assert.equal(p.dotStyle(4).fill, 'var(--cream)');
// 선택지는 네 가지, 기준 프렛은 표시 범위 안에서만 이동한다.
assert.deepEqual(reg.endFret.options.map(o => o.value), ['12','15','17','22']);
p.selectAnchor(30);
assert.ok(reg.board.innerHTML.includes('data-fret="17" role="button" tabindex="0" aria-label="17프렛 기준으로 선택" aria-pressed="true"'));
p.selectAnchor(0);
assert.ok(reg.board.innerHTML.includes('aria-label="1프렛 기준으로 선택" aria-pressed="true"'));
assert.ok(!reg.board.innerHTML.includes('data-fret="0"'));
assert.equal((reg.board.innerHTML.match(/data-inlay="12"/g)||[]).length,1);
assert.equal((reg.board.innerHTML.match(/data-inlay="12"[\s\S]*?<circle/g)||[]).length,1);
assert.ok(reg.board.innerHTML.match(/data-inlay="12">(?:<circle[^>]+>){2}/), '12프렛 인레이는 두 점이다');
const edges = [...p.fretEdges(22,1000)];
assert.equal(edges.length,23);
assert.ok(Math.abs(edges.at(-1)-1000)<1e-9);
assert.ok(edges.every((x,i)=>i===0||x>edges[i-1]));
const firstFret=edges[2]-edges[1],secondFret=edges[3]-edges[2],lastFret=edges.at(-1)-edges.at(-2);
assert.ok(secondFret<firstFret, '프렛은 올라갈수록 좁아진다');
assert.ok(secondFret/firstFret>2**(-1/12), '실제 비율보다 감소 폭을 완만하게 보정한다');
assert.ok(lastFret/firstFret>.65, '높은 프렛도 읽고 누를 폭을 확보한다');

// 펜타토닉은 코드 루트가 아니라 선택한 키 기준이다.
p.setSong('blues'); p.setKey(0);
const shownNotes=()=>[...new Set([...reg.board.innerHTML.matchAll(/pointer-events="none">([A-G][^<]*)<\/text>/g)].map(m=>m[1]))].sort();
p.renderPenta('major');
assert.deepEqual(shownNotes(), ['A','C','D','E','G']);
assert.ok(reg.board.innerHTML.includes('data-open-string="1"'), '개방현은 줄 번호 옆에 표시한다');
p.renderPenta('minor');
assert.deepEqual(shownNotes(), ['B♭','C','E♭','F','G']);
p.setKey(9); p.renderPenta('minor');
assert.deepEqual(shownNotes(), ['A','C','D','E','G']);
assert.ok(reg.board.innerHTML.includes('data-penta-shape="true"'));
assert.ok(reg.board.innerHTML.includes('data-penta-other="true"'));
p.selectTab('penta');
assert.equal(reg.degColor.checked,false,'펜타토닉은 처음에 루트만 색으로 표시한다');
assert.equal(reg.degColorLabel.textContent,'1·♭3·4·5·♭7 색');
reg.degColor.checked=true;reg.degColor.onchange();
assert.equal(p.pentaStyle(3).fill,'var(--mint)');
assert.equal(p.pentaStyle(10).fill,'#79a7ff');

// 실제 메트로놈 함수가 2·4박만 예약하고, 모두 끄면 예약하지 않는지 확인한다.
vm.runInContext(`globalThis.clickTimes=[]; metroClick=t=>clickTimes.push(t);
metroBeats=[false,true,false,true];for(let b=0;b<4;b++)metronome(b,b*.6);`,ctx);
assert.deepEqual([...sandbox.clickTimes].map(t=>Math.round(t*10)),[6,18]);
vm.runInContext(`clickTimes=[];metroBeats=[false,false,false,false];for(let b=0;b<4;b++)metronome(b,b);`,ctx);
assert.deepEqual([...sandbox.clickTimes],[]);

// 저장된 홈과 새 곡 입력은 허용된 항목/코드만 사용한다.
assert.deepEqual([...p.cleanSlots(['shell','penta-minor','bad',null])].slice(0,4).map(s=>s.id),['shell','penta-minor',null,null]);
assert.equal(p.cleanSlots([]).length,11);
assert.equal(p.cleanSlots(Array(20).fill('solo')).length,11);
assert.equal(p.cleanSlots([{id:'solo',color:'triad'}])[0].color,'triad');
assert.equal(p.cleanSlots([{id:'solo',color:'url(bad)'}])[0].color,null);
assert.equal(p.validateSong({title:'  내 곡 ',key:'Am',bars:['Am7','Dm7 G7']}).title,'내 곡');
assert.throws(()=>p.validateSong({title:'내 곡',key:'C',bars:['Cmaj7 invalid']}));
assert.throws(()=>p.validateSong({title:'내 곡',key:'C',bars:[]}));
assert.throws(()=>p.validateSong({title:'내 곡',key:'invalid',bars:['C']}));
// 스케줄러에서도 2·4박만 클릭하고 '메트로놈만'에서는 반주를 예약하지 않는다.
reg.metroOnly=mk({checked:true});
vm.runInContext(`clickTimes=[];metroBeats=[false,true,false,true];
ac={currentTime:0};playing=true;scheduleBar=0;scheduleBeat=0;nextTime=0;queue=[];countLeft=0;
sounds=()=>{throw Error('메트로놈 전용 모드에서 반주가 재생됨');};
for(let b=0;b<4;b++){ac.currentTime=b*.6;scheduler();}playing=false;`,ctx);
assert.deepEqual([...sandbox.clickTimes].map(t=>Math.round(t*10)),[6,18]);

// 새 곡 화면 → 한 마디 2/4코드 편집 → 저장. 등록된 곡은 홈에 자동 추가하지 않는다.
vm.runInContext('ac=null;playing=false;',ctx);
p.openNewSong();
reg.editSongTitle.value='테스트 <곡>';
p.applyBarEdit(['Dm7','G7']);
assert.deepEqual([...p.upcoming()].map(p.name),['Dm7','G7','Cmaj7','Cmaj7']);
vm.runInContext('loopRange=[0,0];',ctx);
assert.deepEqual([...p.upcoming()].map(p.name),['Dm7','G7','Dm7','G7']);
vm.runInContext('loopRange=null;',ctx);
p.applyBarEdit(['Cmaj7','Am7','Dm7','G7']);
assert.deepEqual([...p.upcoming()].map(p.name),['Cmaj7','Am7','Dm7','G7']);
const before=p.seq().map(cs=>cs.map(p.name).join(' ')).join('|');
assert.throws(()=>p.applyBarEdit(['Cmaj7','bad']));
assert.equal(p.seq().map(cs=>cs.map(p.name).join(' ')).join('|'),before);
assert.throws(()=>p.editedBars(0,['C','D','E']));
assert.equal(p.editedBars(4,['F7']).length,5);
assert.equal(p.editedBars(0,[],true).length,3);
// 화면에 표시한 ♭를 그대로 편집해도 파싱한다.
assert.equal(p.name(p.parseBar('Am7♭5')[0]),'Am7♭5');
assert.ok(storage.get('guitar-song-draft-v1'));
p.saveSong();
const savedSongs=JSON.parse(storage.get('guitar-songs-v1'));
assert.equal(Object.values(savedSongs)[0].title,'테스트 <곡>');
assert.equal(Object.values(savedSongs)[0].bars[0],'Cmaj7 Am7 Dm7 G7');
assert.equal(storage.has('guitar-song-draft-v1'),false);
assert.equal(reg.song.options.at(-1).textContent,'테스트 <곡>');
assert.equal(storage.has('guitar-home-v2'),false);
// 다시 편집 후 저장해도 같은 사용자 곡을 갱신한다.
p.applyBarEdit(['Dm7','G7']);p.saveSong();
assert.equal(Object.keys(JSON.parse(storage.get('guitar-songs-v1'))).length,1);
assert.equal(Object.values(JSON.parse(storage.get('guitar-songs-v1')))[0].bars[0],'Dm7 G7');
// 제목·키·코드 검색과 사용자 곡 삭제는 브라우저 저장값까지 함께 갱신한다.
const userId=Object.keys(JSON.parse(storage.get('guitar-songs-v1')))[0];
reg.songSearch.value='테스트';p.drawSongs();
assert.ok(reg.songList.innerHTML.includes('테스트 &lt;곡&gt;'));
assert.equal(reg.songCount.textContent,'연습 1 · 악보 0');
reg.song.value=userId;sandbox.confirm=()=>false;p.deleteSong(userId);
assert.ok(Object.hasOwn(JSON.parse(storage.get('guitar-songs-v1')),userId),'취소하면 곡을 보존한다');
sandbox.confirm=()=>true;p.deleteSong(userId);
assert.ok(!Object.hasOwn(JSON.parse(storage.get('guitar-songs-v1')),userId));
assert.ok(!reg.song.options.some(o=>o.value===userId));
assert.equal(reg.song.value,'blues');
assert.ok(reg.songMessage.textContent.includes('삭제했습니다'));
vm.runInContext("slots=cleanSlots(Array(11).fill('voicing'));activeSlot=null;putTile('solo');",ctx);
assert.ok(reg.homeMessage.textContent.includes('11칸'));
console.log('통과 — 음악 로직 · 프렛 · 펜타토닉 · 메트로놈 · 4코드 미리보기 · 11칸/색상 · 곡 편집/검색/삭제');

// Chord navigation preserves half-bar and quarter-bar positions, including loop boundaries.
vm.runInContext(`playing=false;ac=null;loopRange=null;bar=0;beat=0;`,ctx);
p.setSong('blues');
vm.runInContext(`chooseBar(3);moveChord(1);`,ctx);
assert.equal(p.name(p.current()),'F7');
assert.equal(vm.runInContext('bar',ctx),3);
assert.equal(vm.runInContext('beat',ctx),2);
vm.runInContext(`moveChord(1);moveChord(-1);`,ctx);
assert.equal(vm.runInContext('bar',ctx),3);
assert.equal(vm.runInContext('beat',ctx),2);
vm.runInContext(`loopRange=[3,3];moveChord(1);`,ctx);
assert.equal(p.name(p.current()),'Cm7');
vm.runInContext(`moveChord(-1);`,ctx);
assert.equal(p.name(p.current()),'F7');
vm.runInContext(`loopRange=null;`,ctx);

// Scale notes do not replace chord tones; quality defaults and local overrides remain separate.
p.setSong('251');p.setTab('solo');
vm.runInContext(`bar=0;beat=0;$('showScale').checked=true;draw();`,ctx);
assert.equal(vm.runInContext('selectedScale()',ctx),'dorian');
assert.ok(reg.board.innerHTML.includes('data-scale-note="true"'));
const small=reg.board.innerHTML.match(/data-scale-note="true"[^>]*><circle[^>]*r="([\d.]+)"/);
assert.ok(small&&Number(small[1])<13);
vm.runInContext(`scaleSettings.defaults.m7='aeolian';scaleSettings.chords[scaleKey()]='melodic';`,ctx);
assert.equal(vm.runInContext('selectedScale()',ctx),'melodic');
vm.runInContext(`delete scaleSettings.chords[scaleKey()];`,ctx);
assert.equal(vm.runInContext('selectedScale()',ctx),'aeolian');
assert.deepEqual([...vm.runInContext("SCALES.phrygianDominant[1]",ctx)],[0,1,4,5,7,8,10]);
assert.equal(p.name(p.parseBar('BmM7/A#')[0]),'BmMaj7/B♭');

// All public presets parse in every key. Ten standards = two existing + eight added.
assert.equal(vm.runInContext('STANDARD_PRESETS.length+2',ctx),10);
for(const id of vm.runInContext('STANDARD_PRESETS.map(p=>p.id)',ctx)){
 p.setSong(id);for(let key=0;key<12;key++){p.setKey(key);assert.ok(p.seq().flat().every(c=>Number.isInteger(c.root)&&c.root>=0&&c.root<12));}
}

// Every photographed measure is represented; 16th-note durations also cover the final slide.
const score=JSON.parse(vm.runInContext('JSON.stringify(SILHOUETTE)',ctx));
const samurai=JSON.parse(vm.runInContext('JSON.stringify(SAMURAI_HEART)',ctx));
const parker=JSON.parse(vm.runInContext('JSON.stringify(PARKER_BOOK)',ctx));
assert.equal(parker.length,19);
assert.equal(parker[0].start,18);assert.equal(parker.at(-1).end,102);
assert.ok(parker.every((item,i)=>i===0||item.start===parker[i-1].end+1),'PDF 악보 범위가 18–102쪽을 빠짐없이 잇는다');
assert.equal(score.bars.length,178);assert.equal(score.score.length,178);
for(let i=0;i<178;i++){
 assert.ok(score.bars[i],`Missing chord bar ${i+1}`);
 const events=score.score[i];assert.ok(events?.length,`Missing score bar ${i+1}`);
 let time=0;for(const e of events){assert.equal(e.at,time,`Gap/overlap in bar ${i+1}`);time+=e.duration;assert.ok(e.duration>0);for(const n of e.notes){assert.ok(Number.isInteger(n.s)&&n.s>=0&&n.s<6);assert.ok(Number.isInteger(n.f)&&n.f>=0&&n.f<=22);}}
 assert.equal(time,4,`Incorrect duration in bar ${i+1}`);
}
assert.deepEqual(score.score[0].map(e=>e.notes[0].f),[9,7,9,7,0,7,9,7]);
assert.deepEqual(score.score[0].map(e=>e.notes[0].s),[3,3,3,2,3,3,3,3]);
assert.equal(score.score[116][0].notes.length,0,'117마디 전체 쉼표');
assert.equal(score.score[166].at(-1).duration,.25,'167마디 마지막 슬라이드');
assert.equal(score.score[171][0].tie,true,'172마디는 171마디에서 붙임줄');
assert.equal(samurai.bars.length,61);assert.equal(samurai.score.length,61);
for(let i=0;i<61;i++){
 assert.ok(samurai.bars[i],`Missing Samurai Heart chord bar ${i+1}`);
 const events=samurai.score[i];assert.ok(events?.length,`Missing Samurai Heart score bar ${i+1}`);
 let time=0;for(const e of events){assert.equal(e.at,time,`Samurai Heart gap/overlap in bar ${i+1}`);time+=e.duration;assert.ok(e.duration>0);for(const n of e.notes){assert.ok(Number.isInteger(n.s)&&n.s>=0&&n.s<6);assert.ok(Number.isInteger(n.f)&&n.f>=0&&n.f<=22);}}
 assert.equal(time,4,`Incorrect Samurai Heart duration in bar ${i+1}`);
}
assert.equal(samurai.sections.at(-1)[0],61);
p.setSong('silhouette');p.setTab('penta');reg.pentaType.value='minor';
vm.runInContext(`bar=0;beat=0;draw();`,ctx);
assert.ok(reg.board.innerHTML.includes('data-score-note="3:9"'));
vm.runInContext(`bar=116;beat=2;draw();`,ctx);
assert.ok(!reg.board.innerHTML.includes('data-score-note='),'쉼표에서 큰 운지 원이 사라져야 함');
vm.runInContext(`bar=166;beat=3.75;draw();`,ctx);
assert.ok(reg.board.innerHTML.includes('data-score-note="0:17"'));
vm.runInContext(`previousGuide=[{s:0,f:1}];bar=0;beat=0;draw();`,ctx);
assert.ok(reg.board.innerHTML.includes('data-previous-note="0:1"'),'직전 악보 운지는 연한 잔상으로 남긴다');
reg.bpm.value='183';vm.runInContext(`bar=0;beat=0;syncTimeline();`,ctx);
assert.equal(reg.songTimeline.hidden,false);assert.equal(reg.chart.hidden,true);assert.equal(reg.chartTools.hidden,true);
assert.equal(reg.songSeek.max,'711.75');assert.ok(reg.songTime.textContent.endsWith('/ 3:53'));
p.seekScore(366);assert.equal(vm.runInContext('bar',ctx),91);assert.equal(vm.runInContext('beat',ctx),2);
p.setSong('samurai-heart');p.setTab('penta');reg.pentaType.value='minor';reg.bpm.value='113';
vm.runInContext(`bar=0;beat=0;draw();`,ctx);
assert.ok(reg.board.innerHTML.includes('data-score-note="1:9"'));
assert.equal(reg.boardTitle.textContent,'Samurai Heart · Intro');
assert.equal(reg.songSeek.max,'243.75');assert.ok(reg.songTime.textContent.endsWith('/ 2:10'));
p.setSong('blues');p.syncTimeline();assert.equal(reg.songTimeline.hidden,true);assert.equal(reg.chart.hidden,false);
p.setSong('silhouette');

// Scheduler advances at the score's eighth notes while the metronome remains on four beats.
vm.runInContext(`globalThis.scheduledGuide=[];note=(kind,midi,t,volume,duration)=>scheduledGuide.push({midi,t,duration});
metroBeats=[false,true,false,true];clickTimes=[];$('bpm').value=120;$('metroOnly').checked=true;
$('scoreAudio').checked=true;bar=0;beat=0;playing=true;scoreFinished=false;resumeGuide=true;scheduleBar=0;scheduleBeat=0;countLeft=0;nextTime=0;queue=[];ac={currentTime:0};
for(let n=0;n<16;n++){ac.currentTime=n*.125;scheduler();}playing=false;`,ctx);
assert.deepEqual([...sandbox.scheduledGuide].map(e=>e.midi),[59,57,59,62,50,57,59,57]);
assert.deepEqual([...sandbox.clickTimes],[.5,1.5]);
vm.runInContext(`playing=false;ac=null;`,ctx);
console.log('통과 — 코드 단위 이동 · 코드별 스케일 · 스탠다드 10곡 · 실루엣 178마디 · 사무라이 하트 61마디 · 운지/16분음표/쉼표/메트로놈');
// The complete score ends once; a selected last-bar loop stays in that bar.
vm.runInContext(`ac={currentTime:0};playing=true;scoreFinished=false;resumeGuide=false;loopRange=null;scheduleBar=177;scheduleBeat=3.75;nextTime=0;queue=[];countLeft=0;bar=177;beat=3.5;scheduler();ac.currentTime=.13;scheduler();`,ctx);
assert.equal(vm.runInContext('playing',ctx),false);
assert.equal(reg.playStatus.textContent,'곡 끝');
vm.runInContext(`ac={currentTime:0};playing=true;scoreFinished=false;loopRange=[177,177];scheduleBar=177;scheduleBeat=3.75;nextTime=0;queue=[];countLeft=0;bar=177;beat=3.5;scheduler();ac.currentTime=.13;scheduler();`,ctx);
assert.equal(vm.runInContext('playing',ctx),true);
assert.equal(vm.runInContext('bar',ctx),177);
assert.equal(vm.runInContext('scoreFinished',ctx),false);
vm.runInContext(`playing=false;ac=null;loopRange=null;`,ctx);
console.log('통과 — 실루엣 곡 끝 정지 · 마지막 마디 반복');

/* index.html 의 실제 스크립트를 최소 DOM 스텁 위에서 돌려 음악 로직만 확인한다.
   프레임워크 없음. `node check.mjs` — 조용히 끝나면 통과. */
import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';

const html = fs.readFileSync(new URL('./index.html', import.meta.url), 'utf8');
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
  addEventListener: noop, scrollTo: noop, setInterval: () => 0, clearInterval: noop, setTimeout: noop,
  confirm: () => false, console,
};
const storage=new Map();
sandbox.localStorage = { getItem: key => storage.get(key)??null, setItem: (key,value)=>storage.set(key,value), removeItem: key=>storage.delete(key) };

const ctx = vm.createContext(sandbox);
vm.runInContext(src + `
;globalThis.probe = { seq, NAMES, KEYS, keyOf, shift, voicings, current, span, esc, parseBar, name, dotStyle, fretEdges, cleanSlots, validateSong, upcoming, editedBars, openNewSong, applyBarEdit, saveSong, putTile, selectAnchor: setAnchor,
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
assert.deepEqual([p.span(25), p.span(480), p.span(5400)], ['25초', '8분', '1시간 30분']);
assert.equal(p.esc('<img onerror="x">'), '&lt;img onerror=&quot;x&quot;&gt;');

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
assert.ok(reg.board.innerHTML.includes('aria-label="0프렛 기준으로 선택" aria-pressed="true"'));
const edges = [...p.fretEdges(22,1000)];
assert.equal(edges.length,24);
assert.ok(Math.abs(edges.at(-1)-1000)<1e-9);
assert.ok(edges.every((x,i)=>i===0||x>edges[i-1]));
assert.ok(Math.abs((edges[3]-edges[2])/(edges[2]-edges[1])-2**(-1/12))<1e-10);

// 펜타토닉은 코드 루트가 아니라 선택한 키 기준이다.
p.setSong('blues'); p.setKey(0);
const shownNotes=()=>[...new Set([...reg.board.innerHTML.matchAll(/pointer-events="none">([A-G][^<]*)<\/text>/g)].map(m=>m[1]))].sort();
p.renderPenta('major');
assert.deepEqual(shownNotes(), ['A','C','D','E','G']);
p.renderPenta('minor');
assert.deepEqual(shownNotes(), ['B♭','C','E♭','F','G']);
p.setKey(9); p.renderPenta('minor');
assert.deepEqual(shownNotes(), ['A','C','D','E','G']);

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
vm.runInContext('ac=null;playedAt=null;playing=false;',ctx);
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
vm.runInContext("slots=cleanSlots(Array(11).fill('voicing'));activeSlot=null;putTile('solo');",ctx);
assert.ok(reg.homeMessage.textContent.includes('11칸'));
console.log('통과 — 음악 로직 · 프렛 · 펜타토닉 · 메트로놈 · 4코드 미리보기 · 11칸/색상 · 새 곡 편집/저장');

'use strict';
// Chord-only practice arrangements. Sources are shown beside each progression.
const STANDARD_PRESETS=[
 {id:'blue-bossa',title:'Blue Bossa',key:'Cm',bars:'Cm7|Cm7|Fm7|Fm7|Dm7b5|G7b9|Cm7|Cm7|Ebm7|Ab7|Dbmaj7|Dbmaj7|Dm7b5|G7b9|Cm7|Dm7b5 G7b9',url:'https://www.jazzguitar.be/blog/blue-bossa/',source:'Jazz Guitar Online',note:'16마디 · C 단조. 기본 7화음으로 정리한 연습용 진행.'},
 {id:'all-of-me',title:'All of Me',key:'C',bars:'Cmaj7|Cmaj7|E7|E7|A7|A7|Dm7|Dm7|E7|E7|Am7|Am7|D7|D7|Dm7|G7|Cmaj7|Cmaj7|E7|E7|A7|A7|Dm7|Dm7|Fmaj7|Fm7|Em7|A7|Dm7|G7|Cmaj7 A7|Dm7 G7',url:'https://www.jazzguitar.be/blog/all-of-me/',source:'Jazz Guitar Online',note:'32마디 · C 장조. 마지막 두 마디는 반복 연습용 ii–V 턴어라운드.'},
 {id:'satin-doll',title:'Satin Doll',key:'C',bars:'Dm7 G7|Dm7 G7|Em7 A7|Em7 A7|Am7 D7|Abm7 Db7|Cmaj7|Em7 A7|Dm7 G7|Dm7 G7|Em7 A7|Em7 A7|Am7 D7|Abm7 Db7|Cmaj7|Cmaj7|Gm7 C7|Gm7 C7|Fmaj7|Fmaj7|Am7 D7|Am7 D7|Dm7|G7|Dm7 G7|Dm7 G7|Em7 A7|Em7 A7|Am7 D7|Abm7 Db7|Cmaj7|Em7 A7',url:'https://www.jazz-guitar-licks.com/blog/jazz-standards/satin-doll.html',source:'Jazz Guitar Licks',note:'32마디 · AABA. 기본 7화음 진행, A구간 끝은 Cmaj7 / Em7–A7으로 단순화.'},
 {id:'a-train',title:'Take the “A” Train',key:'C',bars:'Cmaj7|Cmaj7|D7|D7|Dm7|G7|Cmaj7|Dm7 G7|Cmaj7|Cmaj7|D7|D7|Dm7|G7|Cmaj7|Gm7 C7|Fmaj7|Fmaj7|Fmaj7|Fmaj7|D7|D7|Dm7|G7|Cmaj7|Cmaj7|D7|D7|Dm7|G7|Cmaj7|Dm7 G7',url:'https://www.jazzguitarlessons.net/blog/take-the-a-train',source:'Jazz Guitar Lessons · Marc-André Séguin',note:'32마디 · AABA. D7의 ♯11 텐션은 생략. 스케일 설정에서 리디안 도미넌트를 선택할 수 있습니다.'},
 {id:'solar',title:'Solar',key:'Cm',bars:'CmMaj7|CmMaj7|Gm7|C7|Fmaj7|Fmaj7|Fm7|Bb7|Ebmaj7|Ebm7 Ab7|Dbmaj7|Dm7b5 G7b9',url:'https://www.jazzguitar.be/blog/solar-jazz-guitar/',source:'Jazz Guitar Online',note:'12마디 · C 단조에서 F, E♭, D♭ 장조를 거쳐 돌아오는 진행. 시작 코드는 CmMaj7.'},
 {id:'lady-bird',title:'Lady Bird',key:'C',bars:'Cmaj7|Cmaj7|Fm7|Bb7|Cmaj7|Cmaj7|Bbm7|Eb7|Abmaj7|Abmaj7|Am7|D7|Dm7|G7|Cmaj7 Ebmaj7|Abmaj7 Dbmaj7',url:'https://www.learnjazzstandards.com/jazz-standards/lady-bird/',source:'Learn Jazz Standards',note:'16마디 · C Instruments 진행. 마지막 두 마디 Dameron 턴어라운드.'},
 {id:'recorda-me',title:'Recorda Me',key:'Am',bars:'Am7|Am7|Am7|Am7|Cm7|Cm7|Cm7|F7|Bbmaj7|Bbm7 Eb7|Abmaj7|Abm7 Db7|Gbmaj7|Gm7 C7|Fmaj7|E7#9',url:'https://www.learnjazzstandards.com/jazz-standards/recorda-me/',source:'Learn Jazz Standards',note:'인트로를 제외한 본문 16마디. Am / Cm은 보이싱 연습을 위해 m7으로 표기.'},
 {id:'so-what',title:'So What',key:'Dm',bars:[...Array(16).fill('Dm7'),...Array(8).fill('Ebm7'),...Array(8).fill('Dm7')].join('|'),url:'https://www.fouronsixmusic.com/post/how-to-improvise-on-miles-davis-so-what-a-beginner-s-guide-to-modal-jazz-improvisation',source:'Four on Six Music',note:'32마디 · D 도리안 16마디 → E♭ 도리안 8마디 → D 도리안 8마디. 보이싱은 m7로 표시.'}
];

// Index from the user's Charlie Parker for Guitar PDF. The copyrighted score itself is not bundled.
const PARKER_BOOK=[
 {title:'Billie’s Bounce (Bill’s Bounce)',start:18,end:25},
 {title:'Now’s the Time · 1945',start:26,end:28},
 {title:'Anthropology',start:29,end:33},
 {title:'Ko Ko',start:34,end:42},
 {title:'Moose the Mooche',start:43,end:48},
 {title:'Yardbird Suite',start:49,end:52},
 {title:'Ornithology',start:53,end:56},
 {title:'Donna Lee',start:57,end:62},
 {title:'Cheryl',start:63,end:65},
 {title:'Scrapple from the Apple',start:66,end:68},
 {title:'Parker’s Mood',start:69,end:72},
 {title:'Blues (Fast)',start:73,end:75},
 {title:'Bloomdido',start:76,end:79},
 {title:'Au Privave',start:80,end:82},
 {title:'K.C. Blues',start:83,end:85},
 {title:'Blues for Alice',start:86,end:88},
 {title:'Kim',start:89,end:92},
 {title:'Now’s the Time · 1953',start:93,end:97},
 {title:'Confirmation',start:98,end:102}
];

// Silhouette: entered from the user's six-page high-resolution tab (183 BPM, 178 bars).
// Tokens use printed string numbers (1 = high E). @ = quarter-note duration;
// + = simultaneous notes; ~ = continuation of a tie from the previous bar.
// The photos and lyrics are not bundled with this site.
const SILHOUETTE=(()=>{
 const bars=Array(178),score=Array(178);
 function put(first,chords){chords.split('|').forEach((c,i)=>bars[first-1+i]=c);}
 function measure(text){let at=0;return text.split(/\s+/).map(token=>{
   const [body,technique='']=token.split('!'),[positions,length]=body.split('@'),duration=length===undefined?.5:Number(length),tie=positions.startsWith('~');
   const notes=positions==='rest'?[]:positions.replace('~','').split('+').map(n=>{const [s,f]=n.split(':').map(Number);return {s:s-1,f};});
   const event={at,duration,notes,technique,tie};at+=duration;return event;
 });}
 function notes(first,...patterns){patterns.forEach((p,i)=>score[first-1+i]=measure(p));}
 function copy(from,to,count){for(let i=0;i<count;i++)score[to-1+i]=score[from-1+i].map(e=>({...e,notes:e.notes.map(n=>({...n}))}));}
 const cycle='D/F#|G|A|A#dim7|Bm7|F#m7|G|A';
 put(1,'Bm A|G A|Bm A|G A|Bm A|G A|Bm A|G A');put(9,cycle);put(17,'D/F#|G|A|A#dim7|Bm7|D/F#|G|A');put(25,cycle);
 put(33,'Bm|BmMaj7/A#|Bm7/A|Bm6/G#|G|G|A|A');put(41,cycle);put(49,cycle);
 put(57,'D/F# G G A|A Bm7');put(59,cycle);put(67,cycle);put(75,'Bm|BmMaj7/A#|Bm7/A|Bm6/G#|G|G|A|A');
 put(83,cycle);put(91,cycle);put(99,'Bm A|G A|Bm A|G A|Bm A|G A|Bm A|G A');
 put(107,'G|A#dim7|Bm7|D/F#|Em7|F#m7|G|G|A|A');put(117,cycle);put(125,cycle);put(133,cycle);put(141,cycle);
 put(149,'G|A#dim7|Bm7|Bm7|G|A');put(155,cycle);put(163,cycle);put(171,'Bm A|G A|Bm A|G A|Bm A|G A|Bm A|G A');
 const riff='4:9 4:7 4:9 3:7 4:0 4:7 4:9 4:7';
 const fill='4:9 3:7 4:0 4:7 4:9 2:8 2:7 3:7';
 notes(1,riff,fill,riff,'4:9 3:7 4:0 4:7 4:9 1:7 2:8 3:7',riff,fill, riff,'4:9 3:7 4:0 4:7 4:9@1 rest@1');
 notes(9,'3:7@1.5 4:7@1.5 3:7@1','3:9@1.5 4:7@1.5 3:9@1','2:7@1.5 2:8@1.5 2:7 3:9','3:7@1.5 1:15@1.5 1:14@1','2:15@1.5 1:15@1.5 1:14@1','2:15@4','1:15@1.5 1:14@1.5 2:15@1','2:17@1.5 1:14@1.5 2:14@1');
 notes(17,'2:15@4','~2:15@4','5:0+4:2+3:2+2:2@4','5:1+4:2+3:0+2:2@4','5:2+4:0+3:2+2:3@4','6:2+4:0+3:2+2:3@4','6:3+5:2+4:0+3:0+2:3+1:3@4','5:0+4:2+3:2+2:2@4');
 const verseA='3:9 3:7 3:9 2:10 rest 3:7 3:9 3:7',verseB='3:9 2:10 rest 3:7 3:9 2:8 2:7 3:7';
 notes(25,verseA,verseB,verseA,verseB,verseA,verseB,verseA,verseB);
 notes(33,'4:9@1 3:7 2:7@2.5','4:8@1 3:7 2:7@2.5','4:7@1 3:7 2:7@2.5','4:6+3:7+2:7+1:7@4');
 const oct=f=>`5:${f}+3:${f+2}`,high=f=>`4:${f}+2:${f+3}`;
 const eighth=(shape)=>Array(8).fill(shape).join(' ');
 const strum=(shape)=>shape+'@1 '+Array(6).fill(shape).join(' ');
 const slide=(a,b)=>`${a}@1 ${a} ${b}!slide ${b} ${b} ${b}@1`;
 const climb=fs=>fs.map(f=>oct(f)+'@1').join(' ');
 notes(37,eighth(oct(7)),eighth(oct(7)),eighth(oct(9)),`${oct(10)} ${oct(10)} ${oct(10)} ${oct(10)} ${oct(9)}@1 rest@1`);
 const chorus=[strum(oct(5)),strum(oct(7)),slide(oct(9),oct(10)),`${oct(16)} ${oct(16)} ${oct(16)}@1 ${oct(7)}!slide ${oct(7)} ${oct(7)}@1`,strum(oct(5)),strum(oct(7)),slide(oct(9),oct(10)),climb([4,5,7,9])];
 notes(41,...chorus);copy(41,49,8);
 notes(57,`${oct(5)} ${oct(5)} rest ${oct(7)} ${oct(7)} rest ${oct(9)} ${oct(9)}`,`rest ${oct(10)} ${oct(10)} rest 4:7+3:7+2:7+1:7@2!harmonic`);
 notes(59,'6:2@1 3:2 2:3@2.5','6:3@1 3:2 2:3@2.5','5:0@1 3:2 2:2@2.5','5:1@1 4:2 2:2@2.5','5:2@1 3:2 2:3@2.5','6:2@1 4:2 3:2@2.5','6:3@1 3:0 2:0@2.5','5:0@1 3:2 2:2@2.5');
 copy(25,67,8);copy(33,75,6);
 notes(81,`${oct(9)} ${oct(9)} ${oct(9)} ${oct(9)} ${oct(10)} ${oct(10)} ${oct(10)} ${oct(10)}`,`${oct(11)} ${oct(11)} ${oct(11)} ${oct(11)} ${oct(12)} ${oct(12)} ${oct(12)}@1`);
 notes(83,...chorus);score[85]=measure(slide(oct(4),oct(7)));copy(83,91,8);
 copy(1,99,8);
 notes(103,'4:9 4:7 4:9 1:7 4:0 4:7 4:9 4:7','4:9 1:7 4:0 4:7 4:9 2:7 2:8 2:10',riff,'4:9 3:7 4:0 4:7 4:9 3:7 3:9@1!bend');
 notes(107,'2:15@1.5 2:14@1.5 4:16@1','2:15@1.5 2:14@1.5 4:16@1','2:17@1.5 2:15@1.5 3:16@1','2:17@1.5 2:15@1.5 3:16@1','1:14@1.5 2:17@1.5 3:16@1','1:14@1.5 2:17@1.5 3:16@1','~3:16@1 3:16+2:17+1:19@3','~3:16+2:17+1:19@4','2:18+1:19@2!tremolo 2:16+1:17@2!tremolo','2:19+1:20@2!tremolo 2:18+1:19@2!tremolo');
 notes(117,...chorus);score[116]=measure('rest@4');score[117]=measure(Array(4).fill(oct(7)+'@1').join(' '));score[119]=measure(slide(oct(4),oct(7)));
 copy(83,125,8);score[131]=measure([7,9,11,14].map(f=>high(f)+'@1').join(' '));
 notes(133,strum(high(12)),strum(high(14)),strum(high(16)),eighth(high(16)),strum(high(12)),strum(high(14)),slide(high(16),high(17)),[11,12,14,16].map(f=>high(f)+'@1').join(' '));
 copy(133,141,8);score[142]=measure(slide(high(16),high(17)));score[143]=measure(slide(high(11),high(14)));
 notes(149,`${high(12)}@1.5 ${high(11)}@1.5 ${oct(12)}@1`,`${high(14)}@1.5 ${high(12)}@1.5 ${oct(12)}@1`,`${high(11)}@1.5 ${high(9)}@1.5 ${oct(12)}@1`,`${high(12)}@1.5 ${high(11)}@1.5 ${high(9)}@1`,`${high(9)} ${high(9)} ${high(9)}@1 ${high(11)} ${high(11)} ${high(11)} ${high(11)}`,`${high(12)} ${high(12)} ${high(12)}@1 ${high(16)} ${high(16)} ${high(16)} ${high(16)}`);
 notes(155,'3:7@1.5 2:10@1.5 2:8 2:7','3:7@1.5 2:10@1.5 2:8 2:7','3:7@1.5 1:10@1.5 1:9 2:10','2:7@1.5 2:8@1.5 2:10@1','2:15@1.5 1:17@1.5 1:15 1:14','2:15@4','4:7@1!tremolo 4:9@1!tremolo 3:7@1!tremolo 3:9@1!tremolo','2:7@1!tremolo 2:8@1!tremolo 2:10@1!tremolo 1:10@1');
 notes(163,'1:15@1.5 1:14@1.5 2:15@1','~2:15@4','1:15@1.5 1:14@1.5 1:15@1','1:17@1.5 1:19@1.5 1:21@1','1:22@1.5 1:21@1.5 1:19@.75 1:17@.25!slide','1:17@4','1:15@1.5 1:14@1.5 1:15@1','1:17@1.5 1:19@1.5 1:21@1');
 notes(171,'1:22@4','~1:22@4','~1:22@4','~1:22@4',riff,fill,riff,'4:9 3:7 4:0 4:7 4:9 2:8 3:7 3:9');
 const sections=[[1,'Intro'],[9,'Intro · 멜로디'],[17,'A'],[25,'A · 리프'],[33,'B'],[41,'C'],[57,'Interlude'],[59,'A′'],[67,'A′ · 리프'],[75,'B′'],[83,'C′'],[99,'Interlude′'],[107,'멜로디'],[117,'D'],[133,'D · 높은 포지션'],[149,'연결'],[155,'Outro'],[163,'Outro · 높은 포지션'],[171,'Ending']];
 return {bars,score,sections};
})();

// Samurai Heart (Some Like It Hot!!): 90-bar lead-guitar part from the user's
// Guitar Pro PDF. The first three measures are the score's count-in. String/fret
// positions, muted attacks, and rests are read from the PDF's vector coordinates
// and aligned to the printed sixteenth-note grid.
const SAMURAI_HEART=(()=>{
 const bars=Array.from({length:90},(_,i)=>['Cm','Ab','Eb','Bb'][Math.floor(i/4)%4]);
 function measure(text){let at=0;return text.split(/\s+/).map(token=>{
  const [body,technique='']=token.split('!'),[positions,length]=body.split('@'),duration=Number(length),notes=positions==='rest'?[]:positions.split('+').map(n=>{const [s,f]=n.split(':').map(Number);return{s:s-1,f};}),event={at,duration,notes,technique,tie:false};at+=duration;return event;
 });}
 const patterns=[
  'rest@4', // 1
  'rest@4', // 2
  'rest@4', // 3
  'rest@0.5 2:9@0.25 rest@0.25 2:8@0.25 3:8@0.25 rest@0.25 3:10@0.25 rest@0.25 3:8@0.25 rest@0.5 3:8@0.25 3:7@0.25 3:8@0.5', // 4
  'rest@0.5 2:9@0.25 rest@0.25 2:8@0.25 3:8@0.25 rest@0.25 3:10@0.5 rest@0.25 3:8@0.25 rest@0.25 3:8@0.25 4:8@0.75', // 5
  'rest@0.5 2:9@0.25 rest@0.25 2:8@0.25 3:8@0.25 rest@0.25 3:10@0.25 rest@0.25 3:8@0.25 rest@0.5 3:8@0.25 3:7@0.25 3:8@0.5', // 6
  '3:7@0.25 3:8@0.25 3:8@0.25 3:7@0.25 3:8@0.25 3:8@0.25 3:7@0.5 3:8@0.25 3:7@0.25 3:8@0.25 3:8@0.25 3:7@0.25 3:10@0.25 3:8@0.5', // 7
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.5 3:8@0.25 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 rest@0.75', // 8
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.5 3:8@0.25 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 3:10@0.75', // 9
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.25 3:8@0.5 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 rest@0.75', // 10
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.25 3:8@0.25 rest@0.25 3:10@0.25 rest@0.5 3:10@0.25 rest@0.5 3:8@0.25 3:7@0.5', // 11
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.25 3:8@0.5 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 rest@0.75', // 12
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.5 3:8@0.25 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 3:10@0.75', // 13
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.5 3:8@0.25 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 rest@0.75', // 14
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.25 3:8@0.25 rest@0.25 3:10@0.25 rest@0.5 3:10@0.25 rest@0.5 3:8@0.25 3:7@0.5', // 15
  '6:3@0.25 6:3@0.5 5:5@0.25 5:6@0.5 6:3@0.25 6:3@0.5 5:5@0.5 5:5@0.25 5:6@0.5 5:5@0.5', // 16
  '6:4@0.25 6:4@0.5 5:5@0.25 5:6@0.5 6:6@0.25 6:6@0.5 5:5@0.5 5:5@0.25 5:6@0.5 5:5@0.5', // 17
  '6:3@0.25 6:3@0.5 5:5@0.25 5:6@0.5 6:3@0.25 6:3@0.5 5:5@0.5 5:5@0.25 5:6@0.5 5:5@0.5', // 18
  '6:4@0.25 6:4@0.5 5:5@0.25 5:6@0.5 6:6@0.25 6:6@0.5 5:5@0.5 5:5@0.25 5:6@0.5 rest@0.5', // 19
  '2:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:8@0.75', // 20
  'rest@0.5 4:8@0.25 4:10@0.25 3:8@0.5 4:10@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:8@0.5 3:10@0.75', // 21
  '4:8@0.25 4:10@0.25 3:8@0.25 3:8@0.5 3:8@0.25 3:10@0.25 3:10@0.5 3:10@0.25 3:10@0.25 3:8@0.25 3:10@0.5 3:8@0.5', // 22
  'rest@0.5 3:10@0.5 3:10@0.5 3:8@0.5 3:10@0.5 3:8@0.5 3:8@0.5 3:8@0.5', // 23
  '2:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:8@0.75', // 24
  'rest@0.5 4:8@0.25 4:10@0.25 3:8@0.5 4:10@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:8@0.5 3:10@0.75', // 25
  '4:8@0.25 4:10@0.25 3:8@0.25 3:8@0.5 3:8@0.25 3:10@0.25 3:10@0.5 3:10@0.25 3:10@0.25 3:8@0.25 3:10@0.5 3:8@0.5', // 26
  'rest@0.5 3:10@0.5 3:10@0.5 3:8@0.5 3:10@0.5 3:8@0.5 3:7@0.5 3:8@0.5', // 27
  'rest@0.5 2:9@0.25 rest@0.25 2:8@0.25 3:8@0.25 rest@0.25 3:10@0.25 rest@0.25 3:8@0.25 rest@0.5 3:8@0.25 3:7@0.25 3:8@0.5', // 28
  '2:8@1 2:11@1 rest@1 rest@1', // 29
  'rest@0.5 2:9@0.25 rest@0.25 2:8@0.25 3:8@0.25 rest@0.25 3:10@0.25 rest@0.25 3:8@0.25 rest@0.5 3:8@0.25 3:7@0.25 3:8@0.5', // 30
  'rest@0.5 2:9@0.25 rest@0.25 2:8@0.25 3:8@0.25 rest@0.25 3:10@0.5 rest@0.25 3:8@0.25 rest@0.25 3:8@0.25 4:8@0.75', // 31
  '5:6@0.25 5:8@0.25 rest@0.25 rest@0.25 4:5@0.25 4:6@0.25 rest@0.25 rest@0.5 4:6@0.25 4:8@0.25 rest@0.25 rest@0.25 3:7@0.25 3:8@0.5', // 32
  '3:10@0.5 2:11@0.5 2:8@0.25 3:10@0.5 3:8@0.5 3:10@0.5 3:8@0.5 1:11@0.75', // 33
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.5 3:8@0.25 rest@0.5 3:7@0.25 3:8@0.25 rest@0.25 3:8@0.25 rest@0.75', // 34
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.5 3:8@0.25 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 3:10@0.75', // 35
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.5 3:8@0.25 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 rest@0.75', // 36
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.25 3:8@0.25 rest@0.25 3:10@0.25 rest@0.5 3:10@0.25 rest@0.5 3:8@0.25 3:7@0.5', // 37
  'rest@0.5 3:8@0.25 3:8@0.5 3:7@0.25 3:8@0.25 rest@0.25 rest@0.25 rest@0.25 3:8@0.25 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25', // 38
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.5 3:8@0.25 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 3:10@0.75', // 39
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.25 3:8@0.5 rest@0.25 3:7@0.5 3:8@0.25 rest@0.25 3:8@0.25 rest@0.75', // 40
  'rest@0.5 3:7@0.25 3:8@0.25 rest@0.25 3:8@0.25 rest@0.25 3:10@0.25 rest@0.5 3:10@0.25 rest@0.5 3:8@0.25 3:7@0.5', // 41
  '6:3@0.25 6:3@0.5 5:5@0.25 5:6@0.5 6:3@0.25 6:3@0.5 5:5@0.5 5:5@0.25 5:6@0.5 5:5@0.5', // 42
  '6:4@0.25 6:4@0.5 5:5@0.25 5:6@0.5 6:6@0.25 6:6@0.5 5:5@0.5 5:5@0.25 5:6@0.5 5:5@0.5', // 43
  '6:3@0.25 6:3@0.5 5:5@0.25 5:6@0.5 6:3@0.25 6:3@0.5 5:5@0.5 5:5@0.25 5:6@0.5 5:5@0.5', // 44
  '6:4@0.25 6:4@0.5 5:5@0.25 5:6@0.5 6:6@0.25 6:6@0.5 5:5@0.5 5:5@0.25 5:6@1', // 45
  '2:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:8@0.75', // 46
  '4:8@0.25 4:10@0.5 3:8@0.25 4:10@0.5 3:8@0.25 3:10@0.5 3:10@0.5 3:8@0.5 3:10@0.75', // 47
  '4:8@0.25 4:10@0.25 3:8@0.5 3:8@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:10@0.25 3:10@0.25 3:8@0.25 3:10@0.5 3:8@0.5', // 48
  'rest@0.5 3:10@0.5 3:10@0.5 3:8@0.5 3:10@0.5 3:8@0.5 3:8@0.5 3:8@0.5', // 49
  '2:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:8@0.75', // 50
  'rest@0.5 4:8@0.25 4:10@0.25 3:8@0.5 4:10@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:8@0.5 3:10@0.75', // 51
  '4:8@0.25 4:10@0.25 3:8@0.5 3:8@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:10@0.25 3:10@0.25 3:8@0.25 3:10@0.5 3:8@0.5', // 52
  'rest@0.5 3:10@0.5 3:10@0.5 3:8@0.5 3:10@0.5 3:8@0.5 3:7@0.5 rest@0.5', // 53
  '2:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:8@0.75', // 54
  'rest@0.5 4:8@0.25 4:10@0.25 3:8@0.5 4:10@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:8@0.5 3:10@0.75', // 55
  '4:8@0.25 4:10@0.25 3:8@0.25 3:8@0.5 3:8@0.25 3:10@0.25 3:10@0.5 3:10@0.25 3:10@0.25 3:8@0.25 3:10@0.5 3:8@0.5', // 56
  'rest@0.5 3:10@0.5 3:10@0.5 3:8@0.5 3:10@0.5 3:8@0.5 3:8@0.5 rest@0.5', // 57
  '3:12@0.25 3:8@0.25 3:10@0.25 3:15@0.25 3:8@0.25 3:10@0.25 3:13@0.25 3:8@0.25 3:10@0.25 3:12@0.25 3:8@0.25 3:10@0.25 3:12@0.25 3:13@0.25 3:12@0.25 3:8@0.25', // 58
  '3:12@0.25 3:8@0.25 3:10@0.25 3:15@0.25 3:8@0.25 3:10@0.25 3:13@0.25 3:8@0.25 3:10@0.25 3:12@0.25 3:8@0.25 3:10@0.25 3:12@0.25 3:10@0.25 3:8@0.25 rest@0.25', // 59
  '3:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:12@0.75', // 60
  'rest@0.25 2:11@0.25 2:13@0.25 1:11@0.25 1:13@0.25 1:11@0.5 2:13@0.25 1:15@0.25 1:11@0.25 1:13@0.25 1:11@0.25 2:13@0.25 1:13@0.25 1:11@0.25 2:13@0.25', // 61
  '1:11@0.75 3:12@0.5 2:11@0.25 3:12@0.5 2:11@0.25 2:13@0.25 1:11@0.5 2:13@0.25 1:11@0.25 1:13@0.5', // 62
  '1:13@0.5 1:13@0.5 1:13@0.5 1:13@0.25 1:13@0.5 1:13@0.5 1:13@0.25 1:11@0.5 2:13@0.5', // 63
  '1:11@4', // 64
  'rest@4', // 65
  'rest@4', // 66
  'rest@4', // 67
  '1:11@0.5 1:10@0.5 2:11@0.5 1:11@0.5 1:10@0.5 2:11@0.5 1:11@0.5 1:10@0.5', // 68
  '1:11@0.5 1:10@0.5 2:11@0.5 1:11@0.5 1:10@0.5 2:11@0.5 1:11@0.5 1:10@0.5', // 69
  '1:11@0.5 1:10@0.5 2:11@0.5 1:11@0.5 1:10@0.5 2:11@0.5 1:11@0.5 1:10@0.5', // 70
  '1:11@0.5 1:10@0.75 2:11@0.5 1:11@0.75 rest@0.75 rest@0.75', // 71
  '2:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:8@0.75', // 72
  'rest@0.5 4:8@0.25 4:10@0.25 3:8@0.5 4:10@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:8@0.5 3:10@0.75', // 73
  '4:8@0.25 4:10@0.25 3:8@0.25 3:8@0.5 3:8@0.25 3:10@0.25 3:10@0.5 3:10@0.25 3:10@0.25 3:8@0.25 3:10@0.5 3:8@0.5', // 74
  'rest@0.5 3:10@0.5 3:10@0.5 3:8@0.5 3:10@0.5 3:8@0.5 3:8@0.5 3:8@0.5', // 75
  '2:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:8@0.75', // 76
  'rest@0.5 4:8@0.25 4:10@0.25 3:8@0.5 4:10@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:8@0.5 3:10@0.75', // 77
  '4:8@0.25 4:10@0.25 3:8@0.25 3:8@0.5 3:8@0.25 3:10@0.25 3:10@0.5 3:10@0.25 3:10@0.25 3:8@0.25 3:10@0.5 3:8@0.5', // 78
  'rest@0.5 3:10@0.5 3:10@0.5 3:8@0.5 3:10@0.5 3:8@0.5 3:7@0.5 rest@0.5', // 79
  '2:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:8@0.75', // 80
  'rest@0.5 4:8@0.25 4:10@0.25 3:8@0.5 4:10@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:8@0.5 3:10@0.75', // 81
  '4:8@0.25 4:10@0.25 3:8@0.5 3:8@0.25 3:8@0.25 3:10@0.25 3:10@0.5 3:10@0.25 3:10@0.25 3:8@0.25 3:10@0.5 3:8@0.5', // 82
  'rest@0.5 3:10@0.5 3:10@0.5 3:8@0.5 3:10@0.5 3:8@0.5 3:8@0.5 rest@0.5', // 83
  '3:12@0.25 3:8@0.25 3:10@0.25 3:15@0.25 3:8@0.25 3:10@0.25 3:13@0.25 3:8@0.25 3:10@0.25 3:12@0.25 3:8@0.25 3:10@0.25 3:12@0.25 3:13@0.25 3:12@0.25 3:8@0.25', // 84
  '3:12@0.25 3:8@0.25 3:10@0.25 3:15@0.25 3:8@0.25 3:10@0.25 3:13@0.25 3:8@0.25 3:10@0.25 3:12@0.25 3:8@0.25 3:10@0.25 3:12@0.25 3:10@0.25 3:8@0.25 rest@0.25', // 85
  '3:8@0.75 2:11@0.75 3:10@0.5 3:8@0.5 3:10@0.75 3:12@0.75', // 86
  'rest@0.25 2:11@0.25 2:13@0.25 1:11@0.25 1:13@0.5 1:11@0.25 2:13@0.25 1:15@0.25 1:11@0.25 1:13@0.25 1:11@0.25 2:13@0.25 1:13@0.25 1:11@0.25 2:13@0.25', // 87
  '1:11@0.75 3:12@0.5 2:11@0.25 3:12@0.5 2:11@0.25 2:13@0.25 1:11@0.5 2:13@0.25 1:11@0.25 1:13@0.5', // 88
  '1:13@0.5 1:13@0.5 1:13@0.5 1:13@0.25 1:13@0.5 1:13@0.5 1:13@0.25 1:11@0.5 2:13@0.5', // 89
  '1:11@4', // 90
 ];
 const score=patterns.map(measure);
 const sections=[[1,'카운트인'],[4,'Intro'],[16,'Palm mute riff'],[20,'Lead'],[28,'Intro · reprise'],[32,'Fill'],[33,'Verse'],[42,'Palm mute riff · reprise'],[46,'Lead · reprise'],[57,'Tapping'],[60,'Climax'],[63,'Break'],[68,'Bridge'],[72,'Lead · reprise'],[82,'Final lead'],[84,'Tapping · reprise'],[87,'Ending']];
 return{bars,score,sections};
})();

/* ============================================================
   GROCEREIS — main app module (v4)
   ============================================================ */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import QRCode from 'https://esm.sh/qrcode@1.5.4';
import Sortable from 'https://esm.sh/sortablejs@1.15.2';

const SUPABASE_URL = 'https://wmdopfocqufsquzvemka.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0vzeEC0FttISlsEiDaFCnw_N7bjjNym';
const supa = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { params: { eventsPerSecond: 10 } }
});

/* ------------------------------------------------------------ */
/* Categorieën — supermarkt route                                */
/* ------------------------------------------------------------ */
const CATEGORIES = [
  { id:'fruit', name:'Groente & Fruit', icon:'🥬', temp:'ambient', order:1, keywords:[
    'appel','peer','banaan','sinaasappel','mandarijn','citroen','limoen','druif','druiven','aardbei','framboos','bessen','bes','kiwi','mango','ananas','perzik','nectarine','pruim','kers','watermeloen','meloen','tomaat','komkommer','paprika','sla','ijsbergsla','andijvie','spinazie','rucola','ui','knoflook','prei','wortel','wortels','courgette','aubergine','broccoli','bloemkool','kool','spruit','spruiten','asperge','asperges','champignon','champignons','paddestoel','aardappel','aardappelen','pompoen','mais','peulvrucht','sperziebonen','snijboon','snijbonen','doperwt','doperwten','radijs','biet','bieten','koolrabi','selderij','bleekselderij','peterselie','basilicum','dille','bieslook','munt','koriander','gember','avocado','rabarber','groente','fruit','sinas','citrusvrucht','salade','kruiden','rozemarijn','tijm','salie','edamame'
  ]},
  { id:'brood', name:'Brood & Bakkerij', icon:'🥖', temp:'ambient', order:2, keywords:[
    'brood','stokbrood','ciabatta','bagel','bolletjes','croissant','pistolet','beschuit','knackebrod','knäckebröd','cracker','crackers','ontbijtkoek','krentenbol','krentenbrood','volkoren','tarwebrood','witbrood','bruinbrood','broodje','broodjes','muffin','donut','tortilla','wraps','pitabrood','naanbrood'
  ]},
  { id:'houdbaar', name:'Houdbare voorraad', icon:'🍝', temp:'ambient', order:3, keywords:[
    'pasta','spaghetti','penne','macaroni','lasagne','rijst','noedels','noodles','quinoa','couscous','bulgur','meel','bloem','suiker','zout','peper','kruiden','olie','olijfolie','zonnebloemolie','azijn','sojasaus','soja','ketchup','mayonaise','mayo','mosterd','sambal','blik','blikje','tomatenblik','soep','bouillon','honing','jam','pindakaas','hagelslag','chocoladepasta','nutella','muesli','cornflakes','havermout','granola','noten','rozijnen','koffie','thee','cacao','poedersuiker','vanille','gist','bakpoeder','currypasta','kerriepoeder','kaneel','paprikapoeder','ketjap'
  ]},
  { id:'snoep', name:'Snoep & Koek', icon:'🍪', temp:'ambient', order:4, keywords:[
    'koek','koekjes','chocolade','choco','snoep','drop','chips','popcorn','reep','chocoladereep','wafels','stroopwafel','stroopwafels','speculaas','gebak','taart','marsepein','liga','evergreen','tumtum','snicker','mars','bounty','m&m','toffee'
  ]},
  { id:'dranken', name:'Dranken', icon:'🥤', temp:'ambient', order:5, keywords:[
    'water','spa','cola','fanta','sprite','sap','appelsap','sinaasappelsap','wijn','rode wijn','witte wijn','bier','rose','rum','wodka','whisky','gin','tonic','frisdrank','limonade','ranja','ice tea','icetea','drank','siroop','energy','red bull','prosecco','champagne'
  ]},
  { id:'nonfood', name:'Huishouden & Non-food', icon:'🧻', temp:'ambient', order:6, keywords:[
    'wc papier','toiletpapier','keukenrol','keukenpapier','wasmiddel','wasverzachter','vaatwastabletten','vaatwasmiddel','afwasmiddel','allesreiniger','schoonmaak','spons','vuilniszak','vuilniszakken','luier','luiers','tampon','tampons','maandverband','shampoo','douchegel','zeep','tandpasta','tandenborstel','deodorant','scheermesjes','batterijen','batterij','kattenvoer','hondenvoer','bloemen','plant','plantenvoeding','aluminiumfolie','vershoudfolie','bakpapier','tissues','zakdoekjes'
  ]},
  { id:'vleesvis', name:'Vis & Vlees', icon:'🥩', temp:'gekoeld', order:7, keywords:[
    'vis','zalm','zalmfilet','tonijn','kabeljauw','makreel','haring','garnalen','garnaal','mossel','mosselen','paling','sushi','vlees','kip','kipfilet','kipfilethaasjes','kipdijfilet','kippendijen','kippenpoten','rundvlees','varkensvlees','gehakt','biefstuk','schnitzel','worst','ham','salami','spek','bacon','kalkoen','lamsvlees','kotelet','runder','slavink','hamburger','vleeswaren','rookworst','frikandel','kroket','speklap','filet americain','rosbief','chorizo','pancetta'
  ]},
  { id:'zuivel', name:'Kaas & Zuivel', icon:'🧀', temp:'gekoeld', order:8, keywords:[
    'melk','karnemelk','yoghurt','kwark','vla','room','slagroom','crème fraîche','creme fraiche','boter','margarine','kaas','geitenkaas','feta','mozzarella','parmezaan','brie','camembert','ei','eieren','tofu','hummus','tzatziki','smeerkaas','platte kaas','jonge kaas','oude kaas','belegen','roomkaas','cottage cheese','halloumi','melkproduct','zuivel'
  ]},
  { id:'diepvries', name:'Diepvries', icon:'❄️', temp:'diepvries', order:9, keywords:[
    'ijs','ijsje','magnum','cornetto','diepvries','diepvriespizza','pizza','frites','patat','vissticks','kipnuggets','loempia','ijsblokjes','ben & jerry','bevroren','ijstaart','ijscoupe'
  ]},
  { id:'overig', name:'Overig', icon:'🛒', temp:'ambient', order:5.5, keywords:[] }
];
const CAT_BY_ID = Object.fromEntries(CATEGORIES.map(c => [c.id, c]));
const MATCH_ORDER = ['diepvries','vleesvis','zuivel','fruit','brood','dranken','snoep','houdbaar','nonfood'];

const LABELS = ['biologisch', 'grootverpakking', 'light', 'glutenvrij', 'lactosevrij', 'vegan', 'merk', 'aanbieding'];

/* ============================================================ */
/* Parser & matching                                             */
/* ============================================================ */
function normalize(s){
  return (s||'').toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
    .replace(/[⁠​-‍﻿]/g,'')
    .replace(/[^a-z0-9 &']/g,' ')
    .replace(/\s+/g,' ').trim();
}
function categorize(name){
  const n = ' ' + normalize(name) + ' ';
  for(const id of MATCH_ORDER){
    const cat = CAT_BY_ID[id];
    if(!cat?.keywords.length) continue;
    for(const kw of cat.keywords){
      const k = ' ' + normalize(kw) + ' ';
      if(n.includes(k)) return cat.id;
    }
  }
  return 'overig';
}
function parensBalanced(s){ let d=0; for(const c of s){ if(c==='(') d++; else if(c===')') d--; } return d===0; }
function splitRespectParens(s){
  const out=[]; let buf=''; let depth=0;
  for(const c of s){
    if(c==='(') depth++;
    else if(c===')') depth=Math.max(0,depth-1);
    if((c===',' || c===';') && depth===0){ if(buf.trim()) out.push(buf.trim()); buf=''; }
    else buf+=c;
  }
  if(buf.trim()) out.push(buf.trim());
  return out;
}
function isHeaderLine(str){
  const clean = str.replace(/[:\-\s]+$/, '');
  if(/^(boodschappen(lijstje)?|shopping(list)?|grocer(ies|y\s*list)?|lijst(je)?|to\s*do|todo|inkopen|winkel)$/i.test(clean)) return true;
  if(/[:：]\s*$/.test(str) && str.length < 30 && !/\d/.test(str)) return true;
  return false;
}
function levenshtein(a, b){
  const m=a.length, n=b.length;
  if(!m) return n; if(!n) return m;
  let prev = new Array(n+1), curr = new Array(n+1);
  for(let j=0;j<=n;j++) prev[j]=j;
  for(let i=1;i<=m;i++){
    curr[0]=i;
    for(let j=1;j<=n;j++){
      curr[j] = Math.min(prev[j]+1, curr[j-1]+1, prev[j-1] + (a[i-1]===b[j-1]?0:1));
    }
    [prev,curr] = [curr,prev];
  }
  return prev[n];
}
const ALL_KEYWORDS = [];
for(const cat of CATEGORIES){
  for(const kw of cat.keywords){
    if(kw.length >= 4 && !kw.includes(' ')) ALL_KEYWORDS.push(kw);
  }
}
function fuzzyFix(name){
  if(categorize(name) !== 'overig') return null;
  const lower = normalize(name);
  if(!lower) return null;
  for(const kw of ALL_KEYWORDS) if(kw === lower) return null;
  const words = lower.split(' ');
  const first = words.find(w => w.length >= 6);
  if(!first) return null;
  let best = null, bestDist = Infinity;
  for(const kw of ALL_KEYWORDS){
    if(kw.length < 5) continue;
    if(Math.abs(kw.length - first.length) > 3) continue;
    const d = levenshtein(first, kw);
    if(d < bestDist){ bestDist = d; best = kw; }
  }
  const maxDist = Math.min(3, Math.floor(first.length * 0.3));
  if(best && bestDist > 0 && bestDist <= maxDist){
    const re = new RegExp('\\b' + first.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b', 'i');
    return name.replace(re, best);
  }
  return null;
}
function parseQty(str){
  const m = str.match(/^(\d+\s*(?:x|stuks?|st\.?|pak|pakje|pakken|fles|flessen|blik|blikje|liter|l|kg|gram|g|ml)?)\s+(.+)/i);
  if(m) return { qty: m[1].replace(/\s+/g,'').toLowerCase(), name: m[2].trim() };
  return { qty: '', name: str };
}
function cleanItem(raw){
  let str = raw.trim();
  if(!str) return null;
  const original = str;
  str = str.replace(/^[\-•*–—]+\s*/u, '').trim();
  str = str.replace(/^\d+[.)]\s+/, '').trim();
  str = str.replace(/^\[[ xX]?\]\s*/, '').trim();
  if(!str) return null;
  if(isHeaderLine(str)) return { skipped: true, reason: 'header', original };
  if(!parensBalanced(str)){
    let d=0;
    for(const c of str){ if(c==='(') d++; else if(c===')') d--; }
    if(d > 0) str += ')'.repeat(d);
    else str = '('.repeat(-d) + str;
  }
  // Extract parenthetical text as note: "X (Y)" -> name "X", note "Y"
  let note = '';
  str = str.replace(/\s*\(([^)]*)\)\s*/g, (_, inner) => {
    const t = inner.trim();
    if(t) note = note ? note + '; ' + t : t;
    return ' ';
  }).trim();
  const { qty, name } = parseQty(str);
  return { original, name, qty, note, skipped: false };
}
function splitOnInlineMarkers(line){
  // If a single line contains multiple " <dash> " markers (typical when a
  // multi-line list is pasted into a single-line input), split on them.
  const markers = line.match(/\s[-•*–—]\s+/g);
  if(!markers || markers.length < 2) return [line];
  const out = [];
  let buf = '';
  let depth = 0;
  let i = 0;
  while(i < line.length){
    const c = line[i];
    if(c === '(') depth++;
    else if(c === ')') depth = Math.max(0, depth - 1);
    if(depth === 0 && i + 2 < line.length &&
       /\s/.test(line[i]) && /[-•*–—]/.test(line[i+1]) && /\s/.test(line[i+2])){
      if(buf.trim()) out.push(buf.trim());
      buf = '';
      i += 3;
      continue;
    }
    buf += c;
    i++;
  }
  if(buf.trim()) out.push(buf.trim());
  return out;
}

function smartParse(text){
  // Normalize input: strip invisible unicode, nbsp; unify newlines
  text = (text || '')
    .replace(/\r\n/g, '\n')
    .replace(/[⁠​-‍﻿]/g, '')
    .replace(/ /g, ' ');
  const rawLines = text.split('\n');
  // Step 1: merge multi-line parens
  const merged = [];
  let buffer = '';
  for(let line of rawLines){
    line = line.trim();
    if(!line){ if(buffer){ merged.push(buffer); buffer = ''; } continue; }
    buffer = buffer ? buffer + ' ' + line : line;
    if(parensBalanced(buffer)){ merged.push(buffer); buffer = ''; }
  }
  if(buffer) merged.push(buffer);
  // Step 2: split lines on inline markers (handles pasted multi-line lists in single-line inputs)
  const expanded = [];
  for(const line of merged) expanded.push(...splitOnInlineMarkers(line));
  // Step 3: split on commas / semicolons (respecting parens)
  const split = [];
  for(const line of expanded) split.push(...splitRespectParens(line));
  // Step 4: clean each
  const items = [];
  const skipped = [];
  for(const raw of split){
    const r = cleanItem(raw);
    if(!r) continue;
    if(r.skipped){ skipped.push({ original: r.original, reason: r.reason }); continue; }
    const fixed = fuzzyFix(r.name);
    const finalName = fixed || r.name;
    items.push({
      name: finalName, qty: r.qty, note: r.note || '',
      original: r.original,
      wasCleaned: r.original !== finalName, wasFuzzy: !!fixed
    });
  }
  return { items, skipped };
}

/* ============================================================ */
/* State                                                         */
/* ============================================================ */
const COLORS = ['#00f0ff','#ff4dd2','#5cffd8','#ffd166','#c084fc','#fb923c','#a3e635','#fda4af','#60a5fa','#f472b6'];
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function newCode(){
  let s = '';
  for(let i=0;i<6;i++) s += CODE_CHARS[Math.floor(Math.random()*CODE_CHARS.length)];
  return s;
}

const LS = {
  get(k, fb=null){ try{ const v = localStorage.getItem(k); return v == null ? fb : JSON.parse(v); }catch(e){ return fb; } },
  set(k, v){ try{ localStorage.setItem(k, JSON.stringify(v)); }catch(e){} },
  rm(k){ try{ localStorage.removeItem(k); }catch(e){} }
};

const CAMEL_COLORS = [
  '#ffffff', // wit
  '#fbbf24', // amber
  '#22c55e', // groen
  '#ef4444', // rood
  '#3b82f6', // blauw
  '#a855f7', // paars
  '#ec4899', // roze
  '#06b6d4', // cyaan
  '#f97316', // oranje
  '#84cc16', // lime
];

const COMMENTARY = {
  newLeader: (n) => [
    `${n} pakt de leiding!`,
    `We hebben een nieuwe leider: ${n}!`,
    `${n} schiet naar de eerste plek!`,
    `Daar gaat ${n}!`,
    `${n} neemt het voortouw!`,
  ],
  leading: (n, c) => [
    `${n} ligt op kop met ${c} item${c===1?'':'s'}`,
    `${n} staat vooraan: ${c} ingepakt`,
    `${n} blijft koploper met ${c}`,
    `${n} houdt de leiding vast`,
    `Op één: ${n} (${c})`,
  ],
  remaining: (r) => [
    `Nog ${r} producten te gaan!`,
    `${r} items op de lijst...`,
    `Nog ${r} te pakken!`,
    `${r} te gaan tot finish`,
  ],
  almost: () => [
    `Bijna klaar! 🏁`,
    `De finish komt in zicht!`,
    `Nog ééntje!`,
    `Zo dichtbij...`,
  ],
  halfway: () => [
    `Halverwege!`,
    `De helft is binnen 💪`,
    `Halfway!`,
  ],
  tight: () => [
    `Het wordt spannend!`,
    `Wat een race! 🔥`,
    `Heel close...`,
    `Nek-aan-nek!`,
  ],
  catchup: (n) => [
    `Kom op ${n}, inhalen die boel!`,
    `${n} heeft 'n inhaalmanoeuvre nodig...`,
    `${n} bungelt onderaan`,
  ],
  step: (n, c) => [
    `${n} pakt er weer eentje! Nu op ${c}`,
    `Daar gaat ${n} weer (${c})`,
    `${n} gooit er eentje in 't mandje`,
  ],
};

const commentary = { lastTs: 0, prevLeaderId: null };

function pickRandom(arr){ return arr[Math.floor(Math.random() * arr.length)]; }

const THEMES = [
  { id: 'neon',   name: 'Neon',     desc: 'Synthwave · cyan & magenta', swatch: ['#04041a','#00f0ff','#8a5cff','#ff4dd2'] },
  { id: 'soft',   name: 'Rustig',   desc: 'Zachte sage & lavendel',     swatch: ['#1a1d24','#88b0c8','#a896c0','#d49a9a'] },
  { id: 'exotic', name: 'Tropisch', desc: 'Terracotta · teal · mustard', swatch: ['#1f1228','#2a9d8f','#e76f51','#e9c46a'] },
  { id: 'light',  name: 'Licht',    desc: 'Lichte aurora',              swatch: ['#f7f3ff','#00b4d8','#9d4edd','#f72585'] },
];
function migrateTheme(stored){
  if(stored === 'dark') return 'neon';
  if(stored === 'light' || stored === 'neon' || stored === 'soft' || stored === 'exotic') return stored;
  return 'neon';
}
const state = {
  list: null,
  me: null,
  members: [],
  items: [],
  shopMode: LS.get('grocereis.shop', false),
  theme: migrateTheme(LS.get('grocereis.theme', 'neon')),
  itemFs: LS.get('grocereis.itemFs', 16),
  solo: LS.get('grocereis.solo', true),  // default to solo mode for new users
  channel: null,
  editingId: null,
  gameState: null,
  raceRunning: false,
  doneTimestamps: {},  // track last done timestamp per member to trigger hop
};
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

/* ============================================================ */
/* DOM helpers                                                   */
/* ============================================================ */
const $ = id => document.getElementById(id);
function escapeHtml(s){
  return String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
}
function initials(name){
  return (name||'?').trim().split(/\s+/).map(p=>p[0]||'').slice(0,2).join('').toUpperCase();
}

/* ============================================================ */
/* Toasts                                                        */
/* ============================================================ */
function toast(msg, opts={}){
  const host = $('toastHost');
  const el = document.createElement('div');
  el.className = 'toast' + (opts.kind ? ' '+opts.kind : '');
  el.innerHTML = `<span>${escapeHtml(msg)}</span>`;
  if(opts.action){
    const b = document.createElement('button');
    b.className = 'undo'; b.textContent = opts.action.label;
    b.onclick = () => { opts.action.fn(); el.remove(); };
    el.appendChild(b);
  }
  host.appendChild(el);
  setTimeout(()=>el.remove(), opts.ttl ?? 4000);
}

/* ============================================================ */
/* Offline queue                                                 */
/* ============================================================ */
const QKEY = 'grocereis.queue';
function isNetworkError(e){
  const m = String(e?.message ?? e ?? '');
  return /fetch|network|failed to fetch|timeout|offline|load failed|abort/i.test(m);
}
async function execOp(op){
  const t = supa.from(op.table);
  switch(op.op){
    case 'insert':   return await t.insert(op.rows);
    case 'update':   return await t.update(op.patch).eq('id', op.id);
    case 'updateIn': return await t.update(op.patch).in('id', op.ids);
    case 'delete':   return await t.delete().eq('id', op.id);
    case 'deleteIn': return await t.delete().in('id', op.ids);
  }
}
function queueOp(op){
  const q = LS.get(QKEY, []);
  q.push({ ...op, _ts: Date.now() });
  LS.set(QKEY, q);
  updateQueueIndicator();
}
async function safeOp(op){
  if(!navigator.onLine){ queueOp(op); return; }
  try{
    const r = await execOp(op);
    if(r?.error) throw r.error;
    updateQueueIndicator();
  } catch(e){
    if(isNetworkError(e)){ queueOp(op); }
    else { console.error(e); toast('Server-fout: ' + (e.message||e), {kind:'error'}); }
  }
}
async function flushQueue(){
  let q = LS.get(QKEY, []);
  while(q.length && navigator.onLine){
    const op = q[0];
    try{
      const r = await execOp(op);
      if(r?.error) throw r.error;
      q.shift();
      LS.set(QKEY, q);
    } catch(e){
      if(!isNetworkError(e)){
        console.warn('Dropping bad queued op', op, e);
        q.shift(); LS.set(QKEY, q);
      } else break;
    }
  }
  updateQueueIndicator();
}
function updateQueueIndicator(){
  const n = LS.get(QKEY, []).length;
  const status = $('syncStatus');
  const dot = document.querySelector('.sync-card .dot');
  if(!navigator.onLine){
    if(status) status.textContent = `offline · ${n} in wachtrij`;
    if(dot) dot.classList.add('off');
  } else if(n){
    if(status) status.textContent = `synct… ${n} acties`;
    if(dot) dot.classList.add('off');
  } else {
    if(status) status.textContent = state.channel ? 'live · sync aan' : 'connecting…';
    if(dot) dot.classList.toggle('off', !state.channel);
  }
}

/* ============================================================ */
/* Supabase CRUD                                                 */
/* ============================================================ */
async function createList(name){
  for(let tries=0; tries<8; tries++){
    const code = newCode();
    const { data, error } = await supa.from('lists').insert({ code, name: name || null }).select().single();
    if(!error) return data;
    if(error.code !== '23505') throw error;
  }
  throw new Error('Kon geen unieke code genereren');
}
async function getListByCode(code){
  const { data, error } = await supa.from('lists').select('*').eq('code', code.toUpperCase()).maybeSingle();
  if(error) throw error;
  return data;
}
async function addMember(listId, name, color){
  const { data, error } = await supa.from('members').insert({ list_id: listId, name, color }).select().single();
  if(error) throw error;
  return data;
}
async function fetchMembers(listId){
  const { data, error } = await supa.from('members').select('*').eq('list_id', listId).order('joined_at');
  if(error) throw error;
  return data || [];
}
async function fetchItems(listId){
  const { data, error } = await supa.from('items').select('*').eq('list_id', listId).order('created_at');
  if(error) throw error;
  return data || [];
}
function uuid(){
  if(crypto?.randomUUID) return crypto.randomUUID();
  // fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random()*16|0; return (c==='x'?r:(r&0x3|0x8)).toString(16);
  });
}
async function insertItems(itemsArr){
  if(!state.list || !itemsArr.length) return;
  const now = Date.now();
  const rows = itemsArr.map((it, idx) => ({
    id: uuid(),
    list_id: state.list.id,
    name: it.name,
    qty: it.qty || '',
    cat: categorize(it.name),
    done: !!it.done,
    done_by: it.done_by || null,
    position: now + idx,
    note: it.note || '',
    labels: it.labels || [],
    alt: it.alt || ''
  }));
  // optimistic
  const nowIso = new Date().toISOString();
  for(const row of rows){
    if(!state.items.find(i => i.id === row.id)){
      state.items.push({ ...row, created_at: nowIso, updated_at: nowIso });
    }
  }
  cacheState(); render();
  await safeOp({ table: 'items', op: 'insert', rows });
}
async function toggleItem(id){
  const it = state.items.find(i=>i.id===id);
  if(!it) return;
  const newDone = !it.done;
  const patch = { done: newDone, done_by: newDone ? state.me?.id : null };
  Object.assign(it, patch);
  render();
  if(newDone){
    addToHistory(it.name);
    hopCamel(state.me?.id);
  }
  await safeOp({ table: 'items', op: 'update', id, patch });
  maybeFinishRace();
  maybeCommentate();
}
/* ============================================================ */
/* Captain & photo-verification item tap                         */
/* ============================================================ */
async function handleItemTap(it){
  if(it.done){
    // Un-checking: always allowed, no photo / captain detour
    return toggleItem(it.id);
  }
  if(state.me?.is_captain){
    openCaptainPicker(it);
    return;
  }
  const photoRequired = !!state.list?.game_state?.photoRequired;
  if(photoRequired){
    return triggerPhotoCapture(it);
  }
  return toggleItem(it.id);
}
function openCaptainPicker(item){
  // Reuse the assign popover styling but assign as done_by + mark done.
  const pop = $('assignPopover');
  const host = $('assignList');
  host.innerHTML = `<div class="pop-title">Wie pakte dit?</div>`;
  for(const m of state.members){
    const row = document.createElement('div');
    row.className = 'assign-option';
    row.innerHTML = `<span class="avatar" style="background:${m.color}">${initials(m.name)}</span><span class="name">${escapeHtml(m.name)}${state.me && m.id === state.me.id ? ' (jij)' : ''}</span>`;
    row.onclick = async () => {
      closeAssignPopover();
      // Optimistic
      const it = state.items.find(x => x.id === item.id);
      if(it){ it.done = true; it.done_by = m.id; addToHistory(it.name); render(); hopCamel(m.id); }
      await safeOp({ table: 'items', op: 'update', id: item.id, patch: { done: true, done_by: m.id } });
      maybeFinishRace();
    };
    host.appendChild(row);
  }
  pop.hidden = false;
  // Position roughly center top
  pop.style.top = (window.scrollY + 80) + 'px';
  pop.style.left = '50%';
  pop.style.transform = 'translateX(-50%)';
  setTimeout(() => document.addEventListener('click', outsideClose, { once: true }), 0);
}
function triggerPhotoCapture(item){
  const last = LS.get('grocereis.lastPhotoTs', 0);
  const elapsed = Date.now() - last;
  if(elapsed < 15000){
    const r = Math.ceil((15000 - elapsed) / 1000);
    toast(`📸 Nog ${r}s pauze tussen foto's (anti-valsspeel)`, { kind: 'warn' });
    return;
  }
  const inp = $('photoCapture');
  inp.value = '';
  inp.dataset.itemId = item.id;
  inp.click();
}

/* ============================================================ */
/* Commentator                                                   */
/* ============================================================ */
function maybeCommentate(){
  if(!LS.get('grocereis.commentator', true)) return;
  if(state.solo) return;
  if(state.gameState?.phase !== 'racing') return;
  if(state.members.length < 2) return;
  const now = Date.now();
  if(now - commentary.lastTs < 18000) return;
  const { ranked, total } = computeRaceData();
  if(!ranked.length || total === 0) return;
  const leader = ranked[0];
  const remaining = state.items.filter(i => !i.done).length;
  let msg = null;
  // New leader takes priority
  if(leader.count > 0 && leader.member.id !== commentary.prevLeaderId){
    if(commentary.prevLeaderId !== null){
      msg = pickRandom(COMMENTARY.newLeader(leader.member.name));
    }
    commentary.prevLeaderId = leader.member.id;
  } else if(remaining === 1){
    msg = pickRandom(COMMENTARY.almost());
  } else if(remaining > 0 && total >= 6 && remaining === Math.floor(total / 2)){
    msg = pickRandom(COMMENTARY.halfway());
  } else {
    const choices = [];
    if(leader.count > 0) choices.push(pickRandom(COMMENTARY.leading(leader.member.name, leader.count)));
    if(remaining > 0) choices.push(pickRandom(COMMENTARY.remaining(remaining)));
    if(ranked.length > 1 && ranked[0].count > 0 && Math.abs(ranked[0].count - ranked[1].count) <= 1){
      choices.push(pickRandom(COMMENTARY.tight()));
    }
    const laggard = ranked[ranked.length - 1];
    if(laggard && laggard.count === 0 && leader.count >= 3 && Math.random() < 0.4){
      choices.push(pickRandom(COMMENTARY.catchup(laggard.member.name)));
    }
    if(choices.length) msg = pickRandom(choices);
  }
  if(msg){
    toast('🎙️ ' + msg, { kind: 'commentary', ttl: 6000 });
    commentary.lastTs = now;
  }
}

function hopCamel(memberId){
  if(!memberId) return;
  // Wait one tick so the camel has re-rendered at its new position, then hop
  requestAnimationFrame(() => {
    document.querySelectorAll(`.lane-camel[data-member="${memberId}"], .mini-camel[data-member="${memberId}"]`).forEach(el => {
      el.classList.remove('hopping');
      void el.offsetWidth;
      el.classList.add('hopping');
      setTimeout(() => el.classList.remove('hopping'), 700);
    });
  });
}
async function setClaim(id, memberId){
  const it = state.items.find(i=>i.id===id);
  if(!it) return;
  it.claimed_by = memberId;
  render();
  await safeOp({ table: 'items', op: 'update', id, patch: { claimed_by: memberId } });
}
async function removeItem(id){
  state.items = state.items.filter(i => i.id !== id);
  render();
  await safeOp({ table: 'items', op: 'delete', id });
}
async function bulkUpdate(filter, patch){
  const ids = state.items.filter(filter).map(i=>i.id);
  if(!ids.length) return;
  ids.forEach(id => Object.assign(state.items.find(i=>i.id===id), patch));
  render();
  await safeOp({ table: 'items', op: 'updateIn', ids, patch });
}
async function bulkDelete(filter){
  const ids = state.items.filter(filter).map(i=>i.id);
  if(!ids.length) return;
  state.items = state.items.filter(i => !ids.includes(i.id));
  render();
  await safeOp({ table: 'items', op: 'deleteIn', ids });
}
async function updateItem(id, patch){
  const it = state.items.find(i=>i.id===id);
  if(!it) return;
  Object.assign(it, patch);
  render();
  await safeOp({ table: 'items', op: 'update', id, patch });
}
async function markMultipleDone(ids){
  if(!ids.length) return;
  ids.forEach(id => {
    const it = state.items.find(i=>i.id===id);
    if(it){ it.done = true; it.done_by = state.me?.id; addToHistory(it.name); }
  });
  render();
  await safeOp({ table: 'items', op: 'updateIn', ids, patch: { done: true, done_by: state.me?.id } });
}

/* ============================================================ */
/* Local history                                                 */
/* ============================================================ */
function historyKey(){ return state.list ? 'grocereis.hist.' + state.list.code : null; }
function addToHistory(name){
  const k = historyKey(); if(!k) return;
  const list = LS.get(k, []);
  const lc = name.trim().toLowerCase();
  const existing = list.find(h => h.name.toLowerCase() === lc);
  if(existing){ existing.count = (existing.count||1) + 1; existing.ts = Date.now(); }
  else list.push({ name: name.trim(), count: 1, ts: Date.now() });
  LS.set(k, list.slice(-100));
}
function readHistory(){
  const k = historyKey(); if(!k) return [];
  return LS.get(k, []);
}
function computeSuggestions(){
  const active = new Set(state.items.filter(i => !i.done).map(i => i.name.toLowerCase()));
  const hist = readHistory();
  return hist
    .filter(h => !active.has(h.name.toLowerCase()))
    .sort((a,b) => (b.count - a.count) || (b.ts - a.ts))
    .slice(0, 10)
    .map(h => h.name);
}

/* ============================================================ */
/* Realtime                                                      */
/* ============================================================ */
function subscribeRealtime(){
  if(state.channel){ supa.removeChannel(state.channel); state.channel = null; }
  if(!state.list) return;
  const ch = supa.channel('list:' + state.list.id);
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `list_id=eq.${state.list.id}` }, payload => handleItemEvent(payload));
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'members', filter: `list_id=eq.${state.list.id}` }, payload => handleMemberEvent(payload));
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'lists', filter: `id=eq.${state.list.id}` }, payload => handleListEvent(payload));
  ch.subscribe(status => {
    $('syncStatus').textContent = status === 'SUBSCRIBED' ? 'live · sync aan' : 'connecting…';
    const dot = document.querySelector('.sync-card .dot');
    if(dot) dot.classList.toggle('off', status !== 'SUBSCRIBED');
  });
  state.channel = ch;
}
function handleListEvent(payload){
  const { eventType, new: nw } = payload;
  if(eventType === 'UPDATE' && nw){
    state.list = nw;
    const prevPhase = state.gameState?.phase;
    state.gameState = nw.game_state || null;
    const nextPhase = state.gameState?.phase;
    // If the race just started elsewhere, show countdown locally too
    if(prevPhase !== 'racing' && nextPhase === 'racing'){
      runCountdownAndRace();
    } else {
      renderTurnBanner();
      if(state.leaderOpen) renderLeader();
    }
    cacheState();
  }
}
function handleItemEvent(payload){
  const { eventType, new: nw, old: od } = payload;
  let hopMemberId = null;
  if(eventType === 'INSERT'){ if(!state.items.find(i=>i.id===nw.id)) state.items.push(nw); }
  else if(eventType === 'UPDATE'){
    const it = state.items.find(i=>i.id===nw.id);
    // detect become-done by another member -> hop their camel
    if(it && !it.done && nw.done && nw.done_by && (!state.me || nw.done_by !== state.me.id)){
      hopMemberId = nw.done_by;
    }
    if(it) Object.assign(it, nw);
  }
  else if(eventType === 'DELETE'){ state.items = state.items.filter(i=>i.id !== od.id); }
  cacheState(); render();
  if(hopMemberId) hopCamel(hopMemberId);
  maybeFinishRace();
  maybeCommentate();
}
function handleMemberEvent(payload){
  const { eventType, new: nw, old: od } = payload;
  if(eventType === 'INSERT'){ if(!state.members.find(m=>m.id===nw.id)) state.members.push(nw); }
  else if(eventType === 'UPDATE'){ const m = state.members.find(m=>m.id===nw.id); if(m) Object.assign(m, nw); }
  else if(eventType === 'DELETE'){ state.members = state.members.filter(m=>m.id !== od.id); }
  cacheState(); render();
}

/* ============================================================ */
/* Local cache                                                   */
/* ============================================================ */
function cacheState(){
  if(!state.list) return;
  LS.set('grocereis.cache.' + state.list.code, { list: state.list, members: state.members, items: state.items });
}
function loadCache(code){ return LS.get('grocereis.cache.' + code); }

/* ============================================================ */
/* QR                                                            */
/* ============================================================ */
async function renderQR(code){
  const url = location.origin + location.pathname + '#code=' + code;
  await QRCode.toCanvas($('qrCanvas'), url, { width: 220, margin: 1, color: { dark: '#04041a', light: '#ffffff' } });
}

/* ============================================================ */
/* Onboarding                                                    */
/* ============================================================ */
function setupOnboarding(){
  const slides = document.querySelectorAll('#onboarding .slide');
  const dotsHost = $('onbDots');
  let step = 0;
  slides.forEach((_, i) => { const d = document.createElement('span'); if(i===0) d.classList.add('active'); dotsHost.appendChild(d); });
  function show(i){
    slides.forEach(s => s.classList.toggle('active', +s.dataset.step === i));
    dotsHost.querySelectorAll('span').forEach((d, idx) => d.classList.toggle('active', idx === i));
    $('onbNext').textContent = (i === slides.length - 1) ? 'Aan de slag' : 'Volgende';
  }
  show(0);
  $('onbNext').onclick = () => {
    if(step < slides.length - 1){ step++; show(step); }
    else finishOnboarding();
  };
  $('onbSkip').onclick = () => finishOnboarding();
}
async function finishOnboarding(){
  $('onboarding').hidden = true;
  LS.set('grocereis.onboarded', true);
  await ensureListAndMember();
}

/* ============================================================ */
/* Name picker                                                   */
/* ============================================================ */
function pickAvailableColor(){
  const used = new Set(state.members.map(m => m.color));
  for(const c of COLORS) if(!used.has(c)) return c;
  return COLORS[Math.floor(Math.random() * COLORS.length)];
}
function showNamePicker(){
  return new Promise(resolve => {
    const modal = $('namePicker');
    const input = $('nameInput');
    const row = $('colorRow');
    let color = pickAvailableColor();
    row.innerHTML = '';
    COLORS.forEach(c => {
      const d = document.createElement('span');
      d.className = 'color-dot' + (c === color ? ' selected' : '');
      d.style.background = c;
      d.onclick = () => { color = c; row.querySelectorAll('.color-dot').forEach(x => x.classList.toggle('selected', x === d)); };
      row.appendChild(d);
    });
    input.value = LS.get('grocereis.lastName', '');
    modal.hidden = false;
    setTimeout(()=>input.focus(), 50);
    $('nameConfirm').onclick = () => {
      const name = (input.value || '').trim();
      if(!name){ input.focus(); return; }
      LS.set('grocereis.lastName', name);
      modal.hidden = true;
      resolve({ name, color });
    };
    input.onkeydown = (e) => { if(e.key === 'Enter') $('nameConfirm').click(); };
  });
}

/* ============================================================ */
/* List flows                                                    */
/* ============================================================ */
async function ensureListAndMember(){
  const hashMatch = location.hash.match(/code=([A-Z0-9]+)/i);
  if(hashMatch){
    history.replaceState(null, '', location.pathname);
    await joinByCode(hashMatch[1]);
    return;
  }
  const last = LS.get('grocereis.lastCode');
  if(last && await tryResume(last)) return;
  const me = await showNamePicker();
  const list = await createList('Lijst van ' + me.name);
  await joinAsMe(list, me);
  toast('Nieuwe lijst aangemaakt · code ' + list.code);
}
async function tryResume(code){
  const cached = loadCache(code);
  if(cached){
    state.list = cached.list;
    state.members = cached.members || [];
    state.items = cached.items || [];
    const memberId = LS.get('grocereis.member.' + code);
    if(memberId) state.me = state.members.find(m => m.id === memberId) || null;
    $('app').hidden = false;
    render();
    if(state.list?.code){ try{ await renderQR(state.list.code); }catch{} }
  }
  try {
    const list = await getListByCode(code);
    if(!list){ LS.rm('grocereis.lastCode'); return !!cached; }
    state.list = list;
    state.gameState = list.game_state || null;
    state.members = await fetchMembers(list.id);
    state.items = await fetchItems(list.id);
    const memberId = LS.get('grocereis.member.' + code);
    let me = memberId ? state.members.find(m => m.id === memberId) : null;
    if(!me){
      const picked = await showNamePicker();
      me = await addMember(list.id, picked.name, picked.color);
      state.members.push(me);
      LS.set('grocereis.member.' + code, me.id);
    }
    state.me = me;
    LS.set('grocereis.lastCode', code);
    $('app').hidden = false;
    cacheState();
    render();
    renderTurnBanner();
    subscribeRealtime();
    await renderQR(list.code);
    return true;
  } catch(e){
    if(isNetworkError(e) && cached){
      // We're offline — stay with cached state, will sync when back online
      toast('Offline — werkt door met cache', { ttl: 3000, kind: 'warn' });
      return true;
    }
    console.error(e);
    toast('Kon lijst niet laden: ' + (e.message || e), {kind:'error'});
    return !!cached;
  }
}
async function joinByCode(code){
  code = code.toUpperCase();
  try {
    const list = await getListByCode(code);
    if(!list){ toast('Code niet gevonden: ' + code, {kind:'error'}); return; }
    const memberId = LS.get('grocereis.member.' + code);
    let me;
    if(memberId){
      const members = await fetchMembers(list.id);
      me = members.find(m => m.id === memberId);
    }
    if(!me){
      const picked = await showNamePicker();
      me = await addMember(list.id, picked.name, picked.color);
    }
    await joinAsMe(list, me);
  } catch(e){ toast('Verbinden mislukt: ' + (e.message || e), {kind:'error'}); }
}
async function joinAsMe(list, mePicked){
  state.list = list;
  state.gameState = list.game_state || null;
  state.members = await fetchMembers(list.id);
  if(!mePicked.id){
    mePicked = await addMember(list.id, mePicked.name, mePicked.color);
    state.members.push(mePicked);
  } else if(!state.members.find(m => m.id === mePicked.id)){
    state.members.push(mePicked);
  }
  state.me = mePicked;
  state.items = await fetchItems(list.id);
  LS.set('grocereis.lastCode', list.code);
  LS.set('grocereis.member.' + list.code, mePicked.id);
  $('app').hidden = false;
  cacheState();
  render();
  subscribeRealtime();
  await renderQR(list.code);
}
async function leaveList(){
  if(!state.list) return;
  if(!confirm('Verlaat deze lijst? Je items blijven bewaard.')) return;
  if(state.me) await supa.from('members').delete().eq('id', state.me.id);
  if(state.channel){ supa.removeChannel(state.channel); state.channel = null; }
  LS.rm('grocereis.member.' + state.list.code);
  LS.rm('grocereis.lastCode');
  state.list = null; state.me = null; state.members = []; state.items = [];
  $('app').hidden = true;
  await ensureListAndMember();
}

/* ============================================================ */
/* Import preview                                                */
/* ============================================================ */
function showImportPreview(parsed){
  return new Promise(resolve => {
    const list = $('importList'); const skip = $('importSkipped');
    list.innerHTML = ''; skip.innerHTML = '';
    const enabled = new Array(parsed.items.length).fill(true);
    parsed.items.forEach((it, idx) => {
      const cat = CAT_BY_ID[categorize(it.name)];
      const row = document.createElement('div');
      row.className = 'import-row' + (it.wasFuzzy || it.wasCleaned ? ' fixed' : '');
      const wasChanged = it.original !== it.name;
      row.innerHTML = `
        <span class="toggle"></span>
        <span class="ico">${cat.icon}</span>
        <span class="name">
          ${escapeHtml(it.name)}${it.qty ? ` <span class="qty">${escapeHtml(it.qty)}</span>` : ''}
          ${it.note ? `<br><span class="import-note">${escapeHtml(it.note)}</span>` : ''}
          ${wasChanged ? `<br><span class="was">was: ${escapeHtml(it.original)}</span>` : ''}
        </span>
        ${cat.temp !== 'ambient' ? `<span class="badge ${cat.temp}">${cat.temp}</span>` : ''}
      `;
      row.querySelector('.toggle').onclick = () => { enabled[idx] = !enabled[idx]; row.classList.toggle('off', !enabled[idx]); };
      list.appendChild(row);
    });
    if(parsed.skipped.length){
      skip.innerHTML = `<b>Overgeslagen (${parsed.skipped.length}):</b> ` +
        parsed.skipped.map(s => `<code>${escapeHtml(s.original)}</code>`).join(', ');
    }
    const cleaned = parsed.items.filter(i => i.wasCleaned || i.wasFuzzy).length;
    $('importSummary').innerHTML =
      `${parsed.items.length} items gevonden` +
      (cleaned ? ` · ${cleaned} opgeschoond` : '') +
      (parsed.skipped.length ? ` · ${parsed.skipped.length} overgeslagen` : '');
    $('importModal').hidden = false;
    $('importCancel').onclick = () => { $('importModal').hidden = true; resolve(null); };
    $('importConfirm').onclick = () => { $('importModal').hidden = true; resolve(parsed.items.filter((_, i) => enabled[i])); };
  });
}

/* ============================================================ */
/* Edit modal                                                    */
/* ============================================================ */
function openEditModal(it){
  state.editingId = it.id;
  const { name: dispName, note: dispNote } = splitNameNote(it);
  $('editName').value = dispName;
  $('editQty').value = it.qty || '';
  $('editNote').value = dispNote;
  $('editAlt').value = it.alt || '';
  // Render label chips
  const host = $('editLabels');
  host.innerHTML = '';
  const current = new Set(it.labels || []);
  LABELS.forEach(label => {
    const chip = document.createElement('span');
    chip.className = 'label-chip' + (current.has(label) ? ' on' : '');
    chip.textContent = label;
    chip.onclick = () => {
      chip.classList.toggle('on');
    };
    host.appendChild(chip);
  });
  $('editModal').hidden = false;
  setTimeout(()=>$('editName').focus(), 50);
}
function closeEditModal(){ $('editModal').hidden = true; state.editingId = null; }
async function saveEdit(){
  const id = state.editingId; if(!id) return;
  const labels = Array.from(document.querySelectorAll('#editLabels .label-chip.on')).map(c => c.textContent);
  const patch = {
    name: $('editName').value.trim(),
    qty: $('editQty').value.trim(),
    note: $('editNote').value.trim(),
    alt: $('editAlt').value.trim(),
    labels,
  };
  if(!patch.name){ toast('Naam mag niet leeg', {kind:'warn'}); return; }
  patch.cat = categorize(patch.name);
  closeEditModal();
  await updateItem(id, patch);
}

/* ============================================================ */
/* Voice (mark items done with confirmation)                     */
/* ============================================================ */
let recog = null;
let voiceMatchedIds = new Set();
let voiceUnmatchedNames = [];

function voiceSupported(){
  return 'SpeechRecognition' in window || 'webkitSpeechRecognition' in window;
}
function openVoice(){
  if(!voiceSupported()){ toast('Voice werkt niet in deze browser', {kind:'warn'}); return; }
  voiceMatchedIds = new Set();
  voiceUnmatchedNames = [];
  $('voiceTranscript').textContent = 'tik de microfoon en spreek…';
  $('voiceMatches').innerHTML = '';
  $('voiceConfirm').disabled = true;
  $('voiceModal').hidden = false;
  $('micPulse').classList.remove('listening');
}
function closeVoice(){
  if(recog){ try{ recog.abort(); }catch(e){} recog = null; }
  $('voiceModal').hidden = true;
  $('micPulse').classList.remove('listening');
}
function startListening(){
  if(recog){ try{ recog.abort(); }catch(e){} }
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  recog = new SR();
  recog.lang = 'nl-NL';
  recog.continuous = false;
  recog.interimResults = true;
  recog.maxAlternatives = 1;
  let finalText = '';
  recog.onresult = (e) => {
    let interim = '';
    for(let i = e.resultIndex; i < e.results.length; i++){
      const r = e.results[i];
      if(r.isFinal) finalText += r[0].transcript + ' ';
      else interim += r[0].transcript;
    }
    $('voiceTranscript').textContent = (finalText + interim).trim() || '…';
  };
  recog.onerror = (e) => {
    $('micPulse').classList.remove('listening');
    if(e.error === 'no-speech') $('voiceTranscript').textContent = 'niets gehoord — tik nogmaals';
    else $('voiceTranscript').textContent = 'fout: ' + e.error;
  };
  recog.onend = () => {
    $('micPulse').classList.remove('listening');
    const txt = finalText.trim();
    if(txt) processVoiceTranscript(txt);
  };
  $('micPulse').classList.add('listening');
  recog.start();
}
function processVoiceTranscript(text){
  // Strip common Dutch connectives
  let cleaned = text.toLowerCase();
  const fillers = ['ik heb','heb','hebben','gepakt','gehaald','gevonden','en','ook','nog','in','mijn','mandje','de','het','een','uhm','euh','ehm','ja','effe','even','daarna','toen','nog','plus'];
  // Replace connectives with separators
  const parts = cleaned.split(/[,;.]/).map(p => {
    let s = p.trim();
    for(const f of fillers){
      const re = new RegExp('\\b' + f + '\\b', 'g');
      s = s.replace(re, ',');
    }
    return s;
  }).flatMap(s => s.split(',')).map(s => s.trim()).filter(s => s.length > 1);

  // Match each spoken token to an undone item
  const undone = state.items.filter(i => !i.done);
  const matched = []; // [{ spoken, item }]
  const unmatched = [];
  const usedIds = new Set();
  for(const tok of parts){
    const norm = normalize(tok);
    if(!norm) continue;
    // direct substring
    let m = undone.find(i => !usedIds.has(i.id) && (normalize(i.name).includes(norm) || norm.includes(normalize(i.name).split(' ')[0])));
    if(!m){
      let best=null, bestDist=Infinity;
      for(const i of undone){
        if(usedIds.has(i.id)) continue;
        const itName = normalize(i.name).split(' ')[0];
        const d = levenshtein(norm.split(' ')[0], itName);
        if(d < bestDist){ bestDist = d; best = i; }
      }
      if(best && bestDist <= Math.max(2, Math.floor(best.name.length * 0.35))) m = best;
    }
    if(m){ usedIds.add(m.id); matched.push({ spoken: tok, item: m }); }
    else unmatched.push(tok);
  }

  voiceMatchedIds = new Set(matched.map(m => m.item.id));
  voiceUnmatchedNames = unmatched;

  // Render
  const host = $('voiceMatches');
  host.innerHTML = '';
  if(!matched.length && !unmatched.length){
    host.innerHTML = '<div class="hint">Niets herkend.</div>';
    $('voiceConfirm').disabled = true;
    return;
  }
  matched.forEach(({spoken, item}) => {
    const row = document.createElement('div');
    row.className = 'voice-match-row';
    row.innerHTML = `
      <span class="toggle"></span>
      <span class="name">${escapeHtml(item.name)}${item.qty ? ` <span class="qty">${escapeHtml(item.qty)}</span>`:''}</span>
      ${normalize(spoken) !== normalize(item.name) ? `<span class="heard">"${escapeHtml(spoken)}"</span>` : ''}
    `;
    row.onclick = () => {
      row.classList.toggle('off');
      updateVoiceConfirmState();
    };
    host.appendChild(row);
  });
  unmatched.forEach(tok => {
    const row = document.createElement('div');
    row.className = 'voice-match-row unmatched';
    row.innerHTML = `
      <span class="toggle"></span>
      <span class="name">${escapeHtml(tok)}</span>
      <span class="heard">niet op lijst — voeg toe &amp; vink af</span>
    `;
    row.onclick = () => { row.classList.toggle('off'); updateVoiceConfirmState(); };
    host.appendChild(row);
  });
  updateVoiceConfirmState();
}
function updateVoiceConfirmState(){
  const active = document.querySelectorAll('.voice-match-row:not(.off)').length;
  $('voiceConfirm').disabled = active === 0;
}

async function confirmVoice(){
  const rows = Array.from(document.querySelectorAll('.voice-match-row'));
  const matchedIds = [];
  const newItems = [];
  rows.forEach((row, idx) => {
    if(row.classList.contains('off')) return;
    if(row.classList.contains('unmatched')){
      const name = row.querySelector('.name').textContent.trim();
      newItems.push({ name });
    } else {
      // find corresponding item
      const nameText = row.querySelector('.name').firstChild.textContent.trim();
      const it = state.items.find(i => i.name === nameText && !i.done);
      if(it) matchedIds.push(it.id);
    }
  });
  closeVoice();
  if(newItems.length){
    await insertItems(newItems.map(it => ({ ...it, done: true, done_by: state.me?.id })));
    newItems.forEach(it => addToHistory(it.name));
  }
  if(matchedIds.length) await markMultipleDone(matchedIds);
  toast(`✓ ${matchedIds.length + newItems.length} items afgevinkt`);
}

/* ============================================================ */
/* Leaderboard                                                   */
/* ============================================================ */
function openLeader(){
  // Race onboarding on first open
  if(!LS.get('grocereis.race-onboarded')){
    $('raceOnboarding').hidden = false;
    return;
  }
  state.leaderOpen = true;
  $('leaderModal').hidden = false;
  renderLeader();
}
function dismissRaceOnboarding(){
  LS.set('grocereis.race-onboarded', true);
  $('raceOnboarding').hidden = true;
}
function closeLeader(){
  state.leaderOpen = false;
  $('leaderModal').hidden = true;
}
function computeRaceData(){
  const counts = {};
  state.items.filter(i => i.done && i.done_by).forEach(i => {
    counts[i.done_by] = (counts[i.done_by] || 0) + 1;
  });
  const ranked = state.members
    .map(m => ({ member: m, count: counts[m.id] || 0, handicap: m.handicap_offset || 0 }))
    .sort((a, b) => (b.count + b.handicap) - (a.count + a.handicap));
  const total = Math.max(1, state.items.length);
  return { counts, ranked, total };
}
function renderLeader(){
  const { ranked, total } = computeRaceData();
  const remaining = state.items.filter(i => !i.done).length;
  const host = $('leaderList');
  host.innerHTML = '';

  const race = document.createElement('div');
  race.className = 'race' + (state.raceRunning ? ' running' : '');
  race.innerHTML = `
    <div class="race-info">
      <span class="race-label">Nog te kopen</span>
      <span class="race-num">${remaining}</span>
    </div>
    <div class="race-track" id="raceTrack"></div>
  `;
  host.appendChild(race);
  const track = race.querySelector('#raceTrack');

  if(!ranked.length){
    track.innerHTML = '<div class="hint" style="padding:14px">Geen deelnemers — nodig iemand uit met de QR-code.</div>';
  } else {
    ranked.forEach((r, idx) => {
      const effective = r.count + r.handicap;
      const pct = Math.min(95, (effective / total) * 95);
      const startPct = Math.min(90, (r.handicap / total) * 95);
      const isLeader = idx === 0 && effective > 0;
      const lane = document.createElement('div');
      lane.className = 'race-lane' + (isLeader ? ' leader' : '') + (r.handicap > 0 ? ' handicap' : '');
      const laneColor = r.member.camel_color || r.member.color;
      lane.style.setProperty('--lane-color', laneColor);
      lane.style.setProperty('--handicap-pct', startPct + '%');
      const ridingAvatar = r.member.avatar ? `<img class="camel-rider" src="${r.member.avatar}" alt="">` : '';
      lane.innerHTML = `
        <div class="lane-name" title="${escapeHtml(r.member.name)}">
          ${escapeHtml(r.member.name)}${state.me && r.member.id === state.me.id ? ' <span class="you">·jij·</span>' : ''}${r.member.pre_pick ? ' <span class="prepick">★</span>' : ''}${r.member.is_captain ? ' 🧺' : ''}
        </div>
        <div class="lane-track">
          <div class="lane-trail" style="width:${pct}%"></div>
          <div class="lane-camel" data-member="${r.member.id}" style="left:${pct}%; color:${laneColor}">${isLeader ? '🐪' : '🐫'}${ridingAvatar}</div>
          <div class="lane-finish">🏁</div>
        </div>
        <div class="lane-count">${r.count}${r.handicap ? `+${r.handicap}` : ''}</div>
      `;
      track.appendChild(lane);
    });
  }

  if(ranked.some(r => r.count > 0)){
    const rankingTitle = document.createElement('div');
    rankingTitle.className = 'race-rank-title';
    rankingTitle.textContent = 'Stand';
    host.appendChild(rankingTitle);
    const medals = ['🥇', '🥈', '🥉'];
    const rankClasses = ['gold', 'silver', 'bronze'];
    ranked.forEach((r, i) => {
      if(r.count === 0) return;
      const row = document.createElement('div');
      row.className = 'leader-row' + (i < 3 ? ' ' + rankClasses[i] : '');
      row.innerHTML = `
        <span class="leader-rank">${i < 3 ? medals[i] : '#' + (i+1)}</span>
        <span class="avatar" style="background:${r.member.color}">${initials(r.member.name)}</span>
        <span class="leader-name">${escapeHtml(r.member.name)}${state.me && r.member.id === state.me.id ? '<span class="you">jij</span>' : ''}</span>
        <span class="leader-count">${r.count}</span>
      `;
      host.appendChild(row);
    });
  }

  renderHandicapSettings();
  // Toggle End/Start race buttons based on game phase
  const racing = state.gameState?.phase === 'racing';
  const start = $('startRace');
  const end = $('endRace');
  if(racing){
    start.hidden = true;
    end.hidden = false;
  } else {
    start.hidden = false;
    end.hidden = true;
  }
}

function renderHandicapSettings(){
  // Mijn camel section (color, avatar, captain)
  renderMyCamelSection();
  const list = $('handicapList');
  if(!list) return;
  list.innerHTML = '';
  state.members.forEach(m => {
    const row = document.createElement('div');
    row.className = 'handicap-row';
    row.innerHTML = `
      <span class="avatar" style="background:${m.color}">${initials(m.name)}</span>
      <span class="h-name">${escapeHtml(m.name)}${state.me && m.id === state.me.id ? '<span class="you">jij</span>' : ''}</span>
      <span class="h-number">+<input type="number" min="0" max="20" value="${m.handicap_offset || 0}" data-member="${m.id}" data-field="handicap_offset"></span>
      <label class="h-pre"><input type="checkbox" data-member="${m.id}" data-field="pre_pick" ${m.pre_pick ? 'checked' : ''}> eerste keus</label>
    `;
    list.appendChild(row);
  });
  list.querySelectorAll('input[data-member]').forEach(inp => {
    inp.onchange = async () => {
      const id = inp.dataset.member;
      const field = inp.dataset.field;
      const val = field === 'pre_pick' ? inp.checked : Math.max(0, Math.min(20, parseInt(inp.value, 10) || 0));
      const m = state.members.find(x => x.id === id);
      if(m){ m[field] = val; }
      await safeOp({ table: 'members', op: 'update', id, patch: { [field]: val } });
      if(state.leaderOpen) renderLeader();
    };
  });
  // Beurt modus toggle
  const tm = $('turnMode');
  const pr = $('perTurnRow');
  const gs = state.gameState;
  const initialOn = !!(gs && gs.phase === 'turns');
  tm.checked = initialOn;
  pr.hidden = !initialOn;
  $('perTurn').value = gs?.perTurn || 3;
  $('perTurnVal').textContent = $('perTurn').value;
  tm.onchange = () => { pr.hidden = !tm.checked; };
  $('perTurn').oninput = () => { $('perTurnVal').textContent = $('perTurn').value; };
  // Photo + commentator toggles read from list.game_state defaults
  const pm = $('photoMode');
  const cm = $('commentatorMode');
  if(pm){
    pm.checked = !!(state.list?.game_state?.photoRequired ?? LS.get('grocereis.photoMode', false));
    pm.onchange = async () => {
      LS.set('grocereis.photoMode', pm.checked);
      const next = { ...(state.list?.game_state || {}), photoRequired: pm.checked };
      await setGameState(next.phase ? next : (pm.checked ? next : null));
    };
  }
  if(cm){
    cm.checked = LS.get('grocereis.commentator', true);
    cm.onchange = () => { LS.set('grocereis.commentator', cm.checked); };
  }
}

function renderMyCamelSection(){
  if(!state.me) return;
  const picker = $('camelColorPicker');
  if(picker){
    picker.innerHTML = '';
    const mkDot = (color, isDefault) => {
      const d = document.createElement('span');
      d.className = 'color-dot' + (isDefault ? ' default-dot' : '') +
        ((isDefault && !state.me.camel_color) || (!isDefault && state.me.camel_color === color) ? ' selected' : '');
      if(!isDefault) d.style.background = color;
      if(isDefault){ d.textContent = '✕'; d.title = 'Standaard (mijn deelnemerskleur)'; }
      d.onclick = async () => {
        state.me.camel_color = isDefault ? null : color;
        picker.querySelectorAll('.color-dot').forEach(x => x.classList.toggle('selected', x === d));
        await safeOp({ table: 'members', op: 'update', id: state.me.id, patch: { camel_color: state.me.camel_color } });
        render();
      };
      picker.appendChild(d);
    };
    mkDot(null, true);
    for(const c of CAMEL_COLORS) mkDot(c, false);
  }
  // Avatar preview
  const preview = $('avatarPreview');
  const removeBtn = $('avatarRemove');
  if(preview){
    if(state.me.avatar){
      preview.style.backgroundImage = `url('${state.me.avatar}')`;
      preview.classList.add('has-image');
      preview.textContent = '';
      if(removeBtn) removeBtn.hidden = false;
    } else {
      preview.style.backgroundImage = '';
      preview.classList.remove('has-image');
      preview.textContent = '＋';
      if(removeBtn) removeBtn.hidden = true;
    }
  }
  // Captain toggle
  const cap = $('captainToggle');
  if(cap){
    cap.checked = !!state.me.is_captain;
    cap.onchange = async () => {
      state.me.is_captain = cap.checked;
      await safeOp({ table: 'members', op: 'update', id: state.me.id, patch: { is_captain: cap.checked } });
    };
  }
}

async function resizeImage(file, size = 96){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      const img = new Image();
      img.onerror = reject;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext('2d');
        const minDim = Math.min(img.width, img.height);
        const sx = (img.width - minDim) / 2;
        const sy = (img.height - minDim) / 2;
        ctx.drawImage(img, sx, sy, minDim, minDim, 0, 0, size, size);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
async function setMyAvatar(file){
  if(!state.me) return;
  try {
    const dataUrl = await resizeImage(file, 96);
    state.me.avatar = dataUrl;
    await safeOp({ table: 'members', op: 'update', id: state.me.id, patch: { avatar: dataUrl } });
    renderMyCamelSection(); render();
    toast('Foto opgeslagen');
  } catch(e){ console.error(e); toast('Foto upload mislukt', {kind:'error'}); }
}
async function clearMyAvatar(){
  if(!state.me) return;
  state.me.avatar = null;
  await safeOp({ table: 'members', op: 'update', id: state.me.id, patch: { avatar: null } });
  renderMyCamelSection(); render();
}

/* ============================================================ */
/* Race start flow                                               */
/* ============================================================ */
async function startRaceFlow(){
  const turnsEnabled = $('turnMode')?.checked;
  const perTurn = parseInt($('perTurn')?.value || '3', 10);
  closeLeader();

  // Pre-pick phase: members with pre_pick=true claim items first
  const prePickers = state.members.filter(m => m.pre_pick);
  if(prePickers.length){
    await runTurnPhase(prePickers, perTurn, 'eerste keus');
  }

  // Beurt modus: cycle through all members (in join order)
  if(turnsEnabled){
    const order = state.members.slice().sort((a,b) =>
      new Date(a.joined_at) - new Date(b.joined_at)
    );
    await runTurnPhase(order, perTurn, 'kies items');
  }

  // Countdown + jingle + race
  await setGameState({ phase: 'racing', startedAt: Date.now() });
}

function runTurnPhase(members, perTurn, label){
  return new Promise(async (resolve) => {
    const gs = {
      phase: 'turns',
      perTurn,
      label,
      memberOrder: members.map(m => m.id),
      currentIndex: 0,
      claimsThisTurn: 0,
      _resolve: true // sentinel ignored on remote
    };
    await setGameState(gs);
    // Wait until phase changes (handleListEvent or our nextTurn drives it)
    const interval = setInterval(() => {
      const cur = state.gameState;
      if(!cur || cur.phase !== 'turns' || cur.label !== label){
        clearInterval(interval);
        resolve();
      }
    }, 200);
  });
}

async function nextTurn(){
  const gs = state.gameState;
  if(!gs || gs.phase !== 'turns') return;
  const nextIdx = gs.currentIndex + 1;
  if(nextIdx >= gs.memberOrder.length){
    await setGameState(null);
    return;
  }
  await setGameState({ ...gs, currentIndex: nextIdx, claimsThisTurn: 0 });
}

async function setGameState(gs){
  state.gameState = gs;
  if(state.list){ state.list.game_state = gs; }
  renderTurnBanner();
  if(state.leaderOpen) renderLeader();
  if(state.list){
    await safeOp({ table: 'lists', op: 'update', id: state.list.id, patch: { game_state: gs } });
  }
  if(gs?.phase === 'racing'){
    runCountdownAndRace();
  }
}

function renderTurnBanner(){
  const gs = state.gameState;
  const banner = $('turnBanner');
  if(!gs || gs.phase !== 'turns' || !gs.memberOrder?.length){
    banner.hidden = true;
    document.body.classList.remove('has-turn-banner');
    return;
  }
  const current = state.members.find(m => m.id === gs.memberOrder[gs.currentIndex]);
  if(!current){ banner.hidden = true; document.body.classList.remove('has-turn-banner'); return; }
  banner.hidden = false;
  document.body.classList.add('has-turn-banner');
  const av = $('turnAvatar');
  av.style.background = current.color;
  av.textContent = initials(current.name);
  const isMe = state.me && current.id === state.me.id;
  $('turnName').textContent = isMe ? `Jouw beurt` : `${current.name} aan zet`;
  $('turnSub').textContent = `${gs.label} · ${gs.perTurn} item${gs.perTurn === 1 ? '' : 's'}`;
}

/* ============================================================ */
/* Countdown + race animation                                    */
/* ============================================================ */
let countdownActive = false;
async function runCountdownAndRace(){
  if(countdownActive) return;
  countdownActive = true;
  const ov = $('countdownOverlay');
  const num = $('cdNum');
  ov.hidden = false;
  // 5 → 1
  for(let n = 5; n >= 1; n--){
    num.classList.remove('go');
    num.textContent = String(n);
    num.style.animation = 'none';
    void num.offsetWidth;
    num.style.animation = '';
    await sleep(800);
  }
  // GO!
  num.textContent = 'GO!';
  num.classList.add('go');
  try { const j = $('jingle'); j.currentTime = 0; await j.play(); } catch(e){ console.warn('jingle play failed', e); }
  await sleep(1100);
  ov.hidden = true;
  countdownActive = false;
  // Don't open the leaderboard modal — go straight to the shopping view
  // with the sticky mini-race showing the camels animating in.
  state.raceRunning = true;
  closeLeader();
  // Render mini race + animate camels from 0% to target
  renderMiniRace();
  animateMiniRaceCamels();
  // Race stays active — camels update live as items get checked.
  setTimeout(() => { state.raceRunning = false; }, 2000);
  // Reset commentator state for new race
  commentary.lastTs = 0;
  commentary.prevLeaderId = null;
}

async function endRace(){
  // Announce winner if there is one
  if(state.gameState?.phase === 'racing'){
    const { ranked } = computeRaceData();
    const winner = ranked[0];
    if(winner && (winner.count + winner.handicap) > 0){
      const isMe = state.me && winner.member.id === state.me.id;
      toast(`🏆 ${isMe ? 'Jij wint' : winner.member.name + ' wint'} met ${winner.count} item${winner.count===1?'':'s'}!`, { ttl: 8000 });
    }
  }
  await setGameState(null);
  if(state.leaderOpen) renderLeader();
}
function maybeFinishRace(){
  if(state.gameState?.phase !== 'racing') return;
  if(!state.items.length) return;
  if(state.items.every(i => i.done)){
    endRace();
  }
}
function animateMiniRaceCamels(){
  const camels = document.querySelectorAll('.mini-camel');
  const trails = document.querySelectorAll('.mini-trail');
  const camelTargets = Array.from(camels).map(c => c.style.left);
  const trailTargets = Array.from(trails).map(t => t.style.width);
  camels.forEach(c => { c.style.transition = 'none'; c.style.left = '0%'; });
  trails.forEach(t => { t.style.transition = 'none'; t.style.width = '0%'; });
  void document.body.offsetWidth;
  requestAnimationFrame(() => {
    camels.forEach((c, i) => { c.style.transition = ''; c.style.left = camelTargets[i]; });
    trails.forEach((t, i) => { t.style.transition = 'width 1.2s cubic-bezier(.45,.05,.55,1)'; t.style.width = trailTargets[i]; });
  });
}
function renderRaceAnimated(){
  renderLeader();
  // Snap camels to 0%, then transition to target pct
  const camels = document.querySelectorAll('.lane-camel');
  const trails = document.querySelectorAll('.lane-trail');
  const targets = Array.from(camels).map(c => c.style.left);
  const trailTargets = Array.from(trails).map(t => t.style.width);
  camels.forEach(c => { c.style.transition = 'none'; c.style.left = '0%'; });
  trails.forEach(t => { t.style.transition = 'none'; t.style.width = '0%'; });
  void document.body.offsetWidth;
  requestAnimationFrame(() => {
    camels.forEach((c, i) => { c.style.transition = ''; c.style.left = targets[i]; });
    trails.forEach((t, i) => { t.style.transition = 'width 1.2s cubic-bezier(.45,.05,.55,1)'; t.style.width = trailTargets[i]; });
  });
}

/* ============================================================ */
/* Theme                                                         */
/* ============================================================ */
function applyTheme(){
  document.body.dataset.theme = state.theme;
  document.body.style.setProperty('--item-fs', state.itemFs + 'px');
  const tc = { neon: '#04041a', soft: '#1a1d24', exotic: '#1f1228', light: '#f7f3ff' };
  document.querySelector('meta[name="theme-color"]').setAttribute('content', tc[state.theme] || '#04041a');
}

/* ============ Settings modal ============ */
function openSettings(){
  renderThemeGrid();
  $('fsRange').value = state.itemFs;
  $('soloToggle').checked = !!state.solo;
  $('settingsModal').hidden = false;
}
function closeSettings(){ $('settingsModal').hidden = true; }
function renderThemeGrid(){
  const grid = $('themeGrid');
  grid.innerHTML = '';
  for(const t of THEMES){
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'theme-card' + (state.theme === t.id ? ' on' : '');
    card.dataset.theme = t.id;
    card.innerHTML = `
      <div class="theme-swatch">${t.swatch.map(c => `<span style="background:${c}"></span>`).join('')}</div>
      <div class="theme-name">${escapeHtml(t.name)}</div>
      <div class="theme-desc">${escapeHtml(t.desc)}</div>
    `;
    card.onclick = () => {
      state.theme = t.id;
      LS.set('grocereis.theme', t.id);
      applyTheme();
      renderThemeGrid();
    };
    grid.appendChild(card);
  }
}

/* ============================================================ */
/* Shop mode                                                     */
/* ============================================================ */
function applyShopMode(){
  document.body.classList.toggle('shop', state.shopMode);
  $('modeList').classList.toggle('on', !state.shopMode);
  $('modeShop').classList.toggle('on', state.shopMode);
}
function applySolo(){
  document.body.classList.toggle('solo', state.solo);
}

/* ============================================================ */
/* Rendering                                                     */
/* ============================================================ */
function render(){
  renderHeader();
  renderSync();
  renderList();
  renderHistory();
  renderMiniRace();
  applyShopMode();
  applySolo();
  applyTheme();
}
function renderMiniRace(){
  const section = $('miniRace');
  const gs = state.gameState;
  const active = gs && (gs.phase === 'racing' || gs.phase === 'turns');
  if(!active || !state.members.length){ section.hidden = true; return; }
  section.hidden = false;
  const { ranked, total } = computeRaceData();
  $('miniRemaining').textContent = state.items.filter(i => !i.done).length;
  const track = $('miniRaceTrack');
  track.innerHTML = '';
  ranked.forEach((r, idx) => {
    const effective = r.count + r.handicap;
    const pct = Math.min(95, (effective / total) * 95);
    const isLeader = idx === 0 && effective > 0;
    const lane = document.createElement('div');
    lane.className = 'mini-lane';
    const laneColor = r.member.camel_color || r.member.color;
    lane.style.setProperty('--lane-color', laneColor);
    const ridingAvatar = r.member.avatar ? `<img class="camel-rider" src="${r.member.avatar}" alt="">` : '';
    lane.innerHTML = `
      <span class="mini-name">${escapeHtml(r.member.name)}</span>
      <div class="mini-track-bar">
        <div class="mini-trail" style="width:${pct}%"></div>
        <span class="mini-camel" data-member="${r.member.id}" style="left:${pct}%; color:${laneColor}">${isLeader ? '🐪' : '🐫'}${ridingAvatar}</span>
        <span class="mini-finish">🏁</span>
      </div>
      <span class="mini-count">${r.count}${r.handicap ? '+'+r.handicap : ''}</span>
    `;
    track.appendChild(lane);
  });
}
function renderHeader(){
  const strip = $('membersStrip');
  strip.innerHTML = '';
  state.members.forEach(m => {
    const a = document.createElement('div');
    a.className = 'avatar' + (state.me && m.id === state.me.id ? ' me' : '');
    a.style.background = m.color;
    a.textContent = initials(m.name);
    a.title = m.name + (state.me && m.id === state.me.id ? ' (jij)' : '');
    strip.appendChild(a);
  });
}
function renderSync(){
  if(!state.list) return;
  $('codeChip').textContent = state.list.code;
  $('codeDisplay').textContent = state.list.code;
}
function renderHistory(){
  const panel = $('historyPanel');
  const host = $('historyContent');
  const count = $('historyCount');
  if(!panel || !host || !count) return;
  const sug = computeSuggestions();
  if(!sug.length){ panel.hidden = true; return; }
  panel.hidden = false;
  count.textContent = sug.length;
  // Group by category
  const groups = {};
  for(const name of sug){
    const catId = categorize(name);
    (groups[catId] = groups[catId] || []).push(name);
  }
  // Sort categories by route order
  const sortedCatIds = Object.keys(groups).sort((a,b) => {
    const oa = CAT_BY_ID[a]?.order ?? 99;
    const ob = CAT_BY_ID[b]?.order ?? 99;
    return oa - ob;
  });
  host.innerHTML = '';
  for(const catId of sortedCatIds){
    const cat = CAT_BY_ID[catId] || CAT_BY_ID.overig;
    const block = document.createElement('div');
    block.className = 'history-cat';
    block.innerHTML = `
      <div class="history-cat-title"><span>${cat.icon}</span> ${escapeHtml(cat.name)}</div>
      <div class="history-cat-chips"></div>
    `;
    const chipsHost = block.querySelector('.history-cat-chips');
    for(const name of groups[catId]){
      const chip = document.createElement('button');
      chip.className = 'history-chip';
      chip.type = 'button';
      chip.textContent = name;
      chip.onclick = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        await insertItems([{ name }]);
        toast('Toegevoegd: ' + name);
      };
      chipsHost.appendChild(chip);
    }
    host.appendChild(block);
  }
}
function renderList(){
  const $todo = $('todo');
  const $done = $('done');
  $todo.innerHTML = ''; $done.innerHTML = '';
  const todo = state.items.filter(i => !i.done);
  const done = state.items.filter(i => i.done);
  const byCat = {};
  for(const it of todo) (byCat[it.cat] = byCat[it.cat] || []).push(it);
  const sortedCats = CATEGORIES.filter(c => byCat[c.id] && byCat[c.id].length).sort((a,b) => a.order - b.order);
  if(sortedCats.length === 0) $todo.innerHTML = '<div class="empty">geen openstaande boodschappen · tijd voor pizza</div>';
  for(const cat of sortedCats){
    const list = byCat[cat.id];
    // Sort by manual position (set on drag-reorder or insert), fallback created_at
    list.sort((a,b) => {
      const pa = a.position || new Date(a.created_at||0).getTime();
      const pb = b.position || new Date(b.created_at||0).getTime();
      return pa - pb;
    });
    const wrap = document.createElement('div');
    wrap.className = 'cat ' + cat.temp;
    wrap.dataset.catId = cat.id;
    wrap.innerHTML = `
      <div class="cat-head">
        <span class="ico">${cat.icon}</span>
        <span class="name">${escapeHtml(cat.name)}</span>
        ${cat.temp==='gekoeld' ? '<span class="badge gekoeld">gekoeld</span>' : ''}
        ${cat.temp==='diepvries' ? '<span class="badge diepvries">diepvries</span>' : ''}
        <span class="count">${list.length}</span>
      </div>
      <ul class="items" data-cat-id="${cat.id}"></ul>`;
    const ul = wrap.querySelector('ul');
    for(const it of list) ul.appendChild(itemEl(it, cat));
    $todo.appendChild(wrap);
  }
  initSortable();
  if(done.length){
    $('doneSection').hidden = false;
    $('doneHeadCount').textContent = done.length;
    const sortedDone = [...done].sort((a,b) => {
      const oa = CAT_BY_ID[a.cat]?.order ?? 99;
      const ob = CAT_BY_ID[b.cat]?.order ?? 99;
      if(oa !== ob) return oa - ob;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    const ul = document.createElement('ul'); ul.className = 'items';
    for(const it of sortedDone){
      const cat = CAT_BY_ID[it.cat] || CAT_BY_ID.overig;
      ul.appendChild(itemEl(it, cat));
    }
    $done.appendChild(ul);
  } else $('doneSection').hidden = true;
  $('todoCount').textContent = todo.length;
  $('doneCount').textContent = done.length;
  $('totalCount').textContent = state.items.length;
  const pct = state.items.length ? Math.round((done.length / state.items.length) * 100) : 0;
  $('progressBar').style.width = pct + '%';
}
function splitNameNote(it){
  // Returns the displayed name (without parenthetical text) and combined note.
  // If the item already has a separate note field, the name is left alone and
  // any leftover parens in the name (older items) are still extracted for
  // display.
  let name = it.name || '';
  let note = it.note || '';
  if(/\([^)]*\)/.test(name)){
    name = name.replace(/\s*\(([^)]*)\)\s*/g, (_, inner) => {
      const t = (inner || '').trim();
      if(t) note = note ? note + '; ' + t : t;
      return ' ';
    }).trim().replace(/\s+/g, ' ');
  }
  return { name, note };
}

function itemEl(it, cat){
  const li = document.createElement('li');
  li.className = 'item';
  if(it.claimed_by && state.me && it.claimed_by === state.me.id) li.classList.add('claimed-by-me');
  li.dataset.id = it.id;
  const { name: displayName, note: displayNote } = splitNameNote(it);
  const claimer = state.members.find(m => m.id === it.claimed_by);
  const doneBy = state.members.find(m => m.id === it.done_by);
  const assignChip = claimer
    ? `<button class="assign-chip has-claim" style="background:${claimer.color}" title="Gepakt door ${escapeHtml(claimer.name)}">${initials(claimer.name)}</button>`
    : `<button class="assign-chip" title="Toewijzen">+</button>`;
  const metaParts = [];
  if(cat.temp === 'gekoeld') metaParts.push('<span class="badge gekoeld">gekoeld</span>');
  if(cat.temp === 'diepvries') metaParts.push('<span class="badge diepvries">diepvries</span>');
  if(it.labels && it.labels.length) it.labels.forEach(l => metaParts.push(`<span class="mini-label">${escapeHtml(l)}</span>`));
  if(it.alt) metaParts.push(`<span class="mini-alt">${escapeHtml(it.alt)}</span>`);
  if(doneBy && it.done) metaParts.push(`<span class="mini-label" style="color:${doneBy.color};border-color:${doneBy.color};background:rgba(255,255,255,0.05)">door ${escapeHtml(doneBy.name)}</span>`);
  li.innerHTML = `
    <span class="check"></span>
    <div class="item-body">
      <div class="item-row1">
        ${it.qty ? `<span class="qty">${escapeHtml(it.qty)}</span>` : ''}
        <span class="label">${escapeHtml(displayName)}</span>
      </div>
      ${displayNote ? `<div class="item-note">${escapeHtml(displayNote)}</div>` : ''}
      ${metaParts.length ? `<div class="item-meta">${metaParts.join('')}</div>` : ''}
    </div>
    <div class="item-actions">
      ${assignChip}
      <button class="edit-btn" type="button" title="Aanpassen" aria-label="Aanpassen">✎</button>
      <button class="del" type="button" title="verwijder" aria-label="verwijder">✕</button>
    </div>
  `;
  li.addEventListener('click', (e) => {
    if(e.target.closest('.del') || e.target.closest('.assign-chip') || e.target.closest('.edit-btn')) return;
    handleItemTap(it);
  });
  li.querySelector('.del').onclick = (e) => { e.stopPropagation(); removeItem(it.id); };
  li.querySelector('.assign-chip').onclick = (e) => { e.stopPropagation(); openAssignPopover(e.currentTarget, it); };
  li.querySelector('.edit-btn').onclick = (e) => { e.stopPropagation(); openEditModal(it); };
  return li;
}
function openAssignPopover(anchor, item){
  const pop = $('assignPopover');
  const host = $('assignList');
  host.innerHTML = '';
  const noOne = document.createElement('div');
  noOne.className = 'assign-option' + (!item.claimed_by ? ' selected' : '');
  noOne.innerHTML = `<span class="avatar" style="background:rgba(255,255,255,0.1);color:var(--ink)">∅</span><span class="name">Niemand</span>`;
  noOne.onclick = () => { closeAssignPopover(); setClaim(item.id, null); };
  host.appendChild(noOne);
  for(const m of state.members){
    const row = document.createElement('div');
    row.className = 'assign-option' + (item.claimed_by === m.id ? ' selected' : '');
    row.innerHTML = `<span class="avatar" style="background:${m.color}">${initials(m.name)}</span><span class="name">${escapeHtml(m.name)}${state.me && m.id === state.me.id ? ' (jij)' : ''}</span>`;
    row.onclick = () => { closeAssignPopover(); setClaim(item.id, m.id); };
    host.appendChild(row);
  }
  pop.hidden = false;
  const r = anchor.getBoundingClientRect();
  pop.style.top = (window.scrollY + r.bottom + 6) + 'px';
  const leftMax = window.innerWidth - pop.offsetWidth - 10;
  pop.style.left = Math.min(leftMax, Math.max(10, r.right - pop.offsetWidth)) + 'px';
  setTimeout(() => document.addEventListener('click', outsideClose, { once: true }), 0);
}
function closeAssignPopover(){ $('assignPopover').hidden = true; }
function outsideClose(e){ if(!e.target.closest('#assignPopover')) closeAssignPopover(); }

/* ============================================================ */
/* Drag-to-reorder (within category)                             */
/* ============================================================ */
let sortableInstances = [];
function initSortable(){
  sortableInstances.forEach(s => { try{ s.destroy(); }catch(e){} });
  sortableInstances = [];
  document.querySelectorAll('#todo ul.items').forEach(ul => {
    const s = new Sortable(ul, {
      animation: 180,
      delay: 280,
      delayOnTouchOnly: true,
      touchStartThreshold: 6,
      ghostClass: 'drag-ghost',
      chosenClass: 'drag-chosen',
      dragClass: 'drag-active',
      forceFallback: true,
      fallbackTolerance: 5,
      onEnd: async (evt) => {
        if(evt.from !== evt.to) return; // shouldn't happen — same list only
        const catId = ul.dataset.catId;
        const ids = Array.from(ul.children).map(li => li.dataset.id);
        await reorderItems(catId, ids);
      }
    });
    sortableInstances.push(s);
  });
}
async function reorderItems(catId, ids){
  const base = Date.now();
  const updates = [];
  ids.forEach((id, idx) => {
    const it = state.items.find(i => i.id === id);
    if(it){
      it.position = base + (idx * 1000);
      updates.push({ id: it.id, position: it.position });
    }
  });
  cacheState();
  for(const u of updates){
    await safeOp({ table: 'items', op: 'update', id: u.id, patch: { position: u.position } });
  }
}

/* ============================================================ */
/* Recipe import via Edge Function                               */
/* ============================================================ */
async function importRecipe(url){
  url = (url||'').trim();
  if(!/^https?:\/\//i.test(url)){ toast('Vul een geldige URL in', {kind:'warn'}); return; }
  toast('Recept ophalen…', { ttl: 2500 });
  try{
    const r = await fetch(`${SUPABASE_URL}/functions/v1/recipe-scrape`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + SUPABASE_KEY,
        'apikey': SUPABASE_KEY,
      },
      body: JSON.stringify({ url })
    });
    if(!r.ok){
      let body = '';
      try{ body = await r.text(); }catch{}
      toast(`Ophalen mislukt (${r.status})`, {kind:'error'});
      console.warn('Recipe scrape error:', body);
      return;
    }
    const data = await r.json();
    if(!data.ingredients?.length){
      toast('Geen ingrediënten gevonden op deze pagina', {kind:'warn'});
      return;
    }
    const text = data.ingredients.join('\n');
    const parsed = smartParse(text);
    if(!parsed.items.length){ toast('Niets bruikbaars', {kind:'warn'}); return; }
    const final = await showImportPreview(parsed);
    if(!final) return;
    await insertItems(final);
    toast(`${final.length} ingrediënten toegevoegd${data.title ? ' · ' + data.title : ''}`);
  } catch(e){
    console.error(e);
    toast('Recept ophalen mislukt', {kind:'error'});
  }
}

/* ============================================================ */
/* Events                                                        */
/* ============================================================ */
function wireEvents(){
  function setMode(shop){
    state.shopMode = !!shop;
    LS.set('grocereis.shop', state.shopMode);
    applyShopMode();
    if(state.shopMode) window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  $('modeList').onclick = () => setMode(false);
  $('modeShop').onclick = () => setMode(true);
  $('soloToggle').onchange = (e) => {
    state.solo = e.target.checked;
    LS.set('grocereis.solo', state.solo);
    applySolo();
  };

  // Avatar upload (camel-rider) — opens hidden file input
  $('avatarUpload').onclick = () => $('avatarFile').click();
  $('avatarFile').onchange = async (e) => {
    const file = e.target.files?.[0];
    if(!file) return;
    await setMyAvatar(file);
    e.target.value = '';
  };
  $('avatarRemove').onclick = clearMyAvatar;

  // Photo-verification capture flow
  $('photoCapture').onchange = async (e) => {
    const file = e.target.files?.[0];
    const itemId = e.target.dataset.itemId;
    e.target.value = '';
    if(!file || !itemId) return;
    LS.set('grocereis.lastPhotoTs', Date.now());
    toast('📸 Foto vastgelegd!');
    await toggleItem(itemId);
  };
  $('settingsBtn').onclick = openSettings;
  $('settingsClose').onclick = closeSettings;
  $('fsRange').oninput = (e) => {
    state.itemFs = parseInt(e.target.value, 10);
    LS.set('grocereis.itemFs', state.itemFs);
    document.body.style.setProperty('--item-fs', state.itemFs + 'px');
  };
  $('leaderBtn').onclick = openLeader;
  $('leaderClose').onclick = closeLeader;
  $('startRace').onclick = startRaceFlow;
  $('endRace').onclick = endRace;
  $('turnDone').onclick = nextTurn;
  $('turnSkip').onclick = nextTurn;
  $('raceOnbSkip').onclick = () => { dismissRaceOnboarding(); };
  $('raceOnbStart').onclick = () => {
    dismissRaceOnboarding();
    state.leaderOpen = true;
    $('leaderModal').hidden = false;
    renderLeader();
  };
  $('miniRaceOpen').onclick = () => { openLeader(); };
  $('miniRace').addEventListener('click', (e) => {
    if(e.target.closest('#miniRaceOpen')) return;
    openLeader();
  });

  $('addBatch').onclick = async () => {
    const txt = $('batch').value;
    if(!txt.trim()) return;
    const parsed = smartParse(txt);
    if(!parsed.items.length){ toast('Niks bruikbaars gevonden', {kind:'warn'}); return; }
    const final = await showImportPreview(parsed);
    if(!final) return;
    await insertItems(final);
    $('batch').value = '';
    const cleanCount = final.filter(f => f.wasCleaned || f.wasFuzzy).length;
    toast(`${final.length} toegevoegd` + (cleanCount ? ` · ${cleanCount} gecorrigeerd` : ''));
  };
  $('clearBatch').onclick = () => { $('batch').value = ''; };

  async function quickAddFrom(inpId){
    const inp = $(inpId);
    const v = inp.value.trim();
    if(!v) return;
    const parsed = smartParse(v);
    if(!parsed.items.length){ toast('Niks bruikbaars', {kind:'warn'}); inp.focus(); return; }
    if(parsed.items.length > 1){
      inp.value = '';
      const final = await showImportPreview(parsed);
      if(final){ await insertItems(final); toast(`${final.length} toegevoegd`); }
    } else {
      await insertItems(parsed.items);
      inp.value = '';
    }
    inp.focus();
  }
  async function quickPaste(inpId, e){
    const text = e.clipboardData?.getData('text') ?? '';
    if(!text) return;
    // If the pasted text clearly is a list (newlines or 2+ bullet markers),
    // intercept and route through the batch parser — input would otherwise
    // strip newlines.
    const hasNewlines = /\n/.test(text);
    const multiMarkers = (text.match(/\s[-•*–—]\s/g) || []).length >= 2;
    if(!hasNewlines && !multiMarkers) return;
    e.preventDefault();
    const parsed = smartParse(text);
    if(!parsed.items.length){ toast('Niks bruikbaars in plak', {kind:'warn'}); return; }
    const inp = $(inpId); inp.value = '';
    if(parsed.items.length > 1){
      const final = await showImportPreview(parsed);
      if(final){ await insertItems(final); toast(`${final.length} toegevoegd`); }
    } else {
      await insertItems(parsed.items);
    }
  }
  $('addOne').onclick = () => quickAddFrom('quick');
  $('quick').onkeydown = (e) => { if(e.key === 'Enter'){ e.preventDefault(); quickAddFrom('quick'); } };
  $('quick').addEventListener('paste', (e) => quickPaste('quick', e));
  $('shopAdd').onclick = () => quickAddFrom('shopQuick');
  $('shopQuick').onkeydown = (e) => { if(e.key === 'Enter'){ e.preventDefault(); quickAddFrom('shopQuick'); } };
  $('shopQuick').addEventListener('paste', (e) => quickPaste('shopQuick', e));

  $('uncheckAll').onclick = () => bulkUpdate(i => i.done, { done: false, done_by: null });
  $('clearDone').onclick = () => { if(!state.items.some(i => i.done)) return; if(confirm('Alle afgevinkte items verwijderen?')) bulkDelete(i => i.done); };
  $('clearAll').onclick = () => { if(!state.items.length) return; if(confirm('Hele lijst wissen?')) bulkDelete(() => true); };

  $('copyLink').onclick = async () => {
    const url = location.origin + location.pathname + '#code=' + state.list.code;
    try { await navigator.clipboard.writeText(url); toast('Link gekopieerd'); }
    catch(e){ toast('Kopiëren mislukt', {kind:'warn'}); }
  };
  $('joinOther').onclick = () => { $('joinCode').value = ''; $('joinModal').hidden = false; setTimeout(() => $('joinCode').focus(), 50); };
  $('joinCancel').onclick = () => { $('joinModal').hidden = true; };
  $('joinGo').onclick = async () => {
    const code = $('joinCode').value.trim().toUpperCase();
    if(code.length !== 6) { toast('Code is 6 tekens', {kind:'warn'}); return; }
    $('joinModal').hidden = true;
    if(state.channel){ supa.removeChannel(state.channel); state.channel = null; }
    LS.rm('grocereis.lastCode');
    await joinByCode(code);
  };
  $('joinCode').onkeydown = (e) => { if(e.key === 'Enter') $('joinGo').click(); };

  $('newList').onclick = async () => {
    if(!confirm('Start een nieuwe lijst? De huidige blijft bestaan, je kunt later terug via code ' + state.list.code + '.')) return;
    if(state.channel){ supa.removeChannel(state.channel); state.channel = null; }
    LS.rm('grocereis.lastCode');
    state.list = null; state.me = null; state.members = []; state.items = [];
    const me = await showNamePicker();
    const list = await createList('Lijst van ' + me.name);
    await joinAsMe(list, me);
    toast('Nieuwe lijst · code ' + list.code);
  };
  $('leaveList').onclick = leaveList;

  // Edit modal
  $('editCancel').onclick = closeEditModal;
  $('editSave').onclick = saveEdit;

  // Voice
  $('shopMic').onclick = () => { openVoice(); startListening(); };
  $('micPulse').onclick = startListening;
  $('voiceCancel').onclick = closeVoice;
  $('voiceConfirm').onclick = confirmVoice;

  // Recipe import
  const recipeBtn = $('recipeBtn'), recipeModal = $('recipeModal'), recipeUrl = $('recipeUrl');
  if(recipeBtn){
    recipeBtn.onclick = async () => {
      recipeUrl.value = '';
      // pre-fill from clipboard if it looks like a URL
      try {
        const text = await navigator.clipboard.readText();
        if(/^https?:\/\//i.test((text||'').trim())) recipeUrl.value = text.trim();
      } catch {}
      recipeModal.hidden = false;
      setTimeout(()=>recipeUrl.focus(), 50);
    };
    $('recipeCancel').onclick = () => { recipeModal.hidden = true; };
    $('recipeGo').onclick = async () => {
      recipeModal.hidden = true;
      await importRecipe(recipeUrl.value);
    };
    recipeUrl.onkeydown = (e) => { if(e.key === 'Enter') $('recipeGo').click(); };
  }

  // Online/offline + queue
  window.addEventListener('online', flushQueue);
  window.addEventListener('offline', updateQueueIndicator);

  window.addEventListener('scroll', closeAssignPopover, { passive: true });
  document.addEventListener('visibilitychange', async () => {
    if(document.visibilityState === 'visible' && state.list){
      try{
        state.items = await fetchItems(state.list.id);
        state.members = await fetchMembers(state.list.id);
        cacheState(); render();
      } catch(e){}
    }
  });
}

/* ============================================================ */
/* Service worker                                                */
/* ============================================================ */
function registerSW(){
  if(!('serviceWorker' in navigator)) return;
  navigator.serviceWorker.register('sw.js').catch(e => console.warn('SW register failed', e));
}

/* ============================================================ */
/* Init                                                          */
/* ============================================================ */
async function init(){
  applyTheme();
  wireEvents();
  registerSW();
  // Try to flush any leftover queued ops from a previous session
  if(navigator.onLine) flushQueue();
  updateQueueIndicator();
  const onboarded = LS.get('grocereis.onboarded');
  const hash = location.hash;
  if(!onboarded && !hash){
    $('onboarding').hidden = false;
    setupOnboarding();
  } else {
    await ensureListAndMember();
    const lastVer = LS.get('grocereis.version');
    if(lastVer !== 'v11'){
      toast('Nieuw: camel-kleur + foto · live commentator 🎙️ · foto-bewijs modus 📸 · mandje-houder modus 🧺', { ttl: 9500 });
      LS.set('grocereis.version', 'v11');
    }
  }
}

init().catch(e => { console.error(e); toast('Startfout: ' + (e.message || e), {kind:'error'}); });

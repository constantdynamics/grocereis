/* ============================================================
   GROCEREIS — main app module
   ============================================================ */
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.45.4';
import QRCode from 'https://esm.sh/qrcode@1.5.4';

const SUPABASE_URL = 'https://wmdopfocqufsquzvemka.supabase.co';
const SUPABASE_KEY = 'sb_publishable_0vzeEC0FttISlsEiDaFCnw_N7bjjNym';
const supa = createClient(SUPABASE_URL, SUPABASE_KEY, {
  realtime: { params: { eventsPerSecond: 10 } }
});

/* ------------------------------------------------------------ */
/* Categorieën — supermarkt route; gekoeld/diepvries naar einde  */
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

/* ============================================================ */
/* Smart parser                                                  */
/* ============================================================ */
function normalize(s){
  return s.toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g,'')
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

/* parens-aware helpers */
function parensBalanced(s){
  let d=0;
  for(const c of s){ if(c==='(') d++; else if(c===')') d--; }
  return d===0;
}
function splitRespectParens(s){
  const out=[]; let buf=''; let depth=0;
  for(const c of s){
    if(c==='(') depth++;
    else if(c===')') depth=Math.max(0,depth-1);
    if((c===',' || c===';') && depth===0){
      if(buf.trim()) out.push(buf.trim()); buf='';
    } else buf+=c;
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

/* Build flat keyword dictionary once */
const ALL_KEYWORDS = [];
for(const cat of CATEGORIES){
  for(const kw of cat.keywords){
    if(kw.length >= 4 && !kw.includes(' ')) ALL_KEYWORDS.push(kw);
  }
}

function fuzzyFix(name){
  // Only try to fix if the item didn't categorize to a real category — i.e. it's "overig"
  if(categorize(name) !== 'overig') return null;
  const lower = normalize(name);
  if(!lower) return null;
  // already in dictionary? skip
  for(const kw of ALL_KEYWORDS) if(kw === lower) return null;
  // try first significant word (>= 6 chars to avoid false positives like 'verse')
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
  // distance must be <= 30% of word length, capped at 3
  const maxDist = Math.min(3, Math.floor(first.length * 0.3));
  if(best && bestDist > 0 && bestDist <= maxDist){
    // replace only the matched word, keep capitalization/rest of name
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
  // strip leading markers
  str = str.replace(/^[\-•*–—–—]+\s*/u, '').trim();
  str = str.replace(/^\d+[.)]\s+/, '').trim();
  str = str.replace(/^\[[ xX]?\]\s*/, '').trim();
  if(!str) return null;
  if(isHeaderLine(str)) return { skipped: true, reason: 'header', original };
  // strip trailing dangling open paren noise like "(of anders..."
  // (we already merged multi-line; if still unbalanced, drop closing/opening dangling)
  if(!parensBalanced(str)){
    // try to close it gracefully
    let d=0;
    for(const c of str){ if(c==='(') d++; else if(c===')') d--; }
    if(d > 0) str += ')'.repeat(d);
    else str = '('.repeat(-d) + str;
  }
  const { qty, name } = parseQty(str);
  return { original, name, qty, skipped: false };
}

function smartParse(text){
  const rawLines = text.replace(/\r\n/g, '\n').split('\n');
  // Step 1: merge multi-line parens
  const merged = [];
  let buffer = '';
  for(let line of rawLines){
    line = line.trim();
    if(!line){
      if(buffer){ merged.push(buffer); buffer = ''; }
      continue;
    }
    buffer = buffer ? buffer + ' ' + line : line;
    if(parensBalanced(buffer)){
      merged.push(buffer);
      buffer = '';
    }
  }
  if(buffer) merged.push(buffer);

  // Step 2: split on commas / semicolons (respecting parens)
  const split = [];
  for(const line of merged){
    split.push(...splitRespectParens(line));
  }

  // Step 3: clean each
  const items = [];
  const skipped = [];
  for(const raw of split){
    const r = cleanItem(raw);
    if(!r) continue;
    if(r.skipped){ skipped.push({ original: r.original, reason: r.reason }); continue; }
    // typo fix on the main word
    const fixed = fuzzyFix(r.name);
    const finalName = fixed || r.name;
    items.push({
      name: finalName,
      qty: r.qty,
      original: r.original,
      wasCleaned: r.original !== finalName,
      wasFuzzy: !!fixed
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

const state = {
  list: null,            // { id, code, name }
  me: null,              // current member { id, name, color }
  members: [],           // all members of the list
  items: [],             // all items
  shopMode: LS.get('grocereis.shop', false),
  channel: null,
};

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
  const ttl = opts.ttl ?? 4000;
  setTimeout(()=>el.remove(), ttl);
}

/* ============================================================ */
/* Supabase: list / member / item ops                            */
/* ============================================================ */
async function createList(name){
  // generate unique code with retry
  for(let tries=0; tries<8; tries++){
    const code = newCode();
    const { data, error } = await supa.from('lists').insert({ code, name: name || null }).select().single();
    if(!error) return data;
    if(error.code !== '23505') throw error; // not a unique violation
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

async function insertItems(itemsArr){
  if(!state.list || !itemsArr.length) return;
  const rows = itemsArr.map(it => ({
    list_id: state.list.id,
    name: it.name,
    qty: it.qty || '',
    cat: categorize(it.name),
    done: false
  }));
  const { error } = await supa.from('items').insert(rows);
  if(error){ toast('Toevoegen mislukt: '+error.message, {kind:'error'}); throw error; }
}

async function toggleItem(id){
  const it = state.items.find(i=>i.id===id);
  if(!it) return;
  const newDone = !it.done;
  const patch = { done: newDone, done_by: newDone ? state.me?.id : null };
  // optimistic
  Object.assign(it, patch);
  render();
  const { error } = await supa.from('items').update(patch).eq('id', id);
  if(error){ toast('Kon niet opslaan', {kind:'error'}); }
}

async function setClaim(id, memberId){
  const it = state.items.find(i=>i.id===id);
  if(!it) return;
  it.claimed_by = memberId;
  render();
  await supa.from('items').update({ claimed_by: memberId }).eq('id', id);
}

async function removeItem(id){
  state.items = state.items.filter(i => i.id !== id);
  render();
  await supa.from('items').delete().eq('id', id);
}

async function bulkUpdate(filter, patch){
  const ids = state.items.filter(filter).map(i=>i.id);
  if(!ids.length) return;
  ids.forEach(id => Object.assign(state.items.find(i=>i.id===id), patch));
  render();
  await supa.from('items').update(patch).in('id', ids);
}

async function bulkDelete(filter){
  const ids = state.items.filter(filter).map(i=>i.id);
  if(!ids.length) return;
  state.items = state.items.filter(i => !ids.includes(i.id));
  render();
  await supa.from('items').delete().in('id', ids);
}

/* ============================================================ */
/* Realtime                                                      */
/* ============================================================ */
function subscribeRealtime(){
  if(state.channel){ supa.removeChannel(state.channel); state.channel = null; }
  if(!state.list) return;
  const ch = supa.channel('list:' + state.list.id);
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'items', filter: `list_id=eq.${state.list.id}` }, payload => {
    handleItemEvent(payload);
  });
  ch.on('postgres_changes', { event: '*', schema: 'public', table: 'members', filter: `list_id=eq.${state.list.id}` }, payload => {
    handleMemberEvent(payload);
  });
  ch.subscribe(status => {
    $('syncStatus').textContent = status === 'SUBSCRIBED' ? 'live · sync aan' : 'connecting…';
    const dot = document.querySelector('.sync-card .dot');
    if(dot) dot.classList.toggle('off', status !== 'SUBSCRIBED');
  });
  state.channel = ch;
}

function handleItemEvent(payload){
  const { eventType, new: nw, old: od } = payload;
  if(eventType === 'INSERT'){
    if(!state.items.find(i=>i.id===nw.id)) state.items.push(nw);
  } else if(eventType === 'UPDATE'){
    const it = state.items.find(i=>i.id===nw.id);
    if(it) Object.assign(it, nw);
  } else if(eventType === 'DELETE'){
    state.items = state.items.filter(i=>i.id !== od.id);
  }
  cacheState();
  render();
}
function handleMemberEvent(payload){
  const { eventType, new: nw, old: od } = payload;
  if(eventType === 'INSERT'){
    if(!state.members.find(m=>m.id===nw.id)) state.members.push(nw);
  } else if(eventType === 'UPDATE'){
    const m = state.members.find(m=>m.id===nw.id);
    if(m) Object.assign(m, nw);
  } else if(eventType === 'DELETE'){
    state.members = state.members.filter(m=>m.id !== od.id);
  }
  cacheState();
  render();
}

/* ============================================================ */
/* Local cache (for instant render + offline reads)              */
/* ============================================================ */
function cacheState(){
  if(!state.list) return;
  const k = 'grocereis.cache.' + state.list.code;
  LS.set(k, { list: state.list, members: state.members, items: state.items });
}
function loadCache(code){
  return LS.get('grocereis.cache.' + code);
}

/* ============================================================ */
/* QR                                                            */
/* ============================================================ */
async function renderQR(code){
  const url = location.origin + location.pathname + '#code=' + code;
  const canvas = $('qrCanvas');
  await QRCode.toCanvas(canvas, url, {
    width: 220, margin: 1,
    color: { dark: '#04041a', light: '#ffffff' }
  });
}

/* ============================================================ */
/* Onboarding                                                    */
/* ============================================================ */
function setupOnboarding(){
  const slides = document.querySelectorAll('#onboarding .slide');
  const dotsHost = $('onbDots');
  let step = 0;
  slides.forEach((_, i) => {
    const d = document.createElement('span');
    if(i === 0) d.classList.add('active');
    dotsHost.appendChild(d);
  });
  function show(i){
    slides.forEach(s => s.classList.toggle('active', +s.dataset.step === i));
    dotsHost.querySelectorAll('span').forEach((d, idx) => d.classList.toggle('active', idx === i));
    $('onbNext').textContent = (i === slides.length - 1) ? 'Aan de slag' : 'Volgende';
  }
  show(0);
  $('onbNext').onclick = () => {
    if(step < slides.length - 1){ step++; show(step); }
    else { finishOnboarding(); }
  };
  $('onbSkip').onclick = () => finishOnboarding();
}
async function finishOnboarding(){
  $('onboarding').hidden = true;
  LS.set('grocereis.onboarded', true);
  await ensureListAndMember();
}

/* ============================================================ */
/* Name + color picker                                           */
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
      d.onclick = () => {
        color = c;
        row.querySelectorAll('.color-dot').forEach(x => x.classList.toggle('selected', x === d));
      };
      row.appendChild(d);
    });
    const saved = LS.get('grocereis.lastName', '');
    input.value = saved;
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
/* List ensure / join / leave                                    */
/* ============================================================ */
async function ensureListAndMember(){
  // 1) URL hash takes priority
  const hashMatch = location.hash.match(/code=([A-Z0-9]+)/i);
  if(hashMatch){
    history.replaceState(null, '', location.pathname);
    await joinByCode(hashMatch[1]);
    return;
  }
  // 2) Last used list
  const last = LS.get('grocereis.lastCode');
  if(last){
    const ok = await tryResume(last);
    if(ok) return;
  }
  // 3) Brand new list
  const me = await showNamePicker();
  const list = await createList('Lijst van ' + me.name);
  await joinAsMe(list, me);
  toast('Nieuwe lijst aangemaakt · code ' + list.code);
}

async function tryResume(code){
  try {
    const cached = loadCache(code);
    if(cached){
      // instant render from cache
      state.list = cached.list;
      state.members = cached.members || [];
      state.items = cached.items || [];
      const memberId = LS.get('grocereis.member.' + code);
      if(memberId){
        state.me = state.members.find(m => m.id === memberId) || null;
      }
      $('app').hidden = false;
      render();
    }
    // refresh from server
    const list = await getListByCode(code);
    if(!list){ LS.rm('grocereis.lastCode'); return false; }
    state.list = list;
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
    subscribeRealtime();
    await renderQR(list.code);
    return true;
  } catch(e){
    console.error(e);
    toast('Kon lijst niet laden: ' + (e.message || e), {kind:'error'});
    return false;
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
  } catch(e){
    toast('Verbinden mislukt: ' + (e.message || e), {kind:'error'});
  }
}

async function joinAsMe(list, mePicked){
  state.list = list;
  state.members = await fetchMembers(list.id);
  if(!mePicked.id){
    // mePicked is { name, color } — insert
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
  // delete this device's member record
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
    const list = $('importList');
    const skip = $('importSkipped');
    list.innerHTML = '';
    skip.innerHTML = '';
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
          ${wasChanged ? `<br><span class="was">was: ${escapeHtml(it.original)}</span>` : ''}
        </span>
        ${cat.temp !== 'ambient' ? `<span class="badge ${cat.temp}">${cat.temp}</span>` : ''}
      `;
      row.querySelector('.toggle').onclick = () => {
        enabled[idx] = !enabled[idx];
        row.classList.toggle('off', !enabled[idx]);
      };
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
    $('importConfirm').onclick = () => {
      $('importModal').hidden = true;
      const final = parsed.items.filter((_, i) => enabled[i]);
      resolve(final);
    };
  });
}

/* ============================================================ */
/* Rendering                                                     */
/* ============================================================ */
function render(){
  renderHeader();
  renderSync();
  renderList();
  applyShopMode();
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

function renderList(){
  const $todo = $('todo');
  const $done = $('done');
  $todo.innerHTML = '';
  $done.innerHTML = '';

  const todo = state.items.filter(i => !i.done);
  const done = state.items.filter(i => i.done);

  const byCat = {};
  for(const it of todo) (byCat[it.cat] = byCat[it.cat] || []).push(it);

  const sortedCats = CATEGORIES
    .filter(c => byCat[c.id] && byCat[c.id].length)
    .sort((a,b) => a.order - b.order);

  if(sortedCats.length === 0){
    $todo.innerHTML = '<div class="empty">geen openstaande boodschappen · tijd voor pizza</div>';
  }

  for(const cat of sortedCats){
    const list = byCat[cat.id];
    const wrap = document.createElement('div');
    wrap.className = 'cat ' + cat.temp;
    wrap.innerHTML = `
      <div class="cat-head">
        <span class="ico">${cat.icon}</span>
        <span class="name">${escapeHtml(cat.name)}</span>
        ${cat.temp==='gekoeld' ? '<span class="badge gekoeld">gekoeld</span>' : ''}
        ${cat.temp==='diepvries' ? '<span class="badge diepvries">diepvries</span>' : ''}
        <span class="count">${list.length}</span>
      </div>
      <ul class="items"></ul>`;
    const ul = wrap.querySelector('ul');
    for(const it of list) ul.appendChild(itemEl(it, cat));
    $todo.appendChild(wrap);
  }

  if(done.length){
    $('doneSection').hidden = false;
    $('doneHeadCount').textContent = done.length;
    const sortedDone = [...done].sort((a,b) => {
      const oa = CAT_BY_ID[a.cat]?.order ?? 99;
      const ob = CAT_BY_ID[b.cat]?.order ?? 99;
      if(oa !== ob) return oa - ob;
      return new Date(b.updated_at) - new Date(a.updated_at);
    });
    const ul = document.createElement('ul');
    ul.className = 'items';
    for(const it of sortedDone){
      const cat = CAT_BY_ID[it.cat] || CAT_BY_ID.overig;
      ul.appendChild(itemEl(it, cat));
    }
    $done.appendChild(ul);
  } else {
    $('doneSection').hidden = true;
  }

  $('todoCount').textContent = todo.length;
  $('doneCount').textContent = done.length;
  $('totalCount').textContent = state.items.length;
  const pct = state.items.length ? Math.round((done.length / state.items.length) * 100) : 0;
  $('progressBar').style.width = pct + '%';
}

function itemEl(it, cat){
  const li = document.createElement('li');
  li.className = 'item';
  if(it.claimed_by && state.me && it.claimed_by === state.me.id) li.classList.add('claimed-by-me');
  li.dataset.id = it.id;

  const badges = [];
  if(cat.temp === 'gekoeld') badges.push('<span class="badge gekoeld">gekoeld</span>');
  if(cat.temp === 'diepvries') badges.push('<span class="badge diepvries">diepvries</span>');

  const claimer = state.members.find(m => m.id === it.claimed_by);
  const doneBy = state.members.find(m => m.id === it.done_by);
  const assignChip = claimer
    ? `<button class="assign-chip has-claim" style="background:${claimer.color}" title="Gepakt door ${escapeHtml(claimer.name)}">${initials(claimer.name)}</button>`
    : `<button class="assign-chip" title="Toewijzen">+</button>`;

  li.innerHTML = `
    <span class="check"></span>
    ${it.qty ? `<span class="qty">${escapeHtml(it.qty)}</span>` : ''}
    <span class="label">${escapeHtml(it.name)}${doneBy && it.done ? ` <span class="qty" style="border-color:${doneBy.color};color:${doneBy.color}">${escapeHtml(doneBy.name)}</span>` : ''}</span>
    ${badges.join(' ')}
    ${assignChip}
    <button class="del" type="button" title="verwijder" aria-label="verwijder">✕</button>
  `;

  li.addEventListener('click', (e) => {
    if(e.target.closest('.del') || e.target.closest('.assign-chip')) return;
    toggleItem(it.id);
  });
  li.querySelector('.del').addEventListener('click', (e) => {
    e.stopPropagation();
    removeItem(it.id);
  });
  li.querySelector('.assign-chip').addEventListener('click', (e) => {
    e.stopPropagation();
    openAssignPopover(e.currentTarget, it);
  });
  return li;
}

/* ============================================================ */
/* Assign popover                                                */
/* ============================================================ */
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
/* Shop mode                                                     */
/* ============================================================ */
function applyShopMode(){
  document.body.classList.toggle('shop', state.shopMode);
  $('shopToggle').textContent = state.shopMode ? 'STOP' : 'SHOP';
}

/* ============================================================ */
/* Event wiring                                                  */
/* ============================================================ */
function wireEvents(){
  $('shopToggle').onclick = () => {
    state.shopMode = !state.shopMode;
    LS.set('grocereis.shop', state.shopMode);
    applyShopMode();
    if(state.shopMode) window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  $('addBatch').onclick = async () => {
    const txt = $('batch').value;
    if(!txt.trim()) return;
    const parsed = smartParse(txt);
    if(!parsed.items.length){
      toast('Niks bruikbaars gevonden', {kind:'warn'});
      return;
    }
    const final = await showImportPreview(parsed);
    if(!final) return;
    await insertItems(final);
    $('batch').value = '';
    const cleanCount = final.filter(f => f.wasCleaned || f.wasFuzzy).length;
    const msg = `${final.length} toegevoegd` + (cleanCount ? ` · ${cleanCount} gecorrigeerd` : '');
    toast(msg);
  };

  $('clearBatch').onclick = () => { $('batch').value = ''; };

  async function quickAddFrom(inpId){
    const inp = $(inpId);
    const v = inp.value.trim();
    if(!v) return;
    const parsed = smartParse(v);
    if(parsed.items.length){
      await insertItems(parsed.items);
      inp.value = '';
    } else {
      toast('Niks bruikbaars', {kind:'warn'});
    }
    inp.focus();
  }
  $('addOne').onclick = () => quickAddFrom('quick');
  $('quick').onkeydown = (e) => { if(e.key === 'Enter'){ e.preventDefault(); quickAddFrom('quick'); } };
  $('shopAdd').onclick = () => quickAddFrom('shopQuick');
  $('shopQuick').onkeydown = (e) => { if(e.key === 'Enter'){ e.preventDefault(); quickAddFrom('shopQuick'); } };

  $('uncheckAll').onclick = () => bulkUpdate(i => i.done, { done: false, done_by: null });
  $('clearDone').onclick = () => {
    if(!state.items.some(i => i.done)) return;
    if(confirm('Alle afgevinkte items verwijderen?')) bulkDelete(i => i.done);
  };
  $('clearAll').onclick = () => {
    if(!state.items.length) return;
    if(confirm('Hele lijst wissen?')) bulkDelete(() => true);
  };

  $('copyLink').onclick = async () => {
    const url = location.origin + location.pathname + '#code=' + state.list.code;
    try { await navigator.clipboard.writeText(url); toast('Link gekopieerd'); }
    catch(e){ toast('Kopiëren mislukt', {kind:'warn'}); }
  };
  $('joinOther').onclick = () => {
    $('joinCode').value = '';
    $('joinModal').hidden = false;
    setTimeout(() => $('joinCode').focus(), 50);
  };
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

  // close popover on scroll
  window.addEventListener('scroll', closeAssignPopover, { passive: true });

  // realtime presence on visibilitychange
  document.addEventListener('visibilitychange', async () => {
    if(document.visibilityState === 'visible' && state.list){
      // refresh items in case we missed events
      try{
        state.items = await fetchItems(state.list.id);
        state.members = await fetchMembers(state.list.id);
        cacheState(); render();
      } catch(e){}
    }
  });
}

/* ============================================================ */
/* Init                                                          */
/* ============================================================ */
async function init(){
  wireEvents();
  const onboarded = LS.get('grocereis.onboarded');
  const hash = location.hash;
  if(!onboarded && !hash){
    $('onboarding').hidden = false;
    setupOnboarding();
  } else {
    await ensureListAndMember();
  }
}

init().catch(e => {
  console.error(e);
  toast('Startfout: ' + (e.message || e), {kind:'error'});
});

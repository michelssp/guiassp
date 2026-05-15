// ============================================================
//  GUIA SSP — APP.JS
// ============================================================

// STATE
let pts = 120;
let favs = new Set();
let checkins = new Set();
let sorteiosPart = new Set();
let currentBiz = null;
let starRating = 0;
let currentTab = 'feed';
let histItems = [];
let storyShown = false;
let adminPIN = 'free@8354lock';

// ── UTILS ─────────────────────────────────────────────────
function waLink(phone, name) {
  return 'https://wa.me/' + phone.replace(/\D/g,'') + '?text=' + encodeURIComponent('Olá! Vi ' + name + ' no Guia SSP e gostaria de mais informações.');
}
function isOpen(h) {
  if (!h || h === 'Aberto') return true;
  const c = new Date().getHours() * 60 + new Date().getMinutes();
  const m = h.match(/(\d+):(\d+)[^\d]*(\d+):(\d+)/);
  if (!m) return true;
  return c >= +m[1]*60 + +m[2] && c < +m[3]*60 + +m[4];
}
function catName(c) {
  return {restaurante:'Alimentação',farmacia:'Saúde',comercio:'Comércio',servico:'Serviço',educacao:'Educação'}[c] || c;
}
function planoBadge(p) {
  if (!p) return '';
  const map = {basico:'<span style="background:#E1F5EE;color:#085041;font-size:9px;padding:2px 6px;border-radius:6px;font-weight:700;margin-left:4px">BÁSICO</span>', pro:'<span style="background:#E6F1FB;color:#0C447C;font-size:9px;padding:2px 6px;border-radius:6px;font-weight:700;margin-left:4px">PRO</span>', premium:'<span style="background:#EEEDFE;color:#3C3489;font-size:9px;padding:2px 6px;border-radius:6px;font-weight:700;margin-left:4px">PREMIUM</span>'};
  return map[p] || '';
}
function addPts(n, reason) {
  pts += n;
  document.getElementById('pts-display').textContent = pts;
  histItems.unshift({label: reason, pts: n, time: 'agora'});
}
function fmt(n) { return 'R$ ' + n.toLocaleString('pt-BR'); }
function posColor(p) { return p===1?'#EF9F27':p===2?'#9AA0A6':p===3?'#CD7F32':'var(--color-border-tertiary)'; }
function posText(p) { return p===1?'🥇':p===2?'🥈':p===3?'🥉':p; }

// ── STORY POPUP ───────────────────────────────────────────
function showStoryIfNeeded() {
  if (storyShown) return;
  const s = STORIES.find(x => x.active);
  if (!s) return;
  storyShown = true;
  const overlay = document.createElement('div');
  overlay.id = 'story-overlay';
  overlay.style.cssText = 'position:fixed;inset:0;z-index:200;display:flex;align-items:center;justify-content:center;background:rgba(0,0,0,.7)';
  overlay.innerHTML = `
    <div style="width:300px;background:${s.bg};border-radius:20px;padding:32px 20px;color:#fff;text-align:center;position:relative">
      <button onclick="closeStory()" style="position:absolute;top:10px;right:12px;background:rgba(255,255,255,.2);border:none;color:#fff;border-radius:50%;width:28px;height:28px;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:inherit">×</button>
      <div style="font-size:10px;opacity:.75;text-transform:uppercase;letter-spacing:.5px;margin-bottom:8px">📣 Patrocinado por ${s.name}</div>
      <div style="font-size:52px;margin-bottom:10px">${s.emoji}</div>
      <div style="font-size:32px;font-weight:700;margin-bottom:6px">${s.headline}</div>
      <div style="font-size:14px;opacity:.9;margin-bottom:20px;line-height:1.4">${s.sub}</div>
      <button onclick="window.open('tel:${s.phone}');closeStory();" style="background:#fff;color:${s.bg};border:none;border-radius:12px;padding:12px 28px;font-size:14px;font-weight:700;cursor:pointer;font-family:inherit;width:100%">${s.cta}</button>
      <div style="margin-top:10px;font-size:11px;opacity:.7;cursor:pointer" onclick="closeStory()">Fechar anúncio</div>
    </div>`;
  document.body.appendChild(overlay);
}
function closeStory() {
  const el = document.getElementById('story-overlay');
  if (el) el.remove();
}

// ── TABS ──────────────────────────────────────────────────
function showTab(tab, btn) {
  currentTab = tab;
  if (btn) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('on'));
    btn.classList.add('on');
  }
  document.getElementById('srch').value = '';
  renderAll();
  window.scrollTo(0, 0);
}
function setTB(btn) {
  document.querySelectorAll('.tabb').forEach(b => b.classList.remove('on'));
  btn.classList.add('on');
}
function doSearch() { renderAll(); }

// ── RENDER ALL ────────────────────────────────────────────
function renderAll() {
  const q = document.getElementById('srch').value.toLowerCase();
  const el = document.getElementById('main');
  const map = {
    feed: renderFeed, promos: renderPromos, sorteios: renderSorteios,
    vagas: () => renderVagas(q), enquetes: renderEnquetes, ranking: renderRanking,
    mapa: renderMapa, emergencia: renderEmergencia, perfil: renderPerfil,
    monetizacao: renderMonetizacao, admin: () => renderAdmin()
  };
  if (map[currentTab]) { el.innerHTML = map[currentTab](); return; }
  // negocios
  const filt = BIZ.filter(b => !q || b.name.toLowerCase().includes(q) || b.addr.toLowerCase().includes(q));
  const dest = filt.filter(b => b.destaque);
  const rest = filt.filter(b => !b.destaque);
  const secs = {};
  rest.forEach(b => { if (!secs[b.cat]) secs[b.cat] = []; secs[b.cat].push(b); });
  let h = '<div class="section" style="padding-top:10px">';
  h += renderPlantaoCard();
  if (dest.length) h += `<div style="margin-top:10px"><div class="stitle">⭐ Destaques</div>${dest.map(rCard).join('')}</div>`;
  const cnames = {restaurante:'🍽️ Alimentação',farmacia:'💊 Saúde',comercio:'🛍️ Comércio',servico:'🔧 Serviços',educacao:'📚 Educação'};
  Object.keys(secs).forEach(cat => {
    h += `<div style="margin-top:10px"><div class="stitle">${cnames[cat]||cat}</div>${secs[cat].map(rCard).join('')}</div>`;
  });
  h += '</div>';
  el.innerHTML = filt.length ? h : '<div class="empty"><i class="ti ti-search"></i><p>Nenhum resultado.</p></div>';
}

// ── CARD ──────────────────────────────────────────────────
function rCard(b) {
  const op = isOpen(b.hours), hp = !!b.phone, fv = favs.has(b.id), ci = checkins.has(b.id);
  return `<div class="card${b.destaque?' destaque':''}" onclick="openBiz(${b.id})">
    ${b.destaque ? '<div class="dest-tag">⭐ Destaque</div>' : ''}
    <div class="ctop">
      <div class="cicon" style="background:${b.bg}">${b.icon}</div>
      <div class="cinfo">
        <div class="cname">${b.name}${planoBadge(b.plano)}</div>
        <div class="caddr"><i class="ti ti-map-pin" aria-hidden="true"></i> ${b.addr}</div>
      </div>
      <button class="cfav" onclick="event.stopPropagation();tFav(${b.id})" id="fv${b.id}" aria-label="Favoritar">${fv?'❤️':'🤍'}</button>
    </div>
    <div class="cmeta">
      ${b.rating ? `<span class="rating-s">★ ${b.rating} <span style="color:var(--color-text-secondary)">(${b.rc})</span></span>` : ''}
      <span class="badge-s ${op?'open':'clt'}" style="background:${op?'#E1F5EE':'#FAECE7'}">${op?'Aberto':'Fechado'}</span>
      ${b.plantao ? '<span class="badge-s" style="background:#E1F5EE;color:#085041">🌙 Plantão</span>' : ''}
      ${ci ? '<span class="badge-s" style="background:#F0EEFF;color:#3D2FA0">✓ Check-in</span>' : ''}
    </div>
    <div class="arow" onclick="event.stopPropagation()">
      ${hp ? `<button class="abtn aphone" onclick="window.open('tel:${b.phone}')"><i class="ti ti-phone" aria-hidden="true"></i> Ligar</button>` : ''}
      ${hp ? `<button class="abtn awa" onclick="window.open('${waLink(b.phone,b.name)}')"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i> WA</button>` : ''}
      <button class="abtn acheckin" onclick="doCheckin(${b.id},'${b.name.replace(/'/g,"\\'")}')"><i class="ti ti-map-pin" aria-hidden="true"></i> Check-in</button>
      <button class="abtn ashare" onclick="shareB('${b.name.replace(/'/g,"\\'")}')"><i class="ti ti-share" aria-hidden="true"></i></button>
      <button class="abtn amap" onclick="window.open('${b.maps}')"><i class="ti ti-map" aria-hidden="true"></i></button>
    </div>
  </div>`;
}

// ── ACTIONS ───────────────────────────────────────────────
function doCheckin(id, name) {
  if (checkins.has(id)) { alert('Você já fez check-in em ' + name + ' hoje!'); return; }
  checkins.add(id);
  addPts(20, 'Check-in em ' + name);
  alert('✅ Check-in feito em ' + name + '!\n+20 pontos adicionados!');
  renderAll();
}
function tFav(id) {
  favs.has(id) ? favs.delete(id) : favs.add(id);
  const el = document.getElementById('fv' + id);
  if (el) el.textContent = favs.has(id) ? '❤️' : '🤍';
}
function toggleFavDetail() { if (currentBiz) tFav(currentBiz); }
function shareB(name) { window.open('https://wa.me/?text=' + encodeURIComponent('📍 Confira ' + name + ' no Guia Comercial de São Sebastião do Passé!')); }
function shareDetail() { const b = BIZ.find(x => x.id === currentBiz); if (b) shareB(b.name); }

// ── FEED ──────────────────────────────────────────────────
function renderFeed() {
  const dicas = [
    'Almoço hoje? 🍖 Bode na Brasa com 20% OFF!',
    'Farmácia de plantão: Drogaria São Fellipe — aberta 24h.',
    'Evento neste sábado: Feira Cultural na Praça Central.',
    '💼 Nova vaga: Atendente de Farmácia na Poupe Mais Farma.',
    '🎰 Sorteio ativo: Cesta básica no Somar Supermercado!'
  ];
  const dica = dicas[new Date().getDay() % dicas.length];
  // Banner rotativo
  const bn = BANNERS[Math.floor(Date.now() / 30000) % BANNERS.length];
  const feed = [
    {ava:"🍖",bg:"#FFF3E0",title:"Bode na Brasa: 20% OFF no almoço hoje!",sub:"Promoção válida de seg a qua.",time:"10 min atrás",tab:'promos'},
    {ava:"🎰",bg:"#F0EEFF",title:"Novo sorteio: Fone Bluetooth no EletroShow",sub:"89 pessoas já participaram. Encerra em 25/05.",time:"1h atrás",tab:'sorteios'},
    {ava:"💼",bg:"#E6F1FB",title:"Vaga: Vendedor(a) no EletroShow",sub:"Regime CLT, horário comercial.",time:"2h atrás",tab:'vagas'},
    {ava:"📅",bg:"#E8EAF6",title:"Feira Cultural neste sábado — Praça Central",sub:"9:00 às 18:00. Entrada gratuita.",time:"5h atrás",tab:''},
    {ava:"🏆",bg:"#FDF4D8",title:"Ranking da semana: Bode na Brasa lidera!",sub:"Com 312 pontos, é o mais bem avaliado.",time:"Hoje, 9:00",tab:'ranking'},
    {ava:"🗳️",bg:"#E1F5EE",title:"Enquete: Qual o melhor restaurante de SSP?",sub:"Vote e veja o resultado em tempo real.",time:"Hoje, 8:00",tab:'enquetes'},
  ];
  return `<div class="section" style="padding-top:10px">
    <div class="dica-card" onclick="showTab('promos')">
      <div class="dica-label">💡 DICA DO DIA</div>
      <div class="dica-text">${dica}</div>
      <div class="dica-sub">Toque para saber mais →</div>
    </div>
    <div style="background:${bn.color};border-radius:12px;padding:13px;color:#fff;margin-bottom:10px;cursor:pointer" onclick="window.open('tel:${bn.phone}')">
      <div style="font-size:9px;opacity:.7;text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px">📣 Banner patrocinado · ${bn.name}</div>
      <div style="font-size:18px;font-weight:700;margin-bottom:3px">${bn.icon} ${bn.headline}</div>
      <div style="font-size:12px;opacity:.85;margin-bottom:10px">${bn.sub}</div>
      <div style="background:rgba(255,255,255,.25);border-radius:8px;padding:7px 12px;font-size:12px;font-weight:700;display:inline-flex;align-items:center;gap:5px"><i class="ti ti-phone" aria-hidden="true"></i> ${bn.cta}</div>
    </div>
    <div class="stitle">📰 Novidades de SSP</div>
    ${feed.map(f => `<div class="feed-item" onclick="${f.tab ? "showTab('"+f.tab+"')" : ''}" style="${f.tab?'cursor:pointer':''}">
      <div class="feed-ava" style="background:${f.bg}">${f.ava}</div>
      <div class="feed-content"><div class="feed-title">${f.title}</div><div class="feed-sub">${f.sub}</div><div class="feed-time">${f.time}</div></div>
    </div>`).join('')}
  </div>`;
}

// ── PLANTÃO ───────────────────────────────────────────────
function renderPlantaoCard() {
  const farm = BIZ.find(b => b.plantao);
  return `<div class="plantao-card">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:9px">
      <span style="font-size:20px">🌙</span>
      <div><div class="plantao-title">Plantão hoje — 24 horas</div><div class="plantao-sub">${farm ? farm.addr : ''}</div></div>
    </div>
    <div style="font-size:15px;font-weight:700;color:#085041;margin-bottom:8px">${farm ? farm.name : 'Drogaria São Fellipe'}</div>
    <div style="display:flex;gap:6px">
      ${farm && farm.phone ? `<button class="abtn aphone" onclick="window.open('tel:${farm.phone}')" style="flex:1;padding:8px"><i class="ti ti-phone" aria-hidden="true"></i> Ligar</button><button class="abtn awa" onclick="window.open('${waLink(farm.phone,farm.name)}')" style="flex:1;padding:8px"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i> WhatsApp</button>` : ''}
    </div>
  </div>`;
}

// ── PROMOS ────────────────────────────────────────────────
function renderPromos() {
  return `<div class="section" style="padding-top:10px">
    <div class="stitle">🔥 Promoções ativas</div>
    ${PROMOS.map(p => `<div class="promo-card" onclick="openBiz(${p.bid})">
      <div class="promo-disc">${p.disc}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:600;display:flex;align-items:center;gap:5px">${p.icon} ${p.name}${p.patrocinado?'<span style="background:#FDF4D8;color:#633806;font-size:9px;padding:1px 6px;border-radius:6px;font-weight:700">PATROCINADO</span>':''}</div>
        <div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px">${p.desc}</div>
        <div style="font-size:11px;color:#BA7517;margin-top:4px;display:flex;align-items:center;gap:3px"><i class="ti ti-clock" style="font-size:11px" aria-hidden="true"></i> ${p.valid}</div>
      </div>
    </div>`).join('')}
    <div class="stitle" style="margin-top:12px">📅 Eventos</div>
    ${EVENTS.map(e => `<div class="event-card">
      <div class="event-date"><div class="event-day">${e.day}</div><div class="event-month">${e.month}</div></div>
      <div><div class="event-name">${e.name}</div><div class="event-local"><i class="ti ti-map-pin" style="font-size:10px" aria-hidden="true"></i> ${e.local} · ${e.hora}</div>
      <button class="event-wa" onclick="window.open('https://wa.me/?text='+encodeURIComponent('📅 ${e.name} — ${e.local} às ${e.hora}. Vamos juntos?'))"><i class="ti ti-brand-whatsapp" style="font-size:11px" aria-hidden="true"></i> Compartilhar</button></div>
    </div>`).join('')}
    <div style="background:var(--color-background-secondary);border-radius:12px;border:.5px solid var(--color-border-tertiary);padding:13px;margin-top:4px">
      <div style="font-size:13px;font-weight:600;margin-bottom:5px">💰 Anuncie sua promoção aqui</div>
      <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.45">Publique uma oferta e ela aparece nesta tela para todos os usuários do Guia SSP. A partir de <strong>R$29/publicação</strong>.</div>
      <button class="abtn aphone" onclick="openP('pcontrato')" style="width:100%;padding:9px;font-size:12px;justify-content:center"><i class="ti ti-speakerphone" aria-hidden="true"></i> Quero anunciar</button>
    </div>
  </div>`;
}

// ── SORTEIOS ──────────────────────────────────────────────
function renderSorteios() {
  return `<div class="section" style="padding-top:10px">
    <div class="indique-card">
      <h3>🤝 Indique um negócio</h3>
      <p>Conhece um negócio em SSP que ainda não está no guia? Indique e ganhe <strong>50 pontos</strong> quando ele for aprovado!</p>
      <button class="indique-btn" onclick="openP('pcad');addPts(5,'Indicação iniciada')">📲 Indicar agora (+50pts quando aprovado)</button>
    </div>
    <div class="stitle">🎰 Sorteios ativos</div>
    ${SORTEIOS.map(s => {
      const part = sorteiosPart.has(s.id);
      return `<div class="sort-card">
        <div style="display:flex;align-items:flex-start;gap:10px;margin-bottom:8px">
          <div style="font-size:28px">${s.icon}</div>
          <div style="flex:1">
            <div style="font-size:11px;opacity:.8;margin-bottom:2px">por ${s.biz}${s.patrocinado?' · <span style="opacity:.7;font-size:10px">PATROCINADO</span>':''}</div>
            <div style="font-size:15px;font-weight:700">${s.name}</div>
          </div>
        </div>
        <div style="font-size:12px;opacity:.85;margin-bottom:10px">🎁 Prêmio: ${s.prize}</div>
        <div class="sort-row">
          <div><div style="font-size:10px;opacity:.75">Participantes</div><div style="font-size:16px;font-weight:700">${s.parts}</div></div>
          <div><div style="font-size:10px;opacity:.75">Encerra</div><div style="font-size:14px;font-weight:600">${s.end}</div></div>
          <button class="sort-btn" onclick="${part ? "alert('Você já está participando!')" : "partSort('"+s.id+"','"+s.name+"')"}">${part ? '✓ Participando' : 'Participar grátis'}</button>
        </div>
      </div>`;
    }).join('')}
    <div style="background:var(--color-background-secondary);border-radius:12px;border:.5px solid var(--color-border-tertiary);padding:13px;margin-top:4px">
      <div style="font-size:13px;font-weight:600;margin-bottom:5px">🎰 Patrocine um sorteio</div>
      <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.45">Ofereça um prêmio e alcance centenas de pessoas em SSP. A partir de <strong>R$49/sorteio</strong>.</div>
      <button class="abtn acheckin" onclick="openP('pcontrato')" style="width:100%;padding:9px;font-size:12px;justify-content:center"><i class="ti ti-ticket" aria-hidden="true"></i> Quero patrocinar um sorteio</button>
    </div>
  </div>`;
}
function partSort(id, name) {
  sorteiosPart.add(id);
  addPts(10, 'Participou do sorteio: ' + name);
  alert('🎰 Você está participando!\n+10 pontos adicionados!');
  renderAll();
}

// ── VAGAS ─────────────────────────────────────────────────
function renderVagas(q) {
  const filt = VAGAS.filter(v => !q || v.title.toLowerCase().includes(q) || v.biz.toLowerCase().includes(q));
  return `<div class="section" style="padding-top:10px">
    <div class="stitle">💼 Vagas em SSP <a onclick="openP('pcontrato')">+ Publicar vaga</a></div>
    ${filt.map(v => `<div class="vaga-card">
      <div style="display:flex;align-items:flex-start;gap:9px;margin-bottom:8px">
        <div class="cicon" style="background:#E6F1FB;font-size:18px">${v.icon}</div>
        <div style="flex:1"><div class="vaga-title">${v.title}${v.patrocinado?'<span style="background:#FDF4D8;color:#633806;font-size:9px;padding:1px 6px;border-radius:6px;font-weight:700;margin-left:5px">PATROCINADO</span>':''}</div><div class="vaga-biz">${v.biz}</div></div>
      </div>
      <div class="vaga-tags">
        <span class="vtag" style="background:#E1F5EE;color:#085041">${v.tipo}</span>
        <span class="vtag" style="background:#E6F1FB;color:#0C447C">${v.turno}</span>
        <span class="vtag" style="background:var(--color-background-secondary);color:var(--color-text-secondary);border:.5px solid var(--color-border-tertiary)">${v.req}</span>
      </div>
      <button class="vcand" onclick="window.open('${waLink(v.phone,v.biz+' — '+v.title)}');addPts(15,'Candidatura: '+v.title)">
        <i class="ti ti-brand-whatsapp" style="font-size:14px" aria-hidden="true"></i> Candidatar-se via WhatsApp (+15pts)
      </button>
    </div>`).join('')}
    ${!filt.length ? '<div class="empty"><i class="ti ti-briefcase"></i><p>Nenhuma vaga encontrada.</p></div>' : ''}
    <div style="background:var(--color-background-secondary);border-radius:12px;border:.5px solid var(--color-border-tertiary);padding:13px;margin-top:4px">
      <div style="font-size:13px;font-weight:600;margin-bottom:5px">💼 Publique sua vaga aqui</div>
      <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:10px;line-height:1.45">Alcance candidatos em SSP com notificação push. A partir de <strong>R$19/vaga</strong> ou plano ilimitado por <strong>R$79/mês</strong>.</div>
      <button class="abtn ashare" onclick="openP('pcontrato')" style="width:100%;padding:9px;font-size:12px;justify-content:center"><i class="ti ti-plus" aria-hidden="true"></i> Publicar vaga</button>
    </div>
  </div>`;
}

// ── ENQUETES ──────────────────────────────────────────────
function renderEnquetes() {
  return `<div class="section" style="padding-top:10px">
    <div class="stitle">🗳️ Enquetes de SSP</div>
    ${ENQUETES.map((e, ei) => `<div class="enquete-card">
      <div class="eq-q">${e.q}</div>
      ${e.opts.map((opt, oi) => {
        const pct = e.total ? Math.round(e.votes[oi] / e.total * 100) : 0;
        const voted = e.voted === oi;
        return `<div class="eq-opt${voted?' voted':''}" onclick="vote(${ei},${oi})" style="position:relative;overflow:hidden">
          ${e.voted !== null ? `<div class="eq-bar" style="width:${pct}%;position:absolute;left:0;top:0;bottom:0;background:rgba(29,158,117,.12);z-index:0"></div>` : ''}
          <span style="position:relative;z-index:1">${opt}</span>
          ${e.voted !== null ? `<em style="position:relative;z-index:1;font-style:normal;font-size:11px;color:var(--color-text-secondary)">${pct}%</em>` : ''}
        </div>`;
      }).join('')}
      <div class="eq-meta"><i class="ti ti-users" style="font-size:12px" aria-hidden="true"></i> ${e.total} voto${e.total!==1?'s':''} ${e.voted===null?'· Toque para votar':''}</div>
    </div>`).join('')}
  </div>`;
}
function vote(ei, oi) {
  const e = ENQUETES[ei];
  if (e.voted !== null) return;
  e.voted = oi; e.votes[oi]++; e.total++;
  addPts(5, 'Votou na enquete');
  renderAll();
}

// ── RANKING ───────────────────────────────────────────────
function renderRanking() {
  return `<div class="section" style="padding-top:10px">
    <div class="stitle">🏆 Ranking da semana</div>
    ${RANKING.map(r => `<div class="rank-item" onclick="openBiz(${r.bid})">
      <div class="rank-pos" style="background:${posColor(r.pos)};color:${r.pos<=3?'#fff':'var(--color-text-secondary)'}">${posText(r.pos)}</div>
      <div style="flex:1;min-width:0"><div class="rank-name">${r.icon} ${r.name}</div><div class="rank-meta">${r.meta}</div></div>
      <div class="rank-pts">${r.pts}pts</div>
    </div>`).join('')}
    <div style="background:var(--color-background-secondary);border-radius:10px;padding:12px;text-align:center;margin-top:4px">
      <p style="font-size:12px;color:var(--color-text-secondary);line-height:1.4">Avalie negócios, faça check-ins e participe de sorteios para subir no ranking! 🚀</p>
    </div>
  </div>`;
}

// ── MAPA ──────────────────────────────────────────────────
function renderMapa() {
  const pins = [
    {l:'42%',t:'32%',icon:'🛒',id:1,label:'Somar'},{l:'58%',t:'47%',icon:'🍖',id:2,label:'Bode'},
    {l:'32%',t:'58%',icon:'💊',id:6,label:'São Fellipe'},{l:'67%',t:'36%',icon:'🍔',id:3,label:'Em Brasa'},
    {l:'50%',t:'63%',icon:'📱',id:9,label:'EletroShow'},{l:'24%',t:'42%',icon:'🚗',id:12,label:'Alegre Car'},
    {l:'72%',t:'67%',icon:'📚',id:13,label:'Escola GR'},{l:'55%',t:'22%',icon:'🍕',id:4,label:'Taberna'},
  ];
  return `<div class="section" style="padding-top:10px">
    <div class="stitle">🗺️ Negócios no mapa</div>
    <div class="map-box">
      <div class="map-bg"></div>
      ${pins.map(p => `<div class="map-pin" style="left:${p.l};top:${p.t}" onclick="openBiz(${p.id})">${p.icon}<div class="map-label">${p.label}</div></div>`).join('')}
    </div>
    <a href="https://maps.google.com/?q=São+Sebastião+do+Passé+BA" style="display:flex;align-items:center;justify-content:center;gap:5px;color:var(--green,#1D9E75);font-size:12px;text-decoration:none;margin-bottom:10px">
      <i class="ti ti-external-link" style="font-size:13px" aria-hidden="true"></i> Abrir mapa completo no Google Maps
    </a>
    <div class="stitle">🔗 Links úteis & parceiros</div>
    ${AFILIADOS.map(a => `<div class="card" onclick="window.open('${a.url}')">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="cicon" style="background:var(--color-background-secondary);font-size:20px">${a.icon}</div>
        <div style="flex:1"><div style="font-size:13px;font-weight:600">${a.name}</div><div style="font-size:12px;color:var(--color-text-secondary);margin-top:2px">${a.desc}</div></div>
        <span style="font-size:10px;background:#E1F5EE;color:#085041;padding:2px 8px;border-radius:8px;font-weight:600;white-space:nowrap">${a.comissao}</span>
      </div>
    </div>`).join('')}
  </div>`;
}

// ── EMERGÊNCIA ────────────────────────────────────────────
function renderEmergencia() {
  return `<div class="section" style="padding-top:10px">
    ${renderPlantaoCard()}
    <div class="stitle" style="margin-top:10px">🚨 Números de emergência</div>
    <div class="emerg-wrap">
      <div class="emerg-grid">
        ${EMERGENCY.map(e => `<a class="emerg-item" href="tel:${e.num}"><div class="emerg-num">${e.num}</div><div class="emerg-label">${e.label}</div></a>`).join('')}
      </div>
    </div>
  </div>`;
}

// ── PERFIL / PONTOS ───────────────────────────────────────
function renderPerfil() {
  const hlist = histItems.length ? histItems.slice(0,5) : [
    {label:'Check-in em Somar Supermercado',pts:20,time:'hoje'},
    {label:'Participou de sorteio',pts:10,time:'hoje'},
    {label:'Avaliou Bode na Brasa',pts:10,time:'ontem'},
    {label:'Cadastro no app',pts:50,time:'esta semana'},
    {label:'Completou perfil',pts:30,time:'esta semana'},
  ];
  return `<div class="section" style="padding-top:10px">
    <div class="pts-header">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">
        <span style="font-size:32px">👤</span>
        <div><div style="font-size:14px;font-weight:600">Morador de SSP</div><div style="font-size:12px;opacity:.85">Membro desde maio 2026</div></div>
      </div>
      <div class="pts-val">${pts}</div>
      <div class="pts-label">pontos acumulados</div>
      <div class="pts-grid">
        <div class="pts-stat"><div class="pts-stat-val">${checkins.size+3}</div><div class="pts-stat-label">Check-ins</div></div>
        <div class="pts-stat"><div class="pts-stat-val">${sorteiosPart.size+1}</div><div class="pts-stat-label">Sorteios</div></div>
        <div class="pts-stat"><div class="pts-stat-val">2</div><div class="pts-stat-label">Avaliações</div></div>
      </div>
    </div>
    <div class="stitle">🥇 Conquistas</div>
    <div class="badge-grid">${BADGES.map(b => `<div class="badge-item ${b.earned?'earned':'locked'}" title="${b.desc}"><span class="badge-emoji">${b.emoji}</span><div class="badge-name">${b.name}</div></div>`).join('')}</div>
    <div class="stitle">📋 Histórico de pontos</div>
    <div class="pts-hist">${hlist.map(h => `<div class="hist-item"><div class="hist-icon" style="background:#E1F5EE">⭐</div><div style="flex:1;font-size:12px">${h.label}<div style="font-size:10px;color:var(--color-text-secondary);margin-top:1px">${h.time}</div></div><div class="hist-pts">+${h.pts}</div></div>`).join('')}</div>
    <div style="background:var(--color-background-secondary);border-radius:10px;padding:12px;font-size:12px;color:var(--color-text-secondary);line-height:1.6">
      <strong style="color:var(--color-text-primary)">Como ganhar pontos:</strong><br>
      ✅ Avaliação +10pts &nbsp;|&nbsp; 📍 Check-in +20pts<br>
      🎰 Sorteio +10pts &nbsp;|&nbsp; 💼 Candidatura +15pts<br>
      🗳️ Enquete +5pts &nbsp;|&nbsp; 🤝 Indicação aprovada +50pts
    </div>
  </div>`;
}

// ── MONETIZAÇÃO ───────────────────────────────────────────
function renderMonetizacao() {
  return `<div class="section" style="padding-top:10px">
    <div style="background:linear-gradient(135deg,#1D9E75,#0d7a58);border-radius:12px;padding:14px;color:#fff;margin-bottom:12px">
      <div style="font-size:11px;opacity:.8;text-transform:uppercase;letter-spacing:.5px;margin-bottom:6px">💰 Anuncie no Guia SSP</div>
      <div style="font-size:16px;font-weight:700;margin-bottom:4px">Alcance toda São Sebastião do Passé</div>
      <div style="font-size:12px;opacity:.85;line-height:1.45">Mais de 1.800 acessos mensais de moradores locais. Escolha seu plano e comece hoje.</div>
    </div>
    <div class="stitle">📦 Planos mensais</div>
    ${PLANOS.map(p => `<div class="card" onclick="openP('pcontrato')">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
        <div style="width:38px;height:38px;border-radius:10px;background:${p.color};display:flex;align-items:center;justify-content:center;color:#fff;font-size:16px;font-weight:700">${p.name[0]}</div>
        <div style="flex:1"><div style="font-size:14px;font-weight:700">Plano ${p.name}</div><div style="font-size:20px;font-weight:700;color:${p.color}">${fmt(p.price)}<span style="font-size:12px;font-weight:400;color:var(--color-text-secondary)">/mês</span></div></div>
        ${p.id==='pro'?'<span style="background:#FDF4D8;color:#633806;font-size:10px;padding:3px 8px;border-radius:8px;font-weight:700">POPULAR</span>':''}
      </div>
      ${p.features.map(f => `<div style="display:flex;align-items:flex-start;gap:6px;margin-bottom:5px;font-size:12px;color:var(--color-text-secondary)"><i class="ti ti-check" style="font-size:13px;color:#1D9E75;flex-shrink:0;margin-top:1px" aria-hidden="true"></i><span>${f}</span></div>`).join('')}
      <button style="width:100%;background:${p.color};color:#fff;border:none;border-radius:9px;padding:10px;font-size:13px;font-weight:700;cursor:pointer;font-family:inherit;margin-top:10px">Contratar plano ${p.name}</button>
    </div>`).join('')}
    <div class="stitle" style="margin-top:4px">🎯 Serviços avulsos</div>
    ${[
      {icon:"📣",name:"Banner no feed",price:"R$99–199/mês",desc:"Imagem patrocinada exibida no feed de novidades"},
      {icon:"📱",name:"Story / pop-up",price:"R$149–299/mês",desc:"Card em tela cheia ao abrir o app — alto impacto"},
      {icon:"🔥",name:"Publicação de promoção",price:"R$29–59/publicação",desc:"Promoção no topo do feed com notificação push"},
      {icon:"🎰",name:"Sorteio patrocinado",price:"R$49–99/sorteio",desc:"Viral — participantes divulgam pelo WhatsApp"},
      {icon:"💼",name:"Publicação de vaga",price:"R$19–39/vaga",desc:"Candidatos via WhatsApp, 30 dias no ar"},
      {icon:"🔗",name:"Link de afiliado",price:"Variável",desc:"Comissão por cliques e cadastros gerados"},
    ].map(s => `<div class="card" onclick="openP('pcontrato')">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="cicon" style="background:var(--color-background-secondary);font-size:20px">${s.icon}</div>
        <div style="flex:1"><div style="font-size:13px;font-weight:600">${s.name}</div><div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">${s.desc}</div></div>
        <span style="font-size:11px;font-weight:700;color:#1D9E75;white-space:nowrap">${s.price}</span>
      </div>
    </div>`).join('')}
    <div style="background:var(--color-background-secondary);border-radius:12px;border:.5px solid var(--color-border-tertiary);padding:13px;margin-top:4px;text-align:center">
      <div style="font-size:14px;font-weight:600;margin-bottom:5px">Fale com o Guia SSP</div>
      <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:10px">Tire dúvidas ou solicite um orçamento personalizado</div>
      <button class="abtn awa" onclick="window.open('https://wa.me/5571991104794?text='+encodeURIComponent('Olá! Quero anunciar meu negócio no Guia SSP. Pode me passar mais informações?'))" style="width:100%;padding:10px;font-size:13px;justify-content:center;font-weight:700"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i> Falar pelo WhatsApp</button>
    </div>
  </div>`;
}

// ── ADMIN ─────────────────────────────────────────────────
function renderAdmin() {
  return `<div class="section" style="padding-top:10px">
    <p style="font-size:12px;color:var(--color-text-secondary);margin-bottom:12px">Últimos 30 dias · São Sebastião do Passé</p>
    <div class="stat-grid">
      <div class="stat-card"><div class="stat-val" style="color:#1D9E75">1.847</div><div class="stat-label">Acessos totais</div></div>
      <div class="stat-card"><div class="stat-val">15</div><div class="stat-label">Negócios ativos</div></div>
      <div class="stat-card"><div class="stat-val">312</div><div class="stat-label">Cliques em ligar</div></div>
      <div class="stat-card"><div class="stat-val" style="color:#128C7E">198</div><div class="stat-label">Abertos no WA</div></div>
      <div class="stat-card"><div class="stat-val" style="color:#7C5CBF">268</div><div class="stat-label">Part. sorteios</div></div>
      <div class="stat-card"><div class="stat-val" style="color:#EF9F27">${fmt(847)}</div><div class="stat-label">Receita est./mês</div></div>
    </div>
    <div class="stitle">📊 Mais acessados</div>
    <div style="background:var(--color-background-primary);border-radius:12px;border:.5px solid var(--color-border-tertiary);padding:13px;margin-bottom:10px">
      ${[{n:'Somar Supermercado',v:312},{n:'Bode na Brasa',v:249},{n:'Alegre Car',v:193},{n:'Poupe Mais Farma',v:149},{n:'Taberna & Cia',v:118}].map(r => `<div class="bar-row">
        <div class="bar-label">${r.n}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round(r.v/312*100)}%"></div></div>
        <div class="bar-val">${r.v}</div>
      </div>`).join('')}
    </div>
    <div class="stitle">💰 Receita por fonte</div>
    <div style="background:var(--color-background-primary);border-radius:12px;border:.5px solid var(--color-border-tertiary);padding:13px;margin-bottom:10px">
      ${[{n:'Planos mensais',v:447,pct:53},{n:'Destaques',v:149,pct:18},{n:'Sorteios',v:99,pct:12},{n:'Promoções',v:87,pct:10},{n:'Vagas',v:39,pct:5},{n:'Afiliados',v:26,pct:3}].map(r => `<div class="bar-row">
        <div class="bar-label">${r.n}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${r.pct}%"></div></div>
        <div class="bar-val">${r.pct}%</div>
      </div>`).join('')}
      <div style="padding-top:8px;border-top:.5px solid var(--color-border-tertiary);margin-top:4px;display:flex;justify-content:space-between;font-size:13px">
        <span style="color:var(--color-text-secondary);font-weight:600">Total estimado</span>
        <span style="color:#1D9E75;font-weight:700">${fmt(847)}/mês</span>
      </div>
    </div>
    <div class="stitle">⏳ Cadastros pendentes</div>
    <div style="background:var(--color-background-primary);border-radius:12px;border:.5px solid var(--color-border-tertiary);padding:13px;margin-bottom:10px">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0;border-bottom:.5px solid var(--color-border-tertiary)">
        <div><div style="font-size:13px;font-weight:600">Salão Beauty Hair</div><div style="font-size:11px;color:var(--color-text-secondary)">Serviço · enviado há 3h</div></div>
        <div style="display:flex;gap:6px">
          <button style="background:#E1F5EE;color:#085041;border:none;border-radius:7px;padding:5px 10px;font-size:11px;cursor:pointer;font-family:inherit;font-weight:700" onclick="alert('Aprovado! ✅')">Aprovar</button>
          <button style="background:#FAECE7;color:#712B13;border:none;border-radius:7px;padding:5px 10px;font-size:11px;cursor:pointer;font-family:inherit;font-weight:700" onclick="alert('Recusado.')">Recusar</button>
        </div>
      </div>
      <div style="display:flex;justify-content:space-between;align-items:center;padding:8px 0">
        <div><div style="font-size:13px;font-weight:600">Pizzaria Dom Luigi</div><div style="font-size:11px;color:var(--color-text-secondary)">Restaurante · enviado ontem</div></div>
        <div style="display:flex;gap:6px">
          <button style="background:#E1F5EE;color:#085041;border:none;border-radius:7px;padding:5px 10px;font-size:11px;cursor:pointer;font-family:inherit;font-weight:700" onclick="alert('Aprovado! ✅')">Aprovar</button>
          <button style="background:#FAECE7;color:#712B13;border:none;border-radius:7px;padding:5px 10px;font-size:11px;cursor:pointer;font-family:inherit;font-weight:700" onclick="alert('Recusado.')">Recusar</button>
        </div>
      </div>
    </div>
    <div class="stitle">🌟 Destaques ativos</div>
    <div style="background:var(--color-background-primary);border-radius:12px;border:.5px solid var(--color-border-tertiary);padding:13px">
      ${[{n:'Somar Supermercado',p:'Plano Pro',exp:'20/05',ok:true},{n:'Bode na Brasa',p:'Plano Premium',exp:'16/05',ok:false}].map(d => `<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;border-bottom:.5px solid var(--color-border-tertiary)">
        <div><div style="font-size:13px;font-weight:600">${d.n}</div><div style="font-size:11px;color:var(--color-text-secondary)">${d.p} · expira ${d.exp}</div></div>
        <span style="background:${d.ok?'#E1F5EE':'#FAEEDA'};color:${d.ok?'#085041':'#633806'};font-size:10px;padding:3px 8px;border-radius:8px;font-weight:700">${d.ok?'ATIVO':'EXPIRANDO'}</span>
      </div>`).join('')}
    </div>
  </div>`;
}

// ── CONTRATO / ANUNCIO ────────────────────────────────────
function renderContrato() {
  document.getElementById('pcontrato-body').innerHTML = `
    <div style="background:linear-gradient(135deg,#1D9E75,#0d7a58);border-radius:12px;padding:14px;color:#fff;margin-bottom:14px">
      <div style="font-size:16px;font-weight:700;margin-bottom:4px">💰 Anuncie no Guia SSP</div>
      <div style="font-size:12px;opacity:.85;line-height:1.45">Preencha o formulário e entraremos em contato em até 2h pelo WhatsApp.</div>
    </div>
    <div id="cf1">
      <div class="fg"><label class="flabel">Nome do negócio *</label><input type="text" id="adm-nome" placeholder="Ex: Padaria do João"></div>
      <div class="fg"><label class="flabel">Serviço desejado *</label>
        <select id="adm-tipo">
          <option value="">Selecione...</option>
          <option>Plano Básico — R$99/mês</option>
          <option>Plano Pro — R$149/mês</option>
          <option>Plano Premium — R$199/mês</option>
          <option>Banner no feed — R$99–199/mês</option>
          <option>Story / pop-up — R$149–299/mês</option>
          <option>Publicação de promoção — a partir de R$29</option>
          <option>Sorteio patrocinado — a partir de R$49</option>
          <option>Publicação de vaga — a partir de R$19</option>
        </select>
      </div>
      <div class="fg"><label class="flabel">WhatsApp para contato *</label><input type="tel" id="adm-phone" placeholder="(71) 9 9110-4794"></div>
      <div class="fg"><label class="flabel">Melhor horário para contato</label><input type="text" id="adm-hora" placeholder="Ex: manhã, após 14h..."></div>
      <p class="info-tip"><i class="ti ti-info-circle" aria-hidden="true"></i> Retorno em até 2h no WhatsApp. Pagamento via PIX, boleto ou cartão.</p>
      <button class="sbtn" onclick="submitContrato()"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i> Enviar pelo WhatsApp</button>
    </div>
    <div class="success-box" id="cf-suc">
      <i class="ti ti-circle-check success-icon" aria-hidden="true"></i>
      <p class="success-title">Solicitação enviada!</p>
      <p class="success-sub">Entraremos em contato em até 2h pelo WhatsApp para finalizar seu anúncio.</p>
      <button class="sbtn" style="margin-top:14px" onclick="closeP('pcontrato')">Fechar</button>
    </div>`;
}
function submitContrato() {
  const nome = document.getElementById('adm-nome').value.trim();
  const tipo = document.getElementById('adm-tipo').value;
  const phone = document.getElementById('adm-phone').value.trim();
  if (!nome || !tipo || !phone) { alert('Preencha os campos obrigatórios.'); return; }
  document.getElementById('cf1').style.display = 'none';
  document.getElementById('cf-suc').style.display = 'block';
  const msg = encodeURIComponent('*Solicitação de anúncio — Guia SSP*\nNegócio: ' + nome + '\nServiço: ' + tipo + '\nContato: ' + phone);
  setTimeout(() => window.open('https://wa.me/5571991104794?text=' + msg), 600);
}

// ── DETAIL ────────────────────────────────────────────────
function openBiz(id) {
  const b = BIZ.find(x => x.id === id);
  if (!b) return;
  currentBiz = id; starRating = 0;
  document.getElementById('pdetail-title').textContent = b.name;
  document.getElementById('pdetail-fav').style.opacity = favs.has(id) ? '1' : '.6';
  const hp = !!b.phone;
  document.getElementById('pdetail-body').innerHTML = `
    <div style="font-size:44px;text-align:center;margin-bottom:12px">${b.icon}</div>
    <div style="font-size:19px;font-weight:700;margin-bottom:3px">${b.name}${planoBadge(b.plano)}</div>
    <div style="font-size:12px;color:var(--color-text-secondary);margin-bottom:14px">${catName(b.cat)}${b.destaque?' · <span style="color:#1D9E75;font-weight:700">Destaque</span>':''}</div>
    ${b.rating ? `<div style="display:flex;align-items:center;gap:5px;margin-bottom:12px"><span style="color:#EF9F27;font-size:16px">★</span><span style="font-size:15px;font-weight:700">${b.rating}</span><span style="font-size:12px;color:var(--color-text-secondary)">(${b.rc} avaliações)</span></div>` : ''}
    <div class="detail-row"><i class="ti ti-map-pin" aria-hidden="true"></i><span>${b.addr}, São Sebastião do Passé – BA</span></div>
    ${b.hours ? `<div class="detail-row"><i class="ti ti-clock" aria-hidden="true"></i><span>${b.hours} · <span class="${isOpen(b.hours)?'open':'clt'}">${isOpen(b.hours)?'Aberto agora':'Fechado'}</span></span></div>` : ''}
    ${hp ? `<div class="detail-row"><i class="ti ti-phone" aria-hidden="true"></i><a href="tel:${b.phone}">${b.phone}</a></div>` : ''}
    <div class="detail-actions">
      ${hp ? `<button class="dact-btn dact-green" onclick="window.open('tel:${b.phone}')"><i class="ti ti-phone" aria-hidden="true"></i> Ligar</button>` : '<div></div>'}
      ${hp ? `<button class="dact-btn dact-wa" onclick="window.open('${waLink(b.phone,b.name)}')"><i class="ti ti-brand-whatsapp" aria-hidden="true"></i> WhatsApp</button>` : '<div></div>'}
      <button class="dact-btn dact-purple" onclick="doCheckin(${id},'${b.name.replace(/'/g,"\\'")}')"><i class="ti ti-map-pin" aria-hidden="true"></i> Check-in +20pts</button>
      <button class="dact-btn dact-blue" onclick="shareB('${b.name.replace(/'/g,"\\'")}')"><i class="ti ti-share" aria-hidden="true"></i> Compartilhar</button>
      <button class="dact-btn dact-outline full" onclick="window.open('${b.maps}')"><i class="ti ti-map" aria-hidden="true"></i> Ver no Google Maps</button>
    </div>
    ${b.reviews && b.reviews.length ? `<div style="margin-top:16px"><div style="font-size:13px;font-weight:700;margin-bottom:9px">Avaliações</div>${b.reviews.map(r => `<div style="border-bottom:.5px solid var(--color-border-tertiary);padding:9px 0"><div style="display:flex;justify-content:space-between"><span style="font-size:12px;font-weight:600">${r.a}</span><span style="font-size:12px;color:#EF9F27">${'★'.repeat(r.s)}${'☆'.repeat(5-r.s)}</span></div><div style="font-size:12px;color:var(--color-text-secondary);margin-top:3px;line-height:1.4">${r.t}</div></div>`).join('')}</div>` : ''}
    <div style="margin-top:16px;background:var(--color-background-secondary);border-radius:10px;padding:13px">
      <div style="font-size:13px;font-weight:700;margin-bottom:7px">Deixe sua avaliação <span style="font-size:11px;color:#1D9E75;font-weight:500">(+10pts)</span></div>
      <div class="stars-row" id="sr${id}">${[1,2,3,4,5].map(n => `<button class="star-btn" onclick="setStar(${n},${id})" id="st${id}_${n}" aria-label="${n} estrela${n>1?'s':''}">★</button>`).join('')}</div>
      <textarea id="rt${id}" placeholder="Conte sua experiência..." style="resize:vertical;min-height:65px;width:100%;font-family:inherit;font-size:13px;padding:9px 11px;border-radius:8px;border:.5px solid var(--color-border-tertiary);background:var(--color-background-primary);color:var(--color-text-primary);outline:none;margin-top:6px"></textarea>
      <button class="sbtn" style="margin-top:8px;padding:10px;font-size:13px" onclick="submitRev(${id})">Enviar avaliação</button>
    </div>`;
  openP('pdetail');
}
function setStar(n, id) {
  starRating = n;
  [1,2,3,4,5].forEach(i => { const s = document.getElementById('st'+id+'_'+i); if (s) s.classList.toggle('on', i<=n); });
}
function submitRev(id) {
  const txt = document.getElementById('rt'+id);
  if (!starRating) { alert('Selecione uma nota!'); return; }
  if (!txt || !txt.value.trim()) { alert('Escreva um comentário!'); return; }
  const b = BIZ.find(x => x.id === id);
  if (b) b.reviews.unshift({a:'Você', s:starRating, t:txt.value.trim()});
  addPts(10, 'Avaliação: ' + b.name);
  openBiz(id);
}

// ── PANELS ────────────────────────────────────────────────
function openP(id) {
  if (id === 'pcontrato') renderContrato();
  if (id === 'padmin') showTab('admin');
  document.getElementById(id).classList.add('open');
}
function closeP(id) { document.getElementById(id).classList.remove('open'); }

// ── FAVORITOS ─────────────────────────────────────────────
document.getElementById('pfav').addEventListener('transitionend', function() {
  if (!this.classList.contains('open')) return;
  const body = document.getElementById('pfav-body');
  if (!favs.size) {
    body.innerHTML = '<div class="empty"><i class="ti ti-heart"></i><p>Nenhum favorito ainda.</p><p style="font-size:12px;margin-top:6px">Toque no 🤍 nos cards para salvar.</p></div>';
    return;
  }
  body.innerHTML = BIZ.filter(b => favs.has(b.id)).map(rCard).join('');
});

// ── NOTIFICAÇÕES ──────────────────────────────────────────
document.getElementById('pfav').addEventListener('transitionend', function() {});
function renderNotifs() {
  const body = document.getElementById('pnotif-body');
  if (!body) return;
  body.innerHTML = NOTIFICATIONS.map(n => `
    <div style="background:var(--color-background-secondary);border-radius:10px;padding:10px 12px;margin-bottom:8px;display:flex;gap:9px;align-items:flex-start">
      <div style="width:9px;height:9px;background:${n.color};border-radius:50%;flex-shrink:0;margin-top:3px"></div>
      <div><div style="font-size:13px;font-weight:500">${n.msg}</div><div style="font-size:11px;color:var(--color-text-secondary);margin-top:2px">${n.time}</div></div>
    </div>`).join('') +
    `<button class="sbtn" style="margin-top:8px" onclick="alert('Notificações push ativadas! ✅')"><i class="ti ti-bell" aria-hidden="true"></i> Ativar notificações push</button>`;
}
document.getElementById('pnotif').addEventListener('transitionend', function() {
  if (this.classList.contains('open')) renderNotifs();
});

// ── CADASTRO ──────────────────────────────────────────────
function cs(n) {
  if (n === 2 && (!document.getElementById('cn').value || !document.getElementById('cc').value || !document.getElementById('ce').value)) { alert('Preencha os campos obrigatórios.'); return; }
  if (n === 3 && (!document.getElementById('cp').value || !document.getElementById('ch').value)) { alert('Preencha os campos obrigatórios.'); return; }
  [1,2,3].forEach(i => { const el = document.getElementById('cs'+i); if (el) el.style.display = i===n ? 'block' : 'none'; });
  document.getElementById('pcad').scrollTop = 0;
}
function csub() {
  if (!document.getElementById('cr').value || !document.getElementById('cem').value) { alert('Preencha os campos obrigatórios.'); return; }
  document.getElementById('cs3').style.display = 'none';
  document.getElementById('csuc').style.display = 'block';
  addPts(50, 'Indicação de negócio enviada');
  const msg = encodeURIComponent('*Novo cadastro — Guia SSP*\nNome: '+document.getElementById('cn').value+'\nCat: '+document.getElementById('cc').value+'\nEnd: '+document.getElementById('ce').value+'\nTel: '+document.getElementById('cp').value+'\nResp: '+document.getElementById('cr').value+'\nEmail: '+document.getElementById('cem').value);
  setTimeout(() => window.open('https://wa.me/5571991104794?text='+msg), 800);
}
function creset() {
  ['cn','cc','ce','cp','ch','ci','cr','cem','cd'].forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
  document.getElementById('csuc').style.display = 'none';
  document.getElementById('cs1').style.display = 'block';
  [2,3].forEach(i => { const el = document.getElementById('cs'+i); if (el) el.style.display = 'none'; });
}

// ── WEATHER ───────────────────────────────────────────────
fetch('https://api.open-meteo.com/v1/forecast?latitude=-12.52&longitude=-38.50&current_weather=true')
  .then(r => r.json())
  .then(d => {
    const t = Math.round(d.current_weather.temperature);
    const code = d.current_weather.weathercode;
    const ic = code<=1?'ti-sun':code<=3?'ti-cloud':code<=67?'ti-cloud-rain':'ti-cloud-storm';
    document.getElementById('wpill').innerHTML = `<i class="ti ${ic}" aria-hidden="true"></i> <span id="wtemp">${t}°C</span>`;
  })
  .catch(() => {});

// ── SERVICE WORKER REGISTER ───────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(() => console.log('SW registrado'))
      .catch(e => console.log('SW erro:', e));
  });
}

// ── PWA INSTALL PROMPT ────────────────────────────────────
let deferredPrompt;
window.addEventListener('beforeinstallprompt', e => {
  e.preventDefault();
  deferredPrompt = e;
  const prompt = document.getElementById('install-prompt');
  if (prompt) {
    prompt.classList.add('show');
  }
});
function installPWA() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(() => {
      deferredPrompt = null;
      const p = document.getElementById('install-prompt');
      if (p) p.classList.remove('show');
    });
  }
}
function dismissInstall() {
  const p = document.getElementById('install-prompt');
  if (p) p.classList.remove('show');
}

// ── ADMIN PROMPT ──────────────────────────────────────────
function openAdminPrompt() {
  const pin = prompt('🔒 Digite o PIN do admin:');
  if (pin === adminPIN) {
    document.getElementById('padmin-body').innerHTML = renderAdmin();
    openP('padmin');
  } else if (pin !== null) {
    alert('PIN incorreto!');
  }
}

// ── INIT ──────────────────────────────────────────────────
renderAll();
setTimeout(showStoryIfNeeded, 3000);

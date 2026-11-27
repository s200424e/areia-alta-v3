/* =========================================================
   LANDING DE ARENA · MODELO 3 ("Arena ao vivo")
   Lê o MESMO js/dados.js dos modelos 1 e 2. Opcionais só deste modelo em DADOS.v3:
     v3: { fotos: [...], titulo: "texto com *grifo*", fotoNiveis, fotoExperimental }
   Clima ao vivo: DADOS.endereco.lat / lon (Open-Meteo, sem chave).
   ========================================================= */
(function () {
  'use strict';
  var D = window.DADOS, V = D.v3 || {}, V2 = D.v2 || {};
  var raiz = document.documentElement;
  raiz.classList.add('js');
  var reduz = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduz) raiz.classList.add('sem-movimento');
  var temGsap = !!(window.gsap && window.ScrollTrigger) && !reduz;
  if (!temGsap) raiz.classList.add('sem-gsap'); else gsap.registerPlugin(ScrollTrigger);

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var todos = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function esc(t) { return String(t).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function foto(n) { return 'img/' + (n.indexOf('/') > -1 ? n : 'feed/' + n) + '.webp'; }
  function reais(v) { return 'R$ ' + (Math.round(v) === v ? v : v.toFixed(2).replace('.', ',')); }
  function lista(a) { return a.length > 1 ? a.slice(0, -1).join(', ') + ' e ' + a[a.length - 1] : (a[0] || ''); }
  function semAcento(s) { return String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); }
  function contar(el, fim, ms) {
    if (reduz) { el.textContent = fim; return; }
    var de = +el.textContent.replace(/\D/g, '') || 0, t0 = performance.now();
    (function passo(t) { var k = Math.min(1, (t - t0) / (ms || 900)); el.textContent = Math.round(de + (fim - de) * (1 - Math.pow(1 - k, 3))).toLocaleString('pt-BR'); if (k < 1) requestAnimationFrame(passo); })(t0);
  }

  todos('[data-nome]').forEach(function (e) { e.textContent = D.nome; });
  todos('[data-nome-maiusculo]').forEach(function (e) { e.textContent = D.nome.toUpperCase(); });

  /* ---------- Tempo e turmas ---------- */
  var DIA = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'], DIA3 = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  var ORDEM = [1, 2, 3, 4, 5, 6, 0];
  function agora() {
    var p = {}; new Intl.DateTimeFormat('en-US', { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false })
      .formatToParts(new Date()).forEach(function (x) { p[x.type] = x.value; });
    return { iso: p.year + '-' + p.month + '-' + p.day, dia: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(p.weekday), min: (parseInt(p.hour, 10) % 24) * 60 + parseInt(p.minute, 10) };
  }
  function emMin(h) { var p = h.split(':'); return +p[0] * 60 + +p[1]; }
  var DUR = D.duracaoTurmaMin || 60, MODS = Object.keys(D.modalidades), LUGAR = (D.textos && D.textos.lugar) || 'areia';
  function nomeMod(k) { return (D.modalidades[k] || {}).nome || k; }
  function curtoMod(k) { return (D.modalidades[k] || {}).curto || nomeMod(k); }
  function nomeNivel(k) { return (D.niveis[k] || {}).nome || k; }
  function prof(t) { var p = (D.professores || []).filter(function (x) { return x.id === t.prof; })[0]; return p && p.nome ? 'Prof. ' + p.nome : ''; }
  function doDia(d) { return D.turmas.filter(function (t) { return t.dias.indexOf(d) > -1; }).sort(function (a, b) { return emMin(a.hora) - emMin(b.hora); }); }
  // Próximas ocorrências (até n dias): [{t, n, sem, dia, mes}]
  function proximas(filtro, dias) {
    var ag = agora(), base = new Date(ag.iso + 'T12:00:00Z'), out = [];
    for (var n = 0; n < (dias || 7); n++) {
      var d = new Date(base); d.setUTCDate(d.getUTCDate() + n); var sem = d.getUTCDay();
      doDia(sem).forEach(function (t) { if ((n > 0 || emMin(t.hora) > ag.min) && (!filtro || filtro(t))) out.push({ t: t, n: n, sem: sem, dia: d.getUTCDate(), mes: d.getUTCMonth() + 1 }); });
    }
    return out;
  }
  function quando(o) { return (o.n === 0 ? 'hoje' : o.n === 1 ? 'amanhã' : DIA3[o.sem]) + ', ' + String(o.dia).padStart(2, '0') + '/' + String(o.mes).padStart(2, '0'); }

  /* ---------- Contato ---------- */
  var avisoT;
  function avisar(txt) { var a = $('#aviso'); a.textContent = txt; a.classList.add('mostra'); clearTimeout(avisoT); avisoT = setTimeout(function () { a.classList.remove('mostra'); }, 3600); }
  function copiar(txt) { if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(txt); return Promise.resolve(); }
  function enviar(msg) {
    if (D.demo) { avisar('Demonstração: numa arena de verdade, isso abre o WhatsApp com a mensagem pronta.'); return; }
    if (D.whatsapp) window.open('https://wa.me/' + D.whatsapp + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
    else { copiar(msg).then(function () { avisar('Mensagem copiada. Cole no Direct da ' + D.nome + '.'); }); window.open('https://ig.me/m/' + D.instagram, '_blank', 'noopener'); }
  }
  if (D.demo) document.addEventListener('click', function (e) { if (e.target.closest('a[href*="instagram.com"]')) { e.preventDefault(); avisar('Demonstração: aqui abriria o Instagram da arena.'); } }, true);

  /* ---------- Tema claro/escuro ---------- */
  $('#botaoTema').addEventListener('click', function () {
    var novo = raiz.dataset.tema === 'escuro' ? 'claro' : 'escuro'; raiz.dataset.tema = novo;
    try { localStorage.setItem('tema-v3', novo); } catch (e) {}
    document.querySelector('meta[name="theme-color"]').content = novo === 'escuro' ? '#06111F' : '#EEF4FA';
  });

  /* ---------- Rolagem suave e navegação ---------- */
  var lenis = null;
  if (temGsap && window.Lenis) { lenis = new Lenis({ lerp: 0.1 }); window.lenis = lenis; lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add(function (t) { lenis.raf(t * 1000); }); gsap.ticker.lagSmoothing(0); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest('a[href^="#"]'); if (!a) return;
    var alvo = a.getAttribute('href') === '#inicio' ? document.body : $(a.getAttribute('href')); if (!alvo) return;
    e.preventDefault(); if (lenis) lenis.scrollTo(alvo, { offset: -80, duration: 1.2 }); else alvo.scrollIntoView({ behavior: reduz ? 'auto' : 'smooth' });
  });
  var nav = $('#nav'), ultY = 0;
  window.addEventListener('scroll', function () { var y = window.scrollY; nav.classList.toggle('some', y > 500 && y > ultY + 4); if (y < ultY - 4) nav.classList.remove('some'); ultY = y; }, { passive: true });

  /* ---------- 1. Bento ---------- */
  var tiles = todos('.tile');
  tiles.forEach(function (t, i) { setTimeout(function () { t.classList.add('visto'); }, reduz ? 0 : 120 + i * 80); });
  if (window.matchMedia('(hover: hover)').matches) tiles.forEach(function (t) {
    t.addEventListener('pointermove', function (e) { var r = t.getBoundingClientRect(); t.style.setProperty('--mx', (e.clientX - r.left) + 'px'); t.style.setProperty('--my', (e.clientY - r.top) + 'px'); });
  });
  if (V.titulo) $('#h1').innerHTML = esc(V.titulo).replace(/\*([^*]+)\*/g, '<span class="grifo">$1</span>');
  var nivs = Object.keys(D.niveis).filter(function (k) { return D.turmas.some(function (t) { return t.nivel === k; }); });
  $('#lead').innerHTML = 'Treinos de ' + lista(MODS.map(function (k) { return '<strong>' + esc(nomeMod(k).toLowerCase()) + '</strong>'; })) + ' com turmas ' + esc(lista(nivs.map(function (k) { return nomeNivel(k).toLowerCase(); }))) + '. Veja quem está jogando agora, a semana inteira e reserve a aula experimental em 4 toques.';
  // fotos
  var fotos = V.fotos || V2.heroFotos || D.galeria.slice(0, 3);
  $('#fotos').innerHTML = fotos.map(function (f, i) { return '<div class="foto' + (i ? '' : ' ativa') + '"><img src="' + foto(f) + '" alt="" ' + (i ? 'loading="lazy"' : 'fetchpriority="high"') + '></div>'; }).join('');
  $('#chipFoto').textContent = D.slogan;
  var fi = 0, fs = todos('.foto');
  if (fs.length > 1 && !reduz) setInterval(function () { fs[fi].classList.remove('ativa'); fi = (fi + 1) % fs.length; fs[fi].classList.add('ativa'); }, 5000);
  // agora
  function tileAgora() {
    var ag = agora(), hoje = doDia(ag.dia);
    var rol = hoje.filter(function (t) { var i = emMin(t.hora); return ag.min >= i && ag.min < i + DUR; })[0];
    var barra = $('#agoraBarra');
    if (rol) {
      $('#agoraGrande').textContent = 'Rolando agora';
      $('#agoraSub').textContent = curtoMod(rol.mod) + ' ' + nomeNivel(rol.nivel).toLowerCase() + ' · ' + rol.hora + (prof(rol) ? ' · ' + prof(rol) : '');
      barra.style.width = ((ag.min - emMin(rol.hora)) / DUR * 100) + '%';
      $('#seloTopo').textContent = 'Agora: ' + curtoMod(rol.mod) + ' ' + nomeNivel(rol.nivel).toLowerCase() + ' rolando';
      return;
    }
    var o = proximas(null, 8)[0];
    if (!o) { $('#agoraGrande').textContent = '—'; return; }
    var falta = (o.n * 1440 + emMin(o.t.hora)) - ag.min, h = Math.floor(falta / 60), m = falta % 60;
    $('#agoraGrande').textContent = 'em ' + (h >= 24 ? Math.round(h / 24) + (Math.round(h / 24) > 1 ? ' dias' : ' dia') : (h ? h + 'h ' : '') + String(m).padStart(h ? 2 : 1, '0') + 'min');
    $('#agoraSub').textContent = 'Próxima: ' + curtoMod(o.t.mod) + ' ' + nomeNivel(o.t.nivel).toLowerCase() + ' · ' + quando(o) + ' às ' + o.t.hora;
    barra.style.width = Math.max(4, 100 - Math.min(100, falta / 6)) + '%';
    $('#seloTopo').textContent = 'Próxima turma ' + (o.n === 0 ? 'hoje' : o.n === 1 ? 'amanhã' : DIA[o.sem]) + ', ' + o.t.hora;
  }
  tileAgora(); setInterval(tileAgora, 20000);
  // clima (Open-Meteo, sem chave)
  var e = D.endereco || {};
  if (e.lat != null && e.lon != null) {
    var CODIGOS = { 0: ['☀️', 'Céu limpo'], 1: ['🌤️', 'Quase limpo'], 2: ['⛅', 'Parcialmente nublado'], 3: ['☁️', 'Nublado'], 45: ['🌫️', 'Neblina'], 48: ['🌫️', 'Neblina'], 51: ['🌦️', 'Garoa'], 53: ['🌦️', 'Garoa'], 55: ['🌧️', 'Garoa forte'], 61: ['🌧️', 'Chuva fraca'], 63: ['🌧️', 'Chuva'], 65: ['🌧️', 'Chuva forte'], 80: ['🌦️', 'Pancadas'], 81: ['🌧️', 'Pancadas'], 82: ['⛈️', 'Pancadas fortes'], 95: ['⛈️', 'Trovoadas'], 96: ['⛈️', 'Trovoadas'], 99: ['⛈️', 'Trovoadas'] };
    fetch('https://api.open-meteo.com/v1/forecast?latitude=' + e.lat + '&longitude=' + e.lon + '&current=temperature_2m,precipitation,weather_code,is_day&daily=precipitation_probability_max&forecast_days=1&timezone=America%2FSao_Paulo')
      .then(function (r) { return r.json(); })
      .then(function (j) {
        var c = j.current, cod = CODIGOS[c.weather_code] || ['🌡️', ''], prob = (j.daily && j.daily.precipitation_probability_max || [0])[0];
        var icone = cod[0]; if (!c.is_day && c.weather_code <= 1) icone = '🌙';
        $('#climaIcone').textContent = icone;
        $('#climaTemp').textContent = Math.round(c.temperature_2m);
        var veredito = c.precipitation > 0 || c.weather_code >= 51 ? 'Chovendo agora: confira os avisos' : prob >= 60 ? cod[1] + ' · chance de chuva de ' + prob + '%' : cod[1] + ' · dia bom pra ' + LUGAR;
        $('#climaSub').textContent = veredito;
        $('#tClima').hidden = false; requestAnimationFrame(function () { $('#tClima').classList.add('visto'); });
      }).catch(function () {});
  }
  // preço
  var minimo = Math.min.apply(null, MODS.map(function (k) { return Math.min.apply(null, D.modalidades[k].planos.map(function (p) { return p.preco; })); }));
  $('#precoMin').textContent = reais(minimo);
  var pl0 = D.modalidades[MODS[0]].planos.filter(function (p) { return !p.ciclo || p.ciclo === D.modalidades[MODS[0]].planos[0].ciclo; });
  var maxP = Math.max.apply(null, pl0.map(function (p) { return p.preco; }));
  $('#barrinhas').innerHTML = pl0.map(function () { return '<i></i>'; }).join('');
  setTimeout(function () { todos('#barrinhas i').forEach(function (b, i) { b.style.height = (pl0[i].preco / maxP * 100) + '%'; }); }, 700);
  // semana
  var porDia = ORDEM.map(function (d) { return doDia(d).length; }), maxDia = Math.max.apply(null, porDia) || 1, hojeD = agora().dia;
  var total = D.turmas.reduce(function (s, t) { return s + t.dias.length; }, 0);
  $('#semanaDias').innerHTML = ORDEM.map(function (d, i) { return '<span class="' + (d === hojeD ? 'hoje' : '') + '"><i style="--h:0%" data-h="' + (porDia[i] / maxDia * 100) + '"></i>' + DIA3[d].charAt(0).toUpperCase() + '</span>'; }).join('');
  setTimeout(function () { todos('#semanaDias i').forEach(function (b) { b.style.setProperty('--h', b.dataset.h + '%'); }); contar($('#semanaN'), total); }, 800);
  // mapa e Instagram
  $('#mapaEnd').textContent = [e.linha1, e.linha2].filter(Boolean).join(' · ');
  $('#mapaLink').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(e.busca || '');
  $('#rodapeEnd').textContent = [e.linha1, e.linha2].filter(Boolean).join(' · ');
  $('#instaUser').textContent = '@' + D.instagram;
  $('#instaLink').href = 'https://www.instagram.com/' + D.instagram + '/';
  setTimeout(function () { contar($('#instaN'), (D.perfil || {}).seguidores || 0, 1400); }, 900);

  /* ---------- Letreiro (velocidade e sentido seguem a rolagem) ---------- */
  var palavras = D.faixa || MODS.map(nomeMod).concat(nivs.map(nomeNivel));
  var bloco = palavras.map(function (p) { return '<span>' + esc(p) + '</span><i></i>'; }).join('');
  var trilhoL = $('#letreiro'); trilhoL.innerHTML = bloco + bloco + bloco;
  if (!reduz) {
    var xL = 0, dir = -1, vel = 0;
    window.addEventListener('scroll', function () { var y = window.scrollY; dir = y > (window.__yL || 0) ? -1 : 1; vel = Math.min(12, Math.abs(y - (window.__yL || 0))); window.__yL = y; }, { passive: true });
    (function anda() { var larg = trilhoL.scrollWidth / 3; xL += dir * (0.6 + vel * 0.5); vel *= 0.92; if (xL <= -larg) xL += larg; if (xL > 0) xL -= larg; trilhoL.style.transform = 'translateX(' + xL + 'px)'; requestAnimationFrame(anda); })();
  }

  /* ---------- 2. Cartões empilhados ---------- */
  var cartoes = MODS.map(function (k) {
    var m = D.modalidades[k], ts = D.turmas.filter(function (t) { return t.mod === k; }), nv = Object.keys(D.niveis).filter(function (n) { return ts.some(function (t) { return t.nivel === n; }); });
    var dias = [0, 1, 2, 3, 4, 5, 6].filter(function (d) { return ts.some(function (t) { return t.dias.indexOf(d) > -1; }); }).length;
    return { foto: m.fotos[0], titulo: (m.emoji ? m.emoji + ' ' : '') + m.nome, texto: m.resumo, chips: nv.map(nomeNivel),
      dados: [[reais(Math.min.apply(null, m.planos.map(function (p) { return p.preco; }))), 'a partir de, por mês'], [ts.reduce(function (s, t) { return s + t.dias.length; }, 0), 'treinos por semana'], [dias, 'dias com turma']] };
  });
  cartoes.push({ foto: V.fotoNiveis || 'dupla-sorrindo', titulo: 'Tem turma para o seu nível', texto: nivs.map(function (k) { return nomeNivel(k) + ': ' + ((D.niveis[k] || {}).desc || '').toLowerCase(); }).join(' · ') + '.', chips: nivs.map(nomeNivel), dados: [[nivs.length, 'níveis'], [MODS.length, MODS.length > 1 ? 'modalidades' : 'modalidade'], [(D.professores || []).length || '—', 'professores']] });
  cartoes.push({ foto: V.fotoExperimental || 'turma-praia', titulo: 'A primeira aula é experimental', texto: 'Venha conhecer a turma antes de fechar plano. Roupa leve, água e protetor: na ' + LUGAR + ' se joga descalço.' + (D.avulsa ? ' Sem plano? A aula avulsa custa ' + reais(D.avulsa) + '.' : ''), chips: ['Sem compromisso', 'Mensagem pronta', 'Em 4 toques'], dados: [[D.avulsa ? reais(D.avulsa) : '—', 'aula avulsa'], [proximas(null, 7).length, 'horários nos próximos 7 dias'], ['4', 'toques para reservar']] });
  $('#pilha').innerHTML = cartoes.map(function (c, i) {
    return '<article class="pcard" style="--i:' + i + '"><div class="pcard-foto"><img src="' + foto(c.foto) + '" alt="" loading="lazy"><span class="pcard-num">' + String(i + 1).padStart(2, '0') + ' / ' + String(cartoes.length).padStart(2, '0') + '</span></div>' +
      '<div class="pcard-corpo"><h3>' + esc(c.titulo) + '</h3><p>' + esc(c.texto) + '</p><div class="chips">' + c.chips.map(function (x) { return '<span>' + esc(x) + '</span>'; }).join('') + '</div>' +
      '<div class="pcard-dados">' + c.dados.map(function (d) { return '<div><b>' + esc(d[0]) + '</b><small>' + esc(d[1]) + '</small></div>'; }).join('') + '</div></div></article>';
  }).join('');
  if (temGsap) {
    var pcs = todos('.pcard');
    pcs.forEach(function (c, i) {
      if (i === pcs.length - 1) return;
      gsap.to(c, { scale: .9, opacity: .55, ease: 'none', scrollTrigger: { trigger: pcs[i + 1], start: 'top bottom', end: 'top 120px', scrub: true } });
    });
  }

  /* ---------- 3. Agenda semanal ---------- */
  var CORES = ['var(--destaque)', 'var(--cta)', '#22C55E', '#A855F7'];
  function corMod(k) { return CORES[MODS.indexOf(k) % CORES.length]; }
  var filtroMod = null;
  function desenharFiltros() {
    var itens = [{ v: null, t: 'Todas' }].concat(MODS.map(function (k) { return { v: k, t: curtoMod(k) }; }));
    $('#filtros').innerHTML = itens.map(function (x) { return '<button type="button" aria-pressed="' + (x.v === filtroMod) + '" data-v="' + (x.v || '') + '">' + (x.v ? '<i style="background:' + corMod(x.v) + '"></i>' : '') + esc(x.t) + '</button>'; }).join('');
    todos('#filtros button').forEach(function (b) { b.addEventListener('click', function () { filtroMod = b.dataset.v || null; desenharFiltros(); todos('.bloco').forEach(function (bl) { bl.classList.toggle('esconde', !!filtroMod && bl.dataset.mod !== filtroMod); }); }); });
  }
  if (MODS.length > 1) desenharFiltros(); else $('#filtros').hidden = true;
  var HPX = window.innerWidth < 700 ? 58 : 64;
  var hMin = Math.floor(Math.min.apply(null, D.turmas.map(function (t) { return emMin(t.hora); })) / 60);
  var hMax = Math.ceil((Math.max.apply(null, D.turmas.map(function (t) { return emMin(t.hora); })) + DUR) / 60);
  // Horas sem nenhuma turma encolhem para 22 px (a madrugada/tarde vazia não ocupa a tela)
  var ALTH = [];
  for (var hh0 = hMin; hh0 < hMax; hh0++) ALTH.push(D.turmas.some(function (t) { var i = emMin(t.hora); return i < (hh0 + 1) * 60 && i + DUR > hh0 * 60; }) ? HPX : 22);
  function yDe(min) { var r = min / 60 - hMin, i = Math.floor(r), y = 0; for (var k = 0; k < i && k < ALTH.length; k++) y += ALTH[k]; if (i < ALTH.length) y += (r - i) * ALTH[i]; return y; }
  var alt = yDe(hMax * 60);
  var cal = $('#cal'), ag1 = agora(), htmlCal = '<div class="cal-cab"></div>';
  ORDEM.forEach(function (d) { var n = (d - ag1.dia + 7) % 7; htmlCal += '<div class="cal-cab' + (d === ag1.dia ? ' hoje' : '') + '">' + DIA[d].charAt(0).toUpperCase() + DIA[d].slice(1, 3) + '<small>' + (d === ag1.dia ? 'hoje' : n === 1 ? 'amanhã' : doDia(d).length + ' turmas') + '</small></div>'; });
  htmlCal += '<div class="cal-horas" style="height:' + alt + 'px">';
  var linhasH = '';
  for (var h = hMin; h <= hMax; h++) { var enc = h < hMax && ALTH[h - hMin] < HPX, antEnc = h > hMin && ALTH[h - hMin - 1] < HPX; if (!(enc && antEnc)) htmlCal += '<span style="top:' + yDe(h * 60) + 'px">' + (enc && !antEnc ? String(h).padStart(2, '0') + 'h ···' : String(h).padStart(2, '0') + 'h') + '</span>'; linhasH += '<i class="cal-linha' + (enc ? ' enc' : '') + '" style="top:' + yDe(h * 60) + 'px' + (enc ? ';height:22px' : '') + '"></i>'; }
  htmlCal += '</div>';
  ORDEM.forEach(function (d) {
    var lista2 = doDia(d), blocos = '', clusters = [], atual = null;
    lista2.forEach(function (t) { var i = emMin(t.hora); if (!atual || i >= atual.fim) { atual = { fim: i + DUR, itens: [] }; clusters.push(atual); } atual.fim = Math.max(atual.fim, i + DUR); atual.itens.push(t); });
    clusters.forEach(function (c) {
      var faixas = [];
      c.itens.forEach(function (t) { var i = emMin(t.hora), f = 0; while (faixas[f] > i) f++; faixas[f] = i + DUR; t.__faixa = f; });
      c.itens.forEach(function (t) {
        var n = faixas.length, top = yDe(emMin(t.hora)), w = 100 / n;
        blocos += '<button type="button" class="bloco" data-turma="' + D.turmas.indexOf(t) + '" data-mod="' + t.mod + '" data-dia="' + d + '" style="--cor:' + corMod(t.mod) + ';top:' + (top + 2) + 'px;height:' + (yDe(emMin(t.hora) + DUR) - yDe(emMin(t.hora)) - 4) + 'px;left:calc(' + (t.__faixa * w) + '% + 4px);right:auto;width:calc(' + w + '% - 8px)"><b>' + t.hora + '</b><span>' + esc(curtoMod(t.mod)) + ' · ' + esc(nomeNivel(t.nivel)) + '</span>' + (n === 1 && prof(t) ? '<small>' + esc(prof(t)) + '</small>' : '') + '</button>';
      });
    });
    var linha = '';
    if (d === ag1.dia && ag1.min >= hMin * 60 && ag1.min <= hMax * 60) linha = '<div class="agora-linha" style="top:' + yDe(ag1.min) + 'px"></div>';
    htmlCal += '<div class="cal-col' + (d === ag1.dia ? ' hoje' : '') + '" style="height:' + alt + 'px">' + linhasH + blocos + linha + '</div>';
  });
  cal.innerHTML = htmlCal;
  todos('.bloco').forEach(function (b) {
    var t = D.turmas[+b.dataset.turma], i = emMin(t.hora);
    if (+b.dataset.dia === ag1.dia && ag1.min >= i && ag1.min < i + DUR) b.classList.add('rolando');
    b.addEventListener('click', function () {
      var d = +b.dataset.dia, o = proximas(function (x) { return x === t; }, 8).filter(function (x) { return x.sem === d; })[0] || proximas(function (x) { return x === t; }, 8)[0];
      reserva.mod = t.mod; reserva.nivel = t.nivel; reserva.oc = o; irPasso(4);
      var alvo = $('#reserva'); if (lenis) lenis.scrollTo(alvo, { offset: -80 }); else alvo.scrollIntoView({ behavior: 'smooth' });
    });
  });
  // no celular, abre a agenda já no dia de hoje
  var mold = $('.cal-moldura'), colHoje = $('.cal-col.hoje');
  if (colHoje && mold.scrollWidth > mold.clientWidth) mold.scrollLeft = Math.max(0, colHoje.offsetLeft - 60);

  /* ---------- 4. Planos ---------- */
  var pl = { mod: MODS[0], ciclo: null, idx: 0 };
  function ciclos() { var c = []; D.modalidades[pl.mod].planos.forEach(function (p) { var k = p.ciclo || 'mensal'; if (c.indexOf(k) < 0) c.push(k); }); return c; }
  function planosAtuais() { return D.modalidades[pl.mod].planos.filter(function (p) { return !pl.ciclo || (p.ciclo || 'mensal') === pl.ciclo; }).sort(function (a, b) { return a.vezes - b.vezes; }); }
  function seg(alvo, itens, atual, fn) { alvo.innerHTML = itens.map(function (i) { return '<button type="button" aria-pressed="' + (i.v === atual) + '">' + esc(i.t) + '</button>'; }).join(''); todos('button', alvo).forEach(function (b, n) { b.addEventListener('click', function () { fn(itens[n].v); }); }); }
  var slider = $('#slider');
  function desenharPlanos(manterVezes) {
    var cs = ciclos(); if (cs.length < 2) pl.ciclo = null; else if (cs.indexOf(pl.ciclo) < 0) pl.ciclo = cs[0];
    seg($('#segMod'), MODS.map(function (k) { return { v: k, t: curtoMod(k) }; }), pl.mod, function (v) { var vz = planosAtuais()[pl.idx].vezes; pl.mod = v; desenharPlanos(vz); });
    $('#segMod').hidden = MODS.length < 2;
    $('#segCiclo').hidden = cs.length < 2;
    if (cs.length > 1) seg($('#segCiclo'), cs.map(function (c) { return { v: c, t: D.ciclos && D.ciclos[c] ? D.ciclos[c].nome : c }; }), pl.ciclo, function (v) { var vz = planosAtuais()[pl.idx].vezes; pl.ciclo = v; desenharPlanos(vz); });
    var ps = planosAtuais();
    if (manterVezes != null) { var j = ps.findIndex(function (p) { return p.vezes === manterVezes; }); pl.idx = j > -1 ? j : Math.min(pl.idx, ps.length - 1); }
    pl.idx = Math.min(pl.idx, ps.length - 1);
    slider.min = 0; slider.max = ps.length - 1; slider.value = pl.idx; slider.disabled = ps.length < 2;
    $('#sliderMarcas').innerHTML = ps.map(function (p) { return '<span>' + p.vezes + 'x</span>'; }).join('');
    atualizarPlano();
  }
  function atualizarPlano() {
    var ps = planosAtuais(), p = ps[pl.idx];
    slider.style.setProperty('--fill', (ps.length > 1 ? pl.idx / (ps.length - 1) * 100 : 100) + '%');
    $('#sliderV').textContent = p.vezes + 'x';
    $('#resRot').textContent = nomeMod(pl.mod) + ' · ' + p.vezes + 'x por semana' + (pl.ciclo && pl.ciclo !== 'mensal' ? ' · plano ' + (D.ciclos[pl.ciclo].nome || pl.ciclo).toLowerCase() : '');
    contar($('#resPreco'), p.preco, 600);
    var treinos = p.vezes * 4.3, por = p.preco / treinos;
    $('#resTreino').textContent = '≈ ' + reais(Math.round(por)) + ' por treino (' + Math.round(treinos) + ' treinos no mês)';
    var linhas = '';
    if (D.avulsa) {
      var av = D.avulsa * treinos, maxv = Math.max(av, p.preco);
      linhas += '<div class="comp-linha"><div><span>Com o plano</span><b>' + reais(p.preco) + '</b></div><i style="--w:' + (p.preco / maxv * 100) + '%;--c:var(--destaque)"></i></div>';
      linhas += '<div class="comp-linha"><div><span>Pagando avulsa (' + reais(D.avulsa) + ' cada)</span><b>' + reais(Math.round(av)) + '</b></div><i style="--w:' + (av / maxv * 100) + '%;--c:var(--cta)"></i></div>';
      if (av - p.preco >= 1) linhas += '<p class="comp-eco">Você economiza cerca de ' + reais(Math.round(av - p.preco)) + ' por mês com o plano.</p>';
    }
    $('#comparar').innerHTML = linhas;
  }
  slider.addEventListener('input', function () { pl.idx = +slider.value; atualizarPlano(); });
  desenharPlanos();

  /* ---------- 5. Galeria em arco ---------- */
  var gal = (V.galeria || D.galeria).slice(0, 12), arco = $('#arco');
  arco.innerHTML = gal.map(function (n) { return '<figure><img src="' + foto(n) + '" alt="" loading="lazy" decoding="async"></figure>'; }).join('');
  if (temGsap) {
    var figs = todos('figure', arco), PASSO = 13;
    function posicionar(p) {
      var w = arco.clientWidth, hh = arco.clientHeight, cel = w < 700, R = cel ? Math.max(w * 1.5, 560) : Math.max(w * 0.95, 760), cx = w / 2, cy = hh * (cel ? 0.36 : 0.5) + R;
      var passo = cel ? 17 : PASSO, base = 8 - p * ((figs.length - 1) * passo + 16);
      figs.forEach(function (f, i) {
        var a = base + i * passo, rad = a * Math.PI / 180;
        var x = cx + R * Math.sin(rad) - f.offsetWidth / 2, y = cy - R * Math.cos(rad) - f.offsetHeight / 2 - hh;
        f.style.transform = 'translate(' + (x - w / 2) + 'px,' + y + 'px) rotate(' + a + 'deg)';
        f.style.opacity = Math.abs(a) > 60 ? 0 : 1;
      });
    }
    ScrollTrigger.create({ trigger: '#galeria', start: 'top top', end: 'bottom bottom', scrub: true, onUpdate: function (s) { posicionar(s.progress); }, onRefresh: function (s) { posicionar(s.progress); } });
    posicionar(0); window.addEventListener('resize', function () { posicionar(0); });
  }

  /* ---------- 6. Dúvidas com busca ---------- */
  var qa = [];
  var temIni = D.turmas.some(function (t) { return t.nivel === 'iniciante'; });
  if (temIni) qa.push(['Nunca joguei. Tem turma pra mim?', 'Tem. As turmas de iniciante começam do zero: são ' + D.turmas.filter(function (t) { return t.nivel === 'iniciante'; }).reduce(function (s, t) { return s + t.dias.length; }, 0) + ' horários por semana.', 'começar zero iniciante nunca']);
  qa.push(['Quanto custa?', MODS.map(function (k) { return nomeMod(k) + ': ' + D.modalidades[k].planos.map(function (p) { return p.vezes + 'x ' + reais(p.preco) + (p.ciclo && p.ciclo !== 'mensal' ? ' (' + p.ciclo + ')' : ''); }).join(', '); }).join('. ') + '. Valores por mês.', 'preço valor mensalidade plano custa']);
  if (D.avulsa) qa.push(['Dá pra fazer uma aula só, sem plano?', 'Dá: a aula avulsa custa ' + reais(D.avulsa) + '. E a primeira aula é experimental.', 'avulsa sem plano uma aula']);
  if (D.turmas.some(function (t) { return t.nivel === 'kids'; })) qa.push(['Tem aula para criança?', 'Tem turma kids (' + ((D.niveis.kids || {}).desc || '').toLowerCase() + '): ' + D.turmas.filter(function (t) { return t.nivel === 'kids'; }).map(function (t) { return t.dias.map(function (d) { return DIA3[d]; }).join('/') + ' ' + t.hora; }).join(', ') + '.', 'criança filho filha kids infantil']);
  qa.push(['Quais os horários?', 'De ' + DIA3[ORDEM.filter(function (d) { return doDia(d).length; })[0]] + ' a ' + DIA3[ORDEM.filter(function (d) { return doDia(d).length; }).slice(-1)[0]] + ', das ' + String(hMin).padStart(2, '0') + 'h às ' + String(hMax).padStart(2, '0') + 'h. A agenda completa está logo acima, hora a hora.', 'horário hora manhã noite tarde sábado']);
  qa.push(['O que eu levo?', 'Roupa leve, garrafa de água e protetor solar. Na ' + LUGAR + ' se joga descalço.', 'levar roupa tênis descalço água']);
  qa.push(['Como marco a aula experimental?', 'Aqui embaixo, em 4 toques: modalidade, nível, horário e nome. A mensagem sai pronta para o WhatsApp.', 'marcar agendar experimental reservar']);
  qa.push(['Onde fica?', [e.linha1, e.linha2].filter(Boolean).join(', ') + '. O botão "Como chegar" abre o mapa.', 'endereço onde local mapa chegar']);
  if (MODS.length > 1) qa.push(['Posso fazer as duas modalidades?', 'Pode. Cada modalidade tem o seu plano; fale com a gente para combinar os horários.', 'duas ambas modalidades']);
  (D.perguntasExtras || []).forEach(function (p) { qa.push([p[0], p[1], '']); });
  function realce(txt, termos) { var h = esc(txt); termos.forEach(function (t) { if (t.length < 2) return; h = h.replace(new RegExp('(' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'), '<mark>$1</mark>'); }); return h; }
  function desenharFaq(q) {
    var termos = semAcento(q || '').split(/\s+/).filter(Boolean);
    var achados = qa.filter(function (x) { var alvo = semAcento(x[0] + ' ' + x[1] + ' ' + (x[2] || '')); return termos.every(function (t) { return alvo.indexOf(t) > -1; }); });
    var orig = (q || '').trim().split(/\s+/).filter(Boolean);
    $('#faq').innerHTML = achados.length ? achados.map(function (x, i) { return '<details' + (termos.length && i < 2 ? ' open' : '') + '><summary>' + realce(x[0], orig) + '</summary><p>' + realce(x[1], orig) + '</p></details>'; }).join('')
      : '<p class="faq-vazio">Não achei essa resposta aqui. <a href="#" id="perguntar">Pergunte direto para a ' + esc(D.nome) + '</a>.</p>';
    var pg = $('#perguntar'); if (pg) pg.addEventListener('click', function (ev) { ev.preventDefault(); enviar('Oi! Tenho uma dúvida: ' + q); });
  }
  desenharFaq('');
  $('#busca').addEventListener('input', function () { desenharFaq(this.value); });

  /* ---------- 7. Reserva em passos ---------- */
  var reserva = { passo: 1, mod: null, nivel: null, oc: null };
  function irPasso(n) {
    if (n === 1 && MODS.length === 1) { reserva.mod = MODS[0]; n = 2; }
    reserva.passo = n;
    todos('.passo').forEach(function (p) { p.hidden = +p.dataset.passo !== n; });
    $('#progresso').style.width = (n / 4 * 100) + '%'; $('#passoN').textContent = n + '/4';
    $('#voltar').disabled = n === 1 || (n === 2 && MODS.length === 1);
    if (n === 1) opcoes($('#p1'), MODS.map(function (k) { var m = D.modalidades[k]; return { emo: m.emoji, t: m.nome, s: m.dica || '', v: k }; }), function (v) { reserva.mod = v; irPasso(2); });
    if (n === 2) {
      var ex = (D.experiencia || []).map(function (x) { return { emo: x.emoji, t: x.rotulo, s: x.dica || '', v: x.nivel }; });
      if (D.turmas.some(function (t) { return t.nivel === 'kids' && t.mod === reserva.mod; })) ex.push({ emo: '🧒', t: 'É para uma criança', s: (D.niveis.kids || {}).desc || '', v: 'kids' });
      opcoes($('#p2'), ex, function (v) { reserva.nivel = v; irPasso(3); });
    }
    if (n === 3) {
      var os = proximas(function (t) { return t.mod === reserva.mod && t.nivel === reserva.nivel; }, 8), aviso = '';
      if (!os.length) { os = proximas(function (t) { return t.mod === reserva.mod; }, 8); aviso = 'Sem turma desse nível nos próximos dias. Estes são os horários de ' + nomeMod(reserva.mod).toLowerCase() + ':'; }
      opcoes($('#p3'), os.slice(0, 8).map(function (o, i) { return { t: o.t.hora, s: quando(o) + ' · ' + nomeNivel(o.t.nivel) + (prof(o.t) ? ' · ' + prof(o.t) : ''), v: i }; }), function (v) { reserva.oc = os[v]; irPasso(4); }, aviso);
    }
    if (n === 4) previa();
  }
  function opcoes(alvo, itens, fn, aviso) {
    alvo.innerHTML = (aviso ? '<p class="sub" style="grid-column:1/-1">' + esc(aviso) + '</p>' : '') + itens.map(function (i, n) { return '<button type="button" class="opcao" data-n="' + n + '">' + (i.emo ? '<span class="emo">' + i.emo + '</span>' : '') + '<b>' + esc(i.t) + '</b><small>' + esc(i.s) + '</small></button>'; }).join('');
    todos('.opcao', alvo).forEach(function (b) { b.addEventListener('click', function () { fn(itens[+b.dataset.n].v); }); });
  }
  function mensagem() {
    var o = reserva.oc; if (!o) return '';
    var nome = $('#nome').value.trim();
    return 'Oi! ' + (nome ? 'Sou ' + nome + ' e quero' : 'Quero') + ' agendar uma aula experimental de ' + nomeMod(o.t.mod).toLowerCase() + ' (' + nomeNivel(o.t.nivel).toLowerCase() + ') ' + (o.n === 0 ? 'hoje' : o.n === 1 ? 'amanhã' : DIA[o.sem]) + ' (' + String(o.dia).padStart(2, '0') + '/' + String(o.mes).padStart(2, '0') + '), às ' + o.t.hora + '. Pode ser?';
  }
  function previa() { $('#previa').textContent = mensagem() || 'Escolha um horário.'; }
  $('#nome').addEventListener('input', previa);
  $('#voltar').addEventListener('click', function () { if (reserva.passo > 1) irPasso(reserva.passo - 1); });
  $('#enviar').addEventListener('click', function () { if (!$('#nome').value.trim()) { $('#nome').focus(); avisar('Escreva seu nome para a mensagem sair completa.'); return; } enviar(mensagem()); });
  irPasso(1);

  /* ---------- Revelações ---------- */
  todos('.cabeca, .planos-ctrl, .planos-res, .busca, .passos, .cal-moldura').forEach(function (x) { x.setAttribute('data-revelar', ''); });
  var io = new IntersectionObserver(function (en) { en.forEach(function (x) { if (x.isIntersecting) { x.target.classList.add('visto'); io.unobserve(x.target); } }); }, { threshold: .15 });
  todos('[data-revelar]').forEach(function (x) { io.observe(x); });
  if (temGsap) window.addEventListener('load', function () { ScrollTrigger.refresh(); });
})();

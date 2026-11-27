/* =========================================================
   AREIA ALTA · arena FICTÍCIA (projeto conceito para o portfólio)
   Nome, logo, professores, horários e preços foram inventados.
   Fotos: Pexels (créditos em CREDITOS.md).
   ========================================================= */
window.DADOS = {
  nome: "Areia Alta",
  slogan: "Praia sem mar, treino de verdade",
  // Modo demonstração: os botões de WhatsApp/Instagram mostram um aviso em vez de abrir um contato real.
  demo: true,
  textos: {
    lugar: "areia",
    compartilhar: "Futevôlei e vôlei de praia na Areia Alta. Bora treinar?",
  },
  instagram: "areiaalta.conceito",
  whatsapp: "",
  linkPagina: "",

  endereco: {
    linha1: "Endereço fictício",
    linha2: "Projeto conceito · Brasília - DF",
    cep: "",
    busca: "Brasília, DF",
    lat: -15.79, lon: -47.88, // opcional: liga o clima ao vivo do modelo 3 (Open-Meteo)
  },

  perfil: { posts: 64, seguidores: 3120, seguindo: 180 },

  modalidades: {
    futevolei: {
      nome: "Futevôlei",
      curto: "Futevôlei", emoji: "⚽", dica: "Sem as mãos",
      resumo: "Pé, coxa, peito e cabeça. Do primeiro domínio à bicicleta, com turma para cada nível.",
      fotos: ["bicicleta-azul", "cabeceio", "salto-rede"],
      planos: [ { vezes: 1, preco: 90 }, { vezes: 2, preco: 160 }, { vezes: 3, preco: 210 } ],
    },
    volei: {
      nome: "Vôlei de praia",
      curto: "Vôlei", emoji: "🏐", dica: "Com as mãos",
      resumo: "Toque, manchete, saque e ataque em dupla. Fundamento primeiro, jogo logo depois.",
      fotos: ["ataque-palmeiras", "saque", "silhueta"],
      planos: [ { vezes: 1, preco: 80 }, { vezes: 2, preco: 140 } ],
    },
  },
  avulsa: 35,

  professores: [
    { id: "caio", nome: "Caio", modalidade: "futevolei" },
    { id: "duda", nome: "Duda", modalidade: "volei" },
    { id: "rafa", nome: "Rafa", modalidade: "futevolei" },
  ],

  // Dias: 0 = domingo ... 6 = sábado
  turmas: [
    { dias: [1, 3, 5], hora: "06:30", nivel: "iniciante",     mod: "futevolei", prof: "caio" },
    { dias: [1, 3, 5], hora: "18:30", nivel: "iniciante",     mod: "futevolei", prof: "caio" },
    { dias: [1, 3, 5], hora: "19:30", nivel: "intermediario", mod: "futevolei", prof: "caio" },
    { dias: [1, 3, 5], hora: "20:30", nivel: "avancado",      mod: "futevolei", prof: "rafa" },
    { dias: [2, 4],    hora: "07:00", nivel: "iniciante",     mod: "volei",     prof: "duda" },
    { dias: [2, 4],    hora: "18:00", nivel: "kids",          mod: "volei",     prof: "duda" },
    { dias: [2, 4],    hora: "19:00", nivel: "iniciante",     mod: "volei",     prof: "duda" },
    { dias: [2, 4],    hora: "20:00", nivel: "intermediario", mod: "volei",     prof: "duda" },
    { dias: [2, 4],    hora: "19:30", nivel: "iniciante",     mod: "futevolei", prof: "rafa" },
    { dias: [6],       hora: "08:00", nivel: "iniciante",     mod: "futevolei", prof: "rafa" },
    { dias: [6],       hora: "09:00", nivel: "iniciante",     mod: "volei",     prof: "duda" },
  ],
  duracaoTurmaMin: 60,

  experiencia: [
    { v: "nunca", emoji: "🌱", rotulo: "Nunca joguei",     dica: "Vou começar do zero", nivel: "iniciante" },
    { v: "pouco", emoji: "🏃", rotulo: "Já jogo um pouco", dica: "Brinco com os amigos", nivel: "intermediario", chip: "Jogo um pouco" },
    { v: "bem",   emoji: "🔥", rotulo: "Jogo bem",         dica: "Quero competir",      nivel: "avancado" },
  ],

  niveis: {
    kids:          { nome: "Kids",          desc: "De 8 a 14 anos" },
    iniciante:     { nome: "Iniciante",     desc: "Para quem está começando" },
    intermediario: { nome: "Intermediário", desc: "Para quem já joga" },
    avancado:      { nome: "Avançado",      desc: "Ritmo de competição" },
  },

  stories: [
    { img: "img/story-horarios.webp", alt: "Cartaz com os horários da semana", cta: "Quero treinar num desses horários" },
    { img: "img/story-valores.webp",  alt: "Cartaz com os valores dos planos", cta: "Quero começar num plano" },
    { img: "img/story-aula.webp",     alt: "Aluno dando uma bicicleta na areia", cta: "Quero uma aula experimental", mod: "futevolei" },
  ],

  placar: [
    { valor: "treinos", rotulo: "treinos por semana" },
    { valor: "dias", rotulo: "dias com treino" },
    { valor: "niveis", rotulo: "níveis de turma" },
    { valor: 35, prefixo: "R$ ", rotulo: "a aula avulsa" },
  ],

  faixa: ["Futevôlei", "Vôlei de praia", "Iniciante", "Kids", "Avançado", "Praia sem mar", "Bora pra areia"],

  destaques: [
    { titulo: "Torneio do fim do mês", texto: "Chaves por nível, inscrição na recepção e premiação para as duplas campeãs.", foto: "img/feed/torneio.webp" },
    { titulo: "Aulão do pôr do sol",   texto: "Todo sábado de verão tem treino aberto no fim da tarde, para aluno e convidado.", foto: "img/feed/aulao.webp" },
    { titulo: "Resenha pós-treino",    texto: "A turma fica para a resenha depois do treino. É assim que a areia vira time.", foto: "img/feed/resenha.webp" },
  ],

  // Só do modelo 2 (opcional; sem isso o modelo 2 usa padrões)
  v2: {
    heroTitulo: ["Praia", "sem mar,", "treino de verdade"],
    heroFotos: ["salto-rede", "bicicleta-praia", "rede-por-do-sol"],
    manifesto: "Aqui ninguém precisa de mar. Precisa de *areia*, de turma e de alguém que te ensine o primeiro toque. Do primeiro domínio à primeira vitória no torneio, a *Areia Alta* é onde a semana termina *melhor*.",
    galeria9: ["bicicleta-azul", "rede-por-do-sol", "cabeceio", "palmeiras", "salto-rede", "dupla-sorrindo", "chute-azul", "bola-areia", "ataque-palmeiras"],
  },

  galeria: [
    "bicicleta-azul", "rede-por-do-sol", "cabeceio", "palmeiras", "salto-rede", "dupla-sorrindo",
    "chute-azul", "bola-areia", "ataque-palmeiras", "silhueta", "bicicleta-praia", "saque",
    "dominio", "pes-areia", "voleio-azul", "turma-praia", "cabeceio-ceu", "rede-praia",
  ],
};

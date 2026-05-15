// ============================================================
//  GUIA SSP — DATA
// ============================================================

const BIZ = [
  {id:1,name:"Somar Supermercado",cat:"comercio",icon:"🛒",bg:"#E3F2FD",addr:"Av. São Sebastião, 153",rating:4.1,rc:416,phone:"+5571351023860",hours:"6:30–19:00",maps:"https://maps.google.com/?q=-12.512694,-38.494221",destaque:true,plano:"pro",reviews:[{a:"Maria S.",s:5,t:"Ótimo atendimento e variedade!"},{a:"João P.",s:4,t:"Bom preço, fila grande no fim de semana."}]},
  {id:2,name:"Bode na Brasa",cat:"restaurante",icon:"🍖",bg:"#FFF3E0",addr:"Av. Ernâni de Oliveira Rocha, 1066",rating:4.2,rc:119,phone:"+5571996173468",hours:"11:00–22:00",maps:"https://maps.google.com/?q=-12.5198635,-38.4975816",destaque:true,plano:"premium",reviews:[{a:"Ana L.",s:5,t:"Melhor bode da região, imperdível!"},{a:"Carlos M.",s:4,t:"Ambiente agradável e suco delicioso."}]},
  {id:3,name:"Em Brasa Hambúrguer",cat:"restaurante",icon:"🍔",bg:"#FFF3E0",addr:"R. José Gonçalves, 88c",rating:4.8,rc:6,phone:"+5571996238905",hours:"18:00–22:00",maps:"https://maps.google.com/?q=-12.5097113,-38.494476",destaque:false,plano:"basico",reviews:[{a:"Pedro R.",s:5,t:"Melhor hambúrguer da cidade!"}]},
  {id:4,name:"Taberna & Cia",cat:"restaurante",icon:"🍕",bg:"#FFF3E0",addr:"Praça Doze de Outubro",rating:4.0,rc:140,phone:"+5571991006330",hours:"11:00–22:00",maps:"https://maps.google.com/?q=-12.5125578,-38.495588",destaque:false,plano:null,reviews:[]},
  {id:5,name:"Tempero Baiano",cat:"restaurante",icon:"🥘",bg:"#FFF3E0",addr:"BR-420, 790",rating:4.5,rc:18,phone:null,hours:"Aberto",maps:"https://maps.google.com/?q=-12.5191582,-38.4973155",destaque:false,plano:null,reviews:[]},
  {id:6,name:"Drogaria São Fellipe",cat:"farmacia",icon:"💊",bg:"#E8F5E9",addr:"R. Albino Emílio Abraão",rating:5.0,rc:4,phone:"+5571984405529",hours:"7:00–20:00",maps:"https://maps.google.com/?q=-12.521869,-38.490649",destaque:false,plantao:true,plano:null,reviews:[]},
  {id:7,name:"Poupe Mais Farma",cat:"farmacia",icon:"💊",bg:"#E8F5E9",addr:"R. Antônio Mendes, 03",rating:5.0,rc:1,phone:"+5571997253978",hours:"7:00–23:55",maps:"https://maps.google.com/?q=-12.513983,-38.49399",destaque:false,plano:"basico",reviews:[]},
  {id:8,name:"Drogarias Ultra Popular",cat:"farmacia",icon:"💊",bg:"#E8F5E9",addr:"BA-512, Av. São Sebastião, 256",rating:3.0,rc:4,phone:null,hours:"Aberto",maps:"https://maps.google.com/?q=-12.511685,-38.494192",destaque:false,plano:null,reviews:[]},
  {id:9,name:"EletroShow",cat:"comercio",icon:"📱",bg:"#E3F2FD",addr:"Praça Doze de Outubro, 81",rating:4.0,rc:179,phone:"+558007201111",hours:"8:00–18:00",maps:"https://maps.google.com/?q=-12.511702,-38.495131",destaque:false,plano:null,reviews:[]},
  {id:10,name:"MP Atacado e Varejo",cat:"comercio",icon:"🏪",bg:"#E3F2FD",addr:"R. Amado Bahia, 69",rating:3.9,rc:21,phone:"+5571359900310",hours:"7:00–19:00",maps:"https://maps.google.com/?q=-12.510737,-38.493787",destaque:false,plano:null,reviews:[]},
  {id:11,name:"SOS EPIs & Casa das Tintas",cat:"comercio",icon:"🔧",bg:"#E3F2FD",addr:"Av. Ernâni de Oliveira Rocha, 106",rating:4.1,rc:25,phone:"+5571365524570",hours:"7:00–17:00",maps:"https://maps.google.com/?q=-12.511014,-38.496435",destaque:false,plano:null,reviews:[]},
  {id:12,name:"Alegre Car Mecânica",cat:"servico",icon:"🚗",bg:"#F3E5F5",addr:"R. Albino Emílio Abraão, 351",rating:4.5,rc:42,phone:"+5571319022700",hours:"7:30–17:00",maps:"https://maps.google.com/?q=-12.525218,-38.489106",destaque:false,plano:"basico",reviews:[{a:"Raimundo F.",s:5,t:"Serviço de excelente qualidade!"}]},
  {id:13,name:"Escola Graciliano Ramos",cat:"educacao",icon:"📚",bg:"#E8EAF6",addr:"Av. Ernâni de Oliveira Rocha, 1648",rating:4.4,rc:8,phone:null,hours:"Manhã, tarde e noite",maps:"https://maps.google.com/?q=-12.521020,-38.491866",destaque:false,plano:null,reviews:[]},
  {id:14,name:"Colégio Polivalente",cat:"educacao",icon:"📚",bg:"#E8EAF6",addr:"R. Cônego Eutíquio de Lima, 456",rating:null,rc:null,phone:"+5571365512640",hours:"7:00–22:20",maps:"https://maps.google.com/?q=-12.508836,-38.489349",destaque:false,plano:null,reviews:[]},
  {id:15,name:"Escola CEB",cat:"educacao",icon:"📚",bg:"#E8EAF6",addr:"Caminho Seis, 19",rating:5.0,rc:1,phone:null,hours:"Manhã e tarde",maps:"https://maps.google.com/?q=-12.520575,-38.488218",destaque:false,plano:null,reviews:[]},
];

const PROMOS = [
  {id:"pr1",bid:2,icon:"🍖",name:"Bode na Brasa",desc:"20% OFF no almoço de segunda a quarta",disc:"20%",valid:"Até 16/05",patrocinado:true},
  {id:"pr2",bid:1,icon:"🛒",name:"Somar Supermercado",desc:"Leve 3, pague 2 em bebidas selecionadas",disc:"3×2",valid:"Até 15/05",patrocinado:true},
  {id:"pr3",bid:3,icon:"🍔",name:"Em Brasa Hambúrguer",desc:"Combo hambúrguer + batata + refri por R$29",disc:"COMBO",valid:"Até 18/05",patrocinado:false},
  {id:"pr4",bid:12,icon:"🚗",name:"Alegre Car Mecânica",desc:"Troca de óleo + filtro com 15% de desconto",disc:"15%",valid:"Até 20/05",patrocinado:true},
];

const BANNERS = [
  {id:"bn1",bid:1,icon:"🛒",name:"Somar Supermercado",headline:"Fresquinho todo dia!",sub:"As melhores ofertas em hortifruti e mercearia",cta:"Ver ofertas",color:"#1D9E75",phone:"+5571351023860"},
  {id:"bn2",bid:2,icon:"🍖",name:"Bode na Brasa",headline:"Melhor bode de SSP",sub:"Reserve sua mesa agora e ganhe sobremesa grátis",cta:"Reservar",color:"#B85C00",phone:"+5571996173468"},
];

const STORIES = [
  {id:"st1",bid:2,emoji:"🍖",name:"Bode na Brasa",headline:"20% OFF",sub:"No almoço de segunda a quarta!",cta:"Ligar agora",bg:"#B85C00",phone:"+5571996173468",active:true},
];

const SORTEIOS = [
  {id:"s1",icon:"🍽️",name:"Jantar para 2 — Taberna & Cia",biz:"Taberna & Cia",prize:"Jantar completo para 2 pessoas (valor R$120)",parts:47,end:"18/05",bid:4,patrocinado:false},
  {id:"s2",icon:"🛒",name:"Cesta básica completa",biz:"Somar Supermercado",prize:"Cesta básica no valor de R$150",parts:132,end:"20/05",bid:1,patrocinado:true},
  {id:"s3",icon:"📱",name:"Fone de ouvido Bluetooth",biz:"EletroShow",prize:"Fone Bluetooth JBL Tune",parts:89,end:"25/05",bid:9,patrocinado:true},
];

const VAGAS = [
  {id:"v1",icon:"📱",title:"Vendedor(a) de Loja",biz:"EletroShow",tipo:"CLT",turno:"Comercial",req:"Experiência em vendas",phone:"+558007201111",patrocinado:true},
  {id:"v2",icon:"🛒",title:"Repositor(a)",biz:"Somar Supermercado",tipo:"CLT",turno:"Manhã",req:"Disponibilidade imediata",phone:"+5571351023860",patrocinado:true},
  {id:"v3",icon:"🚗",title:"Auxiliar Mecânico",biz:"Alegre Car Mecânica",tipo:"CLT",turno:"Integral",req:"Noções de mecânica",phone:"+5571319022700",patrocinado:false},
  {id:"v4",icon:"💊",title:"Atendente de Farmácia",biz:"Poupe Mais Farma",tipo:"CLT",turno:"Tarde/Noite",req:"Ensino médio completo",phone:"+5571997253978",patrocinado:false},
];

const ENQUETES = [
  {id:"e1",q:"Qual o melhor restaurante de SSP?",opts:["Bode na Brasa","Taberna & Cia","Em Brasa Hambúrguer","Tempero Baiano"],votes:[0,0,0,0],voted:null,total:0},
  {id:"e2",q:"O que você mais usa no Guia SSP?",opts:["Buscar negócios","Ver promoções","Participar de sorteios","Vagas de emprego"],votes:[0,0,0,0],voted:null,total:0},
  {id:"e3",q:"Qual serviço faz mais falta em SSP?",opts:["Delivery de comida","Mais farmácias 24h","Academia","Cinema"],votes:[0,0,0,0],voted:null,total:0},
];

const EVENTS = [
  {day:"17",month:"Mai",name:"Feira Cultural de SSP",local:"Praça 12 de Outubro",hora:"9:00–18:00"},
  {day:"19",month:"Mai",name:"Show de Forró no Casarão",local:"Casarão Cultural",hora:"20:00"},
  {day:"24",month:"Mai",name:"Caminhada da Saúde",local:"Av. Ernâni de Oliveira Rocha",hora:"6:30"},
  {day:"31",month:"Mai",name:"Festa Junina Antecipada",local:"Escola Graciliano Ramos",hora:"18:00"},
];

const RANKING = [
  {name:"Bode na Brasa",icon:"🍖",meta:"4.2★ · 119 avaliações",pts:312,pos:1,bid:2},
  {name:"Somar Supermercado",icon:"🛒",meta:"4.1★ · 416 acessos",pts:287,pos:2,bid:1},
  {name:"Em Brasa Hambúrguer",icon:"🍔",meta:"4.8★ · 6 avaliações",pts:241,pos:3,bid:3},
  {name:"Alegre Car Mecânica",icon:"🚗",meta:"4.5★ · 42 avaliações",pts:198,pos:4,bid:12},
  {name:"Taberna & Cia",icon:"🍕",meta:"4.0★ · 140 avaliações",pts:175,pos:5,bid:4},
  {name:"Tempero Baiano",icon:"🥘",meta:"4.5★ · 18 avaliações",pts:143,pos:6,bid:5},
  {name:"Poupe Mais Farma",icon:"💊",meta:"5.0★ · 1 avaliação",pts:121,pos:7,bid:7},
];

const BADGES = [
  {emoji:"🗺️",name:"Explorador",desc:"Acessou 5 negócios",earned:true},
  {emoji:"⭐",name:"Avaliador",desc:"Fez 3 avaliações",earned:true},
  {emoji:"📍",name:"Check-in Pro",desc:"5 check-ins",earned:false},
  {emoji:"🔥",name:"Fiel",desc:"7 dias seguidos",earned:false},
  {emoji:"🎰",name:"Sortudo",desc:"Participou de sorteio",earned:true},
  {emoji:"💼",name:"Empregado",desc:"Se candidatou a vaga",earned:false},
  {emoji:"🤝",name:"Indicador",desc:"Indicou um negócio",earned:false},
  {emoji:"👑",name:"Rei de SSP",desc:"Top 1 do ranking",earned:false},
];

const EMERGENCY = [
  {label:"SAMU",num:"192"},{label:"Bombeiros",num:"193"},
  {label:"Polícia Militar",num:"190"},{label:"Polícia Civil",num:"197"},
  {label:"Defesa Civil",num:"199"},{label:"CVV",num:"188"},
];

const AFILIADOS = [
  {icon:"🛵",name:"iFood",desc:"Peça delivery dos restaurantes de SSP",url:"https://www.ifood.com.br",comissao:"R$2–5 por pedido"},
  {icon:"🔨",name:"GetNinjas",desc:"Encontre profissionais de serviços locais",url:"https://www.getninjas.com.br",comissao:"R$3 por cadastro"},
  {icon:"🏠",name:"OLX",desc:"Compre e venda em São Sebastião do Passé",url:"https://www.olx.com.br",comissao:"R$1 por clique"},
];

const PLANOS = [
  {id:"basico",name:"Básico",price:99,color:"#1D9E75",features:["Perfil completo no guia","2 promoções por mês","Badge de assinante","Relatório mensal básico"]},
  {id:"pro",name:"Pro",price:149,color:"#185FA5",features:["Tudo do Básico","Destaque na categoria","4 promoções por mês","1 publicação de vaga","Stories patrocinado (1×/mês)","Relatório detalhado com cliques"]},
  {id:"premium",name:"Premium",price:199,color:"#7C5CBF",features:["Tudo do Pro","1 sorteio patrocinado/mês","Destaque na tela inicial","Vagas ilimitadas","Stories semanais","Relatório completo + exportação"]},
];

const NOTIFICATIONS = [
  {color:"#E24B4A",msg:"🔥 Bode na Brasa: 20% OFF hoje no almoço!",time:"10 min atrás"},
  {color:"#7C5CBF",msg:"🎰 Novo sorteio: Fone Bluetooth no EletroShow!",time:"1h atrás"},
  {color:"#1D9E75",msg:"⭐ Você ganhou 20pts por fazer check-in!",time:"2h atrás"},
  {color:"#378ADD",msg:"💼 Nova vaga: Vendedor(a) no EletroShow",time:"Hoje, 9:00"},
  {color:"#EF9F27",msg:"🏆 Você subiu para 2° lugar no ranking!",time:"Hoje, 8:30"},
  {color:"#1D9E75",msg:"📅 Evento: Feira Cultural neste sábado!",time:"Ontem"},
];

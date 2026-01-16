
import { Product, Neighborhood, Category } from './types';

export const WHATSAPP_NUMBER = '5531998725041';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat_indisp', name: 'Indispensáveis' },
  { id: 'cat_coxinhas', name: 'Coxinhas Doces' },
  { id: 'cat_copoes', name: 'COPÕES (400ml)' },
  { id: 'cat_tortinhas', name: 'TORTINHAS' },
  { id: 'cat_pizzas', name: 'PIZZAS DE BROWNIE' },
  { id: 'cat_sobremesas', name: 'SOBREMESAS' }
];

export const INITIAL_PRODUCTS: Product[] = [
  // INDISPENSÁVEIS
  {
    id: 'b1',
    name: 'Brownie Recheado',
    description: 'Escolha seu recheio favorito.',
    price: 10.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1464347744102-11db6282f854?auto=format&fit=crop&w=400',
    options: [
      { name: 'Ninho' },
      { name: 'Ninho com Nutella' },
      { name: 'Brigadeiro Preto' },
      { name: 'Preto com Nutella' },
      { name: 'Duo (Ninho com preto)' },
      { name: 'Ovomaltine' },
      { name: 'Doce de Leite' }
    ]
  },
  {
    id: 'pm1',
    name: 'Pão de Mel',
    description: 'Pão de mel macio com recheio de doce de leite e cobertura de chocolate.',
    price: 10.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1590080874088-eec64895b423?auto=format&fit=crop&w=400'
  },
  {
    id: 'ct1',
    name: 'Cone Trufado',
    description: 'Nossa famosa casquinha crocante e trufada.',
    price: 11.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?auto=format&fit=crop&w=400',
    options: [
      { name: 'Ninho com Nutella', price: 14.00 },
      { name: 'Brigadeiro Ninho', price: 11.00 },
      { name: 'Brigadeiro Preto', price: 11.00 },
      { name: 'Brigadeiro Duo', price: 11.00 }
    ]
  },
  {
    id: 'pi1',
    name: 'Palha Italiana',
    description: 'Tradicional palha italiana super cremosa.',
    price: 10.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1599599810769-bcde5a160d32?auto=format&fit=crop&w=400',
    options: [
      { name: 'Ninho' },
      { name: '50% Cacau' },
      { name: 'Caramelo com flor de sal' },
      { name: 'Nesquik' }
    ]
  },
  {
    id: 'db1',
    name: 'Dadinhos de Brownie',
    description: 'Pedaços de brownie cobertos com chocolate.',
    price: 15.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1582176604856-e80233660893?auto=format&fit=crop&w=400',
    options: [
      { name: 'Chocolate Preto' },
      { name: 'Chocolate Branco' }
    ]
  },
  {
    id: 'so1',
    name: 'Surpresa de Oreo',
    description: 'Biscoito Oreo coberto com brigadeiro gourmet preto e confeitos de chocolate nobre.',
    price: 12.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1558961359-1d96283686af?auto=format&fit=crop&w=400'
  },
  {
    id: 'br1',
    name: 'Brigadeiro Gourmet',
    description: 'Escolha seu sabor favorito.',
    price: 6.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1599599810664-67c28223652b?auto=format&fit=crop&w=400',
    options: [
      { name: 'Gourmet Tradicional' },
      { name: 'Beijinho' },
      { name: 'Ninho com Nutella' },
      { name: 'Ferrero' }
    ]
  },
  {
    id: 'tu1',
    name: 'Trio de Uvas',
    description: '3 uvas sem sementes cobertas por um delicioso brigadeiro de ninho.',
    price: 11.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1541014741259-df549fa9ba6f?auto=format&fit=crop&w=400'
  },
  {
    id: 'pdm1',
    name: 'Pote Duo com Morango',
    description: 'Campeão de vendas! Brigadeiro 50%, brownies, morango e creme de ninho.',
    price: 13.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400'
  },
  {
    id: 'g1',
    name: 'Gargamel',
    description: 'Creme 4 leites, biscoito maltado, caramelo, creme 50% e castanha de caju.',
    price: 12.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400'
  },
  {
    id: 'plc1',
    name: 'Pudim de Leite Condensado',
    description: 'Pudim cremoso com calda de caramelo.',
    price: 8.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1541783245831-57d69a405357?auto=format&fit=crop&w=400'
  },
  {
    id: 'pn1',
    name: 'Pudim de Ninho',
    description: 'Escolha a sua calda.',
    price: 10.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1541783245831-57d69a405357?auto=format&fit=crop&w=400',
    options: [
      { name: 'Calda de frutas vermelhas' },
      { name: 'Ganache de Nutella' }
    ]
  },
  {
    id: 'ml1',
    name: 'Mousse Limão com Choc. Branco',
    description: 'Mousse aerada de limão com raspas de chocolate branco.',
    price: 10.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1517427677510-d5ff65e533d6?auto=format&fit=crop&w=400'
  },
  {
    id: 'mm1',
    name: 'Mousse Maracujá com Geleia',
    description: 'Mousse de maracujá com geleia caseira da fruta.',
    price: 10.00,
    category: 'Indispensáveis',
    image: 'https://images.unsplash.com/photo-1550507992-eb63ffee0847?auto=format&fit=crop&w=400'
  },

  // COXINHAS DOCES
  {
    id: 'cx1',
    name: 'Coxinha de Ninho com Morango',
    description: 'Deliciosa coxinha de leite ninho recheada com morango fresco.',
    price: 11.00,
    category: 'Coxinhas Doces',
    image: 'https://images.unsplash.com/photo-1549128247-37e905ebdb3f?auto=format&fit=crop&w=400',
    options: [
      { name: 'Tradicional', price: 11.00 },
      { name: 'Com Nutella', price: 13.00 }
    ]
  },
  {
    id: 'cx2',
    name: 'Coxinha 50% Cacau, Amendoim e Morango',
    description: 'Brigadeiro 50%, crocante de amendoim e morango selecionado.',
    price: 11.00,
    category: 'Coxinhas Doces',
    image: 'https://images.unsplash.com/photo-1599599810664-67c28223652b?auto=format&fit=crop&w=400',
    options: [
      { name: 'Tradicional', price: 11.00 },
      { name: 'Com Nutella', price: 13.00 }
    ]
  },
  {
    id: 'cx3',
    name: 'Coxinha 50% Cacau, Granulado e Morango',
    description: 'A clássica combinação de brigadeiro preto, granulado nobre e morango.',
    price: 11.00,
    category: 'Coxinhas Doces',
    image: 'https://images.unsplash.com/photo-1599599810664-67c28223652b?auto=format&fit=crop&w=400'
  },
  {
    id: 'cx4',
    name: 'Coxinha de Ninho com Kinder Bueno',
    description: 'Incrível coxinha de leite ninho recheada com Kinder Bueno original.',
    price: 11.00,
    category: 'Coxinhas Doces',
    image: 'https://images.unsplash.com/photo-1549128247-37e905ebdb3f?auto=format&fit=crop&w=400'
  },

  // COPÕES
  {
    id: 'cp1',
    name: 'Copão Duo / Ouro Branco',
    description: 'Mix de creme de ninho, bombom ouro branco, brownies cremosos, creme de chocolate 50% e chantininho.',
    price: 24.00,
    category: 'COPÕES (400ml)',
    image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=400'
  },
  {
    id: 'cp2',
    name: 'Copão Ninho com Morango',
    description: 'Creme e mousse de ninho, morangos frescos, brownie cremoso e chantininho.',
    price: 27.00,
    category: 'COPÕES (400ml)',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400'
  },
  {
    id: 'cp6',
    name: 'Copo Explosão Ninho com Morango',
    description: 'Uma explosão de sabores em 3 diferentes recheios de leite ninho, morangos e chantininho (sem brownies).',
    price: 30.00,
    category: 'COPÕES (400ml)',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400'
  },

  // TORTINHAS
  {
    id: 't1',
    name: 'Tortinha ninho com morango',
    description: 'Sobremesa leve de leite ninho com morangos e biscoito maltado para dar uma crocância.',
    price: 20.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?auto=format&fit=crop&w=400'
  },
  {
    id: 't2',
    name: 'Mousse de ninho com mousse de nutella',
    description: 'Um show de mousse de nutella com mousse de ninho, amendoim e nutella.',
    price: 19.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?auto=format&fit=crop&w=400'
  },
  {
    id: 't3',
    name: 'Bombom aberto de uva',
    description: 'Super refrescante mousse de leite ninho com uvas verdes e coberto por uma ganache de chocolate.',
    price: 18.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1623334042400-9883d6997424?auto=format&fit=crop&w=400'
  },
  {
    id: 't4',
    name: 'Tortinha de prestígio',
    description: 'Releitura de um clássico chocolate. Com bolo de chocolate, creme de côco, ganache de chocolate.',
    price: 18.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400'
  },
  {
    id: 't5',
    name: 'Cumbuca de abacaxi com côco',
    description: 'A sobremesa mais inusitada e refrescante. Bolo molhadinho, creme de abacaxi, morangos, mousse de ninho e côco.',
    price: 16.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?auto=format&fit=crop&w=400',
    options: [
      { name: 'Com morangos' },
      { name: 'Sem morangos' }
    ]
  },
  {
    id: 't6',
    name: 'Cumbuca ninho e geleia de morangos',
    description: 'Aquela mistura de um mousse levinho de ninho com uma geleia caseira de morango e um bolo molhadinho.',
    price: 16.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?auto=format&fit=crop&w=400'
  },
  {
    id: 't7',
    name: 'Frutas com creme de ninho',
    description: 'Frutas refrescantes (kiwi, manga e morango) com creme de ninho.',
    price: 20.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400'
  },
  {
    id: 't8',
    name: 'Pavê de amendoim',
    description: 'Saboroso creme intercalado com biscoitos de leite, amendoim triturado, cremoso doce de leite e paçoca.',
    price: 16.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400'
  },
  {
    id: 't9',
    name: 'Folhata de morango',
    description: 'Mousse 4 leites suave, creme de chocolate branco, biscoitos folhados e morangos.',
    price: 20.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=400'
  },
  {
    id: 't10',
    name: 'Folhata de abacaxi com doce de leite',
    description: 'Mousse 4 leites suave, mousse de doce de leite, biscoitos folhados e doce de abacaxi.',
    price: 19.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?auto=format&fit=crop&w=400'
  },
  {
    id: 't11',
    name: 'Tortinha de banana rica',
    description: 'Maravilhoso doce de banana caramelizada com creme belga, base de biscoito maltado, chantilly e canela.',
    price: 14.00,
    category: 'TORTINHAS',
    image: 'https://images.unsplash.com/photo-1528458024837-39159849b5a8?auto=format&fit=crop&w=400'
  },

  // PIZZAS DE BROWNIE
  {
    id: 'pz1',
    name: 'Pizza de Brownie: Ninho com nutella',
    description: 'Pedaço de brownie em formato de fatia de pizza com cobertura de brigadeiro de ninho e nutella.',
    price: 18.00,
    category: 'PIZZAS DE BROWNIE',
    image: 'https://images.unsplash.com/photo-1564915022656-7494199aa394?auto=format&fit=crop&w=400'
  },
  {
    id: 'pz2',
    name: 'Pizza de Brownie: Duo com KitKat',
    description: 'Pedaço de brownie em formato de fatia de pizza com cobertura de brigadeiro de ninho e brigadeiro preto com KitKat.',
    price: 18.00,
    category: 'PIZZAS DE BROWNIE',
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=400'
  },

  // SOBREMESAS
  {
    id: 's1',
    name: 'Arroz doce',
    description: 'Um arroz doce diferenciado, super cremoso e saboroso.',
    price: 14.00,
    category: 'SOBREMESAS',
    image: 'https://images.unsplash.com/photo-1594911773177-834f82879572?auto=format&fit=crop&w=400'
  },
  {
    id: 's2',
    name: 'Bombom aberto de uva',
    description: 'Super refrescante mousse de leite ninho com uvas verdes e coberto por uma ganache de chocolate.',
    price: 14.00,
    category: 'SOBREMESAS',
    image: 'https://images.unsplash.com/photo-1623334042400-9883d6997424?auto=format&fit=crop&w=400'
  },
  {
    id: 's3',
    name: 'Surpresa de Oreo',
    description: 'Um biscoito Oreo coberto com brigadeiro de chocolate preto com confeitos de chocolate.',
    price: 9.00,
    category: 'SOBREMESAS',
    image: 'https://images.unsplash.com/photo-1558961359-1d96283686af?auto=format&fit=crop&w=400'
  },
  {
    id: 's4',
    name: 'Mingau de milho verde cremoso',
    description: 'O melhor mingau de milho verde que você vai comer!!! Super cremoso e saboroso!',
    price: 14.00,
    category: 'SOBREMESAS',
    image: 'https://images.unsplash.com/photo-1564936281291-294551497d81?auto=format&fit=crop&w=400'
  },
  {
    id: 's5',
    name: 'Canjica cremosa(380ml)',
    description: 'Nossa famosa canjica super cremosa disponível em dois sabores clássicos.',
    price: 13.00,
    category: 'SOBREMESAS',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?auto=format&fit=crop&w=400',
    options: [
      { name: '5 leites com côco' },
      { name: 'Doce de leite com amendoim' }
    ]
  },
  {
    id: 's6',
    name: 'Red velvet no pote',
    description: 'Deliciosa massa vermelha aveludada, com recheio cremoso de cream cheese e geleia de frutas vermelhas caseira.',
    price: 15.00,
    category: 'SOBREMESAS',
    image: 'https://images.unsplash.com/photo-1586788680434-30d324634bf6?auto=format&fit=crop&w=400'
  },
  {
    id: 's7',
    name: 'Bolo de chocolate com ninho',
    description: 'Fatia generosa de bolo de chocolate com a cobertura mais amada de leite ninho.',
    price: 11.00,
    category: 'SOBREMESAS',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=400'
  },
  {
    id: 's8',
    name: 'Chocolate quente cremoso',
    description: 'Bebida quente de sabor intenso de chocolate, com uma cremosidade que dá pra comer de colher! Vem com pedacinhos de brownie.',
    price: 10.00,
    category: 'SOBREMESAS',
    image: 'https://images.unsplash.com/photo-1544787210-2213d64adac3?auto=format&fit=crop&w=400'
  }
];

export const INITIAL_NEIGHBORHOODS: Neighborhood[] = [
  { id: 'n1', name: 'Centro', fee: 5.00 },
  { id: 'n2', name: 'Fernão Dias', fee: 6.00 },
  { id: 'n3', name: 'Castelo Branco', fee: 7.00 },
  { id: 'n4', name: 'Santa Cruz', fee: 8.00 }
];

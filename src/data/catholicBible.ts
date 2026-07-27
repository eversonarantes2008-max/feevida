import { BibleBook, BibleVerse } from '../types';

export const CATHOLIC_BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento (46 livros)
  // Pentateuco
  { id: 'gn', name: 'Gênesis', abbreviation: 'Gn', testament: 'old', category: 'Pentateuco', chaptersCount: 50 },
  { id: 'ex', name: 'Êxodo', abbreviation: 'Êx', testament: 'old', category: 'Pentateuco', chaptersCount: 40 },
  { id: 'lv', name: 'Levítico', abbreviation: 'Lv', testament: 'old', category: 'Pentateuco', chaptersCount: 27 },
  { id: 'nm', name: 'Números', abbreviation: 'Nm', testament: 'old', category: 'Pentateuco', chaptersCount: 36 },
  { id: 'dt', name: 'Deuteronômio', abbreviation: 'Dt', testament: 'old', category: 'Pentateuco', chaptersCount: 34 },
  
  // Históricos
  { id: 'jos', name: 'Josué', abbreviation: 'Js', testament: 'old', category: 'Históricos', chaptersCount: 24 },
  { id: 'jz', name: 'Juízes', abbreviation: 'Jz', testament: 'old', category: 'Históricos', chaptersCount: 21 },
  { id: 'rt', name: 'Rute', abbreviation: 'Rt', testament: 'old', category: 'Históricos', chaptersCount: 4 },
  { id: '1sm', name: '1 Samuel', abbreviation: '1Sm', testament: 'old', category: 'Históricos', chaptersCount: 31 },
  { id: '2sm', name: '2 Samuel', abbreviation: '2Sm', testament: 'old', category: 'Históricos', chaptersCount: 24 },
  { id: '1rs', name: '1 Reis', abbreviation: '1Rs', testament: 'old', category: 'Históricos', chaptersCount: 22 },
  { id: '2rs', name: '2 Reis', abbreviation: '2Rs', testament: 'old', category: 'Históricos', chaptersCount: 25 },
  { id: '1cr', name: '1 Crônicas', abbreviation: '1Cr', testament: 'old', category: 'Históricos', chaptersCount: 29 },
  { id: '2cr', name: '2 Crônicas', abbreviation: '2Cr', testament: 'old', category: 'Históricos', chaptersCount: 36 },
  { id: 'esd', name: 'Esdras', abbreviation: 'Esd', testament: 'old', category: 'Históricos', chaptersCount: 10 },
  { id: 'ne', name: 'Neemias', abbreviation: 'Ne', testament: 'old', category: 'Históricos', chaptersCount: 13 },
  { id: 'tb', name: 'Tobias (Deuterocanônico)', abbreviation: 'Tb', testament: 'old', category: 'Históricos', chaptersCount: 14 },
  { id: 'jdt', name: 'Judite (Deuterocanônico)', abbreviation: 'Jdt', testament: 'old', category: 'Históricos', chaptersCount: 16 },
  { id: 'est', name: 'Ester', abbreviation: 'Est', testament: 'old', category: 'Históricos', chaptersCount: 10 },
  { id: '1mc', name: '1 Macabeus (Deuterocanônico)', abbreviation: '1Mc', testament: 'old', category: 'Históricos', chaptersCount: 16 },
  { id: '2mc', name: '2 Macabeus (Deuterocanônico)', abbreviation: '2Mc', testament: 'old', category: 'Históricos', chaptersCount: 15 },

  // Sapienciais
  { id: 'jo', name: 'Jó', abbreviation: 'Jó', testament: 'old', category: 'Sapienciais', chaptersCount: 42 },
  { id: 'sl', name: 'Salmos', abbreviation: 'Sl', testament: 'old', category: 'Sapienciais', chaptersCount: 150 },
  { id: 'pr', name: 'Provérbios', abbreviation: 'Pr', testament: 'old', category: 'Sapienciais', chaptersCount: 31 },
  { id: 'ec', name: 'Eclesiastes (Qohelet)', abbreviation: 'Ecl', testament: 'old', category: 'Sapienciais', chaptersCount: 12 },
  { id: 'ct', name: 'Cântico dos Cânticos', abbreviation: 'Ct', testament: 'old', category: 'Sapienciais', chaptersCount: 8 },
  { id: 'sb', name: 'Sabedoria (Deuterocanônico)', abbreviation: 'Sb', testament: 'old', category: 'Sapienciais', chaptersCount: 19 },
  { id: 'ecli', name: 'Eclesiástico / Sirácida (Deuterocanônico)', abbreviation: 'Ecli', testament: 'old', category: 'Sapienciais', chaptersCount: 51 },

  // Proféticos
  { id: 'is', name: 'Isaías', abbreviation: 'Is', testament: 'old', category: 'Proféticos', chaptersCount: 66 },
  { id: 'jr', name: 'Jeremias', abbreviation: 'Jr', testament: 'old', category: 'Proféticos', chaptersCount: 52 },
  { id: 'lm', name: 'Lamentações', abbreviation: 'Lm', testament: 'old', category: 'Proféticos', chaptersCount: 5 },
  { id: 'bar', name: 'Baruc (Deuterocanônico)', abbreviation: 'Bar', testament: 'old', category: 'Proféticos', chaptersCount: 6 },
  { id: 'ez', name: 'Ezequiel', abbreviation: 'Ez', testament: 'old', category: 'Proféticos', chaptersCount: 48 },
  { id: 'dn', name: 'Daniel', abbreviation: 'Dn', testament: 'old', category: 'Proféticos', chaptersCount: 14 },
  { id: 'os', name: 'Oseias', abbreviation: 'Os', testament: 'old', category: 'Proféticos', chaptersCount: 14 },
  { id: 'jl', name: 'Joel', abbreviation: 'Jl', testament: 'old', category: 'Proféticos', chaptersCount: 4 },
  { id: 'am', name: 'Amós', abbreviation: 'Am', testament: 'old', category: 'Proféticos', chaptersCount: 9 },
  { id: 'ob', name: 'Obadias', abbreviation: 'Ob', testament: 'old', category: 'Proféticos', chaptersCount: 1 },
  { id: 'jon', name: 'Jonas', abbreviation: 'Jon', testament: 'old', category: 'Proféticos', chaptersCount: 4 },
  { id: 'mq', name: 'Miqueias', abbreviation: 'Mq', testament: 'old', category: 'Proféticos', chaptersCount: 7 },
  { id: 'na', name: 'Naum', abbreviation: 'Na', testament: 'old', category: 'Proféticos', chaptersCount: 3 },
  { id: 'hab', name: 'Habacuc', abbreviation: 'Hab', testament: 'old', category: 'Proféticos', chaptersCount: 3 },
  { id: 'sf', name: 'Sofonias', abbreviation: 'Sf', testament: 'old', category: 'Proféticos', chaptersCount: 3 },
  { id: 'ag', name: 'Ageu', abbreviation: 'Ag', testament: 'old', category: 'Proféticos', chaptersCount: 2 },
  { id: 'zc', name: 'Zacarias', abbreviation: 'Zc', testament: 'old', category: 'Proféticos', chaptersCount: 14 },
  { id: 'ml', name: 'Malaquias', abbreviation: 'Ml', testament: 'old', category: 'Proféticos', chaptersCount: 3 },

  // Novo Testamento (27 livros)
  // Evangelhos
  { id: 'mt', name: 'São Mateus', abbreviation: 'Mt', testament: 'new', category: 'Evangelhos', chaptersCount: 28 },
  { id: 'mc', name: 'São Marcos', abbreviation: 'Mc', testament: 'new', category: 'Evangelhos', chaptersCount: 16 },
  { id: 'lc', name: 'São Lucas', abbreviation: 'Lc', testament: 'new', category: 'Evangelhos', chaptersCount: 24 },
  { id: 'jo_ev', name: 'São João', abbreviation: 'Jo', testament: 'new', category: 'Evangelhos', chaptersCount: 21 },

  // Histórico
  { id: 'at', name: 'Atos dos Apóstolos', abbreviation: 'At', testament: 'new', category: 'Cartas', chaptersCount: 28 },

  // Cartas de São Paulo e Outras
  { id: 'rm', name: 'Romanos', abbreviation: 'Rm', testament: 'new', category: 'Cartas', chaptersCount: 16 },
  { id: '1co', name: '1 Coríntios', abbreviation: '1Co', testament: 'new', category: 'Cartas', chaptersCount: 16 },
  { id: '2co', name: '2 Coríntios', abbreviation: '2Co', testament: 'new', category: 'Cartas', chaptersCount: 13 },
  { id: 'gl', name: 'Gálatas', abbreviation: 'Gl', testament: 'new', category: 'Cartas', chaptersCount: 6 },
  { id: 'ef', name: 'Efésios', abbreviation: 'Ef', testament: 'new', category: 'Cartas', chaptersCount: 6 },
  { id: 'fip', name: 'Filipenses', abbreviation: 'Fl', testament: 'new', category: 'Cartas', chaptersCount: 4 },
  { id: 'cl', name: 'Colossenses', abbreviation: 'Cl', testament: 'new', category: 'Cartas', chaptersCount: 4 },
  { id: '1ts', name: '1 Tessalonicenses', abbreviation: '1Ts', testament: 'new', category: 'Cartas', chaptersCount: 5 },
  { id: '2ts', name: '2 Tessalonicenses', abbreviation: '2Ts', testament: 'new', category: 'Cartas', chaptersCount: 3 },
  { id: '1tm', name: '1 Timóteo', abbreviation: '1Tm', testament: 'new', category: 'Cartas', chaptersCount: 6 },
  { id: '2tm', name: '2 Timóteo', abbreviation: '2Tm', testament: 'new', category: 'Cartas', chaptersCount: 4 },
  { id: 'tt', name: 'Tito', abbreviation: 'Tt', testament: 'new', category: 'Cartas', chaptersCount: 3 },
  { id: 'fm', name: 'Filemon', abbreviation: 'Fm', testament: 'new', category: 'Cartas', chaptersCount: 1 },
  { id: 'hb', name: 'Hebreus', abbreviation: 'Hb', testament: 'new', category: 'Cartas', chaptersCount: 13 },
  { id: 'tg', name: 'São Tiago', abbreviation: 'Tg', testament: 'new', category: 'Cartas', chaptersCount: 5 },
  { id: '1pe', name: '1 São Pedro', abbreviation: '1Pe', testament: 'new', category: 'Cartas', chaptersCount: 5 },
  { id: '2pe', name: '2 São Pedro', abbreviation: '2Pe', testament: 'new', category: 'Cartas', chaptersCount: 3 },
  { id: '1jo', name: '1 São João', abbreviation: '1Jo', testament: 'new', category: 'Cartas', chaptersCount: 5 },
  { id: '2jo', name: '2 São João', abbreviation: '2Jo', testament: 'new', category: 'Cartas', chaptersCount: 1 },
  { id: '3jo', name: '3 São João', abbreviation: '3Jo', testament: 'new', category: 'Cartas', chaptersCount: 1 },
  { id: 'jd', name: 'São Judas', abbreviation: 'Jd', testament: 'new', category: 'Cartas', chaptersCount: 1 },

  // Apocalipse
  { id: 'ap', name: 'Apocalipse (Revelação)', abbreviation: 'Ap', testament: 'new', category: 'Apocalipse', chaptersCount: 22 }
];

// Sample chapters text repository for instant offline reading
export const SAMPLE_BIBLE_VERSES: Record<string, Record<number, BibleVerse[]>> = {
  // Gênesis Cap 1
  'gn': {
    1: [
      { bookId: 'gn', chapter: 1, verse: 1, text: 'No princípio, Deus criou o céu e a terra.' },
      { bookId: 'gn', chapter: 1, verse: 2, text: 'A terra estava informe e vazia; as trevas cobriam o abismo e o Espírito de Deus pairava sobre as águas.' },
      { bookId: 'gn', chapter: 1, verse: 3, text: 'Deus disse: "Faça-se a luz". E a luz foi feita.' },
      { bookId: 'gn', chapter: 1, verse: 4, text: 'Deus viu que a luz era boa, e separou a luz das trevas.' },
      { bookId: 'gn', chapter: 1, verse: 5, text: 'Deus chamou à luz "dia" e às trevas "noite". Houve uma tarde e uma manhã: primeiro dia.' },
      { bookId: 'gn', chapter: 1, verse: 26, text: 'Deus disse: "Façamos o homem à nossa imagem e segundo a nossa semelhança; que ele domine sobre os peixes do mar, as aves do céu, os animais domésticos e toda a terra".' },
      { bookId: 'gn', chapter: 1, verse: 27, text: 'Deus criou o homem à sua imagem, à imagem de Deus o criou; homem e mulher os criou.' }
    ]
  },
  // Salmo 23 (22)
  'sl': {
    23: [
      { bookId: 'sl', chapter: 23, verse: 1, text: 'O Senhor é o meu pastor, nada me faltará.' },
      { bookId: 'sl', chapter: 23, verse: 2, text: 'Em verdes prados me faz descansar, conduz-me às águas refrescantes.' },
      { bookId: 'sl', chapter: 23, verse: 3, text: 'Restaura as minhas forças, guia-me pelos caminhos da justiça por amor do seu nome.' },
      { bookId: 'sl', chapter: 23, verse: 4, text: 'Ainda que eu caminhe pelo vale da sombra da morte, não temerei mal algum, porque tu estás comigo; o teu bordão e o teu cajado me consolam.' },
      { bookId: 'sl', chapter: 23, verse: 5, text: 'Preparas para mim uma mesa à vista dos meus inimigos; unges a minha cabeça com óleo, o meu cálice transborda.' },
      { bookId: 'sl', chapter: 23, verse: 6, text: 'Certamente a bondade e a misericórdia me acompanharão todos os dias da minha vida, e habitarei na casa do Senhor por longos dias.' }
    ],
    91: [
      { bookId: 'sl', chapter: 91, verse: 1, text: 'Tu que habitas sob a proteção do Altíssimo e moras à sombra do Onipotente,' },
      { bookId: 'sl', chapter: 91, verse: 2, text: 'dize ao Senhor: "Meu refúgio, minha fortaleza, meu Deus em quem confio!".' },
      { bookId: 'sl', chapter: 91, verse: 4, text: 'Ele te cobrirá com suas plumas e sob suas asas acharás refúgio; sua fidelidade é escudo e armadura.' },
      { bookId: 'sl', chapter: 91, verse: 11, text: 'Porque aos seus anjos dará ordens a teu respeito, para que te guardem em todos os teus caminhos.' }
    ]
  },
  // Tobias (Deuterocanônico)
  'tb': {
    1: [
      { bookId: 'tb', chapter: 1, verse: 1, text: 'Livro das palavras de Tobias, filho de Tobiel, filho de Ananiel, da tribo de Naftali.' },
      { bookId: 'tb', chapter: 1, verse: 3, text: 'Eu, Tobiel, andei nos caminhos da verdade e da justiça todos os dias da minha vida e fiz muitas esmolas aos meus irmãos.' },
      { bookId: 'tb', chapter: 1, verse: 12, text: 'Porque me lembrava de Deus com todo o meu coração, o Altíssimo deu-me graça e favor.' }
    ]
  },
  // Sabedoria (Deuterocanônico)
  'sb': {
    3: [
      { bookId: 'sb', chapter: 3, verse: 1, text: 'As almas dos justos estão na mão de Deus, e nenhum tormento as tocará.' },
      { bookId: 'sb', chapter: 3, verse: 2, text: 'Aos olhos dos insensatos pareciam ter morrido, mas eles estão em paz.' },
      { bookId: 'sb', chapter: 3, verse: 9, text: 'Os que nele confiam compreenderão a verdade, e os fiéis permanecerão junto dele no amor.' }
    ]
  },
  // São Mateus Cap 5 (Sermão da Montanha / Bem-Aventuranças)
  'mt': {
    5: [
      { bookId: 'mt', chapter: 5, verse: 1, text: 'Vendo as multidões, Jesus subiu ao monte e sentou-se. Os discípulos aproximaram-se dele,' },
      { bookId: 'mt', chapter: 5, verse: 2, text: 'e ele começou a ensiná-los, dizendo:' },
      { bookId: 'mt', chapter: 5, verse: 3, text: '"Bem-aventurados os pobres em espírito, porque deles é o Reino dos Céus.' },
      { bookId: 'mt', chapter: 5, verse: 4, text: 'Bem-aventurados os que choram, porque serão consolados.' },
      { bookId: 'mt', chapter: 5, verse: 5, text: 'Bem-aventurados os mansos, porque possuirão a terra.' },
      { bookId: 'mt', chapter: 5, verse: 6, text: 'Bem-aventurados os que têm fome e sede de justiça, porque serão saciados.' },
      { bookId: 'mt', chapter: 5, verse: 7, text: 'Bem-aventurados os misericordiosos, porque alcançarão misericórdia.' },
      { bookId: 'mt', chapter: 5, verse: 8, text: 'Bem-aventurados os puros de coração, porque verão a Deus.' },
      { bookId: 'mt', chapter: 5, verse: 9, text: 'Bem-aventurados os pacificadores, porque serão chamados filhos de Deus.' },
      { bookId: 'mt', chapter: 5, verse: 14, text: 'Vós sois a luz do mundo. Não se pode esconder uma cidade situada sobre um monte.' },
      { bookId: 'mt', chapter: 5, verse: 16, text: 'Assim brilhe a vossa luz diante dos homens, para que vejam as vossas boas obras e glorifiquem o vosso Pai que está nos céus."' }
    ]
  },
  // São João Cap 1
  'jo_ev': {
    1: [
      { bookId: 'jo_ev', chapter: 1, verse: 1, text: 'No princípio era o Verbo, e o Verbo estava junto de Deus, e o Verbo era Deus.' },
      { bookId: 'jo_ev', chapter: 1, verse: 2, text: 'Ele estava no princípio junto de Deus.' },
      { bookId: 'jo_ev', chapter: 1, verse: 14, text: 'E o Verbo se fez carne e habitou entre nós, e nós vimos a sua glória, glória como do Filho único do Pai, cheio de graça e de verdade.' }
    ],
    3: [
      { bookId: 'jo_ev', chapter: 3, verse: 16, text: 'Com efeito, Deus amou tanto o mundo que deu o seu Filho único, para que todo o que nele crer não pereça, mas tenha a vida eterna.' }
    ]
  },
  // 1 Coríntios 13 (Hino ao Amor)
  '1co': {
    13: [
      { bookId: '1co', chapter: 13, verse: 1, text: 'Ainda que eu falasse as línguas dos homens e dos anjos, se não tiver amor, sou como o bronze que ressoa ou o prato que retinir.' },
      { bookId: '1co', chapter: 13, verse: 4, text: 'O amor é paciente, o amor é prestativo; não é invejoso, não se envaidece, não se orgulha.' },
      { bookId: '1co', chapter: 13, verse: 7, text: 'Tudo desculpa, tudo crê, tudo espera, tudo suporta.' },
      { bookId: '1co', chapter: 13, verse: 13, text: 'Agora, pois, permanecem estas três coisas: a fé, a esperança e o amor; mas a maior delas é o amor.' }
    ]
  }
};

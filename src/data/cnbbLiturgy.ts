import { LiturgicalDay, LiturgyOfHours } from '../types';

export const TODAY_LITURGY: LiturgicalDay = {
  date: new Date().toLocaleDateString('pt-BR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
  title: 'Liturgia Diária Oficial da CNBB',
  color: 'verde',
  colorName: 'Verde (Tempo Comum)',
  season: 'Ordinário da Igreja / Tempo Comum',
  saintOfDay: {
    name: 'São Tiago Maior, Apóstolo',
    title: 'Apóstolo e Primeiro Mártir do Colégio Apostólico',
    imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800',
    biography: `São Tiago foi um dos doze apóstolos escolhidos por Nosso Senhor Jesus Cristo. Irmão de São João Evangelista, era filho de Zebedeu e Salomé. Testemunha ocular de milagres de Cristo como a Transfiguração no Monte Tabor e a Agonia no Horto das Oliveiras. Evangelizou a Península Ibérica e retornou a Jerusalém, onde sofreu o martírio no ano 44 d.C. sob o rei Herodes Agripa. Seus restos mortais repousam na Catedral de Santiago de Compostela, importante centro de peregrinação da Cristandade.`,
    prayer: `Ó Deus Todo-Poderoso, que pelo sangue de São Tiago consagrastes os primeiros frutos dos vossos Apóstolos, concedei que a vossa Igreja seja fortalecida por seu testemunho e sempre sustentada por sua proteção. Por Nosso Senhor Jesus Cristo, vosso Filho, na unidade do Espírito Santo. Amém.`
  },
  firstReading: {
    reference: '2 Coríntios 4, 7-15',
    text: `Irmãos: Trazemos esse tesouro em vasos de barro, para que todos reconheçam que este poder extraordinário vem de Deus e não de nós. Em tudo somos atribulados, mas não angustiados; perplexos, mas não desanimados; perseguidos, mas não desamparados; abatidos, mas não destruídos. Trazemos sempre em nosso corpo a morte de Jesus, para que também a vida de Jesus se manifeste em nosso corpo. De fato, nós, os vivos, somos entregues continuamente à morte por causa de Jesus, para que também a vida de Jesus se manifeste em nossa carne mortal.`
  },
  psalm: {
    reference: 'Salmo 125 (126)',
    response: 'Os que semeiam entre lágrimas, colherão com alegria.',
    stanzas: [
      'Quando o Senhor reconduziu os cativos de Sião, parecíamos sonhar.',
      'A nossa boca encheu-se de sorrisos, e a nossa língua de canções de alegria.',
      'Então se dizia entre as nações: "O Senhor fez por eles grandes coisas!"',
      'Sim, o Senhor fez por nós grandes coisas: fomos repletos de alegria!'
    ]
  },
  secondReading: {
    reference: 'Romanos 12, 1-2',
    text: `Rogo-vos, pois, irmãos, pelas misericórdias de Deus, que apresenteis os vossos corpos como um sacrifício vivo, santo e agradável a Deus, que é o vosso culto espiritual. Não vos conformeis com este mundo, mas transformai-vos pela renovação da vossa mente, para que possais experimentar qual seja a boa, agradável e perfeita vontade de Deus.`
  },
  gospel: {
    reference: 'São Mateus 20, 20-28',
    text: `Naquele tempo, a mãe dos filhos de Zebedeu aproximou-se de Jesus com seus filhos e ajoelhou-se para fazer um pedido. Jesus perguntou: "Que queres?" Ela respondeu: "Manda que estes meus dois filhos se sentem, no teu Reino, um à tua direita e outro à tua esquerda". Jesus respondeu: "Não sabeis o que estais pedindo. Podeis beber o cálice que eu vou beber?" Eles disseram: "Podemos". Jesus disse-lhes: "De fato, vós bebereis do meu cálice. Mas o sentar-se à minha direita ou à minha esquerda não depende de mim concedê-lo; é para aqueles a quem meu Pai o preparou".

Quando os outros dez apóstolos ouviram isso, ficaram zangados com os dois irmãos. Jesus então os chamou e disse: "Sabeis que os governantes das nações as dominam e os grandes as oprimem. Entre vós não deve ser assim. Quem quiser tornar-se grande entre vós, seja aquele que vos serve; e quem quiser ser o primeiro entre vós, seja vosso servo. Pois o Filho do Homem não veio para ser servido, mas para servir e dar a sua vida em resgate por muitos".`
  },
  reflection: `O Evangelho de hoje coloca diante de nós uma das lições fundamentais do cristianismo: a grandeza no Reino de Deus não se mede por títulos, autoridade temporal ou privilégios, mas pelo espírito de serviço humilde e desinteressado.

Ao pedir os primeiros lugares para seus filhos, a mãe de Tiago e João refletia uma mentalidade puramente humana de poder. Jesus, porém, redireciona o olhar para o mistério do Cálice e da Cruz. Beber o cálice de Cristo significa aceitar a doação total de si por amor a Deus e ao próximo.

São Tiago compreendeu essa lição com profundidade: foi o primeiro dos apóstolos a derramar seu sangue por Cristo em Jerusalém. Na nossa vida diária, servir a família, os irmãos necessitados e a comunidade é o caminho autêntico para se estar à direita do Pai.`
};

export const LITURGY_OF_HOURS: LiturgyOfHours = {
  laudes: {
    title: 'Laudes - Oração da Manhã',
    hymn: 'Já o sol luminoso se levanta: Oremos a Deus com alma santa, Para que em nossas obras durante o dia, A luz do Espírito seja nossa guia.',
    psalms: [
      {
        title: 'Salmo 62 (63) - A sede de Deus',
        ref: 'Sl 62, 2-9',
        text: 'Ó Deus, vós sois o meu Deus, por vós madrugo. A minha alma tem sede de vós, minha carne vos deseja com ardor, como terra seca, esgotada e sem água.'
      },
      {
        title: 'Cântico dos Três Jovens - Louvor das Criaturas',
        ref: 'Dn 3, 57-88',
        text: 'Obras do Senhor, bendizei todas ao Senhor, louvai-o e exaltai-o pelos séculos sem fim. Anjos do Senhor, bendizei ao Senhor!'
      }
    ],
    shortReading: 'Efésios 4, 29-32: Não saia da vossa boca nenhuma palavra má, mas só a que for boa para a edificação, segundo a necessidade, a fim de conceder graça aos que a ouvem.',
    bendictus: 'Bendito seja o Senhor Deus de Israel, porque visitou e redimiu o seu povo e nos suscitou uma força de salvação na casa de Davi, seu servo.',
    intercessions: [
      'Seja louvado o Senhor que nos concedeu a luz deste novo dia.',
      'Sustentai a Santa Igreja Católica e o Papa, com todos os bispos da CNBB.',
      'Abençoai os doentes, aflitos e desempregados com a vossa consolação divina.'
    ],
    prayer: 'Deus eterno e todo-poderoso, iluminai a nossa mente com a clareza da vossa verdade, para que em todas as ações de hoje caminhemos sob a vossa santa lei. Por Cristo Nosso Senhor. Amém.'
  },
  horaMedia: {
    title: 'Hora Média (Terça / Sexta / Nona)',
    hymn: 'Ó Deus da verdade e do poder, que regeis o universo com sabedoria, fazei brilhar o sol da tarde e pacificai nossos corações.',
    psalms: [
      {
        title: 'Salmo 118 (119) - Meditação da Lei do Senhor',
        ref: 'Sl 118, 105-112',
        text: 'Lâmpada para os meus pés é a tua palavra e luz para o meu caminho. Jurei e cumprirei guardar os teus justos juízos.'
      }
    ],
    shortReading: '1 Pedro 1, 15-16: Como é santo aquele que vos chamou, sede vós também santos em toda a vossa conduta, porque está escrito: Sereis santos, porque eu sou santo.',
    prayer: 'Senhor Jesus Cristo, que na Hora Média subistes à Cruz para a salvação do mundo, concedei-nos a graça de vos amar sempre mais. Amém.'
  },
  vesperas: {
    title: 'Vésperas - Oração da Tarde',
    hymn: 'Ó Luz resplandecente da Santa Glória do Pai celeste, Jesus Cristo Senhor nosso! Chegando ao pôr do sol, louvamos o Pai, o Filho e o Espírito Santo.',
    psalms: [
      {
        title: 'Salmo 140 (141) - Oração da Tarde',
        ref: 'Sl 140, 1-9',
        text: 'Senhor, a vós clamo, escutai-me; atendei à minha voz quando a vós brado! Suba a minha oração como incenso à vossa presença, e o elevar de minhas mãos como sacrifício vespertino.'
      }
    ],
    shortReading: '1 Tessalonicenses 5, 23: O mesmo Deus da paz vos santifique totalmente, e o vosso ser inteiro, espírito, alma e corpo, seja guardado irrepreensível para a vinda de Nosso Senhor Jesus Cristo.',
    magnificat: 'A minha alma engrandece ao Senhor, e o meu espírito se alegra em Deus, meu Salvador, porque olhou para a humilhação de sua serva.',
    intercessions: [
      'Agradecemos, Senhor, pelas graças recebidas no decorrer deste dia.',
      'Concedei o descanso eterno a todos os fiéis defuntos.',
      'Protegei as nossas famílias sob o manto sagrado de Nossa Senhora Aparecida.'
    ],
    prayer: 'Permanecei conosco, Senhor, pois a noite se aproxima. Sede a nossa luz e a nossa força divina. Por Cristo Nosso Senhor. Amém.'
  },
  completas: {
    title: 'Completas - Oração antes do Repouso da Noite',
    hymn: 'Antes que a luz do dia se apague, nós vos pedimos, Criador do universo, que por vossa habitual misericórdia nos guardeis e protejais.',
    psalms: [
      {
        title: 'Salmo 90 (91) - Sob a proteção do Altíssimo',
        ref: 'Sl 90, 1-16',
        text: 'Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará. Direi do Senhor: Ele é o meu refúgio e a minha fortaleza, o meu Deus, em quem confio.'
      }
    ],
    shortReading: 'Jeremias 14, 9: Tu estás em nosso meio, Senhor, e o teu Nome foi invocado sobre nós; não nos abandones, Senhor nosso Deus!',
    nuncDimittis: 'Agora, Senhor, podes deixar ir em paz o teu servo, segundo a tua palavra; porque os meus olhos viram a tua salvação.',
    prayer: 'Visitai, Senhor, esta nossa casa e afastai dela todas as insídias do inimigo; habitem nela os vossos santos anjos para nos guardar em paz, e a vossa bênção esteja sempre conosco. Por Cristo Nosso Senhor. Amém.'
  }
};

export const ROMAN_MISSAL_PARTS = [
  {
    section: 'Ritos Iniciais',
    parts: [
      { title: 'Cântico de Entrada e Procissão', text: 'Enquanto o sacerdote e os ministros se dirigem ao altar, entoa-se o cântico de entrada.' },
      { title: 'Saudação do Bispo/Sacerdote', text: 'Em nome do Pai, e do Filho, e do Espírito Santo. Amém. A graça de Nosso Senhor Jesus Cristo, o amor do Pai e a comunhão do Espírito Santo estejam convosco. R: Bendito seja Deus que nos reuniu no amor de Cristo.' },
      { title: 'Ato Penitencial', text: 'Confesso a Deus Todo-Poderoso e a vós, irmãos e irmãs, que pequei muitas vezes por pensamentos e palavras, atos e omissões, por minha culpa, minha tão grande culpa. E peço à Virgem Maria, aos Anjos e Santos, e a vós, irmãos e irmãs, que rogueis por mim a Deus, Nosso Senhor.' },
      { title: 'Hino de Louvor (Glória)', text: 'Glória a Deus nas alturas, e paz na terra aos homens por Ele amados! Senhor Deus, Rei dos céus, Deus Pai Todo-Poderoso...' },
      { title: 'Oração Coleta', text: 'O sacerdote diz: Oremos. E rezamos em silêncio juntando nossas intenções.' }
    ]
  },
  {
    section: 'Liturgia da Palavra',
    parts: [
      { title: 'Primeira Leitura', text: 'Proclamação da Palavra de Deus extraída do Antigo Testamento ou dos Atos dos Apóstolos.' },
      { title: 'Salmo Responsorial', text: 'Resposta meditativa da assembleia à Leitura proclamada.' },
      { title: 'Segunda Leitura', text: 'Proclamação extraída das Epístolas dos Apóstolos aos primeiros cristãos.' },
      { title: 'Aclamação ao Evangelho', text: 'Cântico do Aleluia em aclamação a Cristo presente em sua Palavra.' },
      { title: 'Evangelho e Homilia', text: 'Proclamação solene por diácono ou sacerdote, seguida da explicação e aplicação pastoral.' },
      { title: 'Profissão de Fé (Credo)', text: 'Creio em um só Deus, Pai Todo-Poderoso, Criador do céu e da terra...' },
      { title: 'Oração dos Fiéis', text: 'Súplicas da Igreja pela Santa Sé, pelo povo de Deus, pela paz e necessitados.' }
    ]
  },
  {
    section: 'Liturgia Eucarística',
    parts: [
      { title: 'Apresentação das Oferendas', text: 'O pão de trigo e o vinho de uva pura são levados ao altar.' },
      { title: 'Oração Eucarística (Prefácio e Canon)', text: 'A grande oração de ação de graças, invocação do Espírito Santo (Epiclese) e Consagração.' },
      { title: 'Momento da Consagração', text: 'O pão torna-se o Corpo de Cristo; o vinho torna-se o Sangue de Cristo por transubstanciação.' }
    ]
  },
  {
    section: 'Rito da Comunhão e Ritos Finais',
    parts: [
      { title: 'Oração do Pai Nosso', text: 'Rezada pela assembleia reunida em espírito de fraternidade.' },
      { title: 'Abraço da Paz e Cordeiro de Deus', text: 'Cordeiro de Deus que tirais o pecado do mundo, tende piedade de nós.' },
      { title: 'Sagrada Comunhão', text: 'Eis o Cordeiro de Deus, que tira o pecado do mundo. Senhor, eu não sou digno de que entreis em minha morada...' },
      { title: 'Bênção Final e Envio', text: 'O Senhor esteja convosco. A bênção de Deus Todo-Poderoso... Ide em paz e o Senhor vos acompanhe.' }
    ]
  }
];

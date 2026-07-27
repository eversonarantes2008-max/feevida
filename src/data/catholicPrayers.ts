import { CatholicPrayer, Novena, RosaryMystery, SaintInfo, ViaSacraStation } from '../types';

export const ROSARY_MYSTERIES: Record<string, RosaryMystery> = {
  gozosos: {
    name: 'Mistérios Gozosos (Segundas e Sábados)',
    day: 'Segunda-feira e Sábado',
    mysteries: [
      {
        number: 1,
        title: 'A Anunciação do Anjo Gabriel à Virgem Maria',
        fruit: 'Humildade e Aceitação da Vontade Divina',
        biblicalRef: 'Lc 1, 26-38',
        meditation: 'Contemplamos o instante em que o Arcanjo Gabriel anuncia à Virgem de Nazaré que ela seria a Mãe do Redentor. Maria respondeu com o seu generoso "Fiat": "Eis aqui a serva do Senhor, faça-se em mim segundo a tua palavra".',
        imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 2,
        title: 'A Visitação de Nossa Senhora a sua prima Santa Isabel',
        fruit: 'Caridade Fraterna e Serviço',
        biblicalRef: 'Lc 1, 39-56',
        meditation: 'Maria parte apressadamente para as montanhas da Judeia para auxiliar sua prima Isabel. Ao som da saudação de Maria, o Menino João Batista estremeceu de alegria no ventre de sua mãe.',
        imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 3,
        title: 'O Nascimento do Menino Jesus na Gruta de Belém',
        fruit: 'Desapego dos bens materiais e Amor à Pobreza Espiritual',
        biblicalRef: 'Lc 2, 1-20',
        meditation: 'O Rei dos reis nasce na pobreza de uma manjedoura em Belém, envolto em panos, adorado por Maria, José, pelos anjos no céu e pelos humildes pastores.',
        imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 4,
        title: 'A Apresentação do Menino Jesus no Templo e Purificação de Maria',
        fruit: 'Obediência à Lei de Deus e Pureza',
        biblicalRef: 'Lc 2, 22-38',
        meditation: 'Em obediência à Lei, Maria e José levam o Menino Jesus ao Templo de Jerusalém. O profeta Simeão o acolhe nos braços e profetiza que uma espada de dor traspassará o coração de Maria.',
        imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 5,
        title: 'A Perda e o Encontro do Menino Jesus no Templo',
        fruit: 'Busca incessante por Jesus e Sabedoria',
        biblicalRef: 'Lc 2, 41-52',
        meditation: 'Após três dias de aflita busca, Maria e José encontram Jesus no Templo, sentado no meio dos doutores da Lei, ouvindo-os e fazendo-lhes perguntas sobre o Pai.',
        imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  luminosos: {
    name: 'Mistérios Luminosos (Quintas-feiras)',
    day: 'Quinta-feira',
    mysteries: [
      {
        number: 1,
        title: 'O Batismo de Jesus no Rio Jordão',
        fruit: 'Fidelidade às Promessas do Batismo',
        biblicalRef: 'Mt 3, 13-17',
        meditation: 'Jesus é batizado por São João Batista. O céu se abre, o Espírito Santo desce em forma de pomba e a voz do Pai declara: "Este é o meu Filho amado, em quem me comprazo".',
        imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 2,
        title: 'A Auto-revelação de Jesus nas Bodas de Caná',
        fruit: 'Confiança na Intercessão de Maria',
        biblicalRef: 'Jo 2, 1-12',
        meditation: 'Atendendo ao pedido maternal de Nossa Senhora ("Fazei tudo o que Ele vos disser"), Jesus realiza seu primeiro milagre, transformando água em vinho excelente.',
        imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 3,
        title: 'O Anúncio do Reino de Deus e o Convite à Conversão',
        fruit: 'Conversão de Coração e Santidade',
        biblicalRef: 'Mc 1, 14-15',
        meditation: 'Jesus proclama a boa nova do Reino de Deus, perdoa os pecados dos contritos e convida todos os homens a mudarem de vida com fé e esperança.',
        imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 4,
        title: 'A Transfiguração do Senhor no Monte Tabor',
        fruit: 'Desejo da Glória Celestial',
        biblicalRef: 'Mt 17, 1-8',
        meditation: 'Jesus manifesta sua glória divina diante de Pedro, Tiago e João. Seu rosto brilha como o sol e suas vestes tornam-se alvas como a luz.',
        imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 5,
        title: 'A Instituição da Santíssima Eucaristia na Última Ceia',
        fruit: 'Devoção Eucarística e Amor à Santa Missa',
        biblicalRef: 'Mt 26, 26-29',
        meditation: 'Na véspera de sua Paixão, Jesus dá aos apóstolos seu próprio Corpo e Sangue sob as espécies do pão e do vinho, instituindo o Sacerdócio e o Sacramento do Altar.',
        imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  dolorosos: {
    name: 'Mistérios Dolorosos (Terças e Sextas)',
    day: 'Terça-feira e Sexta-feira',
    mysteries: [
      {
        number: 1,
        title: 'A Agonia de Jesus no Horto das Oliveiras',
        fruit: 'Contrição dos Pecados e Oração Fervorosa',
        biblicalRef: 'Lc 22, 39-46',
        meditation: 'No Getsemani, em profunda agonia mental e espiritual, Jesus suor gotas de sangue enquanto orava: "Pai, se queres, afasta de mim este cálice; contudo, não se faça a minha vontade, mas a tua".',
        imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 2,
        title: 'A Flagelação de Nosso Senhor atado à Coluna',
        fruit: 'MORTIFICAÇÃO dos Sentidos e Pureza',
        biblicalRef: 'Mt 27, 26',
        meditation: 'Por ordem de Pôncio Pilatos, o Santo dos Santos é despido e impiedosamente açoitado pelos soldados romanos, oferecendo suas chagas pela redenção dos nossos pecados da carne.',
        imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 3,
        title: 'A Coroação de Espinhos de Nosso Senhor',
        fruit: 'Humildade e Supressão do Orgulho',
        biblicalRef: 'Mt 27, 27-31',
        meditation: 'Os soldados trançam uma coroa de espinhos pontiagudos, cravam-na na cabeça sagrada de Jesus, vestem-no de púrpura e escarnecem dele ajoelhando-se: "Salve, Rei dos Judeus!".',
        imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 4,
        title: 'O Carregamento da Cruz a caminho do Calvário',
        fruit: 'Paciência no Sofrimento e Aceitação das Cruzes',
        biblicalRef: 'Jo 19, 16-17',
        meditation: 'Esgotado e ferido, Jesus carrega o pesado lenho da Cruz pelas ruas de Jerusalém até o Monte Calvário, caindo por três vezes e encontrando sua Mãe Santíssima no trajeto.',
        imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 5,
        title: 'A Crucificação e Morte de Jesus na Cruz',
        fruit: 'Perdão aos inimigos e Amor de Redenção',
        biblicalRef: 'Lc 23, 33-46',
        meditation: 'Pregado na Cruz entre dois ladrões, após três horas de imensa agonia, Jesus perdoa seus algozes, nos entrega Maria por Mãe na pessoa de São João e entrega seu Espírito ao Pai.',
        imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  gloriosos: {
    name: 'Mistérios Gloriosos (Quartas-feiras e Domingos)',
    day: 'Quarta-feira e Domingo',
    mysteries: [
      {
        number: 1,
        title: 'A Ressurreição de Nosso Senhor Jesus Cristo',
        fruit: 'Fé Viva e Vitória sobre a Morte',
        biblicalRef: 'Mt 28, 1-10',
        meditation: 'No domingo de manhã, o túmulo está vazio! Cristo ressuscita glorioso e triunfante, vencendo a morte e o pecado, garantindo a nossa futura ressurreição corporal.',
        imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 2,
        title: 'A Ascensão de Nosso Senhor ao Céu',
        fruit: 'Esperança Celeste e Desejo das Coisas do Alto',
        biblicalRef: 'At 1, 6-11',
        meditation: 'Quarenta dias após a Ressurreição, no Monte das Oliveiras, Jesus eleva-se aos céus diante dos seus apóstolos e senta-se à direita de Deus Pai Todo-Poderoso.',
        imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 3,
        title: 'A Vinda do Espírito Santo sobre Maria e os Apóstolos (Pentecostes)',
        fruit: 'Amor de Deus e Dons do Espírito Santo',
        biblicalRef: 'At 2, 1-13',
        meditation: 'Reunidos no Cenáculo em oração com a Virgem Maria, línguas como de fogo pousam sobre cada um e os apóstolos ficam cheios do Espírito Santo, pregando com intrepidez.',
        imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 4,
        title: 'A Assunção de Nossa Senhora ao Céu em Corpo e Alma',
        fruit: 'Devoção Filial a Maria e Boa Morte',
        biblicalRef: 'Ap 12, 1',
        meditation: 'Concluído o curso de sua vida terrena, a Mãe de Deus é elevada em corpo e alma à glória celestial pelos anjos do Senhor.',
        imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800'
      },
      {
        number: 5,
        title: 'A Coroação de Nossa Senhora como Rainha do Céu e da Terra',
        fruit: 'Perseverança Final e Confiança na Rainha dos Anjos',
        biblicalRef: 'Ap 12, 1-6',
        meditation: 'A Santíssima Trindade coroa a Virgem Maria com doze estrelas no céu, constituindo-a Rainha dos Anjos, dos Santos, das Famílias e de toda a criação.',
        imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800'
      }
    ]
  }
};

export const VIA_SACRA_STATIONS: ViaSacraStation[] = [
  {
    number: 1,
    title: 'Jesus é condenado à Morte',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'Pilatos lava as mãos e condena o Inocente. Quantas vezes nós condenamos nossos irmãos com julgamentos apressados e falsos testemunhos?',
    imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 2,
    title: 'Jesus carrega a Cruz às costas',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'Jesus abraça o pesado lenho de nossas culpas. Peçamos a graça de carregar nossas cruzes diárias sem murmuração.',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 3,
    title: 'Jesus cai pela primeira vez',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'O peso dos nossos pecados prostra o Salvador por terra. Ele se levanta para nos ensinar a erguer da queda do pecado.',
    imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 4,
    title: 'Jesus encontra sua Mãe Santíssima',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'Que dor imensa no olhar de Mãe e Filho! Que Maria nos fortaleça nas horas de angústia e aflição familiar.',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 5,
    title: 'Simão de Cirene ajuda Jesus a carregar a Cruz',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'Cireneu alivia os ombros sagrados do Senhor. Sejamos também nós consoladores dos irmãos que sofrem.',
    imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 6,
    title: 'A Verônica enxuga o Rosto de Jesus',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'Uma mulher piedosa enxuga o suor e o sangue de Cristo, recebendo em recompensa a Sagrada Face impressa no véu.',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 7,
    title: 'Jesus cai pela segunda vez',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'As feridas se reabrem, as forças humanas se esgotam. Jesus persevera até o fim por amor a nós.',
    imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 8,
    title: 'Jesus consola as mulheres de Jerusalém',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: '"Não choreis por mim, chorai por vós e por vossos filhos". Jesus convida ao choro de verdadeira conversão.',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 9,
    title: 'Jesus cai pela terceira vez',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'A poucos passos do Calvário, a extrema prostração. O amor divinal o impele a se erguer novamente.',
    imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 10,
    title: 'Jesus é despojado de suas vestes',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'Tiram-lhe as túnicas coladas às feridas. Que o Senhor purifique nosso coração de todo apego e vanglória.',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 11,
    title: 'Jesus é pregado na Cruz',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'Os cravos atravessam mãos e pés. Do alto da Cruz ele perdoa: "Pai, perdoa-lhes, eles não sabem o que fazem".',
    imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 12,
    title: 'Jesus morre na Cruz',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: '"Tudo está consumado! Pai, em tuas mãos entrego o meu espírito". (Silêncio e genuflexão).',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 13,
    title: 'Jesus é retirado da Cruz e entregue a sua Mãe (Pietà)',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'Maria acolhe no colo o Corpo inerte de seu Filho. Ó Mãe das Dores, rogai por nós!',
    imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800'
  },
  {
    number: 14,
    title: 'Jesus é depositado no Sepulcro',
    prayer: 'Nós vos adoramos, ó Cristo, e vos bendizemos. Porque pela vossa Santa Cruz remistes o mundo.',
    reflection: 'A grande pedra fecha o túmulo. A Igreja aguarda na esperança a luz da manhã da Ressurreição.',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800'
  }
];

export const CATHOLIC_PRAYERS_COLLECTION: CatholicPrayer[] = [
  {
    id: 'pai-nosso',
    title: 'Pai Nosso (Oração do Senhor)',
    category: 'Diárias',
    content: `Pai Nosso que estais nos céus, santificado seja o vosso nome, venha a nós o vosso reino, seja feita a vossa vontade assim na terra como no céu. O pão nosso de cada dia nos dai hoje, perdoai-nos as nossas ofensas assim como nós perdoamos a quem nos tem ofendido, e não nos deixeis cair em tentação, mas livrai-nos do mal. Amém.`,
    latinContent: `Pater noster, qui es in caelis, sanctificetur nomen tuum. Adveniat regnum tuum. Fiat voluntas tua, sicut in caelo et in terra. Panem nostrum quotidianum da nobis hodie, et dimitte nobis debita nostra sicut et nos dimittimus debitoribus nostris. Et ne nos inducas in tentationem, sed libera nos a malo. Amen.`
  },
  {
    id: 'ave-maria',
    title: 'Ave Maria',
    category: 'Nossa Senhora',
    content: `Ave Maria, cheia de graça, o Senhor é convosco, bendita sois vós entre as mulheres e bendito é o fruto do vosso ventre, Jesus. Santa Maria, Mãe de Deus, rogai por nós pecadores, agora e na hora da nossa morte. Amém.`,
    latinContent: `Ave Maria, gratia plena, Dominus tecum. Benedicta tu in mulieribus, et benedictus fructus ventris tui, Iesus. Sancta Maria, Mater Dei, ora pro nobis peccatoribus, nunc et in hora mortis nostrae. Amen.`
  },
  {
    id: 'credo',
    title: 'Símbolo dos Apóstolos (Creio)',
    category: 'Diárias',
    content: `Creio em Deus Pai Todo-Poderoso, Criador do céu e da terra. E em Jesus Cristo, seu único Filho, nosso Senhor, que foi concebido pelo poder do Espírito Santo, nasceu da Virgem Maria, padeceu sob Pôncio Pilatos, foi crucificado, morto e sepultado. Desceu à mansão dos mortos; ressuscitou ao terceiro dia; subiu aos céus, está sentado à direita de Deus Pai Todo-Poderoso, donde há de vir a julgar os vivos e os mortos. Creio no Espírito Santo, na Santa Igreja Católica, na comunhão dos santos, na remissão dos pecados, na ressurreição da carne, na vida eterna. Amém.`
  },
  {
    id: 'salve-rainha',
    title: 'Salve Rainha',
    category: 'Nossa Senhora',
    content: `Salve, Rainha, Mãe de misericórdia, vida, doçura e esperança nossa, salve! A vós bradamos os degredados filhos de Eva. A vós suspiramos, gemendo e chorando neste vale de lágrimas. Eia, pois, advogada nossa, esses vossos olhos misericordiosos a nós voltei, e depois deste desterro mostrai-nos Jesus, bendito fruto do vosso ventre, ó clemente, ó piedosa, ó doce sempre Virgem Maria. Rogai por nós, Santa Mãe de Deus, para que sejamos dignos das promessas de Cristo. Amém.`
  },
  {
    id: 'santo-anjo',
    title: 'Santo Anjo do Senhor',
    category: 'Anjos e Santos',
    content: `Santo Anjo do Senhor, meu zeloso guardador, já que a ti me confiou a piedade divina, sempre me rege, me guarda, me governa e me ilumina. Amém.`
  },
  {
    id: 'sao-miguel',
    title: 'Oração a São Miguel Arcanjo',
    category: 'Proteção e Liberação',
    content: `São Miguel Arcanjo, defendei-nos no combate, sede o nosso refúgio contra as maldades e ciladas do demônio. Ordene-lhe Deus, instantemente o pedimos, e vós, príncipe da milícia celeste, pela virtude divina, precipitai no inferno a Satanás e a todos os espíritos malignos, que vagam pelo mundo para perder as almas. Amém.`
  },
  {
    id: 'sao-bento',
    title: 'Oração da Cruz de São Bento',
    category: 'Proteção e Liberação',
    content: `A Cruz Sagrada seja a minha Luz! Não seja o dragão o meu guia! Retira-te, Satanás! Nunca me aconselhes coisas vãs! É mau o que tu me ofereces, bebe tu mesmo o teu veneno! Em nome do Pai, do Filho e do Espírito Santo. Amém.`
  },
  {
    id: 'consagracao-nossa-senhora',
    title: 'Consagração a Nossa Senhora',
    category: 'Nossa Senhora',
    content: `Ó minha Senhora e minha Mãe, eu me ofereço todo a vós e, em prova da minha devoção para convosco, vos dou neste dia meus olhos, meus ouvidos, minha boca, meu coração e todo o meu ser. E porque sou vosso, ó incomparável Mãe, guardai-me e defendei-me como coisa e propriedade vossa. Amém.`
  },
  {
    id: 'gloria-ao-pai',
    title: 'Glória ao Pai',
    category: 'Diárias',
    content: `Glória ao Pai e ao Filho e ao Espírito Santo. Como era no princípio, agora e sempre. Amém.`,
    latinContent: `Gloria Patri, et Filio, et Spiritui Sancto. Sicut erat in principio, et nunc, et semper, et in saecula saeculorum. Amen.`
  },
  {
    id: 'angelus',
    title: 'Oração do Ângelus (Manhã, Meio-Dia e Tarde)',
    category: 'Diárias',
    content: `V. O Anjo do Senhor anunciou a Maria.\nR. E ela concebeu do Espírito Santo. (Ave Maria...)\n\nV. Eis aqui a serva do Senhor.\nR. Faça-se em mim segundo a vossa palavra. (Ave Maria...)\n\nV. E o Verbo se fez carne.\nR. E habitou entre nós. (Ave Maria...)\n\nV. Rogai por nós, Santa Mãe de Deus.\nR. Para que sejamos dignos das promessas de Cristo.\n\nOremos: Infundi, Senhor, a vossa graça em nossas almas, para que nós, que conhecemos pela anunciação do Anjo a encarnação de Jesus Cristo, vosso Filho, cheguemos, pela sua paixão e cruz, à glória da ressurreição. Pelo mesmo Cristo, nosso Senhor. Amém.`
  },
  {
    id: 'ato-de-contricao',
    title: 'Ato de Contrição (Para o Sacramento da Confissão)',
    category: 'Eucaristia e Adoração',
    content: `Meu Deus, eu me arrependo de todo o coração de vos ter ofendido, porque sois infinitamente bom e digno de ser amado sobre todas as coisas. Proponho firmemente, com a ajuda da vossa graça, não mais pecar e fugir das ocasiões de pecado. Amém.`
  },
  {
    id: 'comunhao-espiritual',
    title: 'Oração de Comunhão Espiritual (Santo Afonso de Ligório)',
    category: 'Eucaristia e Adoração',
    content: `Meu Jesus, eu creio que estais realmente presente no Santíssimo Sacramento do Altar. Amo-vos sobre todas as coisas e desejo receber-vos em minha alma. Já que não posso receber-vos agora sacramentalmente, vinde ao menos espiritualmente ao meu coração. Abraço-me a Vós como se já estivésseis comigo e uno-me inteiramente a Vós; não permitais que eu me separe de Vós. Amém.`
  },
  {
    id: 'sao-francisco',
    title: 'Oração de São Francisco de Assis',
    category: 'Familia e Paz',
    content: `Senhor, fazei-me instrumento de vossa paz. Onde houver ódio, que eu leve o amor; onde houver ofensa, que eu leve o perdão; onde houver discórdia, que eu leve a união; onde houver dúvida, que eu leve a fé; onde houver erro, que eu leve a verdade; onde houver desespero, que eu leve a esperança; onde houver tristeza, que eu leve a alegria; onde houver trevas, que eu leve a luz. Ó Mestre, fazei que eu procure mais consolar que ser consolado; compreender que ser compreendido; amar que ser amado. Pois é dando que se recebe, é perdoando que se é perdoado, e é morrendo que se vive para a vida eterna. Amém.`
  },
  {
    id: 'sao-pio-fica-comigo',
    title: 'Fica Comigo, Senhor (Oração de Padre Pio)',
    category: 'Eucaristia e Adoração',
    content: `Fica comigo, Senhor, porque é necessária a Tua presença para não Te esquecer. Tu sabes quão facilmente Te abandono. Fica comigo, Senhor, porque sou fraco e preciso da Tua força para não cair tantas vezes. Fica comigo, Senhor, porque Tu és a minha luz e sem Ti estou nas trevas. Fica comigo, Senhor, para me mostrar a Tua vontade. Fica comigo, Senhor, para que ouça a Tua voz e Te siga. Amém.`
  },
  {
    id: 'ladainha-nossa-senhora',
    title: 'Ladainha de Nossa Senhora (Loreto)',
    category: 'Nossa Senhora',
    content: `Senhor, tende piedade de nós.\nCristo, tende piedade de nós.\nSanta Maria, rogai por nós.\nSanta Mãe de Deus, rogai por nós.\nMãe da divina graça, Mãe puríssima, Mãe castíssima,\nEspelho de justiça, Sede de sabedoria,\nCausa da nossa alegria, Rosa mística,\nTorre de Davi, Casa de ouro, Arca da aliança,\nPorta do céu, Estrela da manhã,\nSaúde dos enfermos, Refúgio dos pecadores,\nConsoladora dos aflitos, Auxílio dos cristãos,\nRainha dos Anjos, Rainha de todos os Santos,\nRainha da família, Rainha da paz. Amém.`
  }
];

export const SAINTS_DATABASE: SaintInfo[] = [
  {
    id: 'ns-aparecida',
    name: 'Nossa Senhora Aparecida',
    feastDay: '12 de Outubro',
    patronage: 'Padroeira Principal do Brasil',
    imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800',
    summary: 'A imagem sagrada da Imaculada Conceição encontrada milagrosamente nas águas do Rio Paraíba do Sul em 1717.',
    biography: 'Em outubro de 1717, os pescadores Domingos Martins Alves, João Alves e Felipe Pedroso foram incumbidos de pescar para o banquete do Conde de Assumar. Após horas de tentativas frustradas, tiraram do rio o corpo da imagem de Nossa Senhora e, em seguida, a cabeça. Logo após unirem as partes, os pescadores lançaram as redes e obtiveram uma fartura milagrosa de peixes. Desde então, as graças e milagres multiplicaram-se por todo o solo brasileiro.',
    prayer: 'Ó Imaculada Virgem Maria, Mãe de Deus e nossa Mãe, que vos dignastes manifestar a vossa presença através da imagem milagrosa de Aparecida, olhai benigna para a nossa amada Pátria e abençoai as nossas famílias. Amém.'
  },
  {
    id: 'sao-jose',
    name: 'São José, Castíssimo Esposo de Maria',
    feastDay: '19 de Março / 1º de Maio',
    patronage: 'Padroeiro da Igreja Universal e das Famílias',
    imageUrl: 'https://images.unsplash.com/photo-1519817650390-64a93db51149?auto=format&fit=crop&q=80&w=800',
    summary: 'Homem justo da linhagem de Davi, guardião da Sagrada Família e pai adotivo de Nosso Senhor Jesus Cristo.',
    biography: 'São José personifica a fé silenciosa, obediência pronta e amor sacrificial. Escolhido por Deus para ser o protetor do Menino Jesus e de Nossa Senhora, ensinou o ofício da carpintaria ao Redentor. É o santo a quem a Igreja recorre com inteira confiança nas necessidades espirituais e materiais.',
    prayer: 'Ó glorioso São José, a quem foi dado o privilégio de abraçar e educar o Filho de Deus, protegei as nossas famílias, abençoai o nosso trabalho diário e alcançai-nos uma boa e santa morte. Amém.'
  },
  {
    id: 'santo-antonio',
    name: 'Santo Antônio de Pádua',
    feastDay: '13 de Junho',
    patronage: 'Doutor da Igreja, Padroeiro dos Pobres',
    imageUrl: 'https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&q=80&w=800',
    summary: 'Franciscano português famoso por sua profunda sabedoria bíblica, eloqüência na pregação e prodígios inumeráveis.',
    biography: 'Nascido em Lisboa em 1195, ingressou na Ordem dos Frades Menores impulsionado pelo desejo do martírio. Famoso pelos milagres da multiplicação de pães para os pobres e a pregação aos peixes, Santo Antônio carrega nos braços o Menino Jesus que lhe apareceu visivelmente em oração.',
    prayer: 'Lembrai-vos, ó glorioso Santo Antônio, que nunca se ouviu dizer que alguém que tenha recorrido à vossa proteção tenha sido por vós desamparado. Atendei a minha prece com o vosso amor compassivo. Amém.'
  },
  {
    id: 'santa-teresinha',
    name: 'Santa Teresinha do Menino Jesus',
    feastDay: '1º de Outubro',
    patronage: 'Padroeira das Missões e Doutora da Igreja',
    imageUrl: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?auto=format&fit=crop&q=80&w=800',
    summary: 'Mística carmelita francesa que ensinou a "Pequena Via" da infância espiritual e confiança total em Deus.',
    biography: 'Entrou no Carmelo de Lisieux aos 15 anos. Sua vida simples caracterizou-se pela doação diária de pequenos sacrifícios com infinito amor. Prometeu passar o seu céu fazendo o bem sobre a terra e derramando uma chuva de rosas de graças sobre os fiéis.',
    prayer: 'Ó Santa Teresinha do Menino Jesus, que prometestes fazer cair uma chuva de rosas sobre o mundo, alcançai-me de Deus a graça que ardentemente vos peço nesta intenção. Amém.'
  }
];

export const NOVENA_DESATADORA: Novena = {
  id: 'desatadora-nos',
  title: 'Novena de Nossa Senhora Desatadora dos Nós',
  subtitle: 'Para desatar os nós das dificuldades financeiras, familiares e espirituais',
  imageUrl: 'https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800',
  days: Array.from({ length: 9 }, (_, i) => ({
    day: i + 1,
    theme: `Dia ${i + 1}: Confiança na Mãe de Deus`,
    intention: `Desatar os nós da falta de fé e das preocupações do dia ${i + 1}`,
    prayer: `Santa Maria, cheia da presença de Deus, durante os dias de vossa vida aceitastes com toda a humildade a vontade do Pai, e o maligno nunca foi capaz de vos envolver com suas confusões. Junto a vosso Filho, intercedestes por nossas dificuldades e, com toda simplicidade e paciência, nos destes exemplo de como desenrolar o novelo de nossas vidas. Mãe amada, desatai os nós que sufocam a minha alma. Amém.`
  }))
};

export type UserRole = 'user' | 'admin';

export type PaymentStatus = 'pending' | 'approved' | 'rejected';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatarUrl?: string;
  role: UserRole;
  paymentStatus: PaymentStatus;
  paymentMethod?: 'pix' | 'card' | 'boleto';
  pixCode?: string;
  paymentDate?: string;
  planType: 'single' | 'annual';
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  paymentMethod: 'pix' | 'card' | 'boleto';
  status: PaymentStatus;
  description: string;
  pixCode?: string;
  transactionId: string;
  date: string;
}

export interface LiturgicalDay {
  date: string;
  title: string;
  color: 'verde' | 'branco' | 'roxo' | 'vermelho' | 'rosa';
  colorName: string;
  season: string; // Ex: "3º Domingo do Tempo Comum", "Quaresma", "Advento"
  saintOfDay: {
    name: string;
    title: string;
    imageUrl: string;
    biography: string;
    prayer: string;
  };
  firstReading: {
    reference: string;
    text: string;
  };
  psalm: {
    reference: string;
    response: string;
    stanzas: string[];
  };
  secondReading?: {
    reference: string;
    text: string;
  };
  gospel: {
    reference: string;
    text: string;
  };
  reflection: string;
}

export interface LiturgyOfHours {
  laudes: {
    title: string;
    hymn: string;
    psalms: { title: string; ref: string; text: string }[];
    shortReading: string;
    bendictus: string;
    intercessions: string[];
    prayer: string;
  };
  horaMedia: {
    title: string;
    hymn: string;
    psalms: { title: string; ref: string; text: string }[];
    shortReading: string;
    prayer: string;
  };
  vesperas: {
    title: string;
    hymn: string;
    psalms: { title: string; ref: string; text: string }[];
    shortReading: string;
    magnificat: string;
    intercessions: string[];
    prayer: string;
  };
  completas: {
    title: string;
    hymn: string;
    psalms: { title: string; ref: string; text: string }[];
    shortReading: string;
    nuncDimittis: string;
    prayer: string;
  };
}

export interface BibleBook {
  id: string;
  name: string;
  testament: 'old' | 'new';
  category: 'Pentateuco' | 'Históricos' | 'Sapienciais' | 'Proféticos' | 'Evangelhos' | 'Cartas' | 'Apocalipse';
  chaptersCount: number;
  abbreviation: string;
}

export interface BibleVerse {
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface HighlightedVerse {
  id: string;
  bookId: string;
  chapter: number;
  verse: number;
  text: string;
  color: 'gold' | 'wine' | 'blue' | 'emerald';
  note?: string;
  createdAt: string;
}

export interface CatholicPrayer {
  id: string;
  title: string;
  category: 'Diárias' | 'Nossa Senhora' | 'Anjos e Santos' | 'Eucaristia e Adoração' | 'Proteção e Liberação' | 'Familia e Paz';
  content: string;
  latinContent?: string;
  audioUrl?: string;
}

export interface RosaryMystery {
  name: string;
  day: string;
  mysteries: {
    number: number;
    title: string;
    fruit: string;
    biblicalRef: string;
    meditation: string;
    imageUrl: string;
  }[];
}

export interface ViaSacraStation {
  number: number;
  title: string;
  prayer: string;
  reflection: string;
  imageUrl: string;
}

export interface Novena {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  days: {
    day: number;
    theme: string;
    prayer: string;
    intention: string;
  }[];
}

export interface SaintInfo {
  id: string;
  name: string;
  feastDay: string;
  patronage: string;
  imageUrl: string;
  summary: string;
  biography: string;
  prayer: string;
}

export interface KidsStory {
  id: string;
  title: string;
  subtitle: string;
  ageGroup: '3-6' | '7-10' | '11+';
  moralLesson: string;
  biblicalReference: string;
  imageUrl: string;
  narratorAudioText: string;
  sections: {
    heading: string;
    text: string;
    illustrationPrompt?: string;
  }[];
}

export interface KidsQuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface PersonalReminder {
  id: string;
  title: string;
  category: 'Missa' | 'Terço' | 'Liturgia das Horas' | 'Confissão' | 'Angelus' | 'Custom';
  time: string; // HH:MM
  daysOfWeek: number[]; // 0 = Domingo, 1 = Segunda...
  enabled: boolean;
  soundEnabled: boolean;
}

export interface CatechismArticle {
  id: string;
  number: number;
  section: string;
  title: string;
  content: string;
}

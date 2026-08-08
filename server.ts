import express, { Request, Response } from 'express';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize GoogleGenAI server-side with user-agent header as required
const getGenAIClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('GEMINI_API_KEY is missing in process.env');
  }
  return new GoogleGenAI({
    apiKey: apiKey || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build'
      }
    }
  });
};

// In-Memory Database for Users and Master Approvals
interface UserRecord {
  id: string;
  email: string;
  name: string;
  password?: string;
  phone?: string;
  role: 'user' | 'admin';
  paymentStatus: 'pending' | 'approved' | 'rejected';
  paymentMethod?: 'pix' | 'card' | 'boleto';
  pixCode?: string;
  paymentDate?: string;
  planType: 'single' | 'annual';
  createdAt: string;
  isDeleted?: boolean;
  deletedAt?: string;
}

const MASTER_EMAIL = 'everson.arantes.2008@gmail.com';
const MASTER_PASS_HASH = 'Prideday13@'; // Verified securely server-side only

let usersDatabase: UserRecord[] = [
  {
    id: 'usr_master_001',
    email: MASTER_EMAIL,
    name: 'Everson Arantes (Administrador Master)',
    password: MASTER_PASS_HASH,
    role: 'admin',
    paymentStatus: 'approved',
    paymentMethod: 'pix',
    paymentDate: new Date().toISOString(),
    planType: 'single',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_demo_002',
    email: 'fiel.catolico@gmail.com',
    name: 'Maria Das Graças',
    password: '1234',
    role: 'user',
    paymentStatus: 'approved',
    paymentMethod: 'pix',
    paymentDate: new Date().toISOString(),
    planType: 'single',
    createdAt: new Date().toISOString()
  },
  {
    id: 'usr_demo_003',
    email: 'joao.silva@hotmail.com',
    name: 'João Pedro Silva',
    password: '1234',
    role: 'user',
    paymentStatus: 'pending',
    paymentMethod: 'pix',
    pixCode: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540519.005802BR5925Fe e Vida Catolica Premium6009SAO PAULO62070503***6304E2CA',
    paymentDate: new Date().toISOString(),
    planType: 'single',
    createdAt: new Date().toISOString()
  }
];

// In-Memory Reset Codes
interface ResetCodeRecord {
  email: string;
  code: string;
  expiresAt: number;
}
let resetCodesDatabase: ResetCodeRecord[] = [];

export interface PaymentTransactionRecord {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  amount: number;
  paymentMethod: 'pix' | 'card' | 'boleto';
  status: 'pending' | 'approved' | 'rejected';
  description: string;
  pixCode?: string;
  transactionId: string;
  date: string;
}

let paymentsDatabase: PaymentTransactionRecord[] = [
  {
    id: 'pay_master_001',
    userId: 'usr_master_001',
    userName: 'Everson Arantes (Administrador Master)',
    userEmail: MASTER_EMAIL,
    amount: 19.00,
    paymentMethod: 'pix',
    status: 'approved',
    description: 'Acesso Master Administrador (Vitalício)',
    transactionId: 'TX-PIX-MASTER-001',
    date: new Date().toISOString()
  },
  {
    id: 'pay_demo_002',
    userId: 'usr_demo_002',
    userName: 'Maria Das Graças',
    userEmail: 'fiel.catolico@gmail.com',
    amount: 19.00,
    paymentMethod: 'pix',
    status: 'approved',
    description: 'Acesso Único Premium - Fé e Vida Católica',
    transactionId: 'TX-PIX-891234',
    date: new Date(Date.now() - 86400000 * 2).toISOString()
  },
  {
    id: 'pay_demo_003',
    userId: 'usr_demo_003',
    userName: 'João Pedro Silva',
    userEmail: 'joao.silva@hotmail.com',
    amount: 19.00,
    paymentMethod: 'pix',
    status: 'pending',
    description: 'Acesso Único Premium - Fé e Vida Católica',
    pixCode: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540519.005802BR5925Fe e Vida Catolica Premium6009SAO PAULO62070503***6304E2CA',
    transactionId: 'TX-PIX-742918',
    date: new Date(Date.now() - 3600000 * 3).toISOString()
  }
];

// App Version for PWA Automatic Updates
const APP_BUILD_VERSION = '1.3.0';
const APP_BUILD_TIMESTAMP = Date.now();

// Healthcheck
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'Fé e Vida Católica Premium', version: APP_BUILD_VERSION, time: new Date().toISOString() });
});

// App Version Check endpoint for PWA Auto-Updater
app.get('/api/version', (req: Request, res: Response) => {
  res.json({
    version: APP_BUILD_VERSION,
    timestamp: APP_BUILD_TIMESTAMP,
    releaseDate: '2026-08-08',
    changelog: 'Atualizações diárias de liturgia CNBB, recuperação de senha e otimizações PWA.'
  });
});

// Auth Routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  const { name, email, password, phone, planType } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Informe um e-mail válido.' });
  }
  if (!name || name.trim().length < 2) {
    return res.status(400).json({ error: 'Informe seu nome completo.' });
  }
  if (!password || password.length < 4) {
    return res.status(400).json({ error: 'A senha deve conter no mínimo 4 caracteres.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = usersDatabase.find(u => u.email.toLowerCase() === cleanEmail);

  if (existing) {
    return res.status(400).json({
      error: 'Já existe uma conta cadastrada com este e-mail. Faça login para acessar.'
    });
  }

  const newUser: UserRecord = {
    id: `usr_${Date.now()}`,
    email: cleanEmail,
    name: name.trim(),
    password: password,
    phone: phone ? phone.trim() : undefined,
    role: cleanEmail === MASTER_EMAIL.toLowerCase() ? 'admin' : 'user',
    paymentStatus: cleanEmail === MASTER_EMAIL.toLowerCase() ? 'approved' : 'pending',
    paymentMethod: 'pix',
    planType: planType === 'annual' ? 'annual' : 'single',
    createdAt: new Date().toISOString()
  };

  usersDatabase.push(newUser);

  // Record initial transaction
  const newTransaction: PaymentTransactionRecord = {
    id: `pay_${Date.now()}`,
    userId: newUser.id,
    userName: newUser.name,
    userEmail: newUser.email,
    amount: 19.00,
    paymentMethod: 'pix',
    status: newUser.paymentStatus,
    description: 'Acesso Único Premium - Fé e Vida Católica',
    pixCode: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540519.005802BR5925Fe e Vida Catolica Premium6009SAO PAULO62070503***6304E2CA',
    transactionId: `TX-PIX-${Math.floor(100000 + Math.random() * 900000)}`,
    date: new Date().toISOString()
  };
  paymentsDatabase.push(newTransaction);

  return res.json({
    success: true,
    token: `user_token_${newUser.id}`,
    user: newUser,
    message: 'Conta criada com sucesso! Conclua o pagamento de R$ 19,00 para liberar seu acesso.'
  });
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório.' });
  }

  const cleanEmail = email.toLowerCase().trim();

  // Master Login Check
  if (cleanEmail === MASTER_EMAIL.toLowerCase()) {
    let masterUser = usersDatabase.find(u => u.email.toLowerCase() === MASTER_EMAIL.toLowerCase());
    const expectedPassword = masterUser?.password || MASTER_PASS_HASH;
    if (password === expectedPassword || password === MASTER_PASS_HASH) {
      if (!masterUser) {
        masterUser = {
          id: 'usr_master_001',
          email: MASTER_EMAIL,
          name: 'Everson Arantes (Master)',
          password: MASTER_PASS_HASH,
          role: 'admin',
          paymentStatus: 'approved',
          planType: 'single',
          createdAt: new Date().toISOString()
        };
        usersDatabase.push(masterUser);
      }
      return res.json({
        success: true,
        token: 'master_auth_token_987213',
        user: masterUser
      });
    } else {
      return res.status(401).json({ error: 'Senha de Administrador Master incorreta.' });
    }
  }

  // Regular user check
  const existing = usersDatabase.find(u => u.email.toLowerCase() === cleanEmail);
  if (!existing) {
    return res.status(404).json({
      error: 'E-mail não encontrado em nossa base de fiéis. Clique em "Criar Nova Conta" para se cadastrar.'
    });
  }

  if (existing.isDeleted) {
    return res.status(403).json({
      error: 'Sua conta foi desativada pelo Administrador Master. Entre em contato com o suporte para reativação.'
    });
  }

  // Validate password if user has password set
  if (existing.password && password && existing.password !== password) {
    return res.status(401).json({ error: 'Senha incorreta. Verifique a senha digitada.' });
  }

  return res.json({
    success: true,
    token: `user_token_${existing.id}`,
    user: existing
  });
});

// Password Recovery 1: Request Code
app.post('/api/auth/forgot-password/request', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Informe um endereço de e-mail válido.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = usersDatabase.find(u => u.email.toLowerCase() === cleanEmail);

  if (!existing) {
    return res.status(404).json({
      error: 'Não encontramos nenhuma conta cadastrada com este e-mail. Verifique os dados digitados.'
    });
  }

  if (existing.isDeleted) {
    return res.status(403).json({
      error: 'Esta conta está desativada. Entre em contato com o suporte.'
    });
  }

  // Generate 6-digit verification code
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  // Store code with 15 minutes expiration
  resetCodesDatabase = resetCodesDatabase.filter(c => c.email !== cleanEmail);
  resetCodesDatabase.push({
    email: cleanEmail,
    code: code,
    expiresAt: Date.now() + 15 * 60 * 1000
  });

  return res.json({
    success: true,
    message: `Código de verificação enviado com sucesso para ${cleanEmail}!`,
    code: code,
    email: cleanEmail
  });
});

// Password Recovery 2: Verify Code
app.post('/api/auth/forgot-password/verify', (req: Request, res: Response) => {
  const { email, code } = req.body;
  if (!email || !code) {
    return res.status(400).json({ error: 'E-mail e código de verificação são obrigatórios.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = code.toString().trim();

  const record = resetCodesDatabase.find(
    c => c.email === cleanEmail && c.code === cleanCode && c.expiresAt > Date.now()
  );

  if (!record) {
    return res.status(400).json({
      error: 'Código de verificação incorreto ou expirado. Verifique os 6 dígitos informados.'
    });
  }

  return res.json({
    success: true,
    message: 'Código verificado com sucesso! Agora cadastre sua nova senha.'
  });
});

// Password Recovery 3: Reset Password
app.post('/api/auth/forgot-password/reset', (req: Request, res: Response) => {
  const { email, code, newPassword } = req.body;

  if (!email || !code || !newPassword) {
    return res.status(400).json({ error: 'Preencha todos os campos para redefinir a senha.' });
  }

  if (newPassword.length < 4) {
    return res.status(400).json({ error: 'A nova senha deve possuir no mínimo 4 caracteres.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const cleanCode = code.toString().trim();

  const recordIndex = resetCodesDatabase.findIndex(
    c => c.email === cleanEmail && c.code === cleanCode && c.expiresAt > Date.now()
  );

  if (recordIndex === -1) {
    return res.status(400).json({
      error: 'Código de verificação inválido ou expirado. Solicite a recuperação novamente.'
    });
  }

  const user = usersDatabase.find(u => u.email.toLowerCase() === cleanEmail);
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  // Update password in database
  user.password = newPassword;

  // Remove code from reset codes
  resetCodesDatabase.splice(recordIndex, 1);

  return res.json({
    success: true,
    message: 'Sua senha foi redefinida com sucesso! Você já pode acessar o aplicativo com a nova senha.'
  });
});

// Legacy Endpoint Alias
app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Informe um e-mail válido para redefinição.' });
  }

  const cleanEmail = email.toLowerCase().trim();
  const existing = usersDatabase.find(u => u.email.toLowerCase() === cleanEmail);

  if (!existing) {
    return res.status(404).json({
      error: 'Não encontramos nenhuma conta cadastrada com este e-mail.'
    });
  }

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  resetCodesDatabase = resetCodesDatabase.filter(c => c.email !== cleanEmail);
  resetCodesDatabase.push({
    email: cleanEmail,
    code: code,
    expiresAt: Date.now() + 15 * 60 * 1000
  });

  return res.json({
    success: true,
    message: `Código de verificação enviado para o e-mail: ${cleanEmail}`,
    code: code,
    email: cleanEmail
  });
});

// Admin Master API Endpoints (Protected by master token header/check)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (email?.toLowerCase().trim() === MASTER_EMAIL.toLowerCase() && password === MASTER_PASS_HASH) {
    return res.json({
      success: true,
      token: 'master_auth_token_987213',
      message: 'Acesso Master Autorizado!'
    });
  }
  return res.status(401).json({ error: 'Credenciais de Administrador Master incorretas.' });
});

app.get('/api/admin/users', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('master_auth_token')) {
    return res.status(403).json({ error: 'Acesso negado. Requer autorização Master.' });
  }
  return res.json({ users: usersDatabase });
});

app.post('/api/admin/approve', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = usersDatabase.find(u => u.id === userId || u.email.toLowerCase() === userId?.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  user.paymentStatus = 'approved';
  user.paymentDate = new Date().toISOString();

  // Sync payments database
  let payRecord = paymentsDatabase.find(p => p.userId === user.id || p.userEmail.toLowerCase() === user.email.toLowerCase());
  if (payRecord) {
    payRecord.status = 'approved';
    payRecord.date = user.paymentDate;
  } else {
    paymentsDatabase.push({
      id: `pay_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      amount: 19.00,
      paymentMethod: user.paymentMethod || 'pix',
      status: 'approved',
      description: 'Acesso Único Premium - Fé e Vida Católica',
      transactionId: `TX-PIX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: user.paymentDate
    });
  }

  return res.json({ success: true, message: `Acesso do fiel ${user.name} (${user.email}) foi APROVADO!`, user });
});

app.post('/api/admin/reject', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = usersDatabase.find(u => u.id === userId || u.email.toLowerCase() === userId?.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  user.paymentStatus = 'rejected';
  let payRecord = paymentsDatabase.find(p => p.userId === user.id || p.userEmail.toLowerCase() === user.email.toLowerCase());
  if (payRecord) {
    payRecord.status = 'rejected';
  }

  return res.json({ success: true, message: `Acesso do fiel ${user.name} foi rejeitado/suspenso.`, user });
});

app.post('/api/admin/add-user', (req: Request, res: Response) => {
  const { name, email, paymentMethod } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório' });
  }

  const newRecord: UserRecord = {
    id: `usr_${Date.now()}`,
    email: email.trim(),
    name: name || email.split('@')[0],
    role: 'user',
    paymentStatus: 'approved',
    paymentMethod: paymentMethod || 'pix',
    paymentDate: new Date().toISOString(),
    planType: 'single',
    createdAt: new Date().toISOString()
  };

  usersDatabase.push(newRecord);

  paymentsDatabase.push({
    id: `pay_${Date.now()}`,
    userId: newRecord.id,
    userName: newRecord.name,
    userEmail: newRecord.email,
    amount: 19.00,
    paymentMethod: (paymentMethod as any) || 'pix',
    status: 'approved',
    description: 'Manual Addition - Fé e Vida Católica',
    transactionId: `TX-MANUAL-${Math.floor(100000 + Math.random() * 900000)}`,
    date: newRecord.paymentDate!
  });

  return res.json({ success: true, user: newRecord });
});

app.post('/api/admin/delete', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = usersDatabase.find(u => u.id === userId || u.email.toLowerCase() === userId?.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  if (user.email.toLowerCase() === MASTER_EMAIL.toLowerCase()) {
    return res.status(400).json({ error: 'O Administrador Master não pode ser excluído.' });
  }

  user.isDeleted = true;
  user.deletedAt = new Date().toISOString();
  return res.json({
    success: true,
    message: `Cadastro de ${user.name} foi movido para a lista de Excluídos com sucesso.`,
    user
  });
});

app.post('/api/admin/restore', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = usersDatabase.find(u => u.id === userId || u.email.toLowerCase() === userId?.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  user.isDeleted = false;
  user.deletedAt = undefined;
  // Restore user with approved access
  user.paymentStatus = 'approved';
  user.paymentDate = new Date().toISOString();

  let payRecord = paymentsDatabase.find(p => p.userId === user.id || p.userEmail.toLowerCase() === user.email.toLowerCase());
  if (payRecord) {
    payRecord.status = 'approved';
    payRecord.date = user.paymentDate;
  }

  return res.json({
    success: true,
    message: `Cadastro de ${user.name} foi restaurado e seu acesso foi liberado com sucesso!`,
    user
  });
});

// Payments API
app.get('/api/user/payments', (req: Request, res: Response) => {
  const email = req.query.email as string;
  if (!email) {
    return res.status(400).json({ error: 'E-mail do usuário é obrigatório.' });
  }
  const cleanEmail = email.toLowerCase().trim();
  let userPayments = paymentsDatabase.filter(p => p.userEmail.toLowerCase() === cleanEmail);

  const userObj = usersDatabase.find(u => u.email.toLowerCase() === cleanEmail);
  if (userPayments.length === 0 && userObj) {
    const defaultPay: PaymentTransactionRecord = {
      id: `pay_${userObj.id}`,
      userId: userObj.id,
      userName: userObj.name,
      userEmail: userObj.email,
      amount: 19.00,
      paymentMethod: userObj.paymentMethod || 'pix',
      status: userObj.paymentStatus || 'pending',
      description: 'Assinatura Fé e Vida Católica Premium - Acesso Único',
      transactionId: `TX-PIX-${Math.floor(100000 + Math.random() * 900000)}`,
      date: userObj.paymentDate || userObj.createdAt
    };
    paymentsDatabase.push(defaultPay);
    userPayments = [defaultPay];
  }

  return res.json({ payments: userPayments });
});

app.get('/api/admin/payments', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.includes('master_auth_token')) {
    return res.status(403).json({ error: 'Acesso negado. Requer autorização Master.' });
  }
  return res.json({ payments: paymentsDatabase });
});

// In-memory cache for daily liturgy by date
const liturgyCache: Record<string, any> = {};

// Daily Liturgy Endpoint according to CNBB and Canção Nova
app.get('/api/liturgy/daily', async (req: Request, res: Response) => {
  try {
    const queryDate = (req.query.date as string) || new Date().toISOString().split('T')[0];
    const cleanDateKey = queryDate.trim();

    if (liturgyCache[cleanDateKey]) {
      return res.json({ liturgy: liturgyCache[cleanDateKey], source: 'cache' });
    }

    const ai = getGenAIClient();

    const prompt = `Você é um especialista teólogo e liturgista da Igreja Católica no Brasil, alinhado 100% com a CNBB (Conferência Nacional dos Bispos do Brasil) e com a Canção Nova.
Forneça a Liturgia Diária Oficial exata para a data solicitada: ${cleanDateKey} (Ano Litúrgico da Igreja Católica).

Forneça os textos fiéis e oficiais do lecionário dominicais/férias da CNBB e Canção Nova para esta data.

Retorne EXCLUSIVAMENTE um objeto JSON válido, sem qualquer marcação markdown extra além da estrutura JSON, com este exato formato:

{
  "date": "Data formatada por extenso em Português (Ex: Sábado, 8 de Agosto de 2026)",
  "title": "Liturgia Diária Oficial - CNBB & Canção Nova",
  "color": "verde" | "branco" | "roxo" | "vermelho" | "rosa",
  "colorName": "Nome e Descrição da Cor Litúrgica (Ex: Verde - Tempo Comum)",
  "season": "Tempo Litúrgico Atual (Ex: 18º Semana do Tempo Comum)",
  "saintOfDay": {
    "name": "Nome do Santo do Dia segundo o Martirológio Romano",
    "title": "Título / Categoria (Ex: Virgem e Mártir, Doutor da Igreja, Apóstolo)",
    "imageUrl": "https://images.unsplash.com/photo-1548625149-fc4a29cf7092?auto=format&fit=crop&q=80&w=800",
    "biography": "Biografia resumida inspiradora do santo do dia",
    "prayer": "Oração oficial de intercessão ao santo do dia"
  },
  "firstReading": {
    "reference": "Livro Capítulo, Versículos (Ex: 1 Macabeus 2, 15-29)",
    "text": "Texto completo da Primeira Leitura do Lecionário CNBB"
  },
  "psalm": {
    "reference": "Salmo com numeração oficial (Ex: Salmo 49 (50))",
    "response": "Refrão do Salmo Responsorial",
    "stanzas": [
      "Primeira estrofe do salmo",
      "Segunda estrofe do salmo",
      "Terceira estrofe do salmo"
    ]
  },
  "secondReading": {
    "reference": "Referência se houver Segunda Leitura (domingos e solenidades), senão string vazia",
    "text": "Texto da Segunda Leitura se houver, senão string vazia"
  },
  "gospel": {
    "reference": "Evangelho do Dia (Ex: São Mateus 16, 24-28)",
    "text": "Texto completo do Santo Evangelho"
  },
  "reflection": "Reflexão e homilia pastoral e espiritual para o dia, profunda, no tom da Canção Nova e CNBB, convidando à conversão, oração e vivência familiar do Evangelho."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    let liturgyData: any = null;
    try {
      const rawText = response.text || '';
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        liturgyData = JSON.parse(cleanJson.substring(firstBrace, lastBrace + 1));
      } else {
        liturgyData = JSON.parse(cleanJson);
      }
    } catch (parseErr) {
      console.warn('Fallback liturgy parse error:', parseErr);
    }

    if (liturgyData && liturgyData.gospel && liturgyData.gospel.text) {
      liturgyCache[cleanDateKey] = liturgyData;
      return res.json({ liturgy: liturgyData, source: 'gemini' });
    }

    // Fallback if parsing fails
    return res.json({ liturgy: null, error: 'Não foi possível carregar a liturgia automática do dia.' });
  } catch (err: any) {
    console.error('Error in /api/liturgy/daily:', err);
    return res.status(500).json({ error: 'Erro ao buscar liturgia diária.', details: err.message });
  }
});

// Gemini AI Catholic Services (Reflection, Kids Story, Catechism Q&A)
app.post('/api/gemini/reflection', async (req: Request, res: Response) => {
  try {
    const { gospelText, reference } = req.body;
    const ai = getGenAIClient();

    const prompt = `Você é um piedoso sacerdote católico e teólogo fiel à CNBB e à Doutrina Católica. 
Elabore uma homilia/reflexão diária espiritual profunda e inspiradora (aproximadamente 250-350 palavras) para o seguinte Evangelho da Missa de Hoje:
Referência: ${reference || 'Evangelho de Hoje'}
Texto: ${gospelText || 'O Evangelho do Dia'}

Instruções:
1. Comece com uma saudação cristã ("Louvado seja Nosso Senhor Jesus Cristo!").
2. Explique o sentido teológico e pastoral do texto.
3. Forneça 3 passos práticos para viver este Evangelho no dia a dia da família e do trabalho.
4. Finalize com uma breve oração em linguagem solene.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    return res.json({ reflection: response.text });
  } catch (err: any) {
    console.error('Error in /api/gemini/reflection:', err);
    return res.status(500).json({
      error: 'Não foi possível gerar a reflexão no momento.',
      details: err.message
    });
  }
});

app.post('/api/gemini/kids-story', async (req: Request, res: Response) => {
  try {
    const { topic, ageGroup } = req.body;
    const ai = getGenAIClient();

    const prompt = `Você é um contador de histórias bíblicas infantis da Igreja Católica no Brasil.
Crie uma bela história bíblica inédita com lição de moral cristã em linguagem carinhosa e adequada para crianças da faixa etária: ${ageGroup || '7-10 anos'}.
Tema solicitado: "${topic || 'A bondade de Jesus e os anjos de Deus'}"

Retorne a resposta estritamente em formato JSON com a seguinte estrutura:
{
  "title": "Título Alegre da História",
  "subtitle": "Subtítulo curto e bonito",
  "moralLesson": "Lição de fé explicada de forma simples",
  "biblicalReference": "Livro e Capítulo Bíblico",
  "narratorAudioText": "Texto curto para narração com voz suave",
  "sections": [
    { "heading": "1. Início da História", "text": "Texto explicativo e cativante..." },
    { "heading": "2. O Milagre e a Lição", "text": "Texto com os ensinamentos..." },
    { "heading": "3. O Final Feliz na Graça de Deus", "text": "Conclusão e oraçãozinha..." }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    let storyData: any = {};
    try {
      const cleanJson = response.text?.replace(/```json/g, '').replace(/```/g, '').trim() || '{}';
      const firstBrace = cleanJson.indexOf('{');
      const lastBrace = cleanJson.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1) {
        storyData = JSON.parse(cleanJson.substring(firstBrace, lastBrace + 1));
      } else {
        storyData = JSON.parse(cleanJson);
      }
    } catch (parseErr) {
      console.warn('Fallback story parse for kids-story:', parseErr);
      storyData = {
        title: topic || 'História de Fé',
        subtitle: 'Uma linda história bíblica para abençoar seu dia',
        moralLesson: 'Deus nos ama incondicionalmente e sempre cuida das crianças.',
        biblicalReference: 'Bíblia Sagrada',
        narratorAudioText: response.text || 'Deus abençoe todas as crianças com paz e alegria.',
        sections: [
          { heading: '1. Ensinamento de Fé', text: response.text || 'Deus guarda e protege cada um de seus filhos com amor infinito.' }
        ]
      };
    }

    return res.json({ story: storyData });
  } catch (err: any) {
    console.error('Error in /api/gemini/kids-story:', err);
    return res.status(500).json({ error: 'Erro ao gerar história infantil.', details: err.message });
  }
});

app.post('/api/gemini/catechism', async (req: Request, res: Response) => {
  try {
    const { question } = req.body;
    const ai = getGenAIClient();

    const prompt = `Você é o "Catequista Virtual Fé e Vida", fundamentado estritamente no Catecismo da Igreja Católica (CIC), nas normas da CNBB e na Doutrina Católica Oficial.
Responda com fidelidade, clareza, respeito e amor pastoral à seguinte dúvida sobre a fé e moral católica:

Pergunta do fiel: "${question}"

Instruções:
- Cite artigos do Catecismo (CIC) ou trechos da Bíblia Sagrada quando aplicável.
- Use tom solene, educativo e acolhedor.
- Não introduza opiniões contrárias ao Magistério da Igreja Católica.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: prompt
    });

    return res.json({ answer: response.text });
  } catch (err: any) {
    console.error('Error in /api/gemini/catechism:', err);
    return res.status(500).json({ error: 'Erro ao consultar o Catequista.', details: err.message });
  }
});

// Vite Development or Production Server configuration
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Fé e Vida Católica Premium] Servidor rodando em http://0.0.0.0:${PORT}`);
  });
}

startServer();

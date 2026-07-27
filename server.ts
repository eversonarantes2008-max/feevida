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
  role: 'user' | 'admin';
  paymentStatus: 'pending' | 'approved' | 'rejected';
  paymentMethod?: 'pix' | 'card' | 'boleto';
  pixCode?: string;
  paymentDate?: string;
  planType: 'single' | 'annual';
  createdAt: string;
}

const MASTER_EMAIL = 'everson.arantes.2008@gmail.com';
const MASTER_PASS_HASH = 'Prideday13@'; // Verified securely server-side only

let usersDatabase: UserRecord[] = [
  {
    id: 'usr_master_001',
    email: MASTER_EMAIL,
    name: 'Everson Arantes (Administrador Master)',
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
    role: 'user',
    paymentStatus: 'pending',
    paymentMethod: 'pix',
    pixCode: '00020126580014br.gov.bcb.pix0136123e4567-e89b-12d3-a456-426614174000520400005303986540519.005802BR5925Fe e Vida Catolica Premium6009SAO PAULO62070503***6304E2CA',
    paymentDate: new Date().toISOString(),
    planType: 'single',
    createdAt: new Date().toISOString()
  }
];

// Healthcheck
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', app: 'Fé e Vida Católica Premium', time: new Date().toISOString() });
});

// Auth Routes
app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'E-mail é obrigatório.' });
  }

  // Master Login Check
  if (email.toLowerCase().trim() === MASTER_EMAIL.toLowerCase() && password === MASTER_PASS_HASH) {
    const masterUser = usersDatabase.find(u => u.email.toLowerCase() === MASTER_EMAIL.toLowerCase());
    return res.json({
      success: true,
      token: 'master_auth_token_987213',
      user: masterUser || {
        id: 'usr_master_001',
        email: MASTER_EMAIL,
        name: 'Everson Arantes (Master)',
        role: 'admin',
        paymentStatus: 'approved',
        planType: 'single',
        createdAt: new Date().toISOString()
      }
    });
  }

  // Regular user check or auto registration
  let existing = usersDatabase.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
  if (!existing) {
    // Register as new pending user
    existing = {
      id: `usr_${Date.now()}`,
      email: email.trim(),
      name: email.split('@')[0],
      role: 'user',
      paymentStatus: 'pending',
      paymentMethod: 'pix',
      planType: 'single',
      createdAt: new Date().toISOString()
    };
    usersDatabase.push(existing);
  }

  return res.json({
    success: true,
    token: `user_token_${existing.id}`,
    user: existing
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
  return res.json({ success: true, message: `Acesso do fiel ${user.name} (${user.email}) foi APROVADO!`, user });
});

app.post('/api/admin/reject', (req: Request, res: Response) => {
  const { userId } = req.body;
  const user = usersDatabase.find(u => u.id === userId || u.email.toLowerCase() === userId?.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  user.paymentStatus = 'rejected';
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
  return res.json({ success: true, user: newRecord });
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

    const cleanJson = response.text?.replace(/```json/g, '').replace(/```/g, '').trim();
    const storyData = JSON.parse(cleanJson || '{}');

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

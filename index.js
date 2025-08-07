import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mercadopago from 'mercadopago';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// ✅ Configuração correta do Mercado Pago com a nova versão:
mercadopago.configure({
  access_token: process.env.MP_ACCESS_TOKEN,
});

app.post('/create_preference', async (req, res) => {
  try {
    const { items } = req.body;

    const preference = {
      items,
      back_urls: {
        success: "http://localhost:5173/success",
        failure: "http://localhost:5173/failure",
        pending: "http://localhost:5173/pending"
      },
      auto_return: "approved",
    };

    const response = await mercadopago.preferences.create(preference);
    res.json({ init_point: response.body.init_point });
  } catch (error) {
    console.error("Erro ao criar preferência:", error);
    res.status(500).json({ error: 'Erro ao criar preferência' });
  }
});

app.listen(PORT, () => {
  console.log(`✅ Servidor rodando na porta ${PORT}`);
});

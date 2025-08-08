// server.js (ESM)
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MercadoPagoConfig } from 'mercadopago';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

// Inicializa o cliente Mercado Pago com a nova sintaxe
const client = new MercadoPagoConfig({ accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN });

app.post('/create_preference', async (req, res) => {
  try {
    const { title, quantity, price } = req.body;

    const preference = {
      items: [
        {
          title,
          quantity: Number(quantity),
          unit_price: Number(price),
        },
      ],
      back_urls: {
        success: 'http://localhost:5173/success',
        failure: 'http://localhost:5173/failure',
        pending: 'http://localhost:5173/pending',
      },
      auto_return: 'approved',
    };

    const response = await client.preferences.create({ body: preference });

    res.json({ id: response.id });
  } catch (error) {
    console.error('Erro ao criar preferência:', error.message);
    res.status(500).json({ error: 'Erro ao criar preferência' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor backend rodando em http://localhost:${PORT}`);
});

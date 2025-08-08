import express from "express";
import cors from "cors";
import { MercadoPagoConfig, Preference } from "mercadopago";

const app = express();
app.use(cors());
app.use(express.json());

// Configuração do Mercado Pago
const client = new MercadoPagoConfig({
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN, // Defina no Render
});

// Criar preferência
app.post("/create_preference", async (req, res) => {
  try {
    const body = {
      items: [
        {
          title: req.body.title,
          quantity: Number(req.body.quantity),
          currency_id: "BRL",
          unit_price: Number(req.body.price),
        },
      ],
      back_urls: {
        success: "https://seusite.com/sucesso",
        failure: "https://seusite.com/falha",
        pending: "https://seusite.com/pendente",
      },
      auto_return: "approved",
    };

    const preference = await new Preference(client).create({ body });

    res.json({ id: preference.id });
  } catch (error) {
    console.error(error);
    res.status(500).send("Erro ao criar preferência");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

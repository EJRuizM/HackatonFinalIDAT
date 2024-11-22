const cors = require("cors");
const express = require("express");
require("dotenv").config({ path: "./back/.env" });

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");
const app = express();

//Middlewares here
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../")));

// Routes here
app.get("/index", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
});

// Ruta para la página de éxito
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "../success.html"));
});

// Ruta para la página de cancelación
app.get("/cancel", (req, res) => {
  res.sendFile(path.join(__dirname, "../cancel.html"));
});

app.post("/api/create-checkout-session", async (req, res) => {
  const { product } = req.body;
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "pen",
          product_data: {
            name: product.name,
          },
          unit_amount: product.price * 100, //99.99 * 100= 9999  99,99 *100 = 9999
        },
        quantity: product.quantity,
      },
    ],
    mode: "payment",
    success_url: "http://localhost:8000/success",
    cancel_url: "http://localhost:8000/success",
  });
  res.json({ id: session.id });
});

app.listen(8000, () => {
  console.log("Server started at port 8000");
});

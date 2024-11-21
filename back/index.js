const cors = require("cors");
const express = require("express");
require("dotenv").config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const path = require("path");
const app = express();

//Middlewares here
app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "../")));

// Routes here
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../index.html"));
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
    success_url: "http://localhost:3000/success",
    cancel_url: "http://localhost:3000/cancel",
  });
  res.json({ id: session.id });
});

app.listen(8000, () => {
  console.log("Server started at port 8000");
});

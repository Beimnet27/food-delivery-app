const express = require("express");
const cors = require("cors");
const Chapa = require("chapa");

const app = express();
app.use(express.json());
app.use(cors());

// Replace with your secret key from Chapa
const chapa = new Chapa("YOUR_SECRET_KEY");

// Initialize Payment
app.post("/initialize-payment", async (req, res) => {
  const { amount, currency, email, first_name, last_name, callback_url } = req.body;

  const customerInfo = {
    amount,
    currency,
    email,
    first_name,
    last_name,
    callback_url,
    customization: {
      title: "Your Website Name",
      description: "Payment for products/services",
    },
  };

  try {
    const response = await chapa.initialize(customerInfo, { autoRef: true });
    res.status(200).json({
      checkout_url: response.data.checkout_url,
      tx_ref: response.tx_ref,
    });
  } catch (error) {
    res.status(500).json({ message: "Error initializing payment", error });
  }
});

// Verify Payment
app.get("/verify-payment/:tx_ref", async (req, res) => {
  const { tx_ref } = req.params;

  try {
    const response = await chapa.verify(tx_ref);
    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ message: "Error verifying payment", error });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on port 5000");
});

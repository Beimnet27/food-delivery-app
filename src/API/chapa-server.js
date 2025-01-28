import express from "express";
import Chapa from "chapa";

const app = express();
const PORT = 5000;

// Replace with your actual Chapa secret key
const CHAPA_SECRET_KEY = "your-secret-key";
const myChapa = new Chapa(CHAPA_SECRET_KEY);

// Middleware to parse JSON requests
app.use(express.json());

// Endpoint to initialize a payment
app.post("/api/initialize-payment", async (req, res) => {
  const { amount, currency, email, first_name, last_name, callback_url } = req.body;

  if (!amount || !currency || !email || !first_name || !last_name || !callback_url) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const customerInfo = {
    amount,
    currency,
    email,
    first_name,
    last_name,
    callback_url,
    customization: {
      title: "I love e-commerce",
      description: "It is time to pay",
    },
  };

  try {
    const response = await myChapa.initialize(customerInfo, { autoRef: true });
    console.log("Payment Initialization Response:", response);

    if (response.status === "success") {
      // Save the transaction reference to your database (for later verification)
      const { tx_ref, data } = response;
      // TODO: Save tx_ref and other details to the database

      res.json({
        message: "Payment initialized successfully",
        checkout_url: data.checkout_url,
        tx_ref,
      });
    } else {
      res.status(400).json({ error: response.message });
    }
  } catch (error) {
    console.error("Error initializing payment:", error);
    res.status(500).json({ error: "An error occurred during payment initialization" });
  }
});

// Endpoint to verify a transaction
app.post("/api/verify-payment", async (req, res) => {
  const { tx_ref } = req.body;

  if (!tx_ref) {
    return res.status(400).json({ error: "Transaction reference (tx_ref) is required" });
  }

  try {
    const response = await myChapa.verify(tx_ref);
    console.log("Payment Verification Response:", response);

    if (response.status === "success") {
      res.json({
        message: "Payment verified successfully",
        data: response.data,
      });
    } else {
      res.status(400).json({ error: response.message });
    }
  } catch (error) {
    console.error("Error verifying payment:", error);
    res.status(500).json({ error: "An error occurred during payment verification" });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

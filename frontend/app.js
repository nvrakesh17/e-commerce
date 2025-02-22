const express = require("express");
const axios = require("axios");

const app = express();
const PORT = 3000;

app.get("/", async (req, res) => {
  const users = await axios.get("http://user-service:5001/users");
  const orders = await axios.get("http://order-service:5002/orders");
  res.send({ users: users.data, orders: orders.data });
});

app.listen(PORT, () => console.log(`Frontend running on port ${PORT}`));

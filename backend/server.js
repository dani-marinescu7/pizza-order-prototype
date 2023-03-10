const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

const orders = [];

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/public', express.static(`${__dirname}/../frontend/public`));

const port = 9001;

app.get("/", (req, res) => {
  res.redirect(301, '/pizza/list');
});

app.get("/pizza/list", (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/index.html`));
});

app.get("/api/order", (req, res) => {
  res.send(orders)
});

app.post("/api/order", (req, res) => {
  orders.push(req.body)
  res.send("DONE")
});

app.get("/pizza/list/order", (req, res, next) => {
  res.sendFile(path.join(`${__dirname}/../frontend/orderForm.html`));
});

const userRouter = require('./routes/apis');

app.use('/api', userRouter)


app.listen(port, _ => console.log(`http://127.0.0.1:${port}`));
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const e = require("express");

const port = process.env.PORT || 8000;
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hahq7.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("foodizone");
    const productCollection = database.collection("products");
    const orderCollection = database.collection("orders");
    // Add orders
    app.post("/placeorders", async (req, res) => {
      const orders = req.body;
      const result = await orderCollection.insertOne(orders);
      res.send(result);
      // console.log(orders);
      // console.log(result);
    });
    // Add Product
    app.post("/addproduct", async (req, res) => {
      const products = req.body;
      const result = await productCollection.insertOne(products);
      res.send(result);
      // console.log(result);
    });

    // Get products
    app.get("/products", async (req, res) => {
      const result = productCollection.find({});
      const products = await result.toArray();
      res.send(products);
    });

    // Get Orders
    app.get("/allorders", async (req, res) => {
      const result = orderCollection.find({});
      const allOrders = await result.toArray();
      res.send(allOrders);
    });

    // Get Single Service
    app.get("/placebooking/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting specific products", id);
      const query = { _id: ObjectId(id) };
      const result = await productCollection.findOne(query);
      res.send(result);
      // console.log(result);
    });

    // Get my booking
    app.get("/booking/:id", async (req, res) => {
      const id = req.params.id;
      console.log("getting sp", id);
      const query = { email: id };
      console.log(query);
      const orders = orderCollection.find(query);
      const result = await orders.toArray();
      res.send(result);
      console.log(result);
    });

    // DELETE API
    app.delete("/deleteOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
      // console.log(result);
    });

    // Manage All Package Api
    app.get("/allproducts", async (req, res) => {
      const result = orderCollection.find({});
      const order = await result.toArray();
      res.json(order);
    });
    // confirm package Api
    app.put("/confirmOrders/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const update = "Confirm";
      const result = await orderCollection.updateOne(query, {
        $set: {
          status: update,
        },
      });
      res.send(result);
      console.log(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);
app.get("/", (req, res) => {
  console.log("Api   hit");
  res.send("Hellow Foodizone");
});

app.listen(port, () => {
  console.log("listening to port", port);
});

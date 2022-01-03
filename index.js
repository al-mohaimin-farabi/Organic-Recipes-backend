const express = require("express");
const app = express();
const cors = require("cors");
// const admin = require("firebase-admin");
require("dotenv").config();
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;

const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vxwpt.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    const database = client.db("OrganicRecipe");
    const vlogCollections = database.collection("vlog");
    const usersCollection = database.collection("users");

    app.get("/vlog", async (req, res) => {
      const cursor = vlogCollections.find({});
      const cars = await cursor.toArray();
      res.send(cars);
    });

    app.post("/vlog", async (req, res) => {
      const vlogPost = req.body;
      const result = await vlogCollections.insertOne(vlogPost);
      res.json(result);
    });

    app.get("/vlog/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const user = await vlogCollections.findOne(query);
      res.json(user);
    });

    app.delete("/vlog/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await vlogCollections.deleteOne(query);
      res.json(result);
    });

    app.post("/users", async (req, res) => {
      const user = req.body;
      const result = await usersCollection.insertOne(user);
      res.json(result);
    });

    app.put("/users", async (req, res) => {
      const user = req.body;
      const filter = { email: user.email };
      const options = { upsert: true };
      const updateDoc = { $set: user };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      res.json(result);
    });
  } finally {
    // await client.close();
  }
}

run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello Organic Recipes");
});

app.listen(port, () => {
  console.log(`listening at ${port}`);
});

const express = require('express')
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express()
const cors = require("cors")
require('dotenv').config()
const port = process.env.PORT || 3000

// Middleware
app.use(express.json())
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.1rbama4.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();

    const db = client.db("Rapido-Data-Base");
    const parcelCollection = db.collection("Parcel-Sending-Info");

    // POST API → add new parcel
    app.post("/parcels", async (req, res) => {
      const newParcel = req.body;
      const result = await parcelCollection.insertOne(newParcel);
      res.send(result);
    });

    // GET API → fetch all parcels
    app.get("/parcels", async (req, res) => {

      const query = {};
      const {email} = req.query;

      if(email){
        query.senderEmail = email; 
      }
      const cursor = parcelCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
      

    });

    console.log("MongoDB Connected");
  } catch (err) {
    console.log(err);
  }
}
run().catch(console.dir);




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})

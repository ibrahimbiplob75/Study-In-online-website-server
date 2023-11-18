const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());


console.log(process.env.USER_PASS)



const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASS}@cluster0.npygsvo.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    const database=client.db("amazonDB").collection("products");

    
    
    
    //For view all product
    app.get("/products",async(req,res)=>{
      const result=await database.find().toArray();
      res.send(result);

    });

    app.get("/countProduct",async(req,res)=>{
        const count=await database.estimatedDocumentCount();
        res.send({count});
    });

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    //await client.close();
  }
}
run().catch(console.dir);



app.get('/', (req, res) =>{
    res.send('Ibarhim is making a server for Group Study data')
})

app.listen(port, () =>{
    console.log(`server of Group Study is running on port: ${port}`);
})

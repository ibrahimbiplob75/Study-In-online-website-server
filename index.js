const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const cookieParser=require("cookie-parser")
var jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;


// middleware
app.use(cors({
  origin:[
    "http://localhost:5173"
  ],
  credentials:true,
}));
app.use(express.json());
app.use(cookieParser());




const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
    const database=client.db("groupStudyDB").collection("assignments");
    const userDB=client.db("userDB").collection("users");



    app.post("/users",async(req,res)=>{
        const data=req.body;
        console.log(data);
        const result=await userDB.insertOne(data);
        res.send(result);
    });

    app.get("/users",async(req,res)=>{
      const result=await userDB.find().toArray();
      res.send(result);
    });
    
    
    //For view all assignments
    app.get("/assignments",async(req,res)=>{
      const result=await database.find().toArray();
      res.send(result);
    });
    app.post("/assignments",async(req,res)=>{
      const id=req.body;
      const result=await database.insertOne(id);
      res.send(result);
    });
    app.get("/assignments/:id",async(req,res)=>{
      const id=req.params.id;
      const query={_id : new ObjectId(id)}
      const result=await database.findOne(query);
      res.send(result);
    });
    
    app.delete("/assignments/:id",async(req,res)=>{
      const id=req.params.id;
      const query={_id : new ObjectId(id)}
      const result =await database.deleteOne(query);
      res.send(result);

    });
    app.get("/countAssignments",async(req,res)=>{
        const count=await database.estimatedDocumentCount();
        res.send({count});
    });

    app.patch("/assignments/:id",async(req,res)=>{
        const id=req.params.id;
      const query={_id: new ObjectId(id)};
      const options = { upsert: true };
      const update=req.body;
      const updateAssignment={
        $set:{
            title:update.title,
            mark:update.mark,
            description:update.description,
            date:update.date,
            level:update.level,
            photo:update.photo,
            
        }
      }
      const result=await database.updateOne(query,updateAssignment,options);
      res.send(result);
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

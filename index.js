const express = require('express');
const cors = require('cors');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
//middle ware
app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.16yxiu9.mongodb.net/?retryWrites=true&w=majority`;

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

    const productCollection = client.db('amazonDB').collection('products');
    
    app.get('/products', async(req,res)=>{
        // console.log(req.query)
        const page = parseInt(req.query.page) || 0;
        const limit = parseInt(req.query.limit) || 10;
        const skip = page * limit;
        const result = await productCollection.find().skip(skip).limit(limit).toArray();
        res.send(result);
    })
    app.get('/totalProducts', async(req,res)=>{
        const result = await productCollection.estimatedDocumentCount();
        res.send({totalProducts:result})
    })

    app.post('/productsByIds', async(req,res)=>{
      const ids = req.body;
      console.log(ids)
    })





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req,res)=>{
    res.send('ama is busy now for shopping')
})


app.listen(port,()=>{
console.log(`amazon server is running on port:${port}`)
})
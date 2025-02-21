require('dotenv').config()
const express = require('express')
const cors = require('cors')
const port = process.env.PORT || 3000
const app = express()
//mideware
const corsOptions = {
  origin: ['http://localhost:5173',
    
    
  ],
  credentials: true,
  optionalSuccessStatus: 200
}
app.use(cors(corsOptions));
app.use(express.json())

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const uri = `mongodb+srv://${process.env.DATABASE_NAME}:${process.env.DATABASE_PASSWORD}@cluster0.u5q3a.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;


// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
const db = client.db('daily-work');
const taskCollections = db.collection('taskInfo')

async function run() {
  try {
   app.post('/tasks', async(req,res)=>{
    const taskInfo = req.body
    const result = await taskCollections.insertOne(taskInfo);
    res.send(result)
   })
   app.get('/tasks', async(req,res)=>{
    const email= req.query.userEmail
    const query = {userEmail:email}

    const result  = await taskCollections.find(query).toArray()
    res.send(result)
   })
     // delete data form to-do list
     app.delete('/tasks/:id', async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) }
      const result = await taskCollections.deleteOne(filter)
      res.send(result)
    })
    //get task by id
    app.get('/task/:id', async(req,res)=>{
      const id = req.params.id
      const filter = {_id: new ObjectId(id)}
      const result  = await taskCollections.findOne(filter)
      res.send(result)
    })
    //patch task by id
    app.patch('/task/:id', async(req,res)=>{
      const id  =  req.params.id
      const currentData = req.body
      const filter ={_id: new ObjectId(id)}
      const updateData = {
        $set: currentData
      }
      const options = {
        upsert: true
      }
      const result  = await taskCollections.updateOne(filter,updateData,options)
      res.send(result)
    })
    //patch task by id
    app.patch('/taskCategory/:id', async(req,res)=>{
      const id  =  req.params.id
      const {category} = req.body
      const filter ={_id: new ObjectId(id)}
      const updateData = {
        $set: {category:category}
      }
      console.log(updateData)
      const options = {
        upsert: true
      }
      const result  = await taskCollections.updateOne(filter,updateData,options)
      res.send(result)
    })
   
  }
   finally {
    
  }
}
run().catch(console.dir);
//test 
app.get('/', (req, res) => {
    res.send('hello i am from to-do server.....................')
  })
  
  app.listen(port, () => console.log(`server running on ${port}`))

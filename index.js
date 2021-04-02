const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;

const port = process.env.PORT || 5080

const app = express();
app.use(cors());
app.use(bodyParser.json());
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.nwuix.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
app.get('/', (req, res) => {
  res.send('Hello World!')
})


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const bookCollection = client.db("BookLibrary").collection("books");
  const ordersCollection = client.db("BookLibrary").collection("orders");
  
  app.get('/books',(req,res)=>{
      bookCollection.find()
      .toArray((err, documents)=>{
          res.send(documents)
      })
  })
  
  app.post('/addBooks',(req,res) =>{
      const newBook = req.body;
      bookCollection.insertOne(newBook)
      .then(result =>{
          res.send(result.insertedCount > 0)
      })
  })

  app.get('/book/:id',(req,res)=>{
      const id = ObjectId(req.params.id)
      bookCollection.find({_id: id})
      .toArray((err, documents) =>{
          res.send(documents[0])
      })
  })

  app.post('/addOrder',(req,res)=> {
    const order = req.body;
    ordersCollection.insertOne(order)
    .then(result =>{
        res.send(result.insertedCount > 0)
    })
  })

  app.get('/orders', (req,res) =>{
      ordersCollection.find({})
      .toArray((err, documents) => {
          res.send(documents);
      })
  })

  app.delete('/deleteBook/:id', (req,res)=>{
      const id = ObjectId(req.params.id)
      bookCollection.deleteOne({_id: id})
      .then(result =>{
          res.send(result.deletedCount > 0)
      })  
  })
});


app.listen(port)
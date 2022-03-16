const express = require('express')
const app = express()
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config()
//console.log(process.env.DB_PASS);
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
})



const MongoClient = require('mongodb').MongoClient;
const ObjectId = require("mongodb").ObjectId;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ishda.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  
    console.log("error", err);

  const productsCollection = client.db("Business-Assistant").collection("Products");
  const applicantsCollection = client.db("Business-Assistant").collection("Applicants");
  const adminsCollection = client.db("Business-Assistant").collection("Admins");


  console.log("database", uri);

  app.post("/addProduct", (req, res) => {
    const newEvent = req.body;
    console.log("product", newEvent);
    productsCollection.insertOne(newEvent)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  })

  app.get("/products", (req, res) => {
    productsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  app.delete("/deleteEvent/:id", (req, res) => {
    const id = ObjectId(req.params.id);
    console.log("delete this", id);
    eventsCollection.deleteOne({ _id: id })
    .then(result => {
      res.send(result.deletedCount > 0);
    })

  })




  // applicants api 

  app.post("/addApplicant", (req, res) => {
    const newApplicant = req.body;
    console.log("applicant", newApplicant);
    applicantsCollection.insertOne(newApplicant)
      .then(result => {
        console.log(result.insertedCount);
        res.send(result.insertedCount > 0);
      })
  })


  app.get("/applicants", (req, res) => {
    applicantsCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })


  // check admin is valid or not
  app.post("/adminLogin", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    console.log("hello", email, password);
    adminsCollection.find({ "email": email, "passwordAdmin": password })
        .toArray((err, documents) => {
          console.log(documents[0]);
          if(documents.length > 0){
            documents[0].passwordAdmin = "123456";
            res.send(documents[0]);
          }
          else{
            res.send(documents);
          }
        })
})

});




app.listen(port);
const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
const port = process.env.PORT||5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.jo3y1.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
    try {
        await client.connect();
        const database = client.db('bookDeliveryDB');
        const bookinfoCollection = database.collection('bookinfo');

        // // GET API
        // app.get('/', async (req, res) => {
        //     const cursor = bookinfoCollection.find({});
        //     const services = await cursor.toArray();
        //     res.send(services);
        // });

        // // GET Single Service
        // app.get('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     console.log('getting specific service', id);
        //     const query = { _id: ObjectId(id) };
        //     const service = await bookinfoCollection.findOne(query);
        //     res.json(service);
        // })

        // // POST API
        // app.post('/services', async (req, res) => {
        //     const service = req.body;
        //     console.log('hit the post api', service);

        //     const result = await bookinfoCollection.insertOne(service);
        //     console.log(result);
        //     res.json(result)
        // });

        // // DELETE API
        // app.delete('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await bookinfoCollection.deleteOne(query);
        //     res.json(result);
        // })
        console.log("Connected successfully to server");
    }
    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running my test Server');
});

app.listen(port, () => {
    console.log('Running Server on port', port);
})
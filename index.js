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
        const bookinfoCollection = database.collection('productinfo');
        const orderCollection=database.collection('orders');
        // Admin
        
        // GET API
        app.get('/viewallproduct', async (req, res) => {
            const cursor = bookinfoCollection.find({});
            const dataList = await cursor.toArray();
            res.send(dataList);
        });

        // GET Single Service
        app.get('/products/:id', async(req, res) => {
            const id = req.params.id;
            console.log('getting single product id', id);
            const query = { _id: ObjectId(id) };
            const product = await bookinfoCollection.findOne(query);
            res.json(product);
        })

        // POST API
        app.post('/addproduct', async (req, res) => {
            const dataStore = req.body;
            console.log('hit the post api', dataStore);

            const result = await bookinfoCollection.insertOne(dataStore);
            console.log(result);
            res.json(result)
        });
        //PUT API
        app.put('/products/:id', async(req, res) => {
            const id = req.params.id;
            const updateProduct = req.body;
            const options ={upsert:true};
            const filter = { _id: ObjectId(id) };
            const updateDoc ={
                $set:{
                    booktitle : updateProduct.booktitle,
                    bookprice : updateProduct.bookprice, 
                    discrioption : updateProduct.discrioption, 
                    image : updateProduct.image, 
                    rateing : updateProduct.rateing 
                },
            };
            const result=await bookinfoCollection.updateOne(filter, updateDoc,options);
            console.log('Updating single product id', id);
            res.json(result);

        });


        // DELETE API
        app.delete('/viewallproduct/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await bookinfoCollection.deleteOne(query);
            res.json(result);
        })

        //Order Part

        //post api(order)
        app.post('/cart',async(req,res)=>{
            const order=req.body;
            console.log('hit the post api',order)
            const result=await orderCollection.insertOne(order);
            console.log(result)
            res.json(result)

        });
        // GET API
        app.get('/checkout', async (req, res) => {
            const cursor = orderCollection.find({});
            const dataList = await cursor.toArray();
            res.send(dataList);
        });
        // update api
        app.get('/orders/:id',async(req,res)=>{
        const id= req.params.id;
        const query ={_id:ObjectId(id)};
        const newQuery={$set:{status:'approved'}}
        const result = await orderCollection.updateOne(query, newQuery);
        console.log('load user with id :',id)
        res.json(result)
        })
         //delete api(order)
        app.delete('/orders/:id',async(req,res)=>{
        const id = req.params.id;
        const query={_id: ObjectId(id)};
        const result =await orderCollection.deleteOne(query);
        console.log("deleting user with id",result);
        res.json(result)
    })
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
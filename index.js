const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
const { query } = require('express');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors())
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7apvnd5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollections = client.db('serviceReview').collection('services');
        const reviewCollections = client.db('serviceReview').collection('reviews');

        // show all services
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollections.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })

        // show services by id
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollections.findOne(query);
            res.send(service);
        })

        // save service on database
        app.post('/services', async (req, res) => {
            const service = req.body;
            result = await serviceCollections.insertOne(service);
            res.send(result);
        })

        // save review on database
        app.post('/reviews', async (req, res) => {
            const review = req.body;
            result = await reviewCollections.insertOne(review);
            res.send(result);
        })

        // show all review by service
        app.get('/reviews', async (req, res) => {
            let query = {};
            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            const cursor = reviewCollections.find(query).sort({ reviewPostDate: -1 });
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

        // show all review by customer email
        app.get('/reviewmail', async (req, res) => {
            let query = {};
            if (req.query.email) {
                query = {
                    email: req.query.email
                }
            }
            const cursor = reviewCollections.find(query).sort({ reviewPostDate: -1 });
            const reviewOnMail = await cursor.toArray();
            res.send(reviewOnMail);
        })

        // show reviews by id
        app.get('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const review = await reviewCollections.findOne(query);
            res.send(review);
        })

        // delete review
        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollections.deleteOne(query);
            res.send(result)
        })

        // update review
        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: ObjectId(id) };
            const review = req.body;
            const option = { upsert: true };
            const updatedReview = {
                $set: {
                    message: review.message,
                }
            }
            const result = await reviewCollections.updateOne(filter, updatedReview, option);
            res.send(result);
        })

        // app.put('/reviews/:id', (req, res) => {
        //     const id = req.params.id;
        //     const filter = { _id: ObjectId(id) };
        // })


    }
    finally {

    }
}
run().catch(error => { console.log(error) })


app.get('/', (req, res) => {
    res.send('Service Review Server is running.......');
})

app.listen(port, () => {
    console.log('The server is running on port', port);
})
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(express.json());
app.use(cors())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.7apvnd5.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollections = client.db('serviceReview').collection('services');
        const userCollections = client.db('serviceReview').collection('users');
        const reviewCollections = client.db('serviceReview').collection('reviews');
        const user = {
            name: 'Jogendro nath', email: 'jogenndro@bmail.com'
        }

        const review = {
            name: 'Jetendro Maharaj ',
            email: 'jeten@bmail.com',
            review: 'Fine Service',
            rating: '4.7',
        }
        const userResult = await reviewCollections.insertOne(user);
        const reviewResult = await reviewCollections.insertOne(review);

        // show all services
        app.get('/services', async (req, res) => {
            const query = {}
            const cursor = serviceCollections.find(query);
            const services = await cursor.toArray();
            res.send(services);
        })



        app.get('/users', async (req, res) => {
            const query = {}
            const cursor = userCollections.find(query);
            const user = await cursor.toArray();
            res.send(user);
        })


        app.get('/reviews', async (req, res) => {
            const query = {}
            const cursor = reviewCollections.find(query);
            const review = await cursor.toArray();
            res.send(review);
        })
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
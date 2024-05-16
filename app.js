require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId, ServerApiVersion } = require('mongodb');

const app = express();

const mongoURI = process.env.MONGO_DB_URI;
const dbName = 'REST_API_Server';
const client = new MongoClient(mongoURI, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true,
    }
  });
const collectionName = 'Data';

// Connect to MongoDB
async function connectMongo() {
    await client.connect();
    console.log('connected');
      // Seed initial data
      const db = client.db(dbName);
      const collection = db.collection(collectionName);
      const initialData = [
        {
            name: "Harry Potter and the Order of the Phoenix",
            img: "https://bit.ly/2IcnSwz",
            summary: "Harry Potter and Dumbledore's warning about the return of Lord Voldemort is not heeded by the wizard authorities who, in turn, look to undermine Dumbledore's authority at Hogwarts and discredit Harry."
        },
        {
          name: "The Lord of the Rings: The Fellowship of the Ring",
            img: "https://bit.ly/2tC1Lcg",
            summary: "A young hobbit, Frodo, who has found the One Ring that belongs to the Dark Lord Sauron, begins his journey with eight companions to Mount Doom, the only place where it can be destroyed."
        },
        {
            name: "Avengers: Endgame",
            img: "https://bit.ly/2Pzczlb",
            summary: "Adrift in space with no food or water, Tony Stark sends a message to Pepper Potts as his oxygen supply starts to dwindle.Meanwhile, the remaining Avengers -- Thor, Black Widow, Captain America, and Bruce Banner-- must figure out a way to bring back their vanquished allies for an epic showdown with Thanos-- the evil demigod who decimated the planet and the universe."
        }
    ];
      
      try {
        await collection.deleteMany({}); // Clear existing data
        await collection.insertMany(initialData); // Insert initial data
        console.log('Initial data seeded successfully.');
      } catch (error) {
        console.error('Error seeding initial data:', error);
      }
}

function initApp() {
    app.use(express.json());


app.post('/REST_API_Server', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.insertOne(req.body);
    res.status(201).json(result.ops[0]);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/REST_API_Server', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const books = await collection.find().toArray();
    console.log(books)

    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/REST_API_Server/:id', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const item = await collection.findOne({ _id: ObjectId(req.params.id) });
    if (!item) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.put('/REST_API_Server/:id', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndUpdate(
      { _id: ObjectId(req.params.id) },
      { $set: req.body },
      { returnOriginal: false }
    );
    if (!result.value) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json(result.value);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/REST_API_Server/:id', async (req, res) => {
  try {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);
    const result = await collection.findOneAndDelete({ _id: ObjectId(req.params.id) });
    if (!result.value) {
      return res.status(404).json({ message: 'Item not found' });
    }
    res.json({ message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});

}

connectMongo().then(()=> {
    initApp();
}).catch(err => {
    console.log(err.message);
})

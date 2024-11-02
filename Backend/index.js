const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');

const app = express();
const port = 3000; 
app.use(cors());

const url = 'mongodb+srv://Registration:2111087@cluster0.wexksa1.mongodb.net/mernstacks?retryWrites=true&w=majority';
const dbName = 'mernstacks';
const collectionName = 'Waterdip AI'; 

app.get('/api/data', async (req, res) => {
  const client = new MongoClient(url, { useUnifiedTopology: true });

  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const data = await collection.find({}).toArray();
    res.json(data); 
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching data');
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

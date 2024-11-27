const { MongoClient } = require("mongodb");
require('dotenv').config();

const client = new MongoClient(process.env.DB_STRING_CONNECTION);

async function connectToMongo() {
    try {
     
        await client.connect();
  
        console.log("==== Database MongoDB Connected ====");
  
        const db = client.db();
        const collections = await db.collections();
  
        return {
          db,
          collections,
          client, 
        };
  
    } catch (err) {
        console.error("Failed to connect to MongoDB", err);
        throw err;
      }
};


module.exports = connectToMongo;
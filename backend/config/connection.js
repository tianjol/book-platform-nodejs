const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://root:@localhost:27017/digitalbooks?authSource=admin");

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
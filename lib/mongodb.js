import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const options = {
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 5000,
};

let client;
let clientPromise = null;

if (uri) {
  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the MongoClient
    // instance is not recreated on every hot module reload.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options);
      global._mongoClientPromise = client.connect().catch((err) => {
        console.error("[MongoDB] Connection error:", err.message);
        global._mongoClientPromise = null;
        throw err;
      });
    }
    clientPromise = global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options);
    clientPromise = client.connect().catch((err) => {
      console.error("[MongoDB] Connection error:", err.message);
      throw err;
    });
  }
}

export async function getMongoDb() {
  if (!clientPromise) {
    return null;
  }
  const connectedClient = await clientPromise;
  // Use database name from URI, or default to "thethirdspace"
  return connectedClient.db();
}

export default clientPromise;

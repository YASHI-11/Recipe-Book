import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function GET() {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();
    const db = client.db(process.env.DB_NAME); // same DB you’re already using
    const recipesCollection = db.collection(process.env.COLLECTION_NAME);
    // Fetch all recipes
    const recipes = await recipesCollection.find({}).toArray();
    return NextResponse.json(recipes);
  } catch (error) {
    console.error("Fetch recipes error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await client.close();
  }
}
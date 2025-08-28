import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(req) {
  const client = new MongoClient(process.env.MONGODB_URI);

  try {
    await client.connect();

    const db = client.db(process.env.DB_NAME); // change if you use a different DB
    const recipes = db.collection(process.env.COLLECTION_NAME);

    const body = await req.json();

    // Basic validation
    if (!body.title || !body.description) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newRecipe = {
      ...body,
      rating: (Math.random() + 4).toFixed(1),
      createdAt: new Date(),
    };

    const result = await recipes.insertOne(newRecipe);

    return NextResponse.json(
      { message: "Recipe added successfully", recipeId: result.insertedId },
      { status: 201 }
    );
  } catch (error) {
    console.error("Add Recipe Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  } finally {
    await client.close();
  }
}

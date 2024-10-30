import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const { name, email, clerkId } = await request.json();
    if (!name || !email || !clerkId) {
      return new Response("Missing name, email or clerkId", { status: 400 });
    }
    const response = await sql`
  INSERT INTO users (name, email, clerk_id)
  VALUES (${name}, ${email}, ${clerkId})
  `;
    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("An error occurred", { status: 500 }); 
  }
}
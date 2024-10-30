import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  try {
    const sql = neon(`${process.env.DATABASE_URL}`);
    const body = await request.json();
    const {
      origin_address,
      destination_address,
      origin_latitude,
      origin_longitude,
      destination_latitude,
      destination_longitude,
      ride_time,
      fare_price,
      payment_status,
      driver_id,
      user_id,
    } = body;
    if (
      !origin_address ||
      !destination_address ||
      !origin_latitude ||
      !origin_longitude ||
      !destination_latitude ||
      !destination_longitude ||
      !ride_time ||
      !fare_price ||
      !payment_status ||
      !driver_id ||
      !user_id
    ) {
      return new Response("Missing required information", { status: 400 });
    }

    const response = await sql`
    INSERT INTO rides (origin_address, destination_address, origin_latitude, origin_longitude, destination_latitude, destination_longitude, ride_time, fare_price, payment_status, driver_id, user_id)
    VALUES (${origin_address}, ${destination_address}, ${origin_latitude}, ${origin_longitude}, ${destination_latitude}, ${destination_longitude}, ${ride_time}, ${fare_price}, ${payment_status}, ${driver_id}, ${user_id})
    RETURNING *
    `;
    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    console.log(error);
    return new Response("An error occurred", { status: 500 });
  }
}

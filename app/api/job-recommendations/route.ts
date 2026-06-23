
import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { role } = await req.json();

  const response = await fetch(
    `https://jsearch.p.rapidapi.com/search?query=${encodeURIComponent(
      role + " in India"
    )}&page=1&num_pages=3`,
    {
      headers: {
        "X-RapidAPI-Key":
          process.env.RAPIDAPI_KEY!,
        "X-RapidAPI-Host":
          "jsearch.p.rapidapi.com",
      },
    }
  );

  const data = await response.json();

  return NextResponse.json(
    data.data || []
  );
}
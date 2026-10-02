import { NextResponse } from "next/server";

export async function GET() {
  try {
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;
    const placeId = process.env.GOOGLE_PLACE_ID;

    if (!apiKey || !placeId) {
      return NextResponse.json(
        { error: "Google Places configuration is missing." },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://places.googleapis.com/v1/places/${placeId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask":
            "displayName,rating,userRatingCount,reviews,googleMapsLinks.reviewsUri",
        },
        next: {
          revalidate: 3600,
        },
      }
    );

    if (!response.ok) {
      const error = await response.text();

      console.error("Google Places API error:", error);

      return NextResponse.json(
        { error: "Failed to fetch Google reviews." },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Google reviews error:", error);

    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 }
    );
  }
}
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { origin, destination } = await req.json();

    const API_KEY = process.env.MAPPLS_API_KEY;

    const url = `https://apis.mappls.com/advancedmaps/v1/${API_KEY}/route_adv/driving/${encodeURIComponent(
      origin
    )}/${encodeURIComponent(destination)}`;

    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.routes) {
      return NextResponse.json(
        { error: "No route found" },
        { status: 400 }
      );
    }

    const route = data.routes[0];

    const distanceKm = route.distance / 1000;
    const durationMin = route.duration / 60;

    return NextResponse.json({
      distanceKm,
      durationMin,
      raw: route,
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
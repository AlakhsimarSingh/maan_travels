import { NextRequest, NextResponse } from "next/server";

// ---------------------------------------------------------------------------
// Nominatim usage policy compliance:
// - Server-side only, never called from the browser directly.
// - Descriptive User-Agent required (stock fetch UAs are rejected by Nominatim).
// - Max 1 request/second — only triggered by explicit user click, never on
//   keystroke/autocomplete (which the policy explicitly forbids).
// - Attribution to OpenStreetMap is shown in the calculator UI.
// ---------------------------------------------------------------------------

const NOMINATIM_URL = "https://nominatim.openstreetmap.org/search";
const OSRM_URL = "https://router.project-osrm.org/route/v1/driving";

const USER_AGENT = "MaanTravelsCalculator/1.0 (contact: maantravelcabs@gmail.com)";

async function geocode(place: string, label: string) {
  const params = new URLSearchParams({
    q: `${place}, India`,
    format: "json",
    limit: "1",
    countrycodes: "in",
  });

  let res: Response;
  try {
    res = await fetch(`${NOMINATIM_URL}?${params.toString()}`, {
      headers: {
        "User-Agent": USER_AGENT,
        "Accept-Language": "en",
      },
    });
  } catch (networkErr) {
    // This branch fires for DNS failures, connection refused, TLS issues, etc —
    // the kind of error that happens BEFORE we even get an HTTP response.
    throw new Error(
      `NETWORK_ERROR geocoding "${label}": could not reach nominatim.openstreetmap.org — ${
        (networkErr as Error).message
      }`
    );
  }

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(
      `HTTP_ERROR geocoding "${label}": Nominatim returned ${res.status} ${res.statusText} — ${body.slice(0, 200)}`
    );
  }

  let data: any;
  try {
    data = await res.json();
  } catch (parseErr) {
    throw new Error(`PARSE_ERROR geocoding "${label}": response wasn't valid JSON`);
  }

  if (!data?.length) return null;

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name as string,
  };
}

export async function POST(req: NextRequest) {
  try {
    const { origin, destination } = await req.json();

    if (!origin || !destination) {
      return NextResponse.json(
        { success: false, message: "Origin and destination are required" },
        { status: 400 }
      );
    }

    const originPoint = await geocode(origin, "origin");
    await new Promise((r) => setTimeout(r, 1100));
    const destPoint = await geocode(destination, "destination");

    if (!originPoint || !destPoint) {
      return NextResponse.json(
        {
          success: false,
          message: "Couldn't find one of those locations. Try a more specific name (e.g. add the state).",
        },
        { status: 404 }
      );
    }

    const routeUrl = `${OSRM_URL}/${originPoint.lon},${originPoint.lat};${destPoint.lon},${destPoint.lat}?overview=false`;

    let routeRes: Response;
    try {
      routeRes = await fetch(routeUrl, { headers: { "User-Agent": USER_AGENT } });
    } catch (networkErr) {
      throw new Error(
        `NETWORK_ERROR routing: could not reach router.project-osrm.org — ${(networkErr as Error).message}`
      );
    }

    if (!routeRes.ok) {
      const body = await routeRes.text().catch(() => "");
      throw new Error(`HTTP_ERROR routing: OSRM returned ${routeRes.status} — ${body.slice(0, 200)}`);
    }

    const routeData = await routeRes.json();
    const route = routeData?.routes?.[0];

    if (!route) {
      return NextResponse.json(
        { success: false, message: "Couldn't calculate a route between these locations." },
        { status: 404 }
      );
    }

    const distanceKm = route.distance / 1000;
    const durationMin = route.duration / 60;

    return NextResponse.json({
      success: true,
      distanceKm: Math.round(distanceKm * 10) / 10,
      durationMin: Math.round(durationMin),
      origin: originPoint.displayName,
      destination: destPoint.displayName,
      source: "OpenStreetMap (Nominatim + OSRM)",
    });
  } catch (error) {
    // Full detail goes to the server terminal — this is what to check first.
    console.error("=== DISTANCE CALCULATION ERROR ===");
    console.error(error);
    console.error("===================================");

    return NextResponse.json(
      {
        success: false,
        message: "Distance calculation failed. Please try again.",
        // Only exposed outside production so you can see the exact stage that failed
        debug: process.env.NODE_ENV !== "production" ? (error as Error).message : undefined,
      },
      { status: 500 }
    );
  }
}
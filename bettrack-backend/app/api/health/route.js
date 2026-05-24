export async function GET() {
  return new Response(
    JSON.stringify({ ok: true, service: "BetTrack API", version: "1.0" }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    }
  );
}

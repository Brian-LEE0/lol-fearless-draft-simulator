import {NextRequest} from "next/server";


//return now timestamp
export async function GET(req: NextRequest) {
    return new Response(JSON.stringify({ timestamp: Date.now() }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
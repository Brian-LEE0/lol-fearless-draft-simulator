import { NextRequest, NextResponse } from 'next/server'
import { WebSocketServer, WebSocket } from 'ws'

interface Client {
    id: string;
    ws: WebSocket;
    roomId: string;
    side: string;
}

let wss: WebSocketServer | null = null
let clients: { [id: string]: Client } = {}
let clientSpectators: { [id: string]: Client[] } = {}

function initializeWebSocketServer() {
    if (wss) return;

    console.log('WebSocket server is initializing')
    wss = new WebSocketServer({ port: 2984 })
    

    wss.on('connection', (ws, req) => {
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const roomId = url.searchParams.get('room_id');
        const side = url.searchParams.get('side');
        const clientId = Math.random().toString(36).substring(2, 10);
        console.log(`room_id: ${roomId}, side: ${side}`);
        
        const clientKey = `room_${roomId}_side_${side}`;

        // Find and notify opponent
        const opponentSide = side === 'blue' ? 'red' : side === 'red' ? 'blue' : '';
        const opponentKey = `room_${roomId}_side_${opponentSide}`;

        if (!roomId || !side) {
            ws.close();
            return;
        }
        
        if (side === 'spec') {
            if (!clientSpectators[roomId]) {
                clientSpectators[roomId] = [];
            }
            clientSpectators[roomId].push({ id: clientId, ws, roomId, side });
            console.log(`New spectator connected: ${clientId} in room ${roomId}`);
        }else{
            clients[clientKey] = { 
                id: clientId,
                ws,
                roomId,
                side
            }

            console.log(`New client connected: ${clientId} in room ${roomId} on ${side} side`);
            
            if (clients[opponentKey]) {
                ws.send('opponent connected');
                clients[opponentKey].ws.send('opponent connected');
            }
        }

        ws.on('message', (status, isBinary) => {
            const statusString = status.toString();
            console.log(`Received message from ${clientId}: ${statusString}`);
            const opponent = clients[opponentKey];
            console.log(`opponent: ${opponent}`);
            ws.send(statusString);
            if (opponent) {
                opponent.ws.send(statusString);
            }
            if (clientSpectators[roomId]) {
                console.log(`Spectators: ${clientSpectators[roomId].length}`);
                clientSpectators[roomId].forEach(spectator => {
                    spectator.ws.send(statusString);
                });
            }
        });

        ws.on('close', () => {
            if (side === 'spec') {
                clientSpectators[roomId] = clientSpectators[roomId].filter(spectator => spectator.id !== clientId);
                console.log(`Spectator disconnected: ${clientId}`);
                return;
            }else{
                if (clients[opponentKey]) {
                    clients[opponentKey].ws.send('opponent disconnected');
                }
            }
            console.log(`Client disconnected: ${clientId}`);
        });
    });
}

export async function GET(req: NextRequest) {
    

    const searchParams = req.nextUrl.searchParams;
    const roomId = searchParams.get('room_id');
    const side = searchParams.get('side');

    initializeWebSocketServer();
    console.log(`room_id: ${roomId}, side: ${side}`);

    return NextResponse.json({ message: 'WebSocket server is running' });
}
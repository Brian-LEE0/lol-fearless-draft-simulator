'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  const createRoom = () => {
    const roomId = Math.random().toString(36).substring(2, 10);
    router.push(`/rooms/${roomId}/spec`);
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">리그 오브 레전드 모의 벤픽</h1>
      <button onClick={createRoom} className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700">방 만들기</button>
    </main>
  );
}
'use client';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function Home() {
  const router = useRouter();

  const createRoom = () => {
    const inputElement = document.querySelector('input');
    if (inputElement) {
      const roomName = inputElement.value;
      router.push(`/rooms/${roomName}/waiting-room`);
    } else {
      console.error('Input element not found');
    }
  };

  return (
    <main className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-8">리그 오브 레전드 모의 벤픽</h1>
      <input type="text" placeholder="방 이름 입력" className="px-6 py-3 bg-gray-800 rounded-lg mb-4" />
      <button onClick={createRoom} className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700">방 만들기</button>
    </main>
  );
}
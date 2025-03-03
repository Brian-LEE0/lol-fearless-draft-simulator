'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {fetchChampions} from '@/lib/champion';
import empty_slot from '@/public/empty_slot.png';

export default function Banpick(
    props: WaitingProps
) {;

    const {room_id} = use(props.params);
    const base_url = process.env.NEXT_PUBLIC_BASE_URL;
    console.log(base_url);

    const onClick = () => {
        // Add your onClick logic here
    };
    
    return (
        <main className="flex flex-col items-center justify-center h-screen bg-gray-900 text-white">
            <h1 className="text-4xl font-bold mb-8 ">리그 오브 레전드 모의 벤픽</h1>
            <h3 className="text-2xl font-bold mb-4">방이름: {decodeURI(room_id)}</h3>
            <div className="rounded-lg p-4 mb-4 border-2 border-blue-500">
                <label className=" w-96 px-2 text-blue-500 font-extrabold">블루팀 참가 링크</label>
                <div className="flex flex-row items-center justify-center">
                    <input type="text" value={`${base_url}/rooms/${decodeURI(room_id)}?side=blue&ban=-1`} className="w-96 px-2 py-1 text-blue-800" />
                    <button className="px-2 py-1 bg-blue-600 rounded-lg hover:bg-blue-700"
                        onClick={() => {
                            window.open(`${base_url}/rooms/${decodeURI(room_id)}?side=blue&ban=-1`, '_blank');
                        }}
                    > 바로 가기 </button>
                </div>
            </div>
            <div className="rounded-lg p-4 mb-4 border-2 border-red-500">
                <label className=" w-96 px-2 text-red-500 font-extrabold">레드팀 참가 링크</label>
                <div className="flex flex-row items-center justify-center">
                    <input type="text" value={`${base_url}/rooms/${decodeURI(room_id)}?side=red&ban=-1`} className="w-96 px-2 py-1 text-red-800" />
                    <button className="px-2 py-1 bg-red-600 rounded-lg hover:bg-red-700"
                        onClick={() => {
                            window.open(`${base_url}/rooms/${decodeURI(room_id)}?side=red&ban=-1`, '_blank');
                        }}
                    > 바로 가기 </button>
                </div>
            </div>
            <div className="rounded-lg p-4 mb-4 border-2 border-gray-500">
                <label className=" w-96 px-2 text-gray-500 font-extrabold">관전 링크</label>
                <div className="flex flex-row items-center justify-center">
                    <input type="text" value={`${base_url}/rooms/${decodeURI(room_id)}?side=spec`} className="w-96 px-2 py-1 text-gray-800" />
                    <button className="px-2 py-1 bg-gray-600 rounded-lg hover:bg-gray-700"
                        onClick={() => {
                            window.open(`${base_url}/rooms/${decodeURI(room_id)}?side=spec&ban=-1`, '_blank');
                        }}> 바로 가기 </button>
                </div>
            </div>
        </main>
    );
}
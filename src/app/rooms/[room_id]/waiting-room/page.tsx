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

    return (
        <main className="flex flex-col items-center justify-center h-screen">
            <h1 className="text-4xl font-bold mb-8 ">리그 오브 레전드 모의 벤픽</h1>
            <h3 className="text-2xl font-bold mb-4">방이름: {decodeURI(room_id)}</h3>
            <label className=" w-96 px-2 py-1 mb-4 text-blue-500 font-extrabold">블루팀 참가 링크</label>
            <input type="text" value={`${base_url}/rooms/${decodeURI(room_id)}?side=blue&ban=-1`} className="w-96 px-2 py-1 mb-4 text-blue-800" />
            <label className=" w-96 px-2 py-1 mb-4 text-red-500 font-extrabold">레드팀 참가 링크</label>
            <input type="text" value={`${base_url}/rooms/${decodeURI(room_id)}?side=red&ban=-1`} className="w-96 px-2 py-1 mb-4 text-red-800" />
            <label className=" w-96 px-2 py-1 mb-4 text-gray-500 font-extrabold">관전 링크</label>
            <input type="text" value={`${base_url}/rooms/${decodeURI(room_id)}?side=spec&ban=-1`} className="w-96 px-2 py-1 mb-4 text-gray-800" />
        </main>
      );
};
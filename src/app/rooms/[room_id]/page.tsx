'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {fetchChampions} from '@/lib/champion';
import empty_slot from '@/public/empty_slot.png';

export default function Banpick(
    props: BanpickProps
) {
    const [blueTeamPicks, setBlueTeamPicks] = useState<(Champion | null)[]>(Array(5).fill(null));
    const [blueTeamPicksConfirm, setBlueTeamPicksConfirm] = useState<(Boolean)[]>(Array(5).fill(false));
    const [blueTeamPicksCursor, setBlueTeamPicksCursor] = useState<(Boolean)[]>(Array(5).fill(false));

    const [redTeamPicks, setRedTeamPicks] = useState<(Champion | null)[]>(Array(5).fill(null));
    const [redTeamPicksConfirm, setRedTeamPicksConfirm] = useState<(Boolean)[]>(Array(5).fill(false));
    const [redTeamPicksCursor, setRedTeamPicksCursor] = useState<(Boolean)[]>(Array(5).fill(false));

    const [blueTeamBans, setBlueTeamBans] = useState<(Champion | null)[]>(Array(5).fill(null));
    const [blueTeamBansConfirm, setBlueTeamBansConfirm] = useState<(Boolean)[]>(Array(5).fill(false));
    const [blueTeamBansCursor, setBlueTeamBansCursor] = useState<(Boolean)[]>(Array(5).fill(false));

    const [redTeamBans, setRedTeamBans] = useState<(Champion | null)[]>(Array(5).fill(null));
    const [redTeamBansConfirm, setRedTeamBansConfirm] = useState<(Boolean)[]>(Array(5).fill(false));
    const [redTeamBansCursor, setRedTeamBansCursor] = useState<(Boolean)[]>(Array(5).fill(false));
    const [isMyTurn, setIsMyTurn] = useState(false);

    const { room_id } = use(props.params);
    const { side, ban } = use(props.searchParams);

    const [availableChampions, setAvailableChampions] = useState<Champion[]>([]);
    const [unavailableChampions, setUnavailableChampions] = useState<Champion[]>([]);
    const [pickableChampions, setPickableChampions] = useState<Champion[]>([]);

    const [timer, setTimer] = useState<Timer>({
        side: 'blue',
        time: -1,
    });

    useEffect(() => {
        const fetchData = async () => {
            const champions = await fetchChampions();
            const banChampions = Buffer.from(ban, 'base64').toString('utf-8').split(',');
            console.log(banChampions);
            const filteredChampions = champions.filter(champion => !banChampions.includes(champion.name));
            const filteredUnavailableChampions = champions.filter(champion => banChampions.includes(champion.name));
            setUnavailableChampions(filteredUnavailableChampions);
            
            setAvailableChampions(filteredChampions);
            setPickableChampions(filteredChampions);
        };
        fetchData();
    }, []);
    useEffect(() => {
        const filteredChampions = availableChampions.filter(champion => blueTeamPicks.every(pick => pick?.name !== champion.name) && redTeamPicks.every(pick => pick?.name !== champion.name)).filter(champion => blueTeamBans.every(ban => ban?.name !== champion.name) && redTeamBans.every(ban => ban?.name !== champion.name));
        setPickableChampions(filteredChampions);
    }, [blueTeamPicks, redTeamPicks, blueTeamBans, redTeamBans]);

    const [status, setStatus] = useState<Status>(
        {
            type: "Welcome to Banpick",
            plans: ["b0", "b5", "b1", "b6", "b2", "b7", "p0", "p5", "p6", "p1", "p2", "p7", "b8", "b3", "b9", "b4", "p8", "p3", "p4", "p9"],
            champions: [],
            timestamps: [],
            ready: {
                blue: null,
                red: null,
            }
        }
    );
    const socketRef = useRef<WebSocket | null>(null)

    const connectWebSocket = async () => {
        await fetch(`/api/ws?side=${side}&room_id=${room_id}`)
        const ws = new WebSocket(`${process.env.NEXT_PUBLIC_WS_BASE_URL}?side=${side}&room_id=${room_id}`)
  
        ws.onopen = () => {
          console.log('WebSocket connected')
        }
  
        ws.onmessage = (event) => {
            if (event.data === 'pong') {
                return
            }
            try{
                const data: Status = JSON.parse(event.data)
                setStatus(data)
            }catch(e){
                console.log(event.data)
            }
        }

        socketRef.current = ws
    }

    useEffect(() => {
        connectWebSocket()
    
        return () => {
          if (socketRef.current) {
            socketRef.current.close()
          }
        }
    }, [])

    const sendStatus = (status: Status) => {
        if (socketRef.current) {
            socketRef.current.send(JSON.stringify(status))
        }
    }

    const [searchTerm, setSearchTerm] = useState('');

    const [tempChampion, setTempChampion] = useState<Champion | null>(null);

    const handleChampionSelect = (champion: Champion) => {
        setTempChampion(champion);
        const curIdx = status.timestamps.length;
        const newChampions = [...status.champions];
        newChampions[curIdx] = champion.name;
        setStatus({
            ...status,
            champions: newChampions,
        });
        sendStatus({
            ...status,
            champions: newChampions,
        });
    };

    const handleChampionSelectConfirm = () => {
        let newChampions = [...status.champions];
        const newTimestamps = [...status.timestamps, Date.now()];
        if (tempChampion) {
            setTempChampion(null);
        }else{
            const randomChampion = pickableChampions[Math.floor(Math.random() * pickableChampions.length)];
            newChampions = [...status.champions, randomChampion.name];
        }
        
        setStatus({
            ...status,
            champions: newChampions,
            timestamps: newTimestamps,
        });
        sendStatus({
            ...status,
            champions: newChampions,
            timestamps: newTimestamps,
        });
    };

    useEffect(() => {
        console.log(status);
        if (!status.ready.blue || !status.ready.red){
            return;
        }
        const newBlueTeamPicks = [...blueTeamPicks];
        const newRedTeamPicks = [...redTeamPicks];
        const newBlueTeamBans = [...blueTeamBans];
        const newRedTeamBans = [...redTeamBans];

        const newBlueTeamPicksConfirm = [...blueTeamPicksConfirm];
        const newRedTeamPicksConfirm = [...redTeamPicksConfirm];
        const newBlueTeamBansConfirm = [...blueTeamBansConfirm];
        const newRedTeamBansConfirm = [...redTeamBansConfirm];

        for (let i = 0; i < Math.min(status.champions.length, status.plans.length); i++) {
            const curPlan = status.plans[i];
            const curPlanIdx = Number(curPlan[1]);
            const isPick = curPlan[0] === 'p';
            const isBlue = Number(curPlan[1]) < 5;
            const isBan = curPlan[0] === 'b';
            const isBlueBan = isBan && curPlanIdx < 5;
            const isRedBan = isBan && curPlanIdx >= 5;

            if(isPick){
                if (isBlue) {
                    const foundChampion = availableChampions.find(champion => champion.name === status.champions[i]);
                    if (foundChampion) {
                        newBlueTeamPicks[curPlanIdx] = foundChampion;
                    }
                } else {
                    const foundChampion = availableChampions.find(champion => champion.name === status.champions[i]);
                    if (foundChampion) {
                        newRedTeamPicks[curPlanIdx - 5] = foundChampion;
                    }
                }
            }else if(isBlueBan){
                const foundChampion = availableChampions.find(champion => champion.name === status.champions[i]);
                if (foundChampion) {
                    newBlueTeamBans[curPlanIdx] = foundChampion;
                }
            }else if(isRedBan){
                const foundChampion = availableChampions.find(champion => champion.name === status.champions[i]);
                if (foundChampion) {
                    newRedTeamBans[curPlanIdx - 5] = foundChampion;
                }
            }
            if (i < status.timestamps.length){
                if (isPick){
                    if (isBlue){
                        newBlueTeamPicksConfirm[curPlanIdx] = true;
                    }else{
                        newRedTeamPicksConfirm[curPlanIdx - 5] = true;
                    }
                }else{
                    if (isBlueBan){
                        newBlueTeamBansConfirm[curPlanIdx] = true;
                    }else{
                        newRedTeamBansConfirm[curPlanIdx - 5] = true;
                    }
                }
            }
        }

        setBlueTeamPicks(newBlueTeamPicks);
        setRedTeamPicks(newRedTeamPicks);
        setBlueTeamBans(newBlueTeamBans);
        setRedTeamBans(newRedTeamBans);

        setBlueTeamPicksConfirm(newBlueTeamPicksConfirm);
        setRedTeamPicksConfirm(newRedTeamPicksConfirm);
        setBlueTeamBansConfirm(newBlueTeamBansConfirm);
        setRedTeamBansConfirm(newRedTeamBansConfirm);

        console.log("Blue Team Picks: ", blueTeamPicks);
        console.log("Red Team Picks: ", redTeamPicks);
        console.log("Blue Team Bans: ", blueTeamBans);
        console.log("Red Team Bans: ", redTeamBans);

        if (status.timestamps.length === status.plans.length){
            return;
        }
        const curPlan = status.plans[status.timestamps.length];
        const isMyTurn = Number(curPlan[1]) < 5 && side === 'blue' || Number(curPlan[1]) >= 5 && side === 'red';
        setIsMyTurn(isMyTurn);
        const curPlanSide = Number(curPlan[1]) < 5 ? 'blue' : 'red';
        const curPlanIsBan = curPlan[0] === 'b';
        if (curPlanIsBan){
            if (curPlanSide === 'blue'){
                setBlueTeamBansCursor(blueTeamBansCursor.map((_, idx) => idx === Number(curPlan[1]) ? true : false));
            }else{
                setRedTeamBansCursor(redTeamBansCursor.map((_, idx) => idx === Number(curPlan[1]) - 5 ? true : false));
            }
        }else{
            if (curPlanSide === 'blue'){
                setBlueTeamPicksCursor(blueTeamPicksCursor.map((_, idx) => idx === Number(curPlan[1]) ? true : false));
            }else{
                setRedTeamPicksCursor(redTeamPicksCursor.map((_, idx) => idx === Number(curPlan[1]) - 5 ? true : false));
            }
        }
    }, [status, availableChampions]);

    const filteredChampions = pickableChampions.filter(champion =>
        champion.name.toLowerCase().replace(" ","").includes(searchTerm.toLowerCase().replace(" ","")) ||
        champion.subname.toLowerCase().replace(" ","").includes(searchTerm.toLowerCase().replace(" ","")) ||
        champion.chosung.toLowerCase().replace(" ","").includes(searchTerm.toLowerCase().replace(" ",""))
    );

    const nextRoundButton = (s: string) => {
        let newBan = [...Buffer.from(ban, 'base64').toString('utf-8').split(','), ...blueTeamPicks.map(ban => ban?.name).filter(name => name !== null), ...redTeamPicks.map(ban => ban?.name).filter(name => name !== null)];
        let newBanStr = newBan.join(',');
        let newBanStrBase64 = Buffer.from(newBanStr).toString('base64');
        const newRoomId = room_id + "__new";
        let url = `/rooms/${newRoomId}?side=${s}&ban=${newBanStrBase64}`;
        return url;
    }

    useEffect(() => {
        const interval = setInterval(() => {
            if (socketRef.current) {
                if (socketRef.current?.readyState === WebSocket.OPEN){
                    socketRef.current.send('ping');
                }else{
                    connectWebSocket().then(() => {
                        console.log('Reconnected');
                        socketRef.current?.send('ping');
                    });
                }
            }
        }, 1000)
        return () => clearInterval(interval)
    }, [])

    useEffect(() => {
        if (!status.ready.blue || !status.ready.red){
            return;
        }

        if (status.timestamps.length === status.plans.length){
            return;
        }

        const interval = setInterval(() => {
            const stdTime = Math.max(status.ready.blue ?? 0, status.ready.red ?? 0, status.timestamps[status.timestamps.length - 1] ?? 0);
            const curTime = Date.now();
            const nextTime = stdTime + 60000;
            const time = (nextTime - curTime) / 1000;
            const curPlan = status.plans[status.timestamps.length];
            const curSide = Number(curPlan[1]) < 5 ? 'blue' : 'red';

            if (time < 0){
                if (curSide === side){
                    handleChampionSelectConfirm();
                }
                return;
            }
            setTimer({
                side: curSide,
                time: time,
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [status]);

    const handleReady = (side: string) => {
        const newReady = {
            ...status.ready,
            [side]: Date.now(),
        };
        setStatus({
            ...status,
            ready: newReady,
        });
        sendStatus({
            ...status,
            ready: newReady,
        });
    };

    

    return (
        <div className="flex flex-col h-screen bg-gray-900 text-white">
            {/* Header */}
            <div className="bg-gray-800 p-4 text-center">
                <h1 className="text-2xl font-bold">리그 오브 레전드 벤픽</h1>
                {/* ready button */}
                
                <div className="flex justify-between">
                    {timer.side === 'blue' && timer.time >= 0 ? <div className="timer">{Math.floor(timer.time)}</div>: <h1></h1>}
                    {side === 'blue' ? (
                        <h2 className="text-lg font-semibold text-blue-500">블루 팀</h2>
                    ) : side === 'red' ? (
                        <h2 className="text-lg font-semibold text-red-500">레드 팀</h2>
                    ) : (
                        <h2 className="text-lg font-semibold text-gray-400">관전 모드</h2>
                    )}
                    {timer.side === 'red' && timer.time >= 0 ? <div className="timer">{Math.floor(timer.time)}</div>: <h1></h1>}
                </div>
                <div className="flex justify-between">
                    <div className="flex flex-col">
                        {status.ready.blue || side !== 'blue' ? (
                            <button
                                className="bg-gray-600 text-white p-2 rounded mt-2"
                                onClick={handleReady.bind(null, 'blue')}
                                disabled
                            >블루팀 준비하기</button>
                        ) : (
                            <button
                                className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded mt-2"
                                onClick={handleReady.bind(null, 'blue')}
                            >블루팀 준비하기</button>
                        )}
                        {status.ready.blue ? (
                            <span className="text-blue-500">블루팀 준비 완료</span>
                        ) : (
                            <span className="text-gray-400">블루팀 준비 대기</span>
                        )}
                    </div>
                    <div className="flex justify-between">
                        <button className="bg-blue-900 hover:bg-blue-500 text-white p-2 rounded mt-2">
                            <a href={nextRoundButton('blue')} target='_blank'>다음 라운드 블루 팀</a>
                        </button>
                        <button className="bg-red-900 hover:bg-red-500 text-white p-2 rounded mt-2 ml-2">
                            <a href={nextRoundButton('red')} target='_blank'>다음 라운드 레드 팀</a>
                        </button>
                        <button className="bg-gray-900 hover:bg-gray-500 text-white p-2 rounded mt-2 ml-2">
                            <a href={nextRoundButton('spec')} target='_blank'>다음 라운드 관전 모드</a>
                        </button>
                    </div>
                    <div className="flex flex-col">
                        {status.ready.red || side !== 'red' ? (
                            <button
                                className="bg-gray-600 text-white p-2 rounded mt-2"
                                onClick={handleReady.bind(null, 'red')}
                                disabled
                            >레드팀 준비하기</button>
                        ) : (
                            <button
                                className="bg-red-600 hover:bg-red-500 text-white p-2 rounded mt-2"
                                onClick={handleReady.bind(null, 'red')}
                            >레드팀 준비하기</button>
                        )}
                        {status.ready.red ? (
                            <span className="text-red-500">레드팀 준비 완료</span>
                        ) : (
                            <span className="text-gray-400">레드팀 준비 대기</span>
                        )}
                    </div>
                </div>
                <h5 className="text-sm mt-2">사용 불가 챔피언: {unavailableChampions.map(champion => champion.name).join(', ')}</h5>
            </div>

            {/* Main Content */}
            <div className="flex h-[70%] flex-grow">
                {/* Blue Team */}
                <div className="w-1/2 p-4">
                <h2 className="text-xl font-semibold mb-2 text-blue-500">블루 팀</h2>
                <div>
                    {Array(5).fill(null).map((_, index) => (
                    <div key={index} className="mb-2">
                        {blueTeamPicks[index] ? (
                        <div className="flex items-center">
                            <Image
                            src={blueTeamPicks[index]!.image}
                            alt={blueTeamPicks[index]!.name}
                            width={40}  // 이미지 크기 조정
                            height={40}
                            className="rounded-full mr-2"
                            />
                            {blueTeamPicksConfirm[index] ? (
                                <span className="bg-blue-700 text-white px-2 py-1 rounded">{blueTeamPicks[index]!.name}</span>
                            ) : <span className="color-change-blue text-white px-2 py-1 rounded">{blueTeamPicks[index]!.name}</span>}
                        </div>
                        ) : (
                        <div className="flex items-center">
                            <Image
                            src={empty_slot}
                            alt="Empty Slot"
                            width={40}
                            height={40}
                            className="rounded-full mr-2"
                            />
                            {blueTeamPicksCursor[index] ? (
                                <span className="text-gray-400 background-blue color-change-blue">Player {index + 1} Pick</span>
                            ) : (
                                <span className="text-gray-400">Player {index + 1} Pick</span>
                            )}
                        </div>
                        )}
                    </div>
                    ))}
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-500">블루 팀 벤</h3>
                    <div>
                    {Array(5).fill(null).map((_, index) => (
                        <div key={index} className="mb-2">
                        {blueTeamBans[index] ? (
                            <div className="flex items-center">
                                <Image
                                    src={blueTeamBans[index]!.image}
                                    alt={blueTeamBans[index]!.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full mr-2"
                                />
                                {blueTeamBansConfirm[index] ? (
                                    <span className="bg-blue-700 text-white px-2 py-1 rounded">{blueTeamBans[index]!.name}</span>
                                ) : <span className="color-change-blue text-white px-2 py-1 rounded ">{blueTeamBans[index]!.name}</span>}
                            </div>
                        ) : (
                            <div className="flex items-center">
                            <Image
                                src= {empty_slot}
                                alt="Empty Slot"
                                width={40}
                                height={40}
                                className="rounded-full mr-2"
                            />
                            {blueTeamBansCursor[index] ? (
                                <span className="text-gray-400 background-blue color-change-blue">Ban {index + 1}</span>
                            ) : (
                                <span className="text-gray-400">Ban {index + 1}</span>
                            )}
                            </div>
                        )}
                        
                    
                        </div>
                    ))}
                    </div>
                </div>
                </div>

                {/* Red Team */}
                <div className="w-1/2 p-4">
                <h2 className="text-xl font-semibold mb-2 text-red-500">레드 팀</h2>
                <div>
                    {Array(5).fill(null).map((_, index) => (
                    <div key={index} className="mb-2">
                        {redTeamPicks[index] ? (
                        <div className="flex items-center">
                            <Image
                            src={redTeamPicks[index]!.image}
                            alt={redTeamPicks[index]!.name}
                            width={40}
                            height={40}
                            className="rounded-full mr-2"
                            />
                            {redTeamPicksConfirm[index] ? (
                                <span className="bg-red-700 text-white px-2 py-1 rounded">{redTeamPicks[index]!.name}</span>
                            ) : <span className="color-change-red text-white px-2 py-1 rounded">{redTeamPicks[index]!.name}</span>}
                        </div>
                        ) : (
                        <div className="flex items-center">
                            <Image
                            src= {empty_slot}
                            alt="Empty Slot"
                            width={40}
                            height={40}
                            className="rounded-full mr-2"
                            />
                            {redTeamPicksCursor[index] ? (
                                <span className="text-gray-400 background-red color-change-red">Player {index + 6} Pick</span>
                            ) : (
                                <span className="text-gray-400">Player {index + 6} Pick</span>
                            )}
                        </div>
                        )}
                    </div>
                    ))}
                </div>
                <div>
                    <h3 className="text-lg font-semibold mb-2 text-red-500">레드 팀 벤</h3>
                    <div>
                    {Array(5).fill(null).map((_, index) => (
                        <div key={index} className="mb-2">
                        {redTeamBans[index] ? (
                            <div className="flex items-center">
                                <Image
                                    src={redTeamBans[index]!.image}
                                    alt={redTeamBans[index]!.name}
                                    width={40}
                                    height={40}
                                    className="rounded-full mr-2"
                                />
                                {redTeamBansConfirm[index] ? (
                                    <span className="bg-red-700 text-white px-2 py-1 rounded">{redTeamBans[index]!.name}</span>
                                ) : <span className="color-change-red text-white px-2 py-1 rounded">{redTeamBans[index]!.name}</span>}
                            </div>
                        ) : (
                            <div className="flex items-center">
                            <Image
                                src={empty_slot}
                                alt="Empty Slot"
                                width={40}
                                height={40}
                                className="rounded-full mr-2"
                            />
                            {redTeamBansCursor[index] ? (
                                <span className="text-gray-400 background-red color-change-red">Ban {index + 6}</span>
                            ) : (
                                <span className="text-gray-400">Ban {index + 6}</span>
                            )}
                            </div>
                        )}
                        </div>
                    ))}
                    </div>
                </div>
                </div>
            </div>

            {/* Champion Selection */}
            <div className="p-4 h-[40%] bg-gray-700 text-white">
                <div className="flex justify-between">
                    <input
                    type="text"
                    placeholder="챔피언 이름을 검색하세요 (예: 아트록스, aatrox, ㅇㅌ, 아트)"
                    className="w-full text-black rounded"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    {isMyTurn && side === 'blue' && tempChampion ? (
                        <button
                            className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded mt-2 w-[20%]"
                            onClick={() => handleChampionSelectConfirm()}
                        ><span>확정</span></button>
                    ) : isMyTurn && side === 'red' && tempChampion ? (
                        <button
                            className="bg-red-600 hover:bg-red-500 text-white p-2 rounded mt-2 w-[20%]"
                            onClick={() => handleChampionSelectConfirm()}
                        ><span>확정</span></button>
                    ) : (
                        <button
                            className="bg-gray-600 text-white p-2 rounded mt-2 cursor-not-allowed w-[20%]"
                            disabled
                        ><span>확정</span></button>
                    )}
                </div>
                <div className="grid overflow-y-auto h-[80%]
                 grid-cols-7 gap-2 mt-4">
                    {isMyTurn ? (
                        filteredChampions.map(champion => (
                            <button
                            key={champion.name}
                            className="bg-gray-600 hover:bg-gray-500 text-white p-2 rounded flex flex-col items-center"
                            onClick={() => handleChampionSelect(champion)}
                            >
                            <Image
                                src={champion.image}
                                alt={champion.name}
                                width={40}
                                height={40}
                                className="rounded-full mb-1"
                            />
                            {champion.name}
                            </button>
                        ))
                    ) : (
                        filteredChampions.map(champion => (
                            <button
                            key={champion.name}
                            className="bg-gray-600 text-white p-2 rounded flex flex-col items-center cursor-not-allowed"
                            disabled
                            >
                            <Image
                                src={champion.image}
                                alt={champion.name}
                                width={40}
                                height={40}
                                className="rounded-full mb-1"
                            />
                            {champion.name}
                            </button>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
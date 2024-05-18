import {
    Box, Button, Grid
} from "@mui/material";

import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useEffect, useState} from "react";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {AirConStateCard} from "../Components/AirConStateCard.tsx";
import useWebSocket from "react-use-websocket";
import {AirConditionerState} from "../Interfaces/AirConditionerState.ts";
import {MonitorRoomState} from "../Interfaces/MonitorRoomState.ts";

const client = createClient<openapi.paths>();

export function MonitorPage() {
    const authMiddleware = useAuthMiddleware();
    client.use(authMiddleware)
    const [roomList, setRoomList] = useState<MonitorRoomState[]>([]);

    // 获得全部房间列表
    useEffect(() => {
        const getRooms = async () => {
            const responses = await client.GET('/api/room')
            if (responses.response.status === 200 && responses.data !== undefined) {
                const newRoomList: MonitorRoomState[] = [];
                for (const room of responses.data) {

                    const newRoom: MonitorRoomState = {
                        info: {
                            id: room.roomId,
                            name: room.roomName,
                        },
                        airConState: {
                            cooling: room.airConditioner.cooling,
                            opening: room.airConditioner.opening,
                            roomId: room.airConditioner.roomId,
                            speed: room.airConditioner.speed,
                            targetTemperature: room.airConditioner.targetTemperature,
                            temperature: room.airConditioner.temperature
                        }
                    }
                    newRoomList.push(newRoom);
                }
                newRoomList.sort((a, b) => {
                    return a.info.id > b.info.id ? -1 : 1
                })
                setRoomList(newRoomList);
            }
        }
        getRooms()

    }, []);

    const {
        lastMessage,
    } = useWebSocket('ws://martina.rrricardo.top/api/airConditioner/ws/', {
        onOpen: () => console.log('websocket opened'),
        retryOnError: true,
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: (attemptNumber) =>
            Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    });

    useEffect(() => {
        if (lastMessage !== null) {
            const roomStates = JSON.parse(lastMessage.data) as AirConditionerState[];
            const newRoomList: MonitorRoomState[] = [];
            for (const roomState of roomStates) {
                for (const room of roomList) {
                    if (room.info.id === roomState.roomId) {
                        const newRoom: MonitorRoomState = {
                            info: {
                                id: room.info.id,
                                name: room.info.name,
                            },
                            airConState: {
                                cooling: roomState.cooling,
                                opening: roomState.opening,
                                roomId: roomState.roomId,
                                speed: roomState.speed,
                                targetTemperature: roomState.targetTemperature,
                                temperature: roomState.temperature
                            }
                        }
                        newRoomList.push(newRoom);
                        break;
                    }
                }
            }
            newRoomList.sort((a, b) => {
                return a.info.id > b.info.id ? -1 : 1
            })
            setRoomList(newRoomList)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastMessage])


    return <>
        <Box sx={{position: "relative", width: "100%", height: "100%"}}>
            <Box sx={{
                position: "relative",
                width: "100%",
                height: "10%",
                boxSizing: "border-box",
                padding: '5px',
            }}>
                <Grid container spacing={0}
                      sx={{position: "relative", width: "100%", height: "100%"}}>
                    <Grid item xs={5}/>
                    <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant="outlined">
                            开机
                        </Button>
                    </Grid>

                    <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant="outlined">
                            重置
                        </Button>
                    </Grid>
                    <Grid item xs={5}/>
                </Grid>
            </Box>
            <Box sx={{
                position: "relative",
                width: "100%",
                height: "90%",
                boxSizing: "border-box",
                padding: '10px',
                overflowY: "scroll"
            }}>
                <Grid container columnSpacing={3} rowSpacing={3}
                      sx={{position: "relative", left: "5%", width: "90%", height: "100%"}}>
                    {
                        roomList.map((room) => {
                            return <Grid item xs={2.4} key={room.info.id}
                                         sx={{display: "flex", alignItems: "center", textAlign: "center"}}>
                                <AirConStateCard data={room} key={room.info.id}/>
                            </Grid>
                        })
                    }

                </Grid>
            </Box>
        </Box>
    </>
}

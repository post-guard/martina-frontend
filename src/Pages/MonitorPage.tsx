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
import {enqueueSnackbar} from "notistack";
import SystemSettingModal from "../Components/SystemSettingModal.tsx";
import {useAppSelector} from "../Utils/StoreHooks.ts";
import TestConditionModal from "../Components/TestConditionModal.tsx";

const client = createClient<openapi.paths>();

export function MonitorPage() {
    const authMiddleware = useAuthMiddleware();
    client.use(authMiddleware)
    const userAuth = (useAppSelector((store) => store.userInfo.auth));
    const [roomList, setRoomList] = useState<MonitorRoomState[]>([]);

    const [showSettingModel, setShowSettingModel] = useState(false)
    const [showTestModel, setShowTestModel] = useState(false)
    const [systemStatus, setSystemStatus] = useState<openapi.components['schemas']['AirConditionerOption']>(
        {
            cooling: true,
            minTemperature: 0,
            maxTemperature: 0,
            defaultTemperature: 0,
            defaultFanSpeed: 0,
            highSpeedPerDegree: 0,
            middleSpeedPerDegree: 0,
            lowSpeedPerDegree: 0,
            backSpeed: 0,
            temperatureThreshold: 0,
            pricePerDegree: 0
        }
    )

    const [systemControlButtonStatus, setSystemControlButtonStatus] = useState(false)
    // true -> 系统开机,显示关机按钮
    // false -> 系统关机,显示开机按钮

    const [refresh,setRefresh] = useState(true);
    // 刷新触发器

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
                            status: room.airConditioner.status,
                            roomId: room.airConditioner.roomId,
                            speed: room.airConditioner.speed,
                            targetTemperature: room.airConditioner.targetTemperature,
                            temperature: room.airConditioner.temperature
                        }
                    }
                    newRoomList.push(newRoom);
                }
                newRoomList.sort((a, b) => {
                    return a.info.id > b.info.id ? 1 : -1
                })
                setRoomList(newRoomList);
            } else {
                console.log('请求房间列表不存在!')
            }
        }
        getRooms()

    }, [refresh]);

    useEffect(() => {
        const getSystemStatus = async () => {
            const responses = await client.GET('/api/airConditionerManage')
            if (responses.response.status === 200 && responses.data !== undefined) {
                setSystemStatus({
                    cooling: responses.data.cooling,
                    minTemperature: responses.data.minTemperature,
                    maxTemperature: responses.data.maxTemperature,
                    defaultTemperature: responses.data.defaultTemperature,
                    defaultFanSpeed: responses.data.defaultFanSpeed,
                    highSpeedPerDegree: responses.data.highSpeedPerDegree,
                    middleSpeedPerDegree: responses.data.middleSpeedPerDegree,
                    lowSpeedPerDegree: responses.data.lowSpeedPerDegree,
                    backSpeed: responses.data.backSpeed,
                    temperatureThreshold: responses.data.temperatureThreshold,
                    pricePerDegree: responses.data.pricePerDegree
                })
                setSystemControlButtonStatus(true)
            } else {
                setSystemStatus({
                    cooling: true,
                    minTemperature: 0,
                    maxTemperature: 0,
                    defaultTemperature: 0,
                    defaultFanSpeed: 0,
                    highSpeedPerDegree: 0,
                    middleSpeedPerDegree: 0,
                    lowSpeedPerDegree: 0,
                    backSpeed: 0,
                    temperatureThreshold: 0,
                    pricePerDegree: 0
                })
                setSystemControlButtonStatus(false)
            }

        }

        getSystemStatus();
    }, [showSettingModel])


    const {
        lastMessage,
    } = useWebSocket(SOCKET_URL + 'airConditioner/ws/', {
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
                                status: roomState.status,
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
                return a.info.id > b.info.id ? 1 : -1
            })
            setRoomList(newRoomList)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [lastMessage])

    const handleTurnOnButton = async () => {
        const response = await client.PUT('/api/airConditionerManage/open');
        if (response.response.status === 200) {
            enqueueSnackbar("空调系统启动成功", {
                variant: "success",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setShowSettingModel(true);
            setSystemControlButtonStatus(true)
        } else {
            enqueueSnackbar("空调系统启动失败", {
                variant: "error",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setSystemControlButtonStatus(false)
        }
    }

    const handleTurnOffButton = async () => {
        const response = await client.PUT('/api/airConditionerManage/close');
        if (response.response.status === 200) {
            enqueueSnackbar("空调系统关闭成功", {
                variant: "success",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setSystemControlButtonStatus(false)
        } else {
            enqueueSnackbar("空调系统关闭失败", {
                variant: "error",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setSystemControlButtonStatus(true)
        }
    }

    const handleResetButton = async () => {
        const responses = await client.POST('/api/airConditionerManage/reset');
        if (responses.response.status === 200) {
            enqueueSnackbar("空调系统重置成功", {
                variant: "success",
                autoHideDuration: 1500,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        } else {
            enqueueSnackbar("空调系统重置失败", {
                variant: "error",
                autoHideDuration: 1500,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }
    }


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
                    <Grid item xs={4}/>
                    <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {
                            systemControlButtonStatus ?
                                <Button variant="outlined" onClick={handleTurnOffButton} color={'warning'}>
                                    关机
                                </Button>
                                :
                                <Button variant="outlined" onClick={handleTurnOnButton} color={'primary'}>
                                    开机
                                </Button>
                        }

                    </Grid>

                    <Grid item xs={2} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        {
                            systemControlButtonStatus ?
                                <Button variant="outlined" onClick={() => setShowSettingModel(true)} color={'primary'}>
                                    配置
                                </Button>
                                :
                                <></>
                        }

                    </Grid>

                    <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                        <Button variant="outlined" onClick={handleResetButton}>
                            重置
                        </Button>
                    </Grid>

                    {userAuth === 'sudo' ? (<>
                            <Grid item xs={2} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button variant="outlined"
                                        onClick={() => setShowTestModel(true)}
                                        color={'secondary'}>
                                    测试脚本
                                </Button>
                            </Grid>
                            <Grid item xs={2}/>
                        </>

                    ) : (
                        <Grid item xs={4}/>
                    )}

                </Grid>
            </Box>
            <Box sx={{
                position: "absolute",
                width: "100%",
                top: "10%",
                height: "90%",
                boxSizing: "border-box",
                padding: '10px',
                overflowY: "auto"
            }}>
                <Grid container columnSpacing={3} rowSpacing={3}
                      sx={{position: "relative", left: "5%", width: "90%", height: "100%"}}>
                    {
                        roomList.map((room) => {
                            return <Grid item xs={2.4} key={room.info.id}
                                         sx={{position: "relative", alignItems: "center", textAlign: "center"}}>
                                <AirConStateCard data={room} key={room.info.id}/>
                            </Grid>
                        })
                    }

                </Grid>
            </Box>
        </Box>
        <SystemSettingModal
            defaultStatus={systemStatus}
            open={showSettingModel}
            onClose={setShowSettingModel}/>
        <TestConditionModal
            open={showTestModel}
            onClose={setShowTestModel}
            refresh={refresh}
        setRefresh={setRefresh}/>
    </>
}

import {
    Card,
    CardContent,
    Stack,
    Typography,
    Box,
    ToggleButtonGroup,
    ToggleButton,
    ButtonGroup,
    Button,
    IconButton
} from "@mui/material";
import {KeyboardArrowUp, KeyboardArrowDown, PowerSettingsNew} from '@mui/icons-material';
import React, {useEffect, useState} from "react";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {enqueueSnackbar} from "notistack";

interface airConditionerState {
    opening: boolean,
    targetTemperature: number,
    speed: 0 | 1 | 2 | undefined
}

export function AirConControlCard({roomId}: { roomId: string }) {
    const authMiddleware = useAuthMiddleware();
    const client = createClient<openapi.paths>();
    client.use(authMiddleware)
    const [targetState, setTargetState] = useState<airConditionerState>({
        "opening": false,
        "targetTemperature": 0,
        "speed": 0
    })
    const [targetChanged, setTargetChanged] = useState(false);

    const [powerButtonColor, setPowerButtonColor] = useState('gray')

    useEffect(() => {
        const getRoomInfo = async () => {
            const responses = await client.GET('/api/room/{roomId}', {
                params: {
                    path: {
                        roomId: roomId
                    }
                }
            })
            if (responses.response.status === 200 && responses.data !== undefined) {
                setTargetState({
                    targetTemperature: responses.data.airConditioner.targetTemperature,
                    speed: responses.data.airConditioner.speed,
                    opening: responses.data.airConditioner.opening,
                })
                if(responses.data.airConditioner.opening) {
                    setPowerButtonColor('#1976d2')
                } else {
                    setPowerButtonColor('gray')
                }
                // if (responses.data.checkinStatus !== undefined && responses.data.checkinStatus.checkout) {
                //     enqueueSnackbar("您已退房，无法使用空调服务", {
                //         variant: "error",
                //         autoHideDuration: 1500,
                //         anchorOrigin: {
                //             vertical: 'top',
                //             horizontal: 'center',
                //         }
                //     });
                // } else {
                //     setTargetState({
                //         opening: responses.data.airConditioner.opening,
                //         targetTemperature: responses.data.airConditioner.temperature,
                //         speed: responses.data.airConditioner.speed
                //     })
                // }
            }
        }
        getRoomInfo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomId]);
    const handleWindSpeedChange = (
        _event: React.MouseEvent<HTMLElement>,
        newSpeed: string,
    ) => {

        setTargetState({
            ...targetState,
            // @ts-expect-error ...
            speed: parseInt(newSpeed)
        })
        setTargetChanged(true)
    }

    const handlePowerButton = async () => {
        if (targetState.opening) {
            // 关机
            const responses = await client.POST('/api/airConditioner/{roomId}', {
                params: {
                    path: {
                        roomId: roomId
                    }
                },
                body: {
                    open: false,
                    targetTemperature: targetState.targetTemperature,
                    speed: targetState.speed
                }
            })
            if (responses.response.status === 200) {
                setPowerButtonColor('gray');
                setTargetState({...targetState, opening: false})
                enqueueSnackbar("空调已关闭", {
                    variant: "success",
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                });
            } else {
                enqueueSnackbar("无法关闭空调，请联系空调管理员，准备破产", {
                    variant: "error",
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                });
            }

        } else {
            // 开机
            const responses = await client.POST('/api/airConditioner/{roomId}', {
                params: {
                    path: {
                        roomId: roomId
                    }
                },
                body: {
                    open: true,
                    targetTemperature: targetState.targetTemperature,
                    speed: targetState.speed
                }
            })
            if (responses.response.status === 200) {
                setPowerButtonColor('#1976d2');
                setTargetState({...targetState, opening: true})
                enqueueSnackbar("空调已开启", {
                    variant: "success",
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                });
            } else {
                enqueueSnackbar("无法开启空调，请联系空调管理员", {
                    variant: "error",
                    autoHideDuration: 1500,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                });
            }
        }
    }

    const handleTempUpButton = () => {
        setTargetState({
            ...targetState,
            targetTemperature: targetState.targetTemperature + 1
        })
        setTargetChanged(true);
    }

    const handleTempDownButton = () => {
        setTargetState({
            ...targetState,
            targetTemperature: targetState.targetTemperature - 1
        })
        setTargetChanged(true);
    }

    const handleSendButton = async () => {
        const responses = await client.POST('/api/airConditioner/{roomId}', {
            params: {
                path: {
                    roomId: roomId
                }
            },
            body: {
                open: targetState.opening,
                targetTemperature: targetState.targetTemperature,
                speed: targetState.speed
            }
        })
        if (responses.response.status === 200) {
            enqueueSnackbar("发送空调服务请求成功", {
                variant: "success",
                autoHideDuration: 1500,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setTargetChanged(false);
        } else {
            enqueueSnackbar("发送空调服务请求失败", {
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
        <Card sx={{position: "relative", height: "100%", width: "100%", borderRadius: "0 4px 4px 0"}}>
            <CardContent sx={{height: "100%", width: "100%"}}>
                <Stack sx={{height: "100%", width: "100%"}}>
                    <Box sx={{
                        display: "grid",
                        width: "100%",
                        height: "30%",
                        placeItems: "center",
                        borderRadius: "4px",
                        border: "2px solid #1976d255"
                    }}>
                        <Typography
                            sx={{
                                position: "relative",
                                display: "grid",
                                width: "100%",
                                height: "5%",
                                placeItems: "center",
                                color: "#1976d2"
                            }}>
                            目标温度
                        </Typography>
                        <Typography variant={"h2"}
                                    sx={{
                                        position: "relative",
                                        display: "grid",
                                        width: "100%",
                                        height: "95%",
                                        placeItems: "center"
                                    }}>
                            {targetState.targetTemperature.toFixed(2)}
                        </Typography>
                    </Box>
                    <Box sx={{height: "5%", width: "100%"}}/>
                    <Box sx={{
                        display: "grid",
                        width: "100%",
                        height: "15%",
                        placeItems: "center",
                    }}>
                        <IconButton aria-label="power" onClick={handlePowerButton}>
                            <PowerSettingsNew sx={{fontSize: 60, color: powerButtonColor}}/>
                        </IconButton>
                    </Box>
                    <Box sx={{height: "5%", width: "100%"}}/>
                    <ButtonGroup variant="outlined"
                                 fullWidth={true}
                                 aria-label="温度控制"
                                 sx={{width: "100%", height: "10%"}}
                                 disabled={!targetState.opening}
                    >
                        <Button onClick={handleTempUpButton}>
                            <KeyboardArrowUp fontSize={"large"}/>
                        </Button>
                        <Button onClick={handleTempDownButton}>
                            <KeyboardArrowDown fontSize={"large"}/>
                        </Button>
                    </ButtonGroup>

                    <Box sx={{height: "5%", width: "100%"}}/>

                    <ToggleButtonGroup
                        color="primary"
                        value={targetState.speed?.toString()}
                        exclusive
                        onChange={handleWindSpeedChange}
                        aria-label="风速"
                        fullWidth={true}
                        size={"large"}
                        sx={{width: "100%", height: "10%"}}
                        disabled={!targetState.opening}
                    >
                        <ToggleButton value="0">低速风</ToggleButton>
                        <ToggleButton value="1">中速风</ToggleButton>
                        <ToggleButton value="2">高速风</ToggleButton>
                    </ToggleButtonGroup>

                    <Box sx={{height: "10%", width: "10%"}}/>
                    <Button variant="outlined"
                            sx={{height: "10%", width: "100%"}}
                            onClick={handleSendButton}
                            disabled={!targetState.opening || !targetChanged}>
                        send
                    </Button>
                </Stack>
            </CardContent>
        </Card>
    </>
}

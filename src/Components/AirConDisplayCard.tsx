import {
    Card,
    CardContent,
    Stack,
    Typography,
    Box,
    Grid
} from "@mui/material";
import useWebSocket from "react-use-websocket";
import {useCallback, useEffect,  useState} from "react";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";

interface airConditionerState {
    temperature: number,
    speed: 0 | 1 | 2,
    cooling : boolean,
    waitingNum: number
}

export function AirConDisplayCard({roomId}:{roomId : string}) {
    const authMiddleware = useAuthMiddleware();
    const client = createClient<openapi.paths>();
    client.use(authMiddleware)
    const [currentState, setCurrentState] = useState<airConditionerState>({
        temperature: 0,
        speed: 0,
        cooling : false,
        waitingNum: 0
    })

    const getSocketUrl = useCallback(() => {
        console.log(roomId)
        return 'ws://martina.rrricardo.top/api/airConditioner/ws/' + roomId;
    },[roomId]);

    const {
        lastMessage,
    } = useWebSocket(getSocketUrl, {
        onOpen: () => console.log('websocket opened'),
        retryOnError: true,
        shouldReconnect: () => true,
        reconnectAttempts: 10,
        reconnectInterval: (attemptNumber) =>
            Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    });

    useEffect(() => {
        if (lastMessage !== null) {
            console.log(JSON.parse(lastMessage.data))
            const data = JSON.parse(lastMessage.data)
            setCurrentState({
                temperature : data.temperature,
                speed: data.speed,
                cooling : data.cooling,
                waitingNum : 114514
            })
        }
    }, [lastMessage]);


    return <>
        <Card sx={{position: "relative", height: "100%", width: "100%", borderRadius: "4px 0 0 4px"}}>
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
                            实际温度
                        </Typography>
                        <Typography variant={"h2"}
                                    sx={{
                                        position: "relative",
                                        display: "grid",
                                        width: "100%",
                                        height: "95%",
                                        placeItems: "center"
                                    }}>
                            {currentState.temperature}
                        </Typography>
                    </Box>
                    <Box sx={{height: "5%", width: "100%"}}/>
                    <Grid container
                          spacing={0}
                          sx={{width: "100%", height: "30%", borderRadius: "4px", border: "2px solid #1976d255"}}>
                        <Grid item xs={4}>
                            <Box sx={{display: "grid", width: "100%", height: "100%", placeItems: "center"}}>
                                <Typography
                                    sx={{
                                        position: "relative",
                                        display: "grid",
                                        width: "100%",
                                        height: "5%",
                                        placeItems: "center",
                                        color: "#1976d2"
                                    }}>
                                    风速
                                </Typography>
                                <Typography variant={"h5"}
                                            sx={{
                                                position: "relative",
                                                display: "grid",
                                                width: "100%",
                                                height: "95%",
                                                placeItems: "center"
                                            }}>
                                    {
                                        currentState.speed === 0 ? '低速风' : (
                                            currentState.speed === 1 ? '中速风' : '高速风')
                                    }

                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{display: "grid", width: "100%", height: "100%", placeItems: "center"}}>
                                <Typography
                                    sx={{
                                        position: "relative",
                                        display: "grid",
                                        width: "100%",
                                        height: "5%",
                                        placeItems: "center",
                                        color: "#1976d2"
                                    }}>
                                    模式
                                </Typography>
                                <Typography variant={"h5"}
                                            sx={{
                                                position: "relative",
                                                display: "grid",
                                                width: "100%",
                                                height: "95%",
                                                placeItems: "center"
                                            }}>
                                    {
                                        currentState.cooling ? '制冷' : '制热'
                                    }
                                </Typography>
                            </Box>
                        </Grid>
                        <Grid item xs={4}>
                            <Box sx={{display: "grid", width: "100%", height: "100%", placeItems: "center"}}>
                                <Typography
                                    sx={{
                                        position: "relative",
                                        display: "grid",
                                        width: "100%",
                                        height: "5%",
                                        placeItems: "center",
                                        color: "#1976d2"
                                    }}>
                                    计费费率
                                </Typography>
                                <Typography variant={"h5"}
                                            sx={{
                                                position: "relative",
                                                display: "grid",
                                                width: "100%",
                                                height: "95%",
                                                placeItems: "center"
                                            }}>
                                    {
                                        currentState.speed === 0 ? '0.1元/度' : (
                                            currentState.speed === 1 ? '0.2元/度' : '0.3元/度')
                                    }
                                </Typography>
                            </Box>
                        </Grid>
                    </Grid>
                    <Box sx={{height: "5%", width: "100%"}}/>
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
                            请求状态
                        </Typography>
                        <Typography variant={"h5"}
                                    sx={{
                                        position: "relative",
                                        display: "grid",
                                        width: "100%",
                                        height: "95%",
                                        placeItems: "center"
                                    }}>
                            前面还有{currentState.waitingNum}位用户在等待
                        </Typography>
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    </>
}

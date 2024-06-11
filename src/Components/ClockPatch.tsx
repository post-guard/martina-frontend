import {useEffect, useRef, useState} from "react";
import dayjs from "dayjs";
import {Box, Stack} from "@mui/material";
import Typography from "@mui/material/Typography";
import * as openapi from "../Interfaces/openapi";
import createClient from "openapi-fetch";

export default function ClockPatch() {
    const [currentTime, setCurrentTime] = useState({
        year: 1970,
        month: 1,
        date: 1,
        time: '00:00:00'
    });
    // const {
    //     lastMessage,
    // } = useWebSocket(SOCKET_URL + 'time', {
    //     onOpen: () => console.log('clock websocket opened'),
    //     retryOnError: true,
    //     shouldReconnect: () => true,
    //     reconnectAttempts: 10,
    //     reconnectInterval: (attemptNumber) =>
    //         Math.min(Math.pow(2, attemptNumber) * 1000, 10000),
    // });
    //
    // useEffect(() => {
    //     if (lastMessage !== null) {
    //         const time = dayjs(JSON.parse(lastMessage.data).now)
    //         setCurrentTime({
    //             year: time.year(),
    //             month: time.month() + 1,
    //             date: time.date(),
    //             time: time.format('HH:mm:ss')
    //         })
    //     }
    // }, [lastMessage])
    const client = createClient<openapi.paths>();
    const lastMessage = useRef();
    useEffect(() => {

        const intervalId = setInterval(() => {
            client.GET('/api/time/now').then(response => {
                // @ts-expect-error ...
                lastMessage.current = response.data as openapi.components["schemas"]["TimeResponse"];
                if (lastMessage.current !== undefined) {
                    console.log(lastMessage.current)
                    // @ts-expect-error ...
                    const time = dayjs(lastMessage.current.now)
                    setCurrentTime({
                        year: time.year(),
                        month: time.month() + 1,
                        date: time.date(),
                        time: time.format('HH:mm:ss')
                    })

                }
            })


        }, 1000)
        return () => clearInterval(intervalId);

    }, []);

    return <>
        <Stack sx={{display: "flex", alignItems: "center"}}>
            <Box>
                <Typography>
                    {currentTime.year}年{currentTime.month}月{currentTime.date}日
                </Typography>
            </Box>
            <Box>
                <Typography>
                    {currentTime.time}
                </Typography>
            </Box>
        </Stack>
    </>
}

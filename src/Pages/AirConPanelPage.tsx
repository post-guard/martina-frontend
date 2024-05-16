import {
    Box,
    Card,
    CardContent,
    Grid,
    styled,
    Typography,
    Select,
    FormControl,
    InputLabel,
    MenuItem,
    SelectChangeEvent
} from "@mui/material";
import {AirConControlCard} from "../Components/AirConControlCard.tsx";
import {AirConDisplayCard} from "../Components/AirConDisplayCard.tsx";
import {useEffect, useRef, useState} from "react";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAppSelector} from "../Utils/StoreHooks.ts";

interface Room {
    "roomId": string,
    "roomName": string,
    "pricePerDay": number,
    "roomBaiscTemperature": number,
    "airConditioner": {
        "roomId": string,
        "opening": boolean,
        "temperature": number,
        "targetTemperature": number,
        "speed": number,
        "cooling": boolean
    },
    "checkinStatus": boolean | null
}
const client = createClient<openapi.paths>();
export function AirConPanelPage() {
    const authMiddleware = useAuthMiddleware();

    client.use(authMiddleware)
    const user = useAppSelector((store) => store.userInfo);
    const disable = useRef(false);
    const [roomId, setRoomId] = useState('');
    const [roomList, setRoomList] = useState<Room[]>([]);
    const CardContentNoPadding = styled(CardContent)(`
    &:last-child {
        padding-bottom: 0;
    }
    `);

    useEffect(() => {
        const getRooms = async () => {
            const responses = await client.GET('/api/room')
            if (responses.response.status === 200 && responses.data !== undefined) {
                const newRoomList: Room[] = [];
                for (let pos = 0; pos < responses.data.length; pos++) {
                    // @ts-expect-error 懒得写就这样
                    newRoomList.push(responses.data[pos]);
                }
                if(responses.data.length >= 1) {
                    setRoomId(responses.data[0].roomId);
                }

                setRoomList(newRoomList);
            }
        }
        getRooms()
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [client]);

    useEffect(() => {

        const getCurrentRoomId = async () => {
            const responses = await client.GET('/api/user/{userId}', {
                params: {
                    path: {
                        userId: user.id
                    }
                }
            })
            if (responses.response.status === 200 && responses.data !== undefined && responses.data.checkin !== undefined) {
                setRoomId(responses.data.checkin.roomId);
                disable.current = responses.data.checkin.checkout;
            }
        }

        if (user.auth === 'guest') {
            getCurrentRoomId();
        } else if (user.auth === 'sudo' || user.auth === 'airconAdmin') {
            // 超管和空管能直接操控空调
            disable.current = false;
        } else {
            // 其他不能操控空调
            disable.current = true;
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [roomList, roomId]);

    //  sx={{position:"absolute",width : "10%",height : "10%",top : '2%',left: "50%",transform:"translateX(-50%)"}}
    return <>
        <Box sx={{position: "relative", width: "100%", height: "100%", display: "flex", alignItems: "center"}}>

            <FormControl sx={{
                position: "absolute",
                width: "10%",
                height: "10%",
                top: '2%',
                left: "50%",
                transform: "translateX(-50%)"
            }}>
                <InputLabel id="air-con-room-select-label">Room</InputLabel>
                <Select
                    labelId="air-con-room-select-label"
                    id="air-con-room-select"
                    value={roomId}
                    label="Room"
                    size={'small'}
                    disabled={user.auth === 'guest'}
                    onChange={(event: SelectChangeEvent) => {
                        setRoomId(event.target.value as string)
                    }}
                >
                    {
                        roomList.map((room) => {
                            return <MenuItem value={room.roomId}
                                             key={room.roomId}>
                                {room.roomName}
                            </MenuItem>
                        })
                    }

                </Select>
            </FormControl>


            <Grid container rowSpacing={0} sx={{position: "relative", height: "80%"}}>
                <Grid item xs={2}/>
                <Grid item xs={8}>
                    <Card sx={{position: "relative", height: "100%", width: "100%", backgroundColor: "#1976d2"}}>
                        <CardContentNoPadding style={{height: "100%", width: "100%", padding: "4px"}}>
                            {
                                disable.current ? (
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            width: '100%',
                                            height: '100%',
                                            textAlign: 'center',
                                            alignItems: 'center'
                                        }}>
                                        <Typography variant={'h4'} sx={{width: '100%', height: '10%', color: 'white'}}>
                                            空调控制面板不可使用
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Grid container sx={{position: "relative", height: "100%", width: "100%"}}>
                                        <Grid item xs={8}>
                                            <AirConDisplayCard roomId={roomId}/>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <AirConControlCard roomId={roomId}/>
                                        </Grid>
                                    </Grid>
                                )
                            }
                        </CardContentNoPadding>
                    </Card>
                </Grid>
                <Grid item xs={2}/>
            </Grid>
        </Box>
    </>
}

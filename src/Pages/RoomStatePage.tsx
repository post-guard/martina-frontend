import {useEffect, useState} from "react";
import {Room} from "../Interfaces/Room.ts";
import CheckInModal from "../Components/CheckInModal.tsx";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {Box, Button, Grid} from "@mui/material";
import {useAppSelector} from "../Utils/StoreHooks.ts";
import CreateRoomModal from "../Components/CreateRoomModal.tsx";
import RoomStateCard from "../Components/RoomStateCard.tsx";
import {green, red} from "@mui/material/colors";
import DeleteRoomModal from "../Components/DeleteRoomModal.tsx";


const client = createClient<openapi.paths>();

export function RoomStatePage() {
    const authMiddleware = useAuthMiddleware();
    const [rooms, setRooms] = useState<Room[]>([])
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
    const [showDeleteRoomModal, setShowDeleteRoomModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room>({userId: "", userName: "", id:'',name:'',status:'occupied'});

    useEffect(() => {
        getAllRooms().then(newRooms => {
            getRoomOccupant(newRooms).then(rooms => {
                setRooms(rooms);
            })
        })
    }, []);

    async function getAllRooms(): Promise<Room[]> {
        const response = await client.GET("/api/room");
        if(response.response.status == 200) {
            if(response.data !== undefined) {
                return response.data.map((room) => ({
                    id: room.roomId,
                    name: room.roomName,
                    status: room.checkinStatus === null || room.checkinStatus?.checkout ? 'free' : 'occupied',
                    userId: room.checkinStatus === undefined || room.checkinStatus === null || room.checkinStatus?.checkout ? '' : room.checkinStatus.userId,
                    userName: ''
                }));
            }
        }

        return [];
    }

    async function getRoomOccupant(rooms: Room[]): Promise<Room[]> {
        const promises = rooms.map(async (room):Promise<Room> => {
            if(room.status === 'free') {
                return room;
            }

            const response = await client.GET('/api/user/{userId}', {
                params: {
                    path: {
                        userId: room.userId
                    }
                }
            });

            if(response.response.status === 200 && response.data !== undefined) {
                room.userName = response.data.name;
            }
            else {
                room.userName = '';
            }

            return room;
        });

        return await Promise.all(promises);
    }

    const onRoomClick = (room: Room) => {
        refreshRooms();
        setSelectedRoom(room);
        setShowCheckInModal(true);
    }

    const onRegisterModalClose = () => {
        setShowCheckInModal(false);
        refreshRooms();
    }

    const onCreateRoomModalClose = () => {
        setShowCreateRoomModal(false);
        refreshRooms();
    }

    const onDeleteModalClose = () => {
        setShowDeleteRoomModal(false);
        refreshRooms();
    }

    const refreshRooms = () => {
        getAllRooms().then(newRooms => {
            getRoomOccupant(newRooms).then(rooms => {
                setRooms(rooms);
            })
        })
    }

    client.use(authMiddleware);

    const userInfo = useAppSelector((store) => store.userInfo);

    return (
        <Box sx={{position: "relative", width: "100%", height: "100%"}}>
            <Box sx={{
                position: "relative",
                width: "100%",
                height: "10%",
                boxSizing: "border-box",
                padding: '5px',
            }}>
                {   //超级管理员才能创建/删除房间
                    userInfo.auth === 'sudo' &&
                    <Grid container spacing={0}
                          sx={{position: "relative", width: "100%", height: "100%"}}>
                        <Grid item xs={5}/>
                        <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button
                                variant="contained"
                                sx={{backgroundColor:green[700],
                                    ":hover": {backgroundColor:green[800]},}}
                                onClick={() => setShowCreateRoomModal(true)}
                            >
                                创建房间
                            </Button>
                        </Grid>

                        <Grid item xs={1} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                            <Button
                                variant="contained"
                                sx={{backgroundColor:red[600],
                                    ":hover": {backgroundColor:red[900]},
                                }}
                                onClick={() => setShowDeleteRoomModal(true)}
                            >
                                删除房间
                            </Button>
                        </Grid>
                        <Grid item xs={5}/>
                    </Grid>
                }
            </Box>

            <Box sx={{
                position: "absolute",
                width: "100%",
                top: "10%",
                height: "90%",
                boxSizing: "border-box",
                padding: '10px',
                overflowY: "auto",
                display:'flex',
                justifyContent:'center'
            }}>
                <Grid container columnSpacing={2} rowSpacing={3}
                      sx={{position: "relative", width: "80%", height: "100%"}}>
                    {
                        rooms.map((room, index) => {
                            return <Grid item xs={2.4} key={index}
                                         sx={{position: "relative",alignItems: "center", textAlign: "center"}}>
                                <RoomStateCard key={index} room={room} onRoomClick={onRoomClick} />
                            </Grid>
                        })
                    }
                </Grid>
            </Box>

            {
                showCheckInModal &&
                <CheckInModal
                    onClose={onRegisterModalClose}
                    selectedRoom={selectedRoom}
                >
                </CheckInModal>
            }

            {
                showCreateRoomModal &&
                <CreateRoomModal onClose={onCreateRoomModalClose}>
                </CreateRoomModal>
            }

            {
                showDeleteRoomModal &&
                <DeleteRoomModal rooms={rooms} onClose={onDeleteModalClose}>
                </DeleteRoomModal>
            }
        </Box>
    )
}
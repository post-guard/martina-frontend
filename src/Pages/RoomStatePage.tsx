import {useEffect, useState} from "react";
import {Room} from "../Interfaces/Room.ts";
import RoomList from "../Components/RoomList.tsx";
import CheckInModal from "../Components/CheckInModal.tsx";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {enqueueSnackbar} from "notistack";


const client = createClient<openapi.paths>();

export function RoomStatePage() {
    const authMiddleware = useAuthMiddleware();
    const [rooms, setRooms] = useState<Room[]>([])
    const [showCheckInModal, setShowCheckInModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState<Room>({id:'',name:'',status:'occupied'});

    useEffect(() => {
        getAllRooms().then(newRooms => {
            setRooms(newRooms);
        })
    }, []);

    async function getAllRooms(): Promise<Room[]> {
        const response = await client.GET("/api/room");
        if(response.response.status == 200) {
            if(response.data !== undefined) {
                return response.data.map((room) => ({
                    id: room.roomId,
                    name: room.roomName,
                    status: room.checkinStatus === null || room.checkinStatus?.checkout ? 'free' : 'occupied'
                }));
            }
        }

        return [];
    }

    const onRoomClick = (room: Room) => {
        refreshRooms();
        setSelectedRoom(room);
        if(room.status === 'occupied') {
            enqueueSnackbar("当前房间已被占用！", {
                variant: "warning",
                autoHideDuration:3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }
        else {
            setShowCheckInModal(true);
        }
    }

    const onRegisterModalClose = () => {
        setShowCheckInModal(false);
        refreshRooms();
    }

    const refreshRooms = () => {
        getAllRooms().then(newRooms => {
            setRooms(newRooms);
        })
    }

    client.use(authMiddleware);

    return (
        <div className={"room-state-page"} style={{
            position: "relative",
            width: "100%",
            height: "100%",
            background: "gainsboro"
        }}>
            <RoomList rooms={rooms} onRoomClick={onRoomClick}>
            </RoomList>

            {
                showCheckInModal &&
                <CheckInModal
                    onClose={onRegisterModalClose}
                    selectedRoom={selectedRoom}
                >
                </CheckInModal>
            }

        </div>
    )
}
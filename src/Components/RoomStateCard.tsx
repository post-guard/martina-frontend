import {Room} from "../Interfaces/Room.ts";
import React from "react";
import {Card, Typography} from "@mui/material";

interface RoomProps {
    room: Room;
    onRoomClick: (room: Room) => void;
}

const RoomStateCard: React.FC<RoomProps> = ({room, onRoomClick}) => {
    //绿色表示已入住，蓝色表示空闲
    const backgroundColor = room.status == 'occupied'
        ? '#6ed31c'
        : '#4991e0';

    return (
        <Card
            sx={{
                backgroundColor,
                position:'relative',
                width:'85%',
                height:'7rem',
                textAlign:'center',
                alignContent:'center',
                fontSize:'20px',
                color:'white',
                fontWeight:'bold',
                borderRadius:'15px'
            }}
            onClick={() => onRoomClick(room)}
        >
            {room.name} - {room.status === 'occupied' ? '已入住' : '空闲'}
            {
                room.status === 'occupied' &&
                <Typography>入住人:{room.userName}</Typography>
            }
        </Card>
    );
};

export default RoomStateCard;

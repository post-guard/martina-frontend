import {Room} from "../Interfaces/Room.ts";
import React from "react";
import {Card, Grid} from "@mui/material";

interface RoomProps {
    room: Room;
    onRoomClick: (room: Room) => void;
}

const RoomItem: React.FC<RoomProps> = ({room, onRoomClick}) => {
    const backgroundColor = room.status == 'occupied'
        ? '#6ed31c'
        : '#4991e0';

    return (
        <Grid
            item
            xs={2}
            width='100%'
            height='20%'
        >
            <Card
                className='room-item'
                style={{
                    backgroundColor,
                    width:'100%',
                    height:'100%',
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
            </Card>
        </Grid>
    );
};

export default RoomItem;
import {Room} from "../Interfaces/Room.ts";
import React from "react";
import RoomItem from "./RoomItem.tsx";
import {Box, Grid} from "@mui/material";

interface RoomListProps {
    rooms: Room[];
    onRoomClick: (room: Room) => void;
}

const RoomList: React.FC<RoomListProps> = ({ rooms, onRoomClick }) => {
    return (
        <Box sx={{
            overflowY:'auto',
            width:'100%',
            height:'100%',
            display:'flex',
            flexDirection:'column'
        }}>
            <Grid
                container
                spacing={1}
                rowGap={1}
                columnGap={1}
                sx={{
                    gridTemplateColumns: 'repeat(5,1fr)' ,
                    padding:"4rem 10rem 4rem 10rem",
                    width:'100%',
                    height:'100%',
                    justifyContent:'center',
                }}
            >
                {rooms.map((room) => (
                    <RoomItem key={room.id} room={room} onRoomClick={onRoomClick} />
                ))}
            </Grid>
        </Box>
    );
};

export default RoomList;
import {
    Card, Typography,Box
} from "@mui/material";

import {MonitorRoomState} from "../Interfaces/MonitorRoomState.ts";

export function AirConStateCard({data}: { data: MonitorRoomState }) {

    return <>
        <Card sx={{position:'relative',width: '100%', height: '12rem', borderRadius: '4px'}}>
            <Typography variant={'h6'} sx={{position:'relative',width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                {data.info.name}
            </Typography>
            <Box sx={{position:'relative',width: '100%', height: '10%', display: 'grid', placeItems: 'center'}} />
            <Typography variant={'h4'} sx={{position:'relative',width: '100%', height: '30%', display: 'grid', placeItems: 'center',color:"#1976d2"}}>
                {data.airConState.temperature.toFixed(2)}
            </Typography>
            <Box sx={{position:'relative',width: '100%', height: '5%', display: 'grid', placeItems: 'center'}} />

            <Typography sx={{position:'relative',width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                {data.airConState.cooling ? '制冷' : '制热'}
            </Typography>
            <Typography  sx={{position:'relative',width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                目标温度:{data.airConState.targetTemperature.toFixed(2)} °C
            </Typography>
            <Typography sx={{position:'relative',width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                {data.airConState.speed === 0 ? '低速风' : (data.airConState.speed === 1 ? '中速风' : '高速风')}
            </Typography>
            <Typography sx={{position:'relative',width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                {data.airConState.status === 0 ? '关机' : (data.airConState.status === 1 ? '等待' : '运行')}
            </Typography>
        </Card>
    </>
}

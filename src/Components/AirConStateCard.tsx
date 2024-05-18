import {
    Card, Typography,Box
} from "@mui/material";

import {MonitorRoomState} from "../Interfaces/MonitorRoomState.ts";

export function AirConStateCard({data}: { data: MonitorRoomState }) {

    return <>
        <Card sx={{width: '100%', height: '65%', borderRadius: '4px'}}>
            <Typography variant={'h6'} sx={{width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                {data.info.name}
            </Typography>
            <Box sx={{width: '100%', height: '10%', display: 'grid', placeItems: 'center'}} />
            <Typography variant={'h4'} sx={{width: '100%', height: '30%', display: 'grid', placeItems: 'center',color:"#1976d2"}}>
                {data.airConState.temperature.toFixed(2)}
            </Typography>
            <Box sx={{width: '100%', height: '5%', display: 'grid', placeItems: 'center'}} />

            <Typography sx={{width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                {data.airConState.cooling ? '制冷' : '制热'}
            </Typography>
            <Typography  sx={{width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                目标温度:{data.airConState.targetTemperature.toFixed(2)} °C
            </Typography>
            <Typography sx={{width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                {data.airConState.speed === 0 ? '低速风' : (data.airConState.speed === 1 ? '中速风' : '高速风')}
            </Typography>
            <Typography sx={{width: '100%', height: '10%', display: 'grid', placeItems: 'center'}}>
                {data.airConState.opening ? '运行' : '关机'}
            </Typography>
        </Card>
    </>
}

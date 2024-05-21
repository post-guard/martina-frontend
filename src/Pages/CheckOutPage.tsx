import {Box, Button, FormControl, InputBase, InputLabel, Select, Stack, TextField} from "@mui/material";
import IconButton from "@mui/material/IconButton";
import {Search} from "@mui/icons-material";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {useState} from "react";
import {enqueueSnackbar} from "notistack";
import {CheckInRecord} from "../Interfaces/CheckInRecord.ts";
import dayjs from "dayjs";
import CheckInRecordList from "../Components/CheckInRecordList.tsx";

const client = createClient<openapi.paths>();
export function CheckOutPage() {
    const authMiddleware = useAuthMiddleware();
    const [checkInRecords, setCheckInRecords] = useState<CheckInRecord[]>([]);
    const [displayType, setDisplayType] = useState('unCheckOut');
    const [searchFormData, setSearchFormData] = useState({
        'userId': "",
        'beginTime': "",
        'endTime': ""
    });

    const onSearchClick = async () => {
        if(searchFormData.userId === "") {
            enqueueSnackbar("请输入身份证号！", {
                variant: "warning",
                autoHideDuration:2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setCheckInRecords([]);
            return;
        }

        getCheckInRecords().then(newRecords => {
            setCheckInRecords(newRecords);
            if(newRecords.length === 0) {
                enqueueSnackbar("没有查到任何内容！", {
                    variant: "warning",
                    autoHideDuration:3000,
                    anchorOrigin: {
                        vertical: 'top',
                        horizontal: 'center',
                    }
                });
            }
        });
    }

    async function getCheckInRecords(): Promise<CheckInRecord[]> {
        //查询指定入住记录
        const response = await client.GET('/api/checkin', {
            params:{
                query:{
                    userId:searchFormData.userId,
                    beginTime:searchFormData.beginTime == "" ? undefined : dayjs(new Date(searchFormData.beginTime)).unix(),
                    endTime:searchFormData.endTime == "" ? undefined : dayjs(new Date(searchFormData.endTime)).unix()
                }
            }
        });

        if(response.response.status == 200 && response.data != undefined) {
            const roomPromises = response.data.map(async (record): Promise<CheckInRecord> => {
                //根据房间id查询房间名
                const responseForRoom = await client.GET('/api/room/{roomId}', {
                    params: {
                        path: {
                            roomId: record.roomId
                        }
                    }
                });

                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const {roomId, userId, ...left} = record;

                if(responseForRoom.response.status == 200 && responseForRoom.data !== undefined) {
                    return {...left, roomName:responseForRoom.data.roomName}
                }

                return {...left, roomName:""};
            });

            return await Promise.all(roomPromises);
        }

        return [];
    }

    const filterResults = () => {
        if(displayType === 'checkOut') {
            return checkInRecords.filter(record => record.checkout);
        }
        else if(displayType === 'unCheckOut'){
            return checkInRecords.filter(record => !record.checkout);
        }

        return checkInRecords;
    }

    client.use(authMiddleware);

    return (
        <div className={"check-out-page"}
            style={{
                position:'relative',
                width:'100%',
                height:'100%',
                display:'flex',
                justifyContent:'center'
            }}
        >
            <Stack spacing={5} sx={{ height: '100%', width:'60%', padding: "2rem 2rem 2rem 2rem", alignItems:'center'}}>
                <Box sx={{
                    padding: 2,
                    display:'flex',
                    width:'80%',
                    height:'10%',
                    borderRadius:'15px',
                    border:'2px solid black'
                }}>
                    <InputBase
                        placeholder='身份证号'
                        style={{width:'100%', height:'100%'}}
                        value={searchFormData.userId}
                        onChange={(e) => setSearchFormData({...searchFormData, userId: e.target.value})}
                    />
                    <IconButton type="submit" onClick={onSearchClick}>
                        <Search/>
                    </IconButton>
                </Box>

                <Box sx={{
                    display:'flex',
                    justifyContent:'space-between',
                    width:'80%',
                    height:'10%',
                }}>
                    <TextField
                        focused={false}
                        type='date'
                        label='开始日期'
                        InputLabelProps={{shrink: true}}
                        style={{height:'100%', width:'27%'}}
                        value={searchFormData.beginTime}
                        onChange={(e) => setSearchFormData({...searchFormData, beginTime: e.target.value})}
                    >
                    </TextField>
                    <TextField
                        focused={false}
                        type='date'
                        label='结束日期'
                        InputLabelProps={{shrink: true}}
                        style={{height:'100%', width:'27%'}}
                        value={searchFormData.endTime}
                        onChange={(e) => setSearchFormData({...searchFormData, endTime: e.target.value})}
                    >
                    </TextField>

                    <FormControl variant="outlined" style={{width:'27%', height:'100%'}}>
                        <InputLabel shrink>类型</InputLabel>
                        <Select
                            native
                            label="类型"
                            value={displayType}
                            onChange={(e) => setDisplayType(e.target.value)}
                        >
                            <option value={'all'}>全部</option>
                            <option value={'unCheckOut'}>未结账</option>
                            <option value={'checkOut'}>已结账</option>
                        </Select>
                    </FormControl>
                </Box>

                <Box sx={{
                    position:'absolute',
                    top:'30%',
                    width:'48%',
                    height:'50%',
                }}>
                    <CheckInRecordList records={filterResults()}>
                    </CheckInRecordList>
                </Box>


                {
                    filterResults().length > 0 &&
                    <Button variant='contained'
                            style={{
                                position:'absolute',
                                bottom:'3%',
                                right:'26%',
                                width:'5%',
                                height:'8%'
                    }}>
                        确认
                    </Button>
                }

            </Stack>
        </div>
    )
}
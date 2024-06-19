import {Box, Button, Modal, Paper, Stack, TextField, Typography} from "@mui/material";
import {enqueueSnackbar} from "notistack";
import React, {useEffect, useState} from "react";
import {Room} from "../Interfaces/Room.ts";
import {Form} from "react-router-dom";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import dayjs from 'dayjs'

const client = createClient<openapi.paths>();
interface CheckInModalProps {
    onClose: () => void;
    selectedRoom: Room;
}
const CheckInModal: React.FC<CheckInModalProps> = ({ onClose, selectedRoom}) => {
    const authMiddleware = useAuthMiddleware();
    const [confirmButtonState, setConfirmButtonState] = useState(true);
    const [registerFormData, setRegisterFormData] = useState({
        "roomId": selectedRoom.id,
        "userId": "",
        "username": "",
        "beginTime": "",
        "endTime": ""
    });
    const [defaultDate, setDefaultDate] = useState('');

    useEffect(() => {
        //获取并设置默认日期为当前系统日期
        getDefaultDate().then(defaultDate => {
            setRegisterFormData({"roomId": selectedRoom.id,
                "userId": "",
                "username": "",
                "beginTime": defaultDate,
                "endTime": defaultDate})
        })
    }, [selectedRoom])

    const getDefaultDate = async (): Promise<string> => {
        const response = await client.GET('/api/time/now')
        if(response.response.status === 200 && response.data !== undefined) {
            const date = dayjs(response.data.now * 1000).format('YYYY-MM-DD');
            setDefaultDate(date);
            return date;
        }

        return ''
    }

    const onConfirmClick = async () => {
        //设置按钮为不可操作
        setConfirmButtonState(false);
        const response = await client.POST("/api/checkin", {
            body: {
                "roomId": registerFormData.roomId,
                "userId": registerFormData.userId,
                "username": registerFormData.username,
                "beginTime": dayjs(new Date(registerFormData.beginTime)).add(1, 'second').unix(),
                "endTime": dayjs(new Date(registerFormData.endTime)).add(1, 'day').subtract(1, 'second').unix()
            }
        });

        if(response.response.status == 201 || response.response.status === 200) {
            const message = registerFormData.beginTime === defaultDate ?
                '入住成功!' :
                `预约成功! 预约时间${registerFormData.beginTime}-${registerFormData.endTime}`;
            enqueueSnackbar(message, {
                variant: "success",
                autoHideDuration:3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setTimeout(() => {
                onClose();
            }, 1000)
        } else if(response.response.status == 400) {
            const message = response.error?.message || selectedRoom.status === 'free' ? '登记失败' : '预约失败'
            enqueueSnackbar(message, {
                variant: "error",
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                }
            });
            setTimeout(() => {
                onClose();
            }, 1000)
        } else {
            enqueueSnackbar(selectedRoom.status === 'free' ? '登记失败' : '预约失败', {
                variant: "error",
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                }
            });
            setConfirmButtonState(true);
        }
    }

    client.use(authMiddleware);

    return (
        <>
            <Modal open={true}>
                <div
                    style={{
                        position:"absolute",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Paper style={{height: "85%", width: "35%"}}>
                        <Form style= {{height : "100%", width : '100%'}}>
                            <Stack spacing={4}
                                   sx={{height: '100%',
                                       padding: "2rem 2rem 2rem 2rem",
                                       display: "flex",
                                       justifyContent: "center",
                                       alignItems: "center"}}>
                                <Typography
                                    variant="h4"
                                    style={{textAlign: "center"}}
                                >
                                    {selectedRoom.status === 'free' ? '入住登记' : '预约登记'}
                                </Typography>

                                <TextField
                                    required
                                    id="customer-name"
                                    label="姓名"
                                    variant="standard"
                                    style={{width: "75%"}}
                                    value={registerFormData.username}
                                    onChange={(e) => setRegisterFormData({...registerFormData, username: e.target.value})}
                                >
                                </TextField>

                                <TextField
                                    required
                                    id="customer-id"
                                    label="波普特号"
                                    variant="standard"
                                    style={{width: "75%"}}
                                    value={registerFormData.userId}
                                    onChange={(e) => setRegisterFormData({...registerFormData, userId: e.target.value})}
                                >
                                </TextField>

                                <TextField
                                    required
                                    id="check-in-date"
                                    label="入住日期 ( 00:00:01 )"
                                    type="date"
                                    style={{width: "75%"}}
                                    InputLabelProps={{shrink: true}}
                                    value={registerFormData.beginTime.toString()}
                                    onChange={(e) => setRegisterFormData({...registerFormData, beginTime: e.target.value})}
                                >
                                </TextField>

                                <TextField
                                    required
                                    id="check-out-date"
                                    label="离开日期 ( 23:59:59 )"
                                    type="date"
                                    style={{width: "75%"}}
                                    InputLabelProps={{shrink: true}}
                                    value={registerFormData.endTime}
                                    onChange={(e) => setRegisterFormData({...registerFormData, endTime: e.target.value})}
                                >
                                </TextField>

                                <TextField
                                    id="room-name"
                                    label="房间号"
                                    defaultValue={selectedRoom.name}
                                    InputLabelProps={{shrink: true}}
                                    style={{width: "75%"}}
                                    inputProps={{readOnly:true}}
                                >
                                </TextField>

                                <Box sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    width: '75%'
                                }}>
                                    <Button
                                        variant="contained"
                                        sx={{ mr: 10 }}
                                        style={{width: "40%"}}
                                        onClick={onClose}>
                                        取消
                                    </Button>

                                    <Button
                                        variant="contained"
                                        disabled={!confirmButtonState}
                                        style={{width: "40%"}}
                                        onClick={onConfirmClick}>
                                        确认
                                    </Button>

                                </Box>
                            </Stack>
                        </Form>
                    </Paper>
                </div>
            </Modal>
        </>
    )
}

export default CheckInModal;

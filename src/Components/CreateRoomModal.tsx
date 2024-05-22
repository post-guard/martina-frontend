import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import {Form} from "react-router-dom";
import React, {useState} from "react";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {enqueueSnackbar} from "notistack";

const client = createClient<openapi.paths>();

interface CreateRoomModalProps {
    onClose: () => void;
}

const CreateRoomModal: React.FC<CreateRoomModalProps> = ({onClose}) => {
    const authMiddleware = useAuthMiddleware();
    const [confirmButtonState, setConfirmButtonState] = useState(true);
    const [createRoomFormData, setCreateRoomFormData] = useState({
        "roomName": "",
        "pricePerDay": "",
        "temperature":""
    })

    const onConfirmClick = async () => {
        setConfirmButtonState(false);
        const response = await client.POST('/api/room', {
            body: {
                "roomName": createRoomFormData.roomName,
                "pricePerDay": +createRoomFormData.pricePerDay,
                "roomBasicTemperature": +createRoomFormData.temperature
            }
        });

        if(response.response.status === 201) {
            enqueueSnackbar("创建房间成功，即将跳转页面", {
                variant: "success",
                autoHideDuration:2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setTimeout(() => {
                onClose();
            }, 2000)
        }
        else {
            enqueueSnackbar("创建房间失败", {
                variant: "error",
                autoHideDuration:2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setConfirmButtonState(true);
        }
    }

    client.use(authMiddleware);

    return(
        <Modal open={true}>
            <div
                style={{
                    position: "absolute",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                }}
            >
                <Form style={{width:'35%', height:'75%', backgroundColor:'white'}}>
                    <Stack spacing={7}
                           sx={{height: '100%',
                               padding: "2rem 2rem 2rem 2rem",
                               display: "flex",
                               flexDirection:'column',
                               justifyContent: "flex-start",
                               alignItems: "center"}}>
                        <Typography
                            variant="h4"
                            style={{textAlign: "center"}}
                        >
                            创建房间
                        </Typography>

                        <TextField
                            required
                            id='room-name'
                            label='房间名称'
                            variant='standard'
                            style={{width:'75%'}}
                            value={createRoomFormData.roomName}
                            onChange={(e) => setCreateRoomFormData({...createRoomFormData, roomName: e.target.value})}
                        >
                        </TextField>

                        <TextField
                            required
                            id='price-day'
                            label='价格（元/天）'
                            variant='standard'
                            style={{width:'75%'}}
                            value={createRoomFormData.pricePerDay}
                            onChange={(e) => setCreateRoomFormData({...createRoomFormData, pricePerDay: e.target.value})}
                        >
                        </TextField>

                        <TextField
                            required
                            id='temperature'
                            label='初始温度'
                            variant='standard'
                            style={{width:'75%'}}
                            value={createRoomFormData.temperature}
                            onChange={(e) => setCreateRoomFormData({...createRoomFormData, temperature: e.target.value})}
                        >
                        </TextField>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '75%',
                            height:'50%'
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
                                onClick={onConfirmClick}
                            >
                                确认
                            </Button>

                        </Box>
                    </Stack>
                </Form>
            </div>
        </Modal>
)
}

export default CreateRoomModal;
import {Room} from "../Interfaces/Room.ts";
import {ChangeEvent, FC, useState} from "react";
import {
    Box,
    Button,
    Checkbox,
    Dialog, DialogActions,
    DialogTitle,
    Modal,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {enqueueSnackbar} from "notistack";
import {Simulate} from "react-dom/test-utils";
import error = Simulate.error;

interface DeleteRoomModalProps {
    rooms: Room[];
    onClose: () => void
}

const client = createClient<openapi.paths>();
const DeleteRoomModal: FC<DeleteRoomModalProps> = ({rooms, onClose}) => {
    const authMiddleware = useAuthMiddleware();
    const [selectedRooms, setSelectedRooms] = useState<string[]>([]);
    const [confirmButtonState, setConfirmButtonState] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);

    const onConfirmClick = () => {
        if(selectedRooms.length === 0) {
            enqueueSnackbar("您还未选择要删除的房间", {
                variant: "warning",
                autoHideDuration:2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            return;
        }

        setConfirmButtonState(false);
        deleteRooms(selectedRooms);
    }

    const deleteRooms = (roomIds: string[]) => {
        Promise.all(
            roomIds.map(async (roomId) => {
                const response = await client.DELETE('/api/room/{roomId}', {
                    params: {
                        path:{
                            roomId:roomId
                        }
                    }
                });

                if(response.response.status !== 204 && response.response.status !== 200) {
                    throw error;
                }
            })
        ).then(() => {
            enqueueSnackbar("删除房间成功", {
                variant: "success",
                autoHideDuration:500,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setTimeout(() => {
                onClose();
            }, 500);
        }).catch((error) => {
            console.log('删除房间时出错:', error);

            enqueueSnackbar("删除房间失败", {
                variant: "error",
                autoHideDuration:1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setTimeout(() => {
                onClose();
            }, 1000);
        })
    }

    const handleOnChange = (roomId: string) => (event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        if(isChecked) {
            setSelectedRooms([...selectedRooms, roomId]);
        }
        else {
            setSelectedRooms(selectedRooms.filter((id) => id !== roomId));
        }
    }

    const handleClose = () => {
        setOpenDialog(false);
    }

    const handleDeleteAll = () => {
        setOpenDialog(false);
        deleteRooms(rooms.map((room) => room.id));
    }

    client.use(authMiddleware);

    return (
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
                <Paper sx={{height: "85%", width: "35%"}}>
                    <Stack spacing={4}
                           sx={{height: '100%',
                               padding: "2rem 2rem 2rem 2rem",
                               display: "flex",
                               alignItems: "center"}}>

                        <Box sx={{width:'100%', height:'10%'}}>
                            <Typography variant='h5' sx={{textAlign:'center'}}>
                                选择要删除的房间
                            </Typography>
                        </Box>

                        <Box sx={{
                            width:'100%',
                            height:'80%',
                            overflowY:'auto',
                            padding: "1rem 2rem 2rem 2rem"
                        }}>
                            {
                                rooms.map((room, index) => (
                                    <Box key={index} sx={{display:'flex', flexDirection:'row', alignItems:'center'}}>
                                        <Checkbox
                                            checked={selectedRooms.includes(room.id)}
                                            onChange={handleOnChange(room.id)}
                                        >
                                        </Checkbox>
                                        <Typography>
                                            {room.name}
                                        </Typography>
                                    </Box>
                                ))
                            }
                        </Box>

                        <Box sx={{
                            width:'100%',
                            height:'10%',
                            display:"flex",
                            justifyContent:'center',
                            alignItems:'center'
                        }}>
                            <Button onClick={() => setOpenDialog(true)} variant='contained' sx={{mr:5, width:'25%'}}>
                                删除所有
                            </Button>
                            <Button variant='contained' onClick={() => onClose()} sx={{mr:5, width:'25%'}}>
                                取消
                            </Button>
                            <Button
                                disabled={!confirmButtonState}
                                variant='contained'
                                onClick={() => onConfirmClick()}
                                sx={{width:'25%'}}>
                                确认
                            </Button>
                        </Box>

                        <Dialog
                            open={openDialog}
                            onClose={handleClose}
                        >
                            <DialogTitle id="alert-dialog-title">{"确定要删除所有房间?"}</DialogTitle>
                            <DialogActions>
                                <Button onClick={handleClose}>
                                    否
                                </Button>
                                <Button onClick={handleDeleteAll} autoFocus>
                                    是
                                </Button>
                            </DialogActions>
                        </Dialog>
                    </Stack>
                </Paper>
            </div>
        </Modal>
    )
}

export default DeleteRoomModal;

import {CheckInRecord} from "../Interfaces/CheckInRecord.ts";
import {FC} from "react";
import {Button, Modal, Paper, Stack, Typography} from "@mui/material";

interface BillModalProps {
    checkInRecords: CheckInRecord[],
    onClose: () => void;
}

const BillModal: FC<BillModalProps> = ({checkInRecords, onClose}) => {
    return (
        <>
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
                    <Paper sx={{width: '35%', height: '85%'}}>
                        <Stack spacing={4}
                               sx={{height: '100%',
                                   padding: "2rem 2rem 2rem 2rem",
                                   display: "flex",
                                   justifyContent: "center",
                                   alignItems: "center"}}>
                            <Typography variant={'h3'}>账单</Typography>
                            <Typography>获取到的checkInRecords长度:{checkInRecords.length}</Typography>
                            <Button variant='contained' onClick={onClose}>关闭</Button>
                            <Button variant='contained'>确认结账</Button>
                        </Stack>
                    </Paper>
                </div>
            </Modal>
        </>
)
}

export default BillModal;
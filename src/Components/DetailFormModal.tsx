import {FC} from "react";
import {Button, Modal, Paper, Stack, Typography} from "@mui/material";

interface DetailFormModalProps {
    checkInId: string,
    onClose: () => void
}

const DetailFormModal: FC<DetailFormModalProps> = ({checkInId, onClose}) => {

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
                            <Typography variant={'h3'}>
                                详单
                            </Typography>
                            <Typography>
                                checkInId：{checkInId}
                            </Typography>
                            <Typography>
                                详单内容
                            </Typography>
                            <Button variant='contained' onClick={onClose}>
                                确认
                            </Button>
                        </Stack>
                    </Paper>
                </div>
            </Modal>
        </>
    )
}

export default DetailFormModal;
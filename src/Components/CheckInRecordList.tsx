import {CheckInRecord} from "../Interfaces/CheckInRecord.ts";
import {ChangeEvent, FC, useEffect, useState} from "react";
import dayjs from "dayjs";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {Box, Button, Checkbox, Stack, Typography} from "@mui/material";
import BillModal from "./BillModal.tsx";

interface CheckInRecordListProps {
    records: CheckInRecord[],
    userId: string,
    userName: string,
    openDetailListModal:(selectedRecord:CheckInRecord) => void,
    refresh: () => void;
}

const CheckInRecordList: FC<CheckInRecordListProps> = ({records, userId, userName, openDetailListModal, refresh}) => {
    const [selectedRecords, setSelectedRecords] = useState<CheckInRecord[]>([]);
    const [showBillModal, setShowBillModal] = useState(false);
    const [disableConfirmButton, setDisableConfirmButton] = useState(true);

    const columns:GridColDef[] = [
        {
            field: 'checkbox',
            headerName: '',
            width: 50,
            renderCell: (params) => {
                const { row } = params;
                if (row.type === '未结账') {
                    return (
                        <Checkbox checked={selectedRecords.includes(records[row.id])}
                            onChange={handleOnChange(records[row.id])}/>
                    );
                }

                return null;
            },
        },
        { field: 'id', headerName: '序号', width: 25},
        { field: 'date', headerName: '日期', width: 200},
        {field: 'roomName', headerName: '房间号', width: 100},
        {field: 'type', headerName: '类型', width: 100},
        {
            field: 'detail',
            headerName:'',
            sortable:false,
            width:150,
            align:'right',
            renderCell:(params) => {
                const {row} = params;
                return (
                    <Button variant='contained' onClick={() => {openDetailListModal(records[row.id])}}>
                        详单
                    </Button>
                )
            }
        }
    ]


    const rows = records.map((record, index) => {
        return {
            'id': index,
            'date': dayjs(record.beginTime * 1000).format('YYYY-MM-DD') + '至' + dayjs(record.endTime * 1000).format('YYYY-MM-DD'),
            'roomName': record.roomName,
            'type': record.checkout ? "已结账" : "未结账",
            'checkInId': record.checkinId
        }
    });

    useEffect(() => {
        setSelectedRecords([]);
        setDisableConfirmButton(true);
    }, [records])

    const handleOnChange = (record: CheckInRecord) => (event: ChangeEvent<HTMLInputElement>) => {
        const isChecked = event.target.checked;
        let temp;

        if(isChecked) {
            temp = [...selectedRecords, record];
        }
        else {
            temp = selectedRecords.filter((curRecord) => curRecord !== record);
        }

        setSelectedRecords(temp);
        //有勾选记录时才能确认
        if(temp.length > 0) {
            setDisableConfirmButton(false);
        }
        else {
            setDisableConfirmButton(true);
        }
    }

    const onBillModalClose = () => {
        refresh();  //刷新入住记录列表
        setSelectedRecords([]);
        setShowBillModal(false);
    }

    return (
        <div style={{width:'100%', height:'100%'}}>
            {
                records.length > 0 &&
                <Stack spacing={1} sx={{width:'100%', height:'100%'}}>
                    <Box sx={{wide:'100%', height:'10%', display:'flex', alignItems:'center'}}>
                        <Typography sx={{mr:10}}>姓名: {userName}</Typography>
                        <Typography>波普特号: {userId}</Typography>
                    </Box>
                    <DataGrid
                        rows={rows}
                        columns={columns}
                        disableRowSelectionOnClick
                        sx={{
                            [`&.MuiDataGrid-root .MuiDataGrid-cell:focus`]: {
                                outline: 'none',
                            },
                            width:'100%',
                            height:'70%'
                        }}
                    />
                    <Box sx={{wide:'100%', height:'10%', display:'flex', justifyContent:'flex-end'}}>
                        <Button
                            variant='contained'
                            disabled={disableConfirmButton}
                            sx={{width:'10%'}}
                            onClick={() => setShowBillModal(true)}
                        >
                            确认
                        </Button>
                    </Box>
                </Stack>
            }

            {
                showBillModal &&
                <BillModal checkInRecords={selectedRecords} onClose={onBillModalClose}>
                </BillModal>
            }
        </div>
    )
}

export default CheckInRecordList;
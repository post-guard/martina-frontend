import {CheckInRecord} from "../Interfaces/CheckInRecord.ts";
import {FC, useState} from "react";
import dayjs from "dayjs";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import {Button, Checkbox} from "@mui/material";
import DetailFormModal from "./DetailFormModal.tsx";

interface CheckInRecordListProps {
    records: CheckInRecord[]
}

const CheckInRecordList: FC<CheckInRecordListProps> = ({records}) => {
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [curCheckInId, setCurCheckInId] = useState("");
    const checkInIds: string[] = [];

    const columns:GridColDef[] = [
        {
            field: 'checkbox',
            headerName: '',
            width: 50,
            renderCell: (params) => {
                const { row } = params;
                if (row.type === '未结账') {
                    return (
                        <Checkbox/>
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
                    <Button variant='contained' onClick={() => {setShowDetailModal(true); setCurCheckInId(checkInIds[row.id])}}>
                        详单
                    </Button>
                )
            }
        }
    ]


    const rows = records.map((record, index) => {
        //保存checkInId
        checkInIds.push(record.checkinId);

        return {
            'id': index,
            'date': dayjs(record.beginTime * 1000).format('YYYY-MM-DD') + '至' + dayjs(record.endTime * 1000).format('YYYY-MM-DD'),
            'roomName': record.roomName,
            'type': record.checkout ? "已结账" : "未结账",
            'checkInId': record.checkinId
        }
    });

    return (
        <div style={{width:'100%', height:'100%'}}>
            {
                records.length > 0 &&
                <DataGrid
                    rows={rows}
                    columns={columns}
                    disableRowSelectionOnClick
                    sx={{
                        [`&.MuiDataGrid-root .MuiDataGrid-cell:focus`]: {
                            outline: 'none',
                        },
                        width:'100%',
                        height:'100%'
                    }}
                />
            }

            {
                showDetailModal &&
                <DetailFormModal checkInId={curCheckInId} onClose={() => setShowDetailModal(false)}>
                </DetailFormModal>
            }
        </div>
    )
}

export default CheckInRecordList;
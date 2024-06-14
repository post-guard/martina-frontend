import {CheckInRecord} from "../Interfaces/CheckInRecord.ts";
import { FC, useEffect, useState } from "react";
import {Button, Modal, Paper, Stack, Typography, Card, CardContent} from "@mui/material";
import {enqueueSnackbar} from "notistack";

import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";

import * as XLSX from 'xlsx';

interface BillModalProps {
    checkInRecords: CheckInRecord[],
    onClose: () => void;
}

interface Bill {
    id?: string | null | undefined;
    userId: string;
    beginTime: number;
    endTime: number;
    checkinResponses: {
        checkinId: string;
        roomId: string;
        userId: string;
        beginTime: number;
        endTime: number;
        checkout: boolean;
    }[];
    airConditionerRecordResponses: {
        beginTime: number;
        endTime: number;
        beginTemperature: number;
        endTemperature: number;
        temperatureDelta: number;
        price: number;
        fee: number;
        checked: boolean;
    }[];
    roomFee: number;
    airConditionerFee: number;
}


const client = createClient<openapi.paths>();



const BillModal: FC<BillModalProps> = ({checkInRecords, onClose}) => {

    const authMiddleware = useAuthMiddleware();
    client.use(authMiddleware);

    const [bills, setBills] = useState<Bill | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        // 去除重复的 userId 和 roomId 组合
        const checkinIds = Array.from(new Set(checkInRecords.map(record => record.checkinId)));

        const fetchBills = async () => {
            try {
                if(checkinIds.length === 0) {
                    setError("未选中入住数据！");
                    return;
                }
                const responses = await client.POST('/api/bill/preview', {body: checkinIds});

                if (responses.response.status === 200 && responses.data) {
                    setBills(responses.data);
                    setUsername(await fetchUserAccount(responses.data.userId));
                } else if(responses.response.status === 400) {
                    setError("请求失败: 400 - Bad Request");
                } else if(responses.response.status === 401) {
                    setError("请求失败: 401 - Unauthorized");
                } else if(responses.response.status === 403) {
                    setError("请求失败: 403 - Forbidden");
                } else {
                    setError("未知原因 - 请求失败");
                }

            } catch (error) {
                setError("无法获取获取预览账单 - "+ error) ;
            } finally {
                setLoading(false);
            }
        };

        fetchBills().then();
        if (error!=null) {
            enqueueSnackbar(error, {
                variant: "error",
                autoHideDuration:2000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }
    }, [checkInRecords, error]);

    const fetchUserAccount = async (userId: string) => {
    try {
        const responses = await client.GET('/api/user/{userId}', {
            params: {
                path: {
                    userId: userId
                }
            }
        })
        if (responses.response.status === 200 && responses.data) {
            return responses.data.name || '未知用户';
        } else {
            return '未知用户';
        }
    } catch (err) {
        return '未知用户';
    }
};

    const exportToExcel = async () => {
        if (!bills) {
            return;
        }


        const fetchRoomName = async (roomId: string) => {
            try {
                const responses = await client.GET('/api/room/{roomId}', {
                    params: {
                        path: {
                            roomId: roomId
                        }
                    }
                })
                if (responses.response.status === 200 && responses.data) {
                    return responses.data.roomName || '未知房间';
                } else {
                    return '未知房间';
                }
            } catch (err) {
                return '未知房间';
            }
        };

        // 转换 bill 数据
        const billData = [{
            '账单Id': bills.id || '',
            '用户Id': bills.userId,
            '开始时间': new Date(bills.beginTime * 1000).toLocaleString(),
            '结束时间': new Date(bills.endTime * 1000).toLocaleString(),
            '房间费用': bills.roomFee,
            '空调费用': bills.airConditionerFee,
            // 其他属性...
        }];

        // 转换 checkinResponses 数据
        const checkinData = bills.checkinResponses.map(response => ({
            '入住Id': response.checkinId,
            '房间': fetchRoomName(response.roomId),
            '用户Id': response.userId,
            '开始时间': new Date(response.beginTime * 1000).toLocaleString(),
            '结束时间': new Date(response.endTime * 1000).toLocaleString(),
            '已结账': response.checkout ? '是' : '否',
        }));

        // 转换 airConditionerRecordResponses 数据
        const airConditionerData = bills.airConditionerRecordResponses.map(response => ({
            '开始时间': new Date(response.beginTime * 1000).toLocaleString(),
            '结束时间': new Date(response.endTime * 1000).toLocaleString(),
            '初始温度': response.beginTemperature,
            '开始温度': response.endTemperature,
            '温度变化': response.temperatureDelta,
            '单价': response.price,
            '费用': response.fee,
            '已结账': response.checked ? '是' : '否',
        }));

        // 创建一个新的工作簿
        const workbook = XLSX.utils.book_new();

        // 将数据转换为工作表
        const billWorksheet = XLSX.utils.json_to_sheet(billData);
        const checkinWorksheet = XLSX.utils.json_to_sheet(checkinData);
        const airConditionerWorksheet = XLSX.utils.json_to_sheet(airConditionerData);

        // 将工作表添加到工作簿
        XLSX.utils.book_append_sheet(workbook, billWorksheet, '账单');
        XLSX.utils.book_append_sheet(workbook, checkinWorksheet, '入住记录');
        XLSX.utils.book_append_sheet(workbook, airConditionerWorksheet, '空调记录');

        // 保存工作簿为 Excel 文件
        XLSX.writeFile(workbook, 'bill.xlsx');

        enqueueSnackbar("导出成功，请查看下载栏", {
            variant: "success",
            autoHideDuration:2000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            }
        });
    };


    const handleButtonClick = () => {
        //console.log('确认结账按钮被点击了！');
        const checkinIds = Array.from(new Set(checkInRecords.map(record => record.checkinId)));

        const fetchBills = async () => {
            try {
                const responses = await client.POST('/api/bill/checkout', {body: checkinIds});

                if (responses.response.status === 200 && responses.data) {
                    setBills(responses.data);
                    enqueueSnackbar("结账成功", {
                        variant: "success",
                        autoHideDuration:2000,
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center',
                        }
                    });
                } else {
                    enqueueSnackbar("结账失败", {
                        variant: "error",
                        autoHideDuration:2000,
                        anchorOrigin: {
                            vertical: 'top',
                            horizontal: 'center',
                        }
                    });
                    //throw new Error("结账失败！");
                }



            } catch (error) {
                setError("Error while fetching bills: ");
            } finally {
                setLoading(false);
            }
        };

        fetchBills().then(() => onClose());
    };

    return (
        <>
            <Modal open={true}>
                <div
                    style={{
                        position: "absolute",
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        top:'50%',
                        transform:'translateY(-50%)',
                        height: 'fit-content',
                        width: '100%',

                    }}
                >
                    <Paper sx={{width: '35%', height: '80%',}}>
                        <Stack spacing={4}
                               sx={{height: '100%',
                                   padding: "2rem 2rem 2rem 2rem",
                                   display: "flex",
                                   boxSizing: 'border-box',
                                   overflowY:'auto',
                                   alignItems: "center"}}>
                            <Typography variant={'h3'}>账单</Typography>
                            <Typography>用户名: {username}</Typography>

                            {/*{checkInRecords.map((record) => (*/}
                            {/*    <Typography variant='body2' color="red">[debug]roomId: {record.roomId}</Typography>*/}
                            {/*))}*/}

                            {loading ? (
                                <Typography>Loading...</Typography>
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : bills ? (

                                <Stack spacing={2} direction="column" sx={{ width: '100%' }}>
                                    <Typography sx ={{width:'100%',textAlign:'center'}}>用户ID: {bills.userId}</Typography>
                                    <div style={{overflowY: 'auto', height: '100%', width: '100%'}}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    账单ID: {bills.id}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    用户ID: {bills.userId}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    开始时间: {new Date(bills.beginTime * 1000).toLocaleString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    结束时间: {new Date(bills.endTime * 1000).toLocaleString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    房间费用: ¥{bills.roomFee}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    空调费用: ¥{bills.airConditionerFee.toFixed(2)}
                                                </Typography>
                                                {/* 可以在这里添加更多账单的详细信息 */}
                                            </CardContent>
                                        </Card>
                                    </div>
                                </Stack>
                            ) : (
                                <Typography variant="body1" color="red">
                                    没有账单数据可供显示
                                </Typography>
                            )}
                            {/* <Typography>获取到的checkInRecords长度:{checkInRecords.length}</Typography> */}
                            <Button variant='contained' onClick={onClose}>关闭</Button>
                            <Button variant='contained' onClick={handleButtonClick}>确认结账</Button>
                            <Button variant='contained' onClick={exportToExcel}>导出为excel</Button>
                        </Stack>
                    </Paper>
                </div>
            </Modal>
        </>
)
}

export default BillModal;

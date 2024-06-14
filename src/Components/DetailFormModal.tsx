import {Button, Modal, Paper, Stack, Typography, Card, CardContent} from "@mui/material";
import {CheckInRecord} from "../Interfaces/CheckInRecord.ts";
import {DetailedList} from "../Interfaces/DetailedList.ts";
import { FC, useEffect, useState } from "react";
import {enqueueSnackbar} from "notistack";

import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";

import * as XLSX from 'xlsx';

interface DetailFormModalProps {
    checkInRecord: CheckInRecord,
    onClose: () => void
}

const client = createClient<openapi.paths>();

const DetailFormModal: FC<DetailFormModalProps> = ({checkInRecord, onClose}) => {

    const authMiddleware = useAuthMiddleware();
    client.use(authMiddleware);

    const [details, setDetails] = useState<DetailedList[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [username, setUsername] = useState<string | null>(null);

    useEffect(() => {
        const getDetailedList = async () => {
            try {
                const responses = await client.GET('/api/airConditioner/airConditionerRecords', {
                    params: {
                        query: {
                            roomId: checkInRecord.roomId
                        },
                    },
                });

                if (responses.response.status === 200 && responses.data) {
                    setDetails(responses.data);
                    setUsername(await fetchUserAccount(checkInRecord.userId));
                } else if(responses.response.status === 400) {
                    setError("请求失败: 400 - Bad Request");
                } else if(responses.response.status === 401) {
                    setError("请求失败: 401 - Unauthorized");
                } else if(responses.response.status === 403) {
                    setError("请求失败: 403 - Forbidden");
                } else {
                    setError("未知原因 - 请求失败");
                }
            } catch (err) {
                setError("无法获取详单信息 - "+ err);
            } finally {
                setLoading(false);
            }
        };

        getDetailedList();
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
    }, [checkInRecord.roomId, checkInRecord.userId, error]);

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
    }

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(details.map(detail => ({
            '开始时间': new Date(detail.beginTime * 1000).toLocaleString(),
            '结束时间': new Date(detail.endTime * 1000).toLocaleString(),
            '开始温度': detail.beginTemperature,
            '结束温度': detail.endTemperature,
            '温度变化': detail.temperatureDelta,
            '单价': detail.price,
            '费用': detail.fee,
            '已结账': detail.checked ? '是' : '否',
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, '详单');
        XLSX.writeFile(wb, `详单_${checkInRecord.roomId}.xlsx`);
        enqueueSnackbar("导出成功，请查看下载栏", {
            variant: "success",
            autoHideDuration:2000,
            anchorOrigin: {
                vertical: 'top',
                horizontal: 'center',
            }
        });
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
                        height: '100%',
                        width: '100%',
                    }}
                >
                    <Paper sx={{width: '35%', height: '85%', display: 'flex', flexDirection: 'column' }}>
                        <Stack spacing={2}
                               sx={{height: '100%',
                                   padding: "2rem",
                                   display: "flex",
                                   justifyContent: "center",
                                   alignItems: "center"}}
                        >
                            <Typography variant={'h4'} sx={{height: '10%'}}>详单内容</Typography>
                            <Typography>用户名: {username}</Typography>
                            <Typography>用户ID: {checkInRecord.userId}</Typography>
                            <Typography>房间名: {checkInRecord.roomName}</Typography>
                            {loading ? (
                                <Typography>加载中...</Typography>
                            ) : error ? (
                                <Typography color="error">{error}</Typography>
                            ) : (
                                <div style={{overflowY: 'auto', height: '80%', width: '100%'}}>
                                    {details.map((detail, index) => (
                                        <Card key={index} sx={{ width: '100%', height: 'fit-content' }}>
                                            <CardContent>
                                                <Typography variant="h6" component="div">
                                                    {index}. 空调费用
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    时间: {new Date(detail.beginTime * 1000).toLocaleString()} - {new Date(detail.endTime * 1000).toLocaleString()}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    温度: {detail.beginTemperature.toFixed(2)}°C - {detail.endTemperature.toFixed(2)}°C 变化: {detail.temperatureDelta.toFixed(2)}°C
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    单价: ¥{detail.price.toFixed(2)}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    计费: ¥{detail.fee.toFixed(2)}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ color: detail.checked ? 'text.secondary' : 'red' }}
                                                >
                                                    {detail.checked ? '已结清' : '尚未结账'}
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            )}
                            <Button variant='contained' onClick={onClose} sx={{height: '5%'}}>
                                确认
                            </Button>
                            <Button variant='contained' onClick={exportToExcel} sx={{height: '5%'}}>
                                导出为Excel
                            </Button>
                        </Stack>
                    </Paper>
                </div>
            </Modal>
        </>
    )

}

export default DetailFormModal;

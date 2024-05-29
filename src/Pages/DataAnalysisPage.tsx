import React, { useEffect, useState } from "react";
import { Card, CardContent, Stack, Typography, Box, TextField, MenuItem } from "@mui/material";
import ReactEcharts from "echarts-for-react";

interface RevenueData {
    date: string;
    roomRevenue: number;
    airConditionerRevenue: number;
    totalRevenue: number;
}

interface RoomOccupancyData {
    time: string;
    room1: { occupied: number; unoccupied: number };
    room2: { occupied: number; unoccupied: number };
    room3: { occupied: number; unoccupied: number };
}

interface StatisticsData {
    totalUsers: number;
    totalCheckins: number;
    revenueTrend: RevenueData[];
    roomOccupancy: RoomOccupancyData[];
}

interface RoomOccupancy {
    roomId: string;
    startTime: string;
    endTime: string;
}

const roomOccupancyData = [
    {
        roomId: "66505ca34221949c5d2d03b2",
        startTime: "2024-05-27T13:53:18.641Z",
        endTime: "2024-05-27T13:53:18.641Z"
    },
    {
        roomId: "66505ca34221949c5d2d03b2",
        startTime: "2024-05-26T13:53:18.641Z",
        endTime: "2024-05-26T15:53:18.641Z"
    },
    // 可以添加更多的房间和日期
];

export function DataAnalysisPage() {
    const [data, setData] = useState<StatisticsData | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedDate, setSelectedDate] = useState<string>('');

    useEffect(() => {
        // 使用静态数据进行测试
        const staticData: StatisticsData = {
            totalUsers: 100,
            totalCheckins: 50,
            revenueTrend: [
                { date: '2024-05-01', roomRevenue: 10000, airConditionerRevenue: 5000, totalRevenue: 15000 },
                { date: '2024-05-02', roomRevenue: 12000, airConditionerRevenue: 6000, totalRevenue: 18000 },
                { date: '2024-05-03', roomRevenue: 15000, airConditionerRevenue: 7000, totalRevenue: 22000 },
                { date: '2024-05-04', roomRevenue: 13000, airConditionerRevenue: 4000, totalRevenue: 17000 },
                { date: '2024-05-05', roomRevenue: 16000, airConditionerRevenue: 8000, totalRevenue: 24000 }
            ],
            roomOccupancy: [
                {
                    time: '2024-05-01 08:00',
                    room1: { occupied: 300, unoccupied: 700 },
                    room2: { occupied: 500, unoccupied: 500 },
                    room3: { occupied: 700, unoccupied: 300 }
                },
                {
                    time: '2024-05-01 09:00',
                    room1: { occupied: 200, unoccupied: 800 },
                    room2: { occupied: 600, unoccupied: 400 },
                    room3: { occupied: 800, unoccupied: 200 }
                },
                {
                    time: '2024-05-01 10:00',
                    room1: { occupied: 400, unoccupied: 600 },
                    room2: { occupied: 300, unoccupied: 700 },
                    room3: { occupied: 600, unoccupied: 400 }
                }
            ]
            
        };

        setData(staticData);
        setLoading(false);
        setError(null);
    }, []);
    const getPieOption = (date: string) => {
        const selectedRevenue = data?.revenueTrend.find(item => item.date === date);
        if (!selectedRevenue) return {};

        return {
            title: {
                text: `收费组成 (${selectedRevenue.date})`,
                subtext: '房间与空调费用',
                left: 'center'
            },
            tooltip: {
                trigger: 'item'
            },
            legend: {
                orient: 'vertical',
                left: 'left',
            },
            series: [
                {
                    name: '费用组成',
                    type: 'pie',
                    radius: '50%',
                    data: [
                        { value: selectedRevenue.roomRevenue, name: '房间费用' },
                        { value: selectedRevenue.airConditionerRevenue, name: '空调费用' }
                    ],
                    emphasis: {
                        itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    };
    const getBarOption = (roomOccupancyData: RoomOccupancy[]) => ({
        title: {
            text: '房间占用情况',
            subtext: '绿色为占用时长，黄色为未占用时长',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['占用时长', '未占用时长'],
            left: 'right'
        },
        xAxis: {
            type: 'time',
            axisLabel: {
                formatter: '{HH}:{mm}'
            }
        },
        yAxis: {
            type: 'category',
            data: ['Room 1', 'Room 2', 'Room 3']
        },
        series: [
            {
                name: '占用时长',
                type: 'bar',
                stack: '总量',
                label: {
                    show: true,
                    position: 'insideRight'
                },
                emphasis: {
                    focus: 'series'
                },
                data: roomOccupancyData.map(item => ({
                    value: [new Date(item.startTime), new Date(item.endTime)],
                    itemStyle: { color: 'green' } // 占用的部分显示为绿色
                }))
            },
            {
                name: '未占用时长',
                type: 'bar',
                stack: '总量',
                label: {
                    show: true,
                    position: 'insideRight'
                },
                emphasis: {
                    focus: 'series'
                },
                data: roomOccupancyData.map(item => ({
                    value: [new Date(item.startTime), new Date(item.endTime)],
                    itemStyle: { color: 'yellow' } // 默认设置为黄色
                }))
            }
        ]
    });

    const getLineOption = () => ({
        title: {
            text: '收入走势',
            subtext: '按日期统计',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['房间收入', '空调收入', '总收入'],
            left: 'right'
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: data?.revenueTrend.map(item => item.date)
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '房间收入',
                type: 'line',
                data: data?.revenueTrend.map(item => item.roomRevenue),
                smooth: true,
                lineStyle: {
                    width: 3
                }
            },
            {
                name: '空调收入',
                type: 'line',
                data: data?.revenueTrend.map(item => item.airConditionerRevenue),
                smooth: true,
                lineStyle: {
                    width: 3
                }
            },
            {
                name: '总收入',
                type: 'line',
                data: data?.revenueTrend.map(item => item.totalRevenue),
                smooth: true,
                lineStyle: {
                    width: 3
                }
            }
        ]
    });

    const handleDateChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        setSelectedDate(event.target.value as string);
    };

    return (
        <Box sx={{position: "relative", width: "100%", height: "100%", padding: 4 }}>
            <Typography variant="h4" gutterBottom>
                波普特酒店营运数据统计
            </Typography>
            <Typography variant="h5" gutterBottom>
                总览
            </Typography>
            <Typography variant="body1" gutterBottom>
                当前用户总数: 114514
                {/* 当前用户总数: {currentUserCount} */}
            </Typography>
            <Typography variant="body1" gutterBottom>
                {/* 当前入住数: {currentCheckInCount} */}
                当前入住数: 19
            </Typography>
            
            {loading ? (
                <Typography>Loading...</Typography>
            ) : error ? (
                <Typography color="error">{error}</Typography>
            ) : data ? (
                <Stack spacing={4}>
                    <Typography variant="h5" gutterBottom>
                        过去一周营收统计
                    </Typography>
                    <Card>
                        <CardContent>
                            <ReactEcharts option={getLineOption()} style={{ height: '400px' }} />
                        </CardContent>
                    </Card>

                    <TextField
                        select
                        label="选择日期"
                        value={selectedDate}
                        onChange={handleDateChange}
                        defaultValue={data.revenueTrend[0].date}
                    >
                        {data.revenueTrend.map(item => (
                            <MenuItem key={item.date} value={item.date}>
                                {item.date}
                            </MenuItem>
                        ))}
                        
                    </TextField>
                    <Card>
                        <CardContent>
                            <ReactEcharts option={getPieOption(selectedDate)} style={{ height: '400px' }} />
                        </CardContent>
                    </Card>
                    <Typography variant="h5" gutterBottom>
                        房间占用率
                    </Typography>
                    <Card>
                        <CardContent>
                            <ReactEcharts option={getBarOption(roomOccupancyData)} style={{ height: '400px' }} />
                        </CardContent>
                    </Card>
                </Stack>
            ) : (
                <Typography variant="body1" color="text.secondary">
                    没有数据可供显示
                </Typography>
            )}
        </Box>
    );
}

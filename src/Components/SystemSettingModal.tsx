import {
    Box,
    Button,
    FormControl, Grid,
    InputLabel,
    Modal,
    Select,
    SelectChangeEvent,
    Stack,
    TextField,
    Typography
} from "@mui/material";
import {Form} from "react-router-dom";
import React, {useEffect, useState} from "react";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {enqueueSnackbar} from "notistack";
import MenuItem from "@mui/material/MenuItem";

const client = createClient<openapi.paths>();

const SystemSettingModal = ({defaultStatus, open, onClose}: {
    defaultStatus: openapi.components['schemas']['AirConditionerOption'],
    open: boolean,
    onClose: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const authMiddleware = useAuthMiddleware();
    client.use(authMiddleware);
    const [confirmButtonState, setConfirmButtonState] = useState(true);
    const [settingData, setSettingData] = useState<openapi.components['schemas']['AirConditionerOption']>(defaultStatus)

    useEffect(() => {
        setSettingData(defaultStatus)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [open]);
    const onConfirmClick = async () => {
        setConfirmButtonState(false);

        const response = await client.PUT('/api/airConditionerManage', {
            body: {
                cooling: settingData.cooling,
                minTemperature: settingData.minTemperature,
                maxTemperature: settingData.maxTemperature,
                defaultTemperature: settingData.defaultTemperature,
                defaultFanSpeed: settingData.defaultFanSpeed,
                highSpeedPerDegree: settingData.highSpeedPerDegree,
                middleSpeedPerDegree: settingData.middleSpeedPerDegree,
                lowSpeedPerDegree: settingData.lowSpeedPerDegree,
                backSpeed: settingData.backSpeed
            }
        });

        if (response.response.status === 200) {
            enqueueSnackbar("空调系统配置成功", {
                variant: "success",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setTimeout(() => {
                setConfirmButtonState(true);
                onClose(false);
            }, 1000)
        } else {
            enqueueSnackbar("空调系统配置失败", {
                variant: "error",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setConfirmButtonState(true);
        }
    }


    return (
        <Modal open={open}>
            <Box
                style={{
                    position: "absolute",
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                }}
            >
                <Form style={{width: '35%', height: 'fit-content', backgroundColor: 'white'}}>
                    <Stack spacing={5}
                           sx={{
                               height: '100%',
                               padding: "2rem 2rem 2rem 2rem",
                               display: "flex",
                               flexDirection: 'column',
                               justifyContent: "flex-start",
                               alignItems: "center"
                           }}>
                        <Typography
                            variant="h4"
                            style={{textAlign: "center"}}
                        >
                            空调系统参数设置
                        </Typography>

                        <FormControl variant="standard" sx={{width: '75%'}}>
                            <InputLabel id="temperature-mode">调温模式</InputLabel>
                            <Select
                                labelId="temperature-mode"
                                id="temperature-mode-select"
                                value={settingData.cooling ? '1' : '2'}
                                label="调温模式"
                                onChange={(event: SelectChangeEvent) => setSettingData({
                                    ...settingData,
                                    cooling: event.target.value === '1'
                                })}
                            >
                                <MenuItem value={1}>制冷</MenuItem>
                                <MenuItem value={2}>制热</MenuItem>
                            </Select>
                        </FormControl>
                        <Grid container spacing={0} sx={{width: "75%"}}>

                            <Grid item xs={5}>
                                <TextField
                                    required
                                    type={'number'}
                                    id="min-temperature"
                                    label="最低温度"
                                    variant="standard"
                                    style={{width: "100%"}}
                                    value={settingData.minTemperature}
                                    onChange={(e) => setSettingData({
                                        ...settingData,
                                        minTemperature: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                    })}
                                >
                                </TextField>
                            </Grid>
                            <Grid item xs={2}/>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    id="max-temperature"
                                    type={'number'}
                                    label="最高温度"
                                    variant="standard"
                                    style={{width: "100%"}}
                                    value={settingData.maxTemperature}
                                    onChange={(e) => setSettingData({
                                        ...settingData,
                                        maxTemperature: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                    })}
                                >
                                </TextField>
                            </Grid>
                        </Grid>

                        <Grid container spacing={0} sx={{width: "75%"}}>

                            <Grid item xs={5}>
                                <TextField
                                    required
                                    id="default-temperature"
                                    type={'number'}
                                    label="缺省目标温度"
                                    variant="standard"
                                    style={{width: "100%"}}
                                    value={settingData.defaultTemperature}
                                    onChange={(e) => setSettingData({
                                        ...settingData,
                                        defaultTemperature: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                    })}
                                >
                                </TextField>
                            </Grid>
                            <Grid item xs={2}/>
                            <Grid item xs={5}>
                                <FormControl variant="standard" sx={{width: '100%'}}>
                                    <InputLabel id="default-fan-speed">缺省风速</InputLabel>
                                    <Select
                                        labelId="default-fan-speede"
                                        id="default-fan-speed-select"
                                        value={settingData.defaultFanSpeed.toString()}
                                        label="缺省风速"
                                        onChange={(event: SelectChangeEvent) => setSettingData({
                                            ...settingData,
                                            defaultFanSpeed: parseInt(event.target.value)
                                        })}
                                    >
                                        <MenuItem value={0}>低速风</MenuItem>
                                        <MenuItem value={1}>中速风</MenuItem>
                                        <MenuItem value={2}>高速风</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                        </Grid>

                        <Grid container spacing={0} sx={{width: "75%"}}>

                            <Grid item xs={5}>
                                <TextField
                                    required
                                    id="high-speed-fan-per"
                                    label="高速风强度(分/度)"
                                    type={'number'}
                                    variant="standard"
                                    style={{width: "100%"}}
                                    value={settingData.highSpeedPerDegree}
                                    onChange={(e) => setSettingData({
                                        ...settingData,
                                        highSpeedPerDegree: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                    })}
                                >
                                </TextField>
                            </Grid>
                            <Grid item xs={2}/>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    id="middle-speed-fan-per"
                                    label="中速风强度(分/度)"
                                    type={'number'}
                                    variant="standard"
                                    style={{width: "100%"}}
                                    value={settingData.middleSpeedPerDegree}
                                    onChange={(e) => setSettingData({
                                        ...settingData,
                                        middleSpeedPerDegree: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                    })}
                                >
                                </TextField>
                            </Grid>
                        </Grid>

                        <Grid container spacing={0} sx={{width: "75%"}}>

                            <Grid item xs={5}>
                                <TextField
                                    required
                                    id="low-speed-fan-per"
                                    label="低速风强度(分/度)"
                                    type={'number'}
                                    variant="standard"
                                    style={{width: "100%"}}
                                    value={settingData.lowSpeedPerDegree}
                                    onChange={(e) => setSettingData({
                                        ...settingData,
                                        lowSpeedPerDegree: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                    })}
                                >
                                </TextField>
                            </Grid>
                            <Grid item xs={2}/>
                            <Grid item xs={5}>
                                <TextField
                                    required
                                    id="back-temperature"
                                    label="回温速度(度/分)"
                                    type={'number'}
                                    variant="standard"
                                    style={{width: "100%"}}
                                    value={settingData.backSpeed}
                                    onChange={(e) => setSettingData({
                                        ...settingData,
                                        backSpeed: isNaN(parseFloat(e.target.value)) ? 0 : parseFloat(e.target.value)
                                    })}
                                >
                                </TextField>
                            </Grid>
                        </Grid>

                        <Box sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '75%',
                            height: '25%'
                        }}>
                            <Button
                                variant="contained"
                                sx={{mr: 10}}
                                style={{width: "40%"}}
                                onClick={() => onClose(false)}>
                                取消
                            </Button>

                            <Button
                                variant="contained"
                                style={{width: "40%"}}
                                disabled={!confirmButtonState}
                                onClick={onConfirmClick}
                            >
                                确认
                            </Button>
                        </Box>
                    </Stack>
                </Form>
            </Box>
        </Modal>
    )
}

export default SystemSettingModal;
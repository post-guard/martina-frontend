import {
    Box,
    Button,
    FormControl,
    Grid,
    InputLabel,
    Modal,
    Select,
    SelectChangeEvent,
    Stack,
    Typography
} from "@mui/material";
import {Form} from "react-router-dom";
import React, {useState} from "react";
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {enqueueSnackbar} from "notistack";
import MenuItem from "@mui/material/MenuItem";

const client = createClient<openapi.paths>();

const TestConditionModal = ({open, onClose, refresh, setRefresh}: {
    open: boolean,
    onClose: React.Dispatch<React.SetStateAction<boolean>>,
    refresh: boolean,
    setRefresh: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const authMiddleware = useAuthMiddleware();
    client.use(authMiddleware);
    const [testMode, setTestMode] = useState(true)

    const handleStartButton = async () => {
        const responses = await client.PATCH('/api/test/start', {
            params: {
                query: {
                    caseName: testMode ? 'cool' : 'hot'
                }
            }
        });

        if (responses.response.status === 200) {
            enqueueSnackbar("开始运行测试脚本", {
                variant: "success",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setRefresh(!refresh)
            onClose(false)

        } else {
            enqueueSnackbar("运行测试脚本失败", {
                variant: "error",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }
    }

    const handleStopButton = async () => {
        const responses = await client.PATCH('/api/test/stop');
        if (responses.response.status === 200) {
            enqueueSnackbar("停止运行测试脚本", {
                variant: "success",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        } else {
            enqueueSnackbar("停止运行测试脚本失败", {
                variant: "error",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }
    }

    const handleClearButton = async () => {
        const responses = await client.PATCH('/api/test/clear', {
            params: {
                query: {
                    caseName: testMode ? 'cool' : 'hot'
                }
            }
        });

        if (responses.response.status === 200) {
            enqueueSnackbar("清除测试集数据成功", {
                variant: "success",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            setRefresh(!refresh)
            onClose(false)

        } else {
            enqueueSnackbar("清除测试集数据失败", {
                variant: "error",
                autoHideDuration: 1000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
        }
    }

    return (
        <Modal open={open} onClose={() => onClose(false)}>
            <Box
                sx={{
                    position: 'absolute',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    height: 'fit-content',
                    width: '40%',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}
            >
                <Form style={{width: '100%', height: 'fit-content', backgroundColor: 'white'}}>
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
                                value={testMode ? '1' : '2'}
                                label="调温模式"
                                onChange={(event: SelectChangeEvent) => setTestMode(
                                    event.target.value === '1'
                                )}
                            >
                                <MenuItem value={'1'}>制冷</MenuItem>
                                <MenuItem value={'2'}>制热</MenuItem>
                            </Select>
                        </FormControl>
                        <Grid container sx={{width: '75%'}}>
                            <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button variant="outlined"
                                        onClick={handleClearButton}
                                        color={'error'}>
                                    清除测试集
                                </Button>
                            </Grid>
                            <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button variant="outlined"
                                        onClick={handleStopButton}
                                        color={'warning'}>
                                    停止测试
                                </Button>
                            </Grid>
                            <Grid item xs={4} sx={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                                <Button variant="outlined"
                                        onClick={handleStartButton}
                                        color={'primary'}>
                                    开始测试
                                </Button>
                            </Grid>
                        </Grid>
                    </Stack>
                </Form>
            </Box>
        </Modal>
    )
}

export default TestConditionModal;

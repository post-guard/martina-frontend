import {Box, Button, Grid, Paper, Stack, TextField, Typography} from "@mui/material";
import {Form, useNavigate} from "react-router-dom";
import createClient from "openapi-fetch";
import * as openapi from '../Interfaces/openapi'
import {useState} from "react";
import {enqueueSnackbar} from "notistack";
import {setToken, setUser} from "../Stores/UserSlice.ts";
import {useAppDispatch} from "../Utils/StoreHooks.ts";

const client = createClient<openapi.paths>()

export function LoginPage() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [loginButtonState, setLoginButtonState] = useState(true)
    const [loginFormData, setLoginFormData] = useState({
        "id": "",
        "password": ""
    })
    const onLoginButtonClick = async () => {
        setLoginButtonState(false);
        const userId = loginFormData.id;
        const responses = await client.POST("/api/user/login", {
            body: {
                "id": loginFormData.id,
                "password": loginFormData.password
            }
        })

        if (responses.response.status === 200) {
            // 登录成功
            enqueueSnackbar("登录成功,即将跳转页面", {
                variant: "success",
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center',
                }
            });
            if (responses.data !== undefined) {
                dispatch(setToken(responses.data.token))
                dispatch(setUser({token: responses.data.token, userId: userId}))
            }
            setTimeout(() => {
                navigate('/')
                setLoginButtonState(true);
            }, 3000)

        } else if (responses.response.status === 400) {
            // 登录失败
            enqueueSnackbar("登录失败", {
                variant: "error",
                autoHideDuration: 3000,
                anchorOrigin: {
                    vertical: 'top',
                    horizontal: 'center'
                }
            });
            setLoginButtonState(true);
        }
    }

    return <>
        <div className={"login-page"} style={{
            position: "absolute",
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            background: "gainsboro"
        }}>
            <div className={"login-page-container"}
                 style={{position: "absolute", width: "100%", height: "60%"}}>
                <Grid container spacing={1}
                      style={{width: "100%", height: "100%"}}>
                    <Grid item sm={4} xs={0}/>
                    <Grid item sm={4} xs={12}>
                        <Paper style={{width: '100%', height: '100%'}}>
                            <Form>
                                <Stack spacing={6}
                                       sx={{padding: "4rem 2rem 4rem 2rem"}}
                                       style={{display: "flex", justifyContent: "center", alignItems: "center"}}>

                                    <Typography variant="h4"
                                                gutterBottom
                                                style={{textAlign: "center"}}>
                                        欢迎
                                    </Typography>

                                    <TextField
                                        required
                                        id="login-name"
                                        label="波普特用户号"
                                        variant="standard"
                                        autoComplete={"user-name"}
                                        style={{width: "80%"}}
                                        value={loginFormData.id}
                                        onChange={(e) => setLoginFormData({...loginFormData, id: e.target.value})}
                                    />
                                    <TextField
                                        required
                                        id="login-password"
                                        label="密码"
                                        variant="standard"
                                        type="password"
                                        autoComplete={"current-password"}
                                        style={{width: "80%"}}
                                        value={loginFormData.password}
                                        onChange={(e) => setLoginFormData({...loginFormData, password: e.target.value})}
                                    />
                                    <Box style={{width: "100%", height: "10%"}}>

                                    </Box>
                                    {
                                        loginButtonState ?
                                            <Button variant="contained"
                                                    size="large"
                                                    style={{width: "80%"}}
                                                    onClick={onLoginButtonClick}>
                                                登录
                                            </Button>
                                            :
                                            <Button variant="contained"
                                                    size="large"
                                                    style={{width: "80%"}}
                                                    disabled={true}>
                                                正在登录
                                            </Button>
                                    }
                                </Stack>
                            </Form>
                        </Paper>
                    </Grid>
                    <Grid item sm={4} xs={0}/>
                </Grid>
            </div>
        </div>
    </>
}

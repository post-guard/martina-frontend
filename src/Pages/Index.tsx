import {useAppSelector} from "../Utils/StoreHooks.ts";
import SystemAppBar from "./SystemAppBar.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {Box} from "@mui/material";
import {useEffect, useState} from "react";


export function Index() {

    const navigate = useNavigate();
    // const [childPage, setChildPage] = useState("");

    // 在这里进行用户权限的页面控制,对应权限能看到什么页面在这里设定
    const userAuth = (useAppSelector((store) => store.userInfo.auth));
    let childrenPages: { name: string, url: string }[] = [];
    switch (userAuth) {
        case "sudo" : {
            childrenPages = [
                {
                    name: "空调监控",
                    url: "monitor"
                },
                {
                    name: "空调控制",
                    url: "air-control"
                },
                {
                    name: "房间管理",
                    url: "roomState"
                },
                {
                    name: "结账办理",
                    url: "checkOut"
                },
                {
                    name: "数据统计",
                    url: "dataAnalysis"
                }
            ];
            break;
        }
        case "roomAdmin" : {
            childrenPages = [
                {
                    name: "房间管理",
                    url: "roomState"
                },
                {
                    name:"结账办理",
                    url:"checkOut"
                }
            ];
            break;
        }
        case "airconAdmin" : {
            childrenPages = [
                {
                    name: "空调监控",
                    url: "monitor"
                },
            ];
            break;
        }
        case "billAdmin" : {
            childrenPages = [];
            break;
        }
        case "guest" : {
            childrenPages = [
                {
                    name: "空调控制",
                    url: "air-control"
                },
            ];
            break;
        }
    }

    const [childPage, setChildPage] = useState(childrenPages[0]?.url);
    useEffect(() => {
        console.log("hello")
        navigate(childPage)
    },[childPage, navigate]);

    return <>
        <Box sx={{
            display: "flex",
            flexDirection: "column",
            height: "100vh"}}>
            <SystemAppBar pages={childrenPages} setChildPage={setChildPage}/>

            <Box sx={{flex: 1}}>
                <Outlet>
                </Outlet>
            </Box>
        </Box>
    </>

}

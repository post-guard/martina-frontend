import {useAppSelector} from "../Utils/StoreHooks.ts";
import SystemAppBar from "./SystemAppBar.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {Box} from "@mui/material";
import {useEffect, useState} from "react";


export function Index() {

    const navigate = useNavigate();
    // const [childPage, setChildPage] = useState("");


    const userAuth = (useAppSelector((store) => store.userInfo.auth));
    let childrenPages: { name: string, url: string }[] = [];
    switch (userAuth) {
        case "sudo" : {
            childrenPages = [
                {
                    name: "空调控制",
                    url: "air-control"
                },
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
            childrenPages = [];
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
                {
                    name: "TestPage2",
                    url: "test2"
                },
                {
                    name: "详单",
                    url: "detailList"
                }
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

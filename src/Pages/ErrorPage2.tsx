import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useEffect} from "react";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {Box} from "@mui/material";

export function ErrorPage2() {
    const authMiddleware = useAuthMiddleware();
    const client = createClient<openapi.paths>();
    client.use(authMiddleware)
    useEffect(()=>{

    })

    return <>
        <Box sx = {{position: "relative" ,width : "100%",height: "100%",backgroundColor:"black"}}>
            <Box color={"red"}>
                Ikun!
            </Box>
        </Box>
    </>
}

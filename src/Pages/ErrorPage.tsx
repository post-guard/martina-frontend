import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useEffect} from "react";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";

export function ErrorPage() {
    const authMiddleware = useAuthMiddleware();
    const client = createClient<openapi.paths>();
    client.use(authMiddleware)
    useEffect(()=>{
        const tryGetUserInfo = async ()=>{
            const responses = await client.GET("/api/User/{userId}", {
                params: {
                    path:{
                        userId : '1'
                    }
                }
            })
            console.log(responses);
        }

        tryGetUserInfo()
    })

    return <>
        Oops!
    </>
}

import { type Middleware } from "openapi-fetch";
import {useAppSelector} from "./StoreHooks.ts";


export function useAuthMiddleware() {
    const token = useAppSelector((store) => store.userInfo.token);
    const middleware : Middleware = {
        async onRequest(req) {
            // 在每个请求中添加 Authorization 标头
            req.headers.set("Authorization", `Bearer ${token}`);
            return req;
        }
    }
    return middleware;
}

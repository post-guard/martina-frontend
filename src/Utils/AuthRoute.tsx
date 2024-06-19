import { Navigate } from 'react-router-dom'
import {useAppSelector} from "./StoreHooks.ts";

// 当前界面需要token的验证器,没有token则自动返回登录页
// @ts-expect-error children类型可能不为JSX.Element
const AuthRoute = ({ children })  => {
    const token = useAppSelector((store) => store.userInfo.token);
    if (token !== '') {
        return <>{children}</>
    } else {
        return <Navigate to="/login" replace />
    }
}

export default AuthRoute

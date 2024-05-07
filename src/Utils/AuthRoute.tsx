import { Navigate } from 'react-router-dom'
import {useAppSelector} from "./StoreHooks.ts";

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

import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import {Index} from "./Pages/Index";
import {LoginPage} from "./Pages/LoginPage.tsx";
import {ErrorPage} from "./Pages/ErrorPage.tsx";
import AuthRoute from "./Utils/AuthRoute.tsx";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Index/>
    },
    {
        path: "/login",
        element: <LoginPage/>
    },
    {
        path: "/error",
        element: <AuthRoute>
            <ErrorPage/>
        </AuthRoute>
    }
])

export function App() {
    return <>
        <RouterProvider router={routers}/>
    </>
}

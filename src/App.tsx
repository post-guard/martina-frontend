import {RouterProvider, createBrowserRouter} from 'react-router-dom'
import {Index} from "./Pages/Index";
import {LoginPage} from "./Pages/LoginPage.tsx";
import {ErrorPage} from "./Pages/ErrorPage.tsx";
import AuthRoute from "./Utils/AuthRoute.tsx";
import {RoomStatePage} from "./Pages/RoomStatePage.tsx";

import {ErrorPage2} from "./Pages/ErrorPage2.tsx";
import { DetailedListPage } from './Pages/DetailedListPage.tsx';

const routers = createBrowserRouter([
    {
        path: "/",
        element: <AuthRoute>
            <Index/>
        </AuthRoute>,
        errorElement: <ErrorPage />,
        children : [
            {
                path: "test",
                element: <ErrorPage />,
            },
            {
                path: "test2",
                element: <ErrorPage2 />
            },
            {
                path: "detailList",
                element: <DetailedListPage />
            },
            {
                path:"roomState",
                element:<RoomStatePage/>
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage/>
    },

])

export function App() {
    return <>
        <RouterProvider router={routers}/>
    </>
}

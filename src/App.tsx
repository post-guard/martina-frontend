import { RouterProvider, createBrowserRouter} from 'react-router-dom'
import { Index } from "./Pages/Index";

const routers = createBrowserRouter([
    {
        path: "/",
        element: <Index/>
    }
])

export function App() {
    return <>
       <RouterProvider router={routers} /> 
    </>
}
import createClient from "openapi-fetch";
import * as openapi from "../Interfaces/openapi";
import {useEffect} from "react";
import {useAuthMiddleware} from "../Utils/Middleware.tsx";
import {Card, CardContent, Stack, Typography, Box} from "@mui/material";

export function DetailedListPage() {
    // 定义静态的详单数据对象
    const details = [
        { description: '包子', kind: '食品', price: 10.99 },
        { description: '茶叶蛋', kind: '食品', price: 20.99 },
    ];

    const authMiddleware = useAuthMiddleware();
    const client = createClient<openapi.paths>();
    client.use(authMiddleware)
    useEffect(()=>{

    })

    return (
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
            <h2>这里是详单</h2>
            <h3>Details:</h3>
            <Stack spacing={2} direction="column">
                {details.map((detail, index) => (
                    <Card key={index}>
                    <CardContent>
                        <Typography variant="h6" component="div">
                        {detail.description}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        Kind: {detail.kind}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                        Price: {detail.price.toFixed(2)}
                        </Typography>
                    </CardContent>
                    </Card>
                ))}
            </Stack>
            {/* <ul>
                {details.map((detail, index) => (
                    <li key={index}>
                        <p>Description: {detail.description}</p>
                        <p>Kind: {detail.kind}</p>
                        <p>Price: {detail.price.toFixed(2)}</p>
                    </li>
                ))}
            </ul> */}
        </Box>
    );
}

# Martina 前端文档

## 项目配置
```shell
npm install
```
下载前端相关库

`vite.config.ts`中配置后端地址，当前固定为[http://martina.rrricardo.top]()

## 项目运行
```shell
npm run dev
```

## 请求接口
后端提供的接口在[http://martina.rrricardo.top/swagger]()
前端为支持typescript，利用`openapi-typescript`生成接口类型文档
要更新接口类型文档，使用
```shell
npx openapi-typescript http://martina.rrricardo.top/swagger/v1/swagger.json
```
生成接口文档内容，保存在`interfaces/openapi.d.ts`文件中
<br>
<br>
在前端使用接口请求，使用以下代码
```typescript
import createClient from "openapi-fetch";
import * as openapi from '../Interfaces/openapi'

const client = createClient<openapi.paths>()
// 创建一个client

const getSomething = async() => {
    const responses = await client.POST(请求接口地址, 参数)
    if (responses.response.status === 200) {
        // 请求成功
        if (responses.data !== undefined) {
            // data内为返回数据
        }
    } else {
        // 请求失败的处理
    }
}
```

需要注意的是，后端有部分接口需要携带token请求，使用以下钩子函数为请求携带token
```typescript
const authMiddleware = useAuthMiddleware();
const client = createClient<openapi.paths>();

client.use(authMiddleware)

// 为请求带上token
```

---
## 使用Store
store内保存了诸如登录后获得的token，用户个人信息（id，name，auth）等信息，store
内的信息是全局通用，持久化维持的，直到当前用户登出为止。

要使用store，使用
```typescript
import {useAppSelector} from "./StoreHooks.ts";

const userName = useAppSelector((store) => store.userInfo.name);
// 获得store内存储的用户名字
```

要改变store中存储的信息，使用
```typescript
import {setToken} from "../Stores/UserSlice.ts";
import {useAppDispatch} from "../Utils/StoreHooks.ts";

const dispatch = useAppDispatch();
dispatch(setToken(responses.data.token))
// dispatch一个action，示例action是设置token
```

如果要添加action，可以在`UserSlice.ts`中定义

---
## 主页面中添加子页面
系统会根据当前用户的权限（超管、前台、空管、经理、客人）,为它们提供不同的工作子页面
比如前台只会有房间入住\退房结账页面，而经理有查看报表、监督空调状态等子页面

要添加子页面，需要改变以下两个文件
### Index.tsx
```typescript
switch (userAuth) {
    case "sudo" : {
        // 超管能看到的子页面列表
        childrenPages = [];
        break;
    }
    // ...
    case "guest" : {
        // 客人能看到的子页面列表
        childrenPages = [
            {
                name: "TestPage",
                // 子页面的标签字面值
                url: "test"
                // 子页面的地址，与路由表中地址对应
            },
            {
                name: "TestPage2",
                url: "test2"
            }
        ];
        break;
    }
}
```

### App.tsx
```tsx
const routers = createBrowserRouter([
    {
        path: "/",
        element: <AuthRoute>
                <Index/>
            </AuthRoute>,
        errorElement: <ErrorPage />,
        children : [
            // 子页面路由配置
            {
                path: "test",
                // 子页面路由地址
                element: <ErrorPage />,
                // 这个页面使用的组件
            },
            {
                path: "test2",
                element: <ErrorPage2 />
            }
        ]
    },
    {
        path: "/login",
        element: <LoginPage/>
    },

])
```
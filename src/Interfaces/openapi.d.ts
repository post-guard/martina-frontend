export interface paths {
    "/api/User/register": {
        post: {
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["RegisterRequest"];
                    "text/json": components["schemas"]["RegisterRequest"];
                    "application/*+json": components["schemas"]["RegisterRequest"];
                };
            };
            responses: {
                /** @description Success */
                200: {
                    content: never;
                };
                /** @description Bad Request */
                400: {
                    content: {
                        "text/plain": components["schemas"]["ExceptionMessage"];
                        "application/json": components["schemas"]["ExceptionMessage"];
                        "text/json": components["schemas"]["ExceptionMessage"];
                    };
                };
            };
        };
    };
    "/api/User/login": {
        post: {
            requestBody?: {
                content: {
                    "application/json": components["schemas"]["LoginRequest"];
                    "text/json": components["schemas"]["LoginRequest"];
                    "application/*+json": components["schemas"]["LoginRequest"];
                };
            };
            responses: {
                /** @description Success */
                200: {
                    content: {
                        "text/plain": components["schemas"]["LoginResponse"];
                        "application/json": components["schemas"]["LoginResponse"];
                        "text/json": components["schemas"]["LoginResponse"];
                    };
                };
                /** @description Bad Request */
                400: {
                    content: {
                        "text/plain": components["schemas"]["ExceptionMessage"];
                        "application/json": components["schemas"]["ExceptionMessage"];
                        "text/json": components["schemas"]["ExceptionMessage"];
                    };
                };
            };
        };
    };
    "/api/User/{userId}": {
        get: {
            parameters: {
                path: {
                    userId: string;
                };
            };
            responses: {
                /** @description Success */
                200: {
                    content: {
                        "text/plain": components["schemas"]["UserResponse"];
                        "application/json": components["schemas"]["UserResponse"];
                        "text/json": components["schemas"]["UserResponse"];
                    };
                };
                /** @description Unauthorized */
                401: {
                    content: never;
                };
                /** @description Forbidden */
                403: {
                    content: never;
                };
            };
        };
    };
}

export type webhooks = Record<string, never>;

export interface components {
    schemas: {
        ExceptionMessage: {
            message: string;
        };
        LoginRequest: {
            userId: string;
            password: string;
        };
        LoginResponse: {
            token: string;
        };
        RegisterRequest: {
            userId: string;
            username: string;
            password: string;
        };
        UserResponse: {
            userId: string;
            username: string;
        };
    };
    responses: never;
    parameters: never;
    requestBodies: never;
    headers: never;
    pathItems: never;
}

export type $defs = Record<string, never>;

export type external = Record<string, never>;

export type operations = Record<string, never>;

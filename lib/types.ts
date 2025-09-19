import StatusCode from "status-code-enum";

export class ApiError extends Error {
    constructor(
        public readonly message: string,
        public readonly statusCode: StatusCode,
    ) {
        super(message);
    }
}

export interface ErrorResponse {
    readonly error: string;
}

export type ApiResponse<ResponseBody = object> = ErrorResponse | ResponseBody;

export type Opaque<BaseType, OpaqueType> = BaseType & {
    readonly __type?: OpaqueType;
};

export type Email = Opaque<string, "Email">;
export type Micros = Opaque<number, "Micros">;

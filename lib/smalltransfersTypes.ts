type Opaque<BaseType, OpaqueType> = BaseType & {
    readonly __type?: OpaqueType;
};

export type Micros = Opaque<number, "Micros">;
export type AuthorizationCode = Opaque<string, "AuthorizationCode">;
export type AccessToken = Opaque<string, "AccessToken">;
export type ChargeId = Opaque<string, "ChargeId">;

export interface CustomerInfo {
    readonly id: string;
    readonly firstName: string;
    readonly lastName: string;
    readonly email: string;
}

export interface GetTokensResponseBody {
    readonly accessToken: AccessToken;
    readonly tokenType: "bearer";
    readonly scope: "add-charge";
    readonly customer: CustomerInfo;
}

export interface AuthorizeChargeResponse {
    readonly id: ChargeId;
}

export interface SmallTransfersApi {
    readonly getAccessToken: (code: AuthorizationCode) => Promise<GetTokensResponseBody>;
    readonly authorizeCharge: (accessToken: AccessToken, maxCostMicros: Micros) => Promise<ChargeId>;
    readonly captureCharge: (accessToken: AccessToken, chargeId: ChargeId, amountMicros: Micros) => Promise<void>;
}

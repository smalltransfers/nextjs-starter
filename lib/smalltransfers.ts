import "@/lib/serverOnly";

import StatusCode from "status-code-enum";

import { SMALL_TRANSFERS_BASE_URL } from "@/lib/constants";
import type {
    AccessToken,
    AuthorizationCode,
    AuthorizeChargeResponse,
    ChargeId,
    GetTokensResponseBody,
    SmallTransfersApi,
} from "@/lib/smalltransfersTypes";
import { Micros } from "@/lib/smalltransfersTypes";
import { ApiError } from "@/lib/types";

export class SmallTransfersClient implements SmallTransfersApi {
    constructor(
        private readonly apiBaseUrl: string = `${SMALL_TRANSFERS_BASE_URL}/api/v1`,
        private readonly publishableKey: undefined | string = process.env.NEXT_PUBLIC_SMALL_TRANSFERS_PUBLISHABLE_KEY,
        private readonly secretKey: undefined | string = process.env.SMALL_TRANSFERS_SECRET_KEY,
    ) {
        if (this.publishableKey === undefined) {
            throw new ApiError(
                "Publishable key not specified in environment variables.",
                StatusCode.ClientErrorPreconditionFailed,
            );
        }
        if (this.secretKey === undefined) {
            throw new ApiError(
                "Secret key not specified in environment variables.",
                StatusCode.ClientErrorPreconditionFailed,
            );
        }
    }

    async getAccessToken(code: AuthorizationCode): Promise<GetTokensResponseBody> {
        const url = `${this.apiBaseUrl}/oauth/tokens`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                grantType: "authorization_code",
                authorizationCode: code,
                publishableKey: this.publishableKey,
                secretKey: this.secretKey,
            }),
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new ApiError(
                `Failed to exchange authorization code for access token: ${response.statusText}`,
                response.status,
            );
        }
        return response.json();
    }

    async authorizeCharge(accessToken: AccessToken, amountMicros: Micros): Promise<ChargeId> {
        const url = `${this.apiBaseUrl}/charges`;
        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                publishableKey: this.publishableKey,
                secretKey: this.secretKey,
                accessToken: accessToken,
                currency: "usd",
                amountMicros,
            }),
        };
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new ApiError(`Failed to authorize a charge: ${response.statusText}`, response.status);
        }
        const data = (await response.json()) as AuthorizeChargeResponse;
        return data.id;
    }

    async captureCharge(accessToken: AccessToken, chargeId: ChargeId, amountMicros: Micros): Promise<void> {
        const captureUrl = `${this.apiBaseUrl}/charges/${chargeId}/capture`;
        const captureOptions = {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({
                publishableKey: this.publishableKey,
                secretKey: this.secretKey,
                accessToken: accessToken,
                amountMicros,
            }),
        };
        const captureResponse = await fetch(captureUrl, captureOptions);
        if (!captureResponse.ok) {
            throw new ApiError(`Failed to capture a charge: ${captureResponse.statusText}`, captureResponse.status);
        }
    }
}

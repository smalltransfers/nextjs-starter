export type Result<T> = { readonly ok: true; readonly value: T } | { readonly ok: false; readonly error: string };

export function makeSuccess<T>(value: T): Result<T> {
    return { ok: true, value };
}

export function makeError<T>(error: string): Result<T> {
    return { ok: false, error };
}

export function promiseSuccess<T>(value: T): Promise<Result<T>> {
    return Promise.resolve(makeSuccess(value));
}

export function promiseError<T>(error: string): Promise<Result<T>> {
    return Promise.resolve(makeError(error));
}

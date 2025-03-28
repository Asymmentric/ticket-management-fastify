export interface IErrorReturn {
    success: boolean;
    message: string;
    statusCode: number;
    code: IErrorCodes;
    error?: any;
}

export type IErrorCodes = (typeof CustomError.ErrorCodesList)[number];

abstract class CustomError extends Error {
    abstract codePhrase: IErrorCodes;

    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, CustomError.prototype);
    }

    abstract returnError(): IErrorReturn;

    static ErrorCodesList = [
        "NOT_FOUND",
        "NOT_ALLOWED_ACCESS",
        "EMPTY_INPUT",
        "INVALID_INPUT",
        "REFRESH_AGAIN",
        "SOMETHING_WENT_WRONG",
        "EMAIL_INVALID",
        "INVALID_OTP",
        "INVALID_CREDENTIALS",
        "NEED_SIGNIN",
        "RESOURCE_EXISTS",
        "RESOURCE_NOT_FOUND",
        "RESOURCE_STATUS",
        "S3_UPLOAD_FAILED",
        "FILE_NOT_ALLOWED",
        "RESOURCE_EXPIRED",
        "CUSTOM_MESSAGE",
        "TOO_MANY_REQUEST",
        "INVALID_FORMAT",
        "INVALID_MINLENGTH",
        "REFRESH_AGAIN",
    ] as const;
}

export default CustomError;

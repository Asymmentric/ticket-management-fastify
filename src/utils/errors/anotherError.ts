import CustomError, { IErrorCodes, IErrorReturn } from "./customError";
import { FastifyRequest, FastifyReply } from "fastify";

class AnotherError extends CustomError {
    codePhrase: IErrorCodes;
    error: any = "";
    statusCode: number = 500;

    constructor(
        codePhrase: IErrorCodes,
        message: string,
        statusCode: number,
        error?: any
    ) {
        super(message);
        this.codePhrase = codePhrase;
        Object.setPrototypeOf(this, AnotherError.prototype);
        this.error = error;
        this.statusCode = statusCode;
    }

    returnError(): IErrorReturn {
        return {
            success: false,
            message: this.message,
            code: this.codePhrase,
            statusCode: this.statusCode,
            error: this.error,
        };
    }
}

export default AnotherError;

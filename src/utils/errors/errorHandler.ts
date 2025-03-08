import { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import AnotherError from "./anotherError";
import NotFoundError from "./404notFound";
import { error } from "console";

export const ErrorHandler = (app: FastifyInstance) => {
    app.setErrorHandler(
        (error, request: FastifyRequest, reply: FastifyReply) => {
            process.env.NODE_ENV !== "production"
                ? request.log.error(error)
                : console.log(error.stack);

            if (error.validation) {
                return reply.status(400).send({
                    success: false,
                    message: "Validation failed",
                    code: "VALIDATION_ERROR",
                    errors: error.validation,
                });
            }

            if (error instanceof AnotherError) {
                return reply
                    .status(error.statusCode)
                    .send({ ...error.returnError(), error: [] });
            } else if (error instanceof NotFoundError) {
                return reply
                    .status(404)
                    .send({ ...error.returnError(), error: [] });
            } else {
                return reply
                    .status(500)
                    .send({ success: false, message: "Something went wrong" });
            }
        }
    );
};

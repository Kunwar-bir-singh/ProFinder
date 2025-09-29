import { BadRequestException, ConflictException, RequestTimeoutException } from "@nestjs/common";
import { ForeignKeyConstraintError, TimeoutError, UniqueConstraintError, ValidationError } from "sequelize";
import { Exception } from "src/common/interface/exception.interface";

/**
 * This function is used to handle errors that occur during database operations.
 * It takes an error object as an argument and returns an Exception object.
 * The returned Exception object contains a message and an array of error objects.
 * The error objects contain a param and a message.
 * The function is used to handle Sequelize errors.
 * It throws a BadRequestException if the error is a ValidationError.
 * It throws a ConflictException if the error is a ForeignKeyConstraintError or a UniqueConstraintError.
 * It throws a RequestTimeoutException if the error is a TimeoutError.
 * @param error - The error object to be handled.
 * @returns - An Exception object containing a message and an array of error objects.
 */

export function handleError(error: any) {
    let exception: Exception;
    console.log("error", error);
    
    switch (true) {
        case error instanceof ValidationError: {
            exception = {
                message: "Validation error",
                errors: error.errors.map((e: any) => {
                    return {
                        param: e.path,
                        message: e.message
                    }
                })
            }
            throw new BadRequestException(exception);
        }

        case error instanceof UniqueConstraintError: {
            exception = {
                message: "Unique Constraint error",
                errors: [{ message: error.message }],
            }
            throw new ConflictException(exception);
        }


        case error instanceof ForeignKeyConstraintError: {
            exception = {
                message: "Foreign Key Constraint error",
                errors: [{ message: error.message }],
            }
            throw new ForeignKeyConstraintError(exception);
        }

        case error instanceof TimeoutError: {
            exception = {
                message: "Timeout error",
                errors: [{ message: error.message }],
            }
            throw new RequestTimeoutException(exception);
        }

        default: {
            throw error;
        }
    }
}


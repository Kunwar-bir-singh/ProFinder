import {
    CallHandler,
    ExecutionContext,
    Injectable,
    NestInterceptor
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { StandardResponse } from "../interface/standard.reponse.interface";

@Injectable()
export class ResponseInterceptor<T>
    implements NestInterceptor<T, StandardResponse<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler
    ): Observable<StandardResponse<T>> {
        const ctx = context.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();
        const method = request.method;
        const path = request.path;

        return next.handle().pipe(
            map(data => {
                const statusCode = response.statusCode;
                let message = "Request Successful";

                switch (method) {
                    case "POST":
                        if (statusCode === 201) {
                            message = "Resource created successfully";
                        }
                        break;
                    case "PUT":
                    case "PATCH":
                        if (statusCode === 200) {
                            message = "Resource updated successfully";
                        }
                        break;
                    case "DELETE":
                        if (statusCode === 200) {
                            message = "Resource deleted successfully";
                        }
                        break;
                    case "GET":
                        if (statusCode === 200) {
                            message = "Resource fetched successfully";
                        }
                        break;
                }

                return {
                    success: true,
                    statusCode,
                    message,
                    data,
                    path
                };
            })
        );
    }
}

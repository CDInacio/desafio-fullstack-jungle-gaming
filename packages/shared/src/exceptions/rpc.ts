import { Catch, RpcExceptionFilter, ArgumentsHost } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { RpcException } from "@nestjs/microservices";

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcException> {
  catch(exception: RpcException, host: ArgumentsHost): Observable<any> {
    console.error("RPC Exception:", exception.getError());

    return throwError(() => ({
      error: exception.getError(),
      timestamp: new Date().toISOString(),
    }));
  }
}

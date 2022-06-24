import { ErrorHandler, Inject, Injectable, Injector } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { LoggingService } from './core/services/logging.service';
import { ErrorService } from './core/services/error.service';
import { NotificationService } from './core/services/notification.service';
import { JL } from 'jsnlog';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  _logger: JL.JSNLog;

  constructor(private injector: Injector, @Inject('JSNLOG') jl: JL.JSNLog) {
    this._logger = jl;
  }


  handleError(error: Error | HttpErrorResponse) {
    const errorService = this.injector.get(ErrorService);
    const logger = this.injector.get(LoggingService);
    const notifier = this.injector.get(NotificationService);

    let message;
    let stackTrace;
    if (error instanceof HttpErrorResponse) {
      // Server error
      message = errorService.getServerErrorMessage(error);
      //stackTrace = errorService.getServerErrorStackTrace(error);
      notifier.error(message);
      this._logger().error(message);
    } else {
      // Client Error
      message = errorService.getClientErrorMessage(error);
      notifier.error(message);
      this._logger().error(message);
    }
    // Always log errors
    logger.logError(message, stackTrace);
    console.error(error);
  }
}

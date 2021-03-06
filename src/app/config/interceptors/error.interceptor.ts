import {Injectable} from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {AuthenticationService} from '../../services/authentication.service';
import {Router} from '@angular/router';
import {ErrorService} from '../../services/error.service';


@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService,
              private errorService: ErrorService,
              private router: Router) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(catchError(err => {
      if ([401, 403].indexOf(err.status) !== -1) {
        // auto logout if 401 Unauthorized or 403 Forbidden response returned from api
        this.authenticationService.logOut();
        location.reload();
        console.log('Interceptor executed');
      }


      if ((err.status === 500) && (err.statusText)) {
        this.errorService.message = err.error.message;
        this.router.navigateByUrl('/500');
      }

      const error = err.error.message || err.statusText;
      return throwError(error);
    }));
  }
}

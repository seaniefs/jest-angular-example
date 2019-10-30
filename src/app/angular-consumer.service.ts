import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AngularConsumer {


  private url = 'http://localhost:12349';

  constructor(private http: HttpClient) {
  }

  performQuery$(validDate: string): Observable<Response> {
    let queryParams = {};
    if (validDate != null) {
      queryParams = { validDate: validDate};
    }
    return this.http.get<Response>(`${this.url}/provider.json`, {params: queryParams})
      .pipe(map(i => {
        if (i == null) {
          return {count: 0, validDate: null};
        }
        i.count = 100 / i.count;
        return {count: 100 / i.count, validDate: i.validDate};
      }), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }
}

export interface Response {
  validDate: string;
  count: number;
}

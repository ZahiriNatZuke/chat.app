import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { first, retry } from 'rxjs/operators';
import { ApiHelpers } from './api.helpers';

const apiHelpers = new ApiHelpers();

@Injectable({
  providedIn: 'root'
})
export class CrudService {
  constructor(private httpClient: HttpClient) {}

  Post(URL: string, body: any): Observable<any> {
    return this.httpClient
      .post(URL, body, { headers: apiHelpers.getHeadersWithAuth() })
      .pipe(first(), retry(1));
  }

  Get(URL: string): Observable<any> {
    return this.httpClient
      .get(URL, { headers: apiHelpers.getHeadersWithOutAuth() })
      .pipe(first(), retry(1));
  }

  GetWithAuth(URL: string): Observable<any> {
    return this.httpClient
      .get(URL, { headers: apiHelpers.getHeadersWithAuth() })
      .pipe(first(), retry(1));
  }

  Put(URL: string, body: any): Observable<any> {
    return this.httpClient
      .put(URL, body, { headers: apiHelpers.getHeadersWithAuth() })
      .pipe(first(), retry(1));
  }

  Delete(URL: string, param: string): Observable<any> {
    return this.httpClient
      .delete(`${URL}/${param}`, {
        headers: apiHelpers.getHeadersWithAuth()
      })
      .pipe(first(), retry(1));
  }
}

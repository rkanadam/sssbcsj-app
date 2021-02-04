import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UtilsService} from './utils.service';
import {Observable, ReplaySubject, Subject} from 'rxjs';
import {AuthService} from '../auth/auth.service';
import {catchError, tap} from 'rxjs/operators';

export enum ApiRequestState {
  IN_PROGRESS, FAILED, SUCCEEDED
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiRequest$$ = new Subject<ApiRequestState>();

  constructor(private httpClient: HttpClient, private utils: UtilsService, private authService: AuthService) {
  }

  public apiRequest$ = this.apiRequest$$.asObservable();

  public get<T>(url: string, params: { [key: string]: string } = {}): Observable<T> {
    this.apiRequest$$.next(ApiRequestState.IN_PROGRESS);
    return this.httpClient.get<T>(`${this.utils.getBaseApiUrl()}/${url}`, {
      headers: this.authService.getHeaders(),
      params
    }).pipe(
      tap((_: T) => {
        this.apiRequest$$.next(ApiRequestState.SUCCEEDED);
      }), catchError((err, caught) => {
        this.apiRequest$$.next(ApiRequestState.FAILED);
        return caught;
      }));
  }

  public post<T>(url: string, payload: any = {}): Observable<T> {
    this.apiRequest$$.next(ApiRequestState.IN_PROGRESS);
    return this.httpClient.post<T>(`${this.utils.getBaseApiUrl()}/${url}`, payload, {
      headers: this.authService.getHeaders()
    }).pipe(
      tap((_: T) => {
        this.apiRequest$$.next(ApiRequestState.SUCCEEDED);
      }), catchError((err, caught) => {
        this.apiRequest$$.next(ApiRequestState.FAILED);
        return caught;
      }));
  }
}

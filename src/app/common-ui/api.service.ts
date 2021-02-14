import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {UtilsService} from './utils.service';
import {Observable, of, Subject, throwError} from 'rxjs';
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
  private _isAdmin$: Observable<boolean> | null = null;

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
        throw caught;
      }));
  }

  public getBlob(url: string, params: { [key: string]: string } = {}): Observable<Blob> {
    this.apiRequest$$.next(ApiRequestState.IN_PROGRESS);
    return this.httpClient.get(`${this.utils.getBaseApiUrl()}/${url}`, {
      headers: this.authService.getHeaders(),
      params,
      responseType: 'blob'
    }).pipe(
      tap((_: any) => {
        this.apiRequest$$.next(ApiRequestState.SUCCEEDED);
      }), catchError((err, caught) => {
        this.apiRequest$$.next(ApiRequestState.FAILED);
        throw caught;
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
        return throwError(caught);
      }));
  }

  public isAdmin$(): Observable<boolean> {
    if (this._isAdmin$) {
      return this._isAdmin$;
    }
    return this.get<boolean>('isAdmin')
      .pipe(
        tap((isAdmin) => {
          this._isAdmin$ = of(isAdmin);
        })
      );
  }
}

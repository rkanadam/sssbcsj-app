import {Injectable} from '@angular/core';
import {isEmpty} from 'lodash-es';

export interface Headers {
  [key: string]: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private authToken = '';

  constructor() {

  }
  public isLoggedIn(): boolean {
    return !isEmpty(this.authToken);
  }

  public setAuthToken(authToken: string): void {
    this.authToken = authToken;
  }

  public getHeaders(): Headers {
    return {
      Bearer: `firebase ${this.authToken}`
    };
  }
}

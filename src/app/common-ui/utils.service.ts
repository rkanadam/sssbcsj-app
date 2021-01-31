import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {
  }

  public getBaseApiUrl(): string {
    return environment.baseAPIUrl;
  }
}

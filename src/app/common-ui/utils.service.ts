import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor() {
  }

  public getBaseApiUrl(): string {
    return environment.baseAPIUrl;
  }

  public parseMultiLineString(description: string): string {
    return description
      .replace(URL_REGEX, (url: string) => `<a href="${url}" target="_blank">${url}</a>`)
      .replace(/\n/ig, '<br/>');
  }

}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OwnerService {
  public API = '//thawing-chamber-47973.herokuapp.com';
  public OWNERS_API = this.API + '/owners';

  constructor(private http: HttpClient) {
  }

  getAll(): Observable<any> {
    return this.http.get(this.API + '/owners');
  }

  getDni(dni) : Observable<any> {
    const newAPI = this.OWNERS_API  + '/search/findByDni?dni=' + dni;
    return this.http.get<any>(newAPI);
  }

  saveOwner(owner: any): Observable<any> {
    let result: Observable<Object>;
    if (owner['href']) {
      result = this.http.put(owner.href, owner);
    } else {
      result = this.http.post(this.OWNERS_API, owner);
    }
    return result;
  }

  removeOwner(href: string) {
    return this.http.delete(href);
  }
}
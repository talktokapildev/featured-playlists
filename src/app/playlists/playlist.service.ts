import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import {
  BehaviorSubject,
  combineLatest,
  EMPTY,
  from,
  merge,
  Subject,
  throwError,
  of,
  Observable,
} from 'rxjs';
import {
  catchError,
  filter,
  map,
  mergeMap,
  scan,
  shareReplay,
  tap,
  toArray,
  switchMap,
} from 'rxjs/operators';

import { Playlist } from './playlist';

@Injectable({
  providedIn: 'root',
})
export class PlaylistService {
  private productsUrl =
    'https://portal.organicfruitapps.com/programming-guides/v2/us_en-us/featured-playlists.json';

  // curator
  private curatorsSubject = new BehaviorSubject<string[]>(null);
  curators$ = this.curatorsSubject.asObservable();

  // All products
  products$ = this.http.get<any>(this.productsUrl).pipe(
    tap(({ featuredPlaylists: { content } }) => {
      const curatorsColl = content.map((d) => d.curator_name);
      this.curatorsSubject.next(
        curatorsColl.filter(
          (item, index) => curatorsColl.indexOf(item) === index
        )
      );
    }),
    map((data) => data.featuredPlaylists.content),
    catchError(this.handleError)
  );
  
  constructor(
    private http: HttpClient
  ) {}

  private handleError(err: any): Observable<never> {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage: string;
    if (err.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Backend returned code ${err.status}: ${err.body.error}`;
    }
    console.error(err);
    return throwError(errorMessage);
  }
}

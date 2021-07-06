import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, EMPTY, Subject } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { PlaylistService } from './playlist.service';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.scss'],
})
export class PlaylistComponent {
  pageTitle = 'PlayList';
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  // Action stream
  private curatorSelectedSubject = new BehaviorSubject<string>(null);
  curatorSelectedAction$ = this.curatorSelectedSubject.asObservable();

  // Merge Data stream with Action stream
  // To filter to the selected curator
  playlists$ = combineLatest([
    this.playlistService.products$,
    this.curatorSelectedAction$,
  ]).pipe(
    map(([playlists, selectedCuratorName]) =>
      playlists.filter((playlist) =>
        selectedCuratorName
          ? playlist.curator_name === selectedCuratorName
          : true
      )
    ),
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  // curators for drop down list
  curators$ = this.playlistService.curators$.pipe(
    catchError((err) => {
      this.errorMessageSubject.next(err);
      return EMPTY;
    })
  );

  // Combine all streams for the view
  vm$ = combineLatest([this.playlists$, this.curators$]).pipe(
    map(([playlists, curators]) => ({ playlists, curators }))
  );

  constructor(private playlistService: PlaylistService) {}

  onSelected(curator: string): void {
    this.curatorSelectedSubject.next(curator);
  }
}

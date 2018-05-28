import { ArticleService, Articles, Page } from '../article.service';
import { Component } from "@angular/core";
import { catchError, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Observable, of, Subject } from "rxjs";

@Component( {
    selector: 'search-form',
    templateUrl: './search-form.component.html',
    styleUrls: ['./search-form.component.css'],
    providers: [ArticleService]
} )

export class SearchFormComponent {
    topic: string = "";
    searching = false;
    noSuggestions = false;
    error = false;
    pages: Page[];

    constructor( private articleService: ArticleService ) { }

    suggestions$ = ( searchText$: Subject<string> ) => searchText$.pipe(
        debounceTime( 500 ),
        distinctUntilChanged(),
        tap( st => {
            this.searching = true;
            this.noSuggestions = false;
            this.error = false;
        } ),
        switchMap( st => this.articleService.findSuggestions( st ) ),
        tap( r => { this.searching = false; if ( this.topic.trim().length > 0 && r.length == 0 ) this.noSuggestions = true; } ),
        catchError(() => {
            this.error = true;
            return of( [] );
        } )
    );

    onSubmit() {
        this.articleService.findArticles( this.topic )
            .subscribe( pages => {
                this.pages = new Array<Page>();
                for ( var property in pages ) {
                    this.pages.push( pages[property] );
                }
            } 
        );
    }
}

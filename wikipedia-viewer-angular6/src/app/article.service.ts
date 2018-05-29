import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, catchError } from "rxjs/operators";
import { of, Observable } from "rxjs";

const WIKI_URL = 'https://en.wikipedia.org/w/api.php';

const PRMS_SUGGS = new HttpParams( {
    fromObject: {
        action: 'opensearch',
        format: 'json',
        origin: '*',
        limit: '10'
    }
} );

const PRMS_ARTS = new HttpParams( {
    fromObject: {
        action: 'query',
        generator: 'search',
        prop: 'extracts',
        exintro: '',
        explaintext: '',
        exsentences: '3',
        exlimit: 'max',
        format: 'json',
        origin: '*'
    }
} );

export interface Articles {
    batchcomplete: string;
    continue: string;
    limits: string;
    query: {
        pages: any;  // not a valid JSON
    }
}

export interface Page {
    index: number;
    pageid: number;
    ns: number;
    title: string;
    extract: string;
}

@Injectable()
export class ArticleService {

    constructor( private http: HttpClient ) { }

    findSuggestions( topic: string ) {
        if ( topic.trim().length == 0 ) { return of( [] ); } else { topic = topic.trim(); }
        const params = { params: PRMS_SUGGS.set( 'search', topic ) };
        return this.http.get<string[]>( WIKI_URL, params ).pipe( map( data => data[1] ) );
    }

    findArticles( suggestion: string ) {
        if ( suggestion.trim().length == 0 ) { return of( [] ); } else { suggestion = suggestion.trim(); }
        const params = { params: PRMS_ARTS.set( 'gsrsearch', suggestion ) };
        return this.http.get<Articles>( WIKI_URL, params ).pipe( map( data => data.query.pages ), catchError(() => {
            return of( [] );
        } ) );
    }
}

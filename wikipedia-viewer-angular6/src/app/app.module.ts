import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { SearchFormComponent } from './search-form/search-form.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { ArticleService } from "./article.service";
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule( {
    declarations: [
        AppComponent,
        SearchFormComponent
    ],
    imports: [
        BrowserModule,
        FormsModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgbModule.forRoot()
    ],
    providers: [],
    bootstrap: [AppComponent]
} )

export class AppModule { }

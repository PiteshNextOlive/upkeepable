import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule ,FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { ArticleRoutingModule } from './article.routing.module';
@NgModule({
    imports:[
        RouterModule,
        CommonModule,
        ReactiveFormsModule,
        SharedModule,
        ArticleRoutingModule
    ],
    declarations:[
    
  ],
    providers:[FormBuilder]
})
export class ArticleModule{}

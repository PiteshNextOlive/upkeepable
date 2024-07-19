import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardAddedSuccessfullyComponent } from './card-added-successfully.component';

describe('CardAddedSuccessfullyComponent', () => {
  let component: CardAddedSuccessfullyComponent;
  let fixture: ComponentFixture<CardAddedSuccessfullyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardAddedSuccessfullyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardAddedSuccessfullyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

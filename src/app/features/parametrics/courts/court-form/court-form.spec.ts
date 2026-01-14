import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourtForm } from './court-form';

describe('CourtForm', () => {
  let component: CourtForm;
  let fixture: ComponentFixture<CourtForm>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CourtForm]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourtForm);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

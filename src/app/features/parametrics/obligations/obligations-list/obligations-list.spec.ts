import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ObligationsList } from './obligations-list';

describe('ObligationsList', () => {
  let component: ObligationsList;
  let fixture: ComponentFixture<ObligationsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ObligationsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ObligationsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

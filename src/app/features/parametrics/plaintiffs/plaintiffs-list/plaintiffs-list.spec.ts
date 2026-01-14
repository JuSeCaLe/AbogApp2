import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaintiffsList } from './plaintiffs-list';

describe('PlaintiffsList', () => {
  let component: PlaintiffsList;
  let fixture: ComponentFixture<PlaintiffsList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaintiffsList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlaintiffsList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

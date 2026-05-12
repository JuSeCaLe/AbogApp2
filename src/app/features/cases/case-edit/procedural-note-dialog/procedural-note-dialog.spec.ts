import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProceduralNoteDialog } from './procedural-note-dialog';

describe('ProceduralNoteDialog', () => {
  let component: ProceduralNoteDialog;
  let fixture: ComponentFixture<ProceduralNoteDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProceduralNoteDialog]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProceduralNoteDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

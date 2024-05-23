import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumenttypeAddEditComponent } from './documenttype-add-edit.component';

describe('DocumenttypeAddEditComponent', () => {
  let component: DocumenttypeAddEditComponent;
  let fixture: ComponentFixture<DocumenttypeAddEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocumenttypeAddEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocumenttypeAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

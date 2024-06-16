import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportMessageAdminComponent } from './support-message-admin.component';

describe('SupportMessageAdminComponent', () => {
  let component: SupportMessageAdminComponent;
  let fixture: ComponentFixture<SupportMessageAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportMessageAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportMessageAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

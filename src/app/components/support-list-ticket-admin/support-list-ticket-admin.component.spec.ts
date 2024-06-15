import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportListTicketAdminComponent } from './support-list-ticket-admin.component';

describe('SupportListTicketAdminComponent', () => {
  let component: SupportListTicketAdminComponent;
  let fixture: ComponentFixture<SupportListTicketAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportListTicketAdminComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportListTicketAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

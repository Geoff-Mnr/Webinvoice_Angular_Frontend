import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SupportCreateTicketComponent } from './support-create-ticket.component';

describe('SupportCreateTicketComponent', () => {
  let component: SupportCreateTicketComponent;
  let fixture: ComponentFixture<SupportCreateTicketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SupportCreateTicketComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SupportCreateTicketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

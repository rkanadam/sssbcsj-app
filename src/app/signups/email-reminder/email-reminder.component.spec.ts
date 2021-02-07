import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailReminderComponent } from './email-reminder.component';

describe('EmailReminderComponent', () => {
  let component: EmailReminderComponent;
  let fixture: ComponentFixture<EmailReminderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmailReminderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailReminderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

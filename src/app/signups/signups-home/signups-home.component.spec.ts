import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupsHomeComponent } from './signups-home.component';

describe('SignupsHomeComponent', () => {
  let component: SignupsHomeComponent;
  let fixture: ComponentFixture<SignupsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SignupsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

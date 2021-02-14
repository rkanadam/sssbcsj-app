import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignupsComponent} from './signups.component';

describe('SignupsHomeComponent', () => {
  let component: SignupsComponent;
  let fixture: ComponentFixture<SignupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignupsComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

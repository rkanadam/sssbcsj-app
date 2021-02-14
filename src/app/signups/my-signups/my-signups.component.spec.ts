import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MySignupsComponent } from './my-signups.component';

describe('MySignupsComponent', () => {
  let component: MySignupsComponent;
  let fixture: ComponentFixture<MySignupsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MySignupsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MySignupsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

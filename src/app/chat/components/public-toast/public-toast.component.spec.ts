import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PublicToastComponent } from './public-toast.component';

describe('PublicToastComponent', () => {
  let component: PublicToastComponent;
  let fixture: ComponentFixture<PublicToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PublicToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

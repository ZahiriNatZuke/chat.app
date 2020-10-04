import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogoutToastComponent } from './logout-toast.component';

describe('LogoutToastComponent', () => {
  let component: LogoutToastComponent;
  let fixture: ComponentFixture<LogoutToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogoutToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

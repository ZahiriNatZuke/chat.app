import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivateToastComponent } from './private-toast.component';

describe('PrivateToastComponent', () => {
  let component: PrivateToastComponent;
  let fixture: ComponentFixture<PrivateToastComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrivateToastComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivateToastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

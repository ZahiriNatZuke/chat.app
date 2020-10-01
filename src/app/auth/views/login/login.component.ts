import {
  Component,
  ElementRef,
  OnInit,
  Renderer2,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../utils/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  public loginForm: FormGroup = this.formBuilder.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    device_name: [
      `${window.navigator.appCodeName}-${
        window.navigator.appName
      }-${Math.random()}`
    ]
  });
  private returnURL: string;
  @ViewChild('email') emailElm: ElementRef;
  @ViewChild('password') passwordElm: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private render2: Renderer2
  ) {
    this.returnURL =
      this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ||
      '/chat/index';
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.PostForLogin(this.loginForm.value).subscribe(
        res => {
          this.authService.updateCurrentUserValue(res.user);
          this.authService.updateCurrentTokenValue(res.token);
          this.router.navigate([this.returnURL]);
        },
        error => console.log(error)
      );
    } else {
      if (this.loginForm.get('email').hasError('required')) {
        this.render2.setAttribute(
          this.emailElm.nativeElement,
          'data-validate',
          'Email is Required'
        );
        this.render2.addClass(this.emailElm.nativeElement, 'alert-validate');
      }
      if (this.loginForm.get('email').hasError('email')) {
        this.render2.setAttribute(
          this.emailElm.nativeElement,
          'data-validate',
          'Email must be a email'
        );
        this.render2.addClass(this.emailElm.nativeElement, 'alert-validate');
      }
      if (this.loginForm.get('password').hasError('required')) {
        this.render2.setAttribute(
          this.passwordElm.nativeElement,
          'data-validate',
          'Password is Required'
        );
        this.render2.addClass(this.passwordElm.nativeElement, 'alert-validate');
      }
      if (this.loginForm.get('password').hasError('minlength')) {
        this.render2.setAttribute(
          this.passwordElm.nativeElement,
          'data-validate',
          'Password must have at least 8 characters'
        );
        this.render2.addClass(this.passwordElm.nativeElement, 'alert-validate');
      }
    }
  }

  eraseAlert(Elm: ElementRef): void {
    this.render2.removeClass(Elm.nativeElement, 'alert-validate');
    this.render2.removeAttribute(Elm.nativeElement, 'data-validate');
  }
}

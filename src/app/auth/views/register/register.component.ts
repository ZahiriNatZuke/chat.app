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
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    password_confirmation: [
      '',
      [Validators.required, Validators.minLength(8), Validators.pattern]
    ]
  });
  private returnURL: string;
  @ViewChild('name') nameElm: ElementRef;
  @ViewChild('email') emailElm: ElementRef;
  @ViewChild('password') passwordElm: ElementRef;
  @ViewChild('password_confirmation') passwordConfirmationElm: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private router: Router,
    private render2: Renderer2
  ) {
    this.returnURL =
      this.activatedRoute.snapshot.queryParamMap.get('returnUrl') ||
      '/auth/login';
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.authService.PostForRegister(this.registerForm.value).subscribe(
        res => {
          this.router.navigate([this.returnURL]);
        },
        error => console.log(error)
      );
    } else {
      if (this.registerForm.get('name').hasError('required')) {
        this.render2.setAttribute(
          this.nameElm.nativeElement,
          'data-validate',
          'Name is Required'
        );
        this.render2.addClass(this.nameElm.nativeElement, 'alert-validate');
      }
      if (this.registerForm.get('email').hasError('required')) {
        this.render2.setAttribute(
          this.emailElm.nativeElement,
          'data-validate',
          'Email is Required'
        );
        this.render2.addClass(this.emailElm.nativeElement, 'alert-validate');
      }
      if (this.registerForm.get('email').hasError('email')) {
        this.render2.setAttribute(
          this.emailElm.nativeElement,
          'data-validate',
          'Email must be a email'
        );
        this.render2.addClass(this.emailElm.nativeElement, 'alert-validate');
      }
      if (this.registerForm.get('password').hasError('required')) {
        this.render2.setAttribute(
          this.passwordElm.nativeElement,
          'data-validate',
          'Password is Required'
        );
        this.render2.addClass(this.passwordElm.nativeElement, 'alert-validate');
      }
      if (this.registerForm.get('password').hasError('minlength')) {
        this.render2.setAttribute(
          this.passwordElm.nativeElement,
          'data-validate',
          'Password must have at least 8 characters'
        );
        this.render2.addClass(this.passwordElm.nativeElement, 'alert-validate');
      }
      if (this.registerForm.get('password_confirmation').hasError('required')) {
        this.render2.setAttribute(
          this.passwordConfirmationElm.nativeElement,
          'data-validate',
          'Password Confirmation is Required'
        );
        this.render2.addClass(
          this.passwordConfirmationElm.nativeElement,
          'alert-validate'
        );
      }
      if (
        this.registerForm.get('password_confirmation').hasError('minlength')
      ) {
        this.render2.setAttribute(
          this.passwordConfirmationElm.nativeElement,
          'data-validate',
          'Password Confirmation must have at least 8 characters'
        );
        this.render2.addClass(
          this.passwordConfirmationElm.nativeElement,
          'alert-validate'
        );
      }
      if (this.registerForm.get('password_confirmation').hasError('pattern')) {
        this.render2.setAttribute(
          this.passwordConfirmationElm.nativeElement,
          'data-validate',
          'Password & Password Confirmation must be equals'
        );
        this.render2.addClass(
          this.passwordConfirmationElm.nativeElement,
          'alert-validate'
        );
      }
    }
  }

  eraseAlert(Elm: ElementRef): void {
    this.render2.removeClass(Elm.nativeElement, 'alert-validate');
    this.render2.removeAttribute(Elm.nativeElement, 'data-validate');
  }
}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginComponent } from './login.component';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let page: any

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        MatInputModule,
        MatButtonModule,
        BrowserAnimationsModule,
        ReactiveFormsModule
      ]
    });
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement
    fixture.detectChanges();
  });

  describe('given form', () => {
    it('when email is empty, then forgot password button should be disabled', () => {
      setEmail('')
  
      expect(forgotPasswordButton().disabled).toBeTruthy()
    })
  
    it('when email is invalid, then forgot password button should be disabled', () => {
      setEmail('invalidEmail')
  
      expect(forgotPasswordButton().disabled).toBeTruthy()
    })
  
    it('when email is valid, then forgot password button should be enabled', () => {
      setEmail('valid@email.com')
  
      expect(forgotPasswordButton().disabled).toBeFalsy()
    })

    it('when email is empty, then login button should be disabled', () => {
      setEmail('')
      setPassword('anyPassword')
  
      expect(loginButton().disabled).toBeTruthy()
    })

    it('when password is empty, then login button should be disabled', () => {
      setEmail('valid@email.com')
      setPassword('')
  
      expect(loginButton().disabled).toBeTruthy()
    })

    it('when password is not empty, then login button should be enabled', () => {
      setEmail('valid@email.com')
      setPassword('anyPassword')
  
      expect(loginButton().disabled).toBeFalsy()
    })
  })
  
  function setEmail(value: string) {
    component.form.get('email')?.setValue(value)
    fixture.detectChanges()
  }

  function setPassword(value: string) {
    component.form.get('password')?.setValue(value)
    fixture.detectChanges()
  }

  function forgotPasswordButton() {
    return page.querySelector('[test-id="forgot-password-button"]')
  }

  function loginButton() {
    return page.querySelector('[test-id="login-button"]')
  }
});

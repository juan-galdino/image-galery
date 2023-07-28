import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { Location } from '@angular/common';
import { RouterTestingModule } from '@angular/router/testing'
import { BlankComponent } from '../mocks/blank/blank.component';
import { Subject } from 'rxjs';
import { LoginService } from './login.service';
import { MatSnackBar } from '@angular/material/snack-bar';


describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let page: any
  let location: Location
  let authenticationServiceMock: AuthenticationServiceMock
  let snackBar: SnackBarMock

  beforeEach( () => {
    authenticationServiceMock = new AuthenticationServiceMock()
    snackBar = new SnackBarMock()

    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,

        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          { path: 'gallery', component: BlankComponent }
        ])
      ],
      providers: [Location]
    })
    .overrideProvider(LoginService, { useValue: authenticationServiceMock })
    .overrideProvider(MatSnackBar, { useValue: snackBar })
    .compileComponents()

    fixture = TestBed.createComponent(LoginComponent);
    location = TestBed.inject(Location)

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

  describe('Login flow', () => {

    describe('given user clicks on login button', () => {

      beforeEach(() => {
        setEmail('valid@email.com')
        setPassword('anyPassword')
        loginButton().click()
        fixture.detectChanges()
      })

      it('then should show the login loader', () => {
        expect(loginLoader()).not.toBeNull()
      })

      it('then should hide the login button', () => { 
        expect(loginButton()).toBeNull()
      })

      describe('when login is succesfull', () => {
        beforeEach(() => {
          authenticationServiceMock._signInResponse.next({id: "anyUserId"})
          fixture.detectChanges()
        })

        it('should then navigate to the gallery page', done => {
          setTimeout( () => {
            expect(location.path()).toEqual('/gallery')
            done()
          }, 100)
        })

      })

      describe('when login fails', () => {
        beforeEach(() => {
          authenticationServiceMock._signInResponse.error({message: "error"})
          fixture.detectChanges()
        })

        it('then do not go to gallery page', done => {
          setTimeout( () => {
            expect(location.path()).not.toEqual('/gallery')
            done()
          }, 100)
        })

        it('then should hide the loader button', () => {
          expect(loginLoader()).toBeNull()
        })

        it('then show login button', () => {
          expect(loginButton()).not.toBeNull()
        })

        it('then show error message', () => {
          expect(snackBar._isOpened).toBeTruthy()
        })

      })
    
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

  function loginButton(): HTMLButtonElement {
    return page.querySelector('[test-id="login-button"]')
  }

  function loginLoader(): HTMLButtonElement  {
    return page.querySelector('[test-id="login-loader"]')
  }
});

class AuthenticationServiceMock {
  _signInResponse = new Subject()

  login() {
    return this._signInResponse.asObservable()
  }
}

class SnackBarMock {
  _isOpened = false

  open() {
    this._isOpened = true
  }
}

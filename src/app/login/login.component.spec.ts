import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing'
import { Location } from '@angular/common';

import { LoginComponent } from './login.component';
import { BlankComponent } from '../mocks/blank/blank.component';
import { AuthenticationService } from '../auth/auth.service'; 
import { MatSnackBar } from '@angular/material/snack-bar';

import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'

import { Subject } from 'rxjs';


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
          { path: 'home/galeria', component: BlankComponent },
          { path: 'cadastro', component: BlankComponent }
        ])
      ],
      providers: [Location]
    })
    .overrideProvider(AuthenticationService, { useValue: authenticationServiceMock })
    .overrideProvider(MatSnackBar, { useValue: snackBar })
    .compileComponents()

    fixture = TestBed.createComponent(LoginComponent);
    location = TestBed.inject(Location)

    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement

    fixture.detectChanges();
  });

  describe('Login flow', () => {

    describe('given form', () => {

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
            expect(location.path()).toEqual('/home/galeria')
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
            expect(location.path()).not.toEqual('/home/galeria')
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

  describe('Recover password flow', () => {

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

  })
    
    describe('given user clicks on forgot password button', () => {

      beforeEach(() => {
        setEmail('valid@email.com')
        forgotPasswordButton().click()
        fixture.detectChanges()
      })

      it('then show forgot password loader', () => {
        expect(forgotPasswordLoader()).not.toBeNull()
      })

      it('then hide forgot password button', () => {
        expect(forgotPasswordButton()).toBeNull()
      })

      describe('when forgot password is succesfull', () => {

        beforeEach(() => {
          authenticationServiceMock._recoverPasswordResponse.next({})
          fixture.detectChanges()
        })

        it('then hide forgot password loader', () => {
          expect(forgotPasswordLoader()).toBeNull()
        })

        it('then show forgot password button', () => {
          expect(forgotPasswordButton()).not.toBeNull()
        })

        it('then show success message', () => {
          expect(snackBar._isOpened).toBeTruthy()
        })

      })

      describe('when forgot password fails', () => {

        beforeEach(() => {
          authenticationServiceMock._recoverPasswordResponse.error({message: 'any error message'})
          fixture.detectChanges()
        })

        it('then hide forgot password loader', () => {
          expect(forgotPasswordLoader()).toBeNull()
        })

        it('then show forgot password button', () => {
          expect(forgotPasswordButton()).not.toBeNull()
        })

        it('then show error message', () => {
          expect(snackBar._isOpened).toBeTruthy()
        })

      })

    })

  })

  describe('Navigates to signup page flow', () => {

    describe('given user clicks on heads to signup page button', () => {

      beforeEach(() => {
        headsToSignupPageButton().click()
        fixture.detectChanges()
      })
  
      it('should then navigate to the signup page', done => {
        setTimeout( () => {
          expect(location.path()).toEqual('/cadastro')
          done()
        }, 100)
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

  function forgotPasswordButton(): HTMLButtonElement {
    return page.querySelector('[test-id="forgot-password-button"]')
  }

  function forgotPasswordLoader(): HTMLButtonElement {
    return page.querySelector('[test-id="forgot-password-loader"]')
  }

  function loginButton(): HTMLButtonElement {
    return page.querySelector('[test-id="login-button"]')
  }

  function headsToSignupPageButton(): HTMLButtonElement {
    return page.querySelector('[test-id="heads-to-signup-page-button"]')
  }

  function loginLoader(): HTMLButtonElement  {
    return page.querySelector('[test-id="login-loader"]')
  }
});

class AuthenticationServiceMock {
  _signInResponse = new Subject()
  _recoverPasswordResponse = new Subject()

  recoverPassword() {
    return this._recoverPasswordResponse.asObservable()
  }

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

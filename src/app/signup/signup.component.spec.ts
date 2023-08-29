import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupComponent } from './signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import { AuthenticationService } from '../auth/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { BlankComponent } from '../mocks/blank/blank.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';


describe('SignupComponent', () => {
  let component: SignupComponent;
  let fixture: ComponentFixture<SignupComponent>;
  let page: any
  let location: Location
  let authenticationService: AuthenticationServiceMock
  let snackBar: SnackBarMock

  beforeEach(() => {
    authenticationService = new AuthenticationServiceMock()
    snackBar = new SnackBarMock()

    TestBed.configureTestingModule({
      declarations: [SignupComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,

        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatProgressSpinnerModule,
        RouterTestingModule.withRoutes([
          { path: "home/galeria", component: BlankComponent },
          { path: "login", component: BlankComponent }
        ])
      ],
      providers:[Location]
    })
    .overrideProvider(AuthenticationService, { useValue: authenticationService })
    .overrideProvider(MatSnackBar, { useValue: snackBar })
    .compileComponents();

    fixture = TestBed.createComponent(SignupComponent);
    location = TestBed.inject(Location)

    component = fixture.componentInstance;
    page = fixture.debugElement.nativeElement;

    fixture.detectChanges();
  });

  describe('Registration Flow', () => {

    describe('given form', () => {

      it('when name is empty, then signup button should be disabled', () => {
        setName('')
        setEmail('valid@email.com')
        setPassword('anyPassword')

        expect(signupButton().disabled).toBeTruthy()
      })

      it('when email is empty, then signup button should be disabled', () => {
        setName('Any Name')
        setEmail('')
        setPassword('anyPassword')

        expect(signupButton().disabled).toBeTruthy()
      })

      it('when email is invalid, then signup button should be disabled', () => {
        setEmail('invalidEmail')
    
        expect(signupButton().disabled).toBeTruthy()
      })

      it('when password is empty, then signup button should be disabled', () => {
        setName('Any Name')
        setEmail('valid@email.com')
        setPassword('')

        expect(signupButton().disabled).toBeTruthy()
      })

      it('when password is not empty, then signup button should be enabled', () => {
        setName('Any Name')
        setEmail('valid@email.com')
        setPassword('anyPassword')
        fixture.detectChanges()

        expect(signupButton().disabled).toBeFalsy()
      })


    })

    describe('when user clicks on signup button', () => {

      beforeEach(() => {
        setName('Any Name')
        setEmail('valid@email.com')
        setPassword('anyPassword')
        fixture.detectChanges()

        signupButton().click()
        fixture.detectChanges()
      })

      it('then hide the signup button', () => {
        expect(signupButton()).toBeNull()
      })

      it('then show signup loader', () => {
        expect(signupLoader()).not.toBeNull()
      })

      describe('when signing up is successful', () => {

        beforeEach(() => {
          authenticationService._signupResponse.next({id: 'anyUserId'})
          fixture.detectChanges()
        })

        it('then navigates to gallery page', done => {
          setTimeout(() => {
            expect(location.path()).toEqual('/home/galeria')
            done()
          },100)
        })

      })

      describe('when signing up fails', () => {

        beforeEach(() => {
          authenticationService._signupResponse.error({message: 'anyError'})
          fixture.detectChanges()
        })
  
        it('then do not navigates to gallery page', done => {
          setTimeout(() => {
            expect(location.path()).not.toEqual('/home/galeria')
            done()
          },100)
        })
  
        it('then show signup button', () => {
          expect(signupButton()).not.toBeNull()
        })

        it('then hide signup loader', () => {
          expect(signupLoader()).toBeNull()
        })

        it('then open snackbar to show error message', () => {
          expect(snackBar._isOpen).toBeTrue()
        })
  
      })
  

    })

    
  })

  describe('Navigates to login page flow', () => {

    describe('given user clicks on heads to login page button', () => {

      beforeEach(() => {
        headsToLoginPageButton().click()
        fixture.detectChanges()
      })

      it('then navigates to login page', done => {
        setTimeout( () => {
          expect(location.path()).toEqual('/login')
          done()
        }, 100)
      })

    } )

  })

  function setName(value: string): void {
    component.form.get('name')?.setValue(value)
    fixture.detectChanges()
  }

  function setEmail(value: string): void {
    component.form.get('email')?.setValue(value)
    fixture.detectChanges()
  }

  function setPassword(value: string): void {
    component.form.get('password')?.setValue(value)
  }

  function signupButton(): HTMLButtonElement {
    return page.querySelector('[test-id="signup-button"]')
  }

  function signupLoader(): HTMLButtonElement {
    return page.querySelector('[test-id="signup-loader"]')
  }

  function headsToLoginPageButton(): HTMLButtonElement {
    return page.querySelector('[test-id="heads-to-login-page-button"]')
  }
});

class AuthenticationServiceMock {
  _signupResponse = new Subject()

  signup() {
    return this._signupResponse.asObservable()
  }
}

class SnackBarMock {
  _isOpen = false

  open() {
    this._isOpen = true
  }

}

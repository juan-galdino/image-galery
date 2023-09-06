import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, catchError, take } from 'rxjs';
import { FirebaseStorageService } from 'src/app/firebase-storage.service';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})

export class DialogContentComponent {
  subscription!: Subscription
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public userData: { userFileName: string, uid: string }, 
    private firebaseStorageService: FirebaseStorageService 
    ) {}

  delete() {
    const userFilePath = 'users/'+ this.userData.uid +'/uploads/' + this.userData.userFileName
    this.firebaseStorageService.removeFile(userFilePath)
    .pipe(
      take(1),
      catchError(err => {
        throw err
      })
    )
    .subscribe()
  }
}

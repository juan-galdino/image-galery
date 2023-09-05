import { Component, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, catchError } from 'rxjs';
import { FirebaseStorageService } from 'src/app/firebase-storage.service';

@Component({
  selector: 'app-dialog-content',
  templateUrl: './dialog-content.component.html',
  styleUrls: ['./dialog-content.component.css']
})

export class DialogContentComponent implements OnDestroy {
  subscription!: Subscription
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { name: string, uid: string }, 
    private firebaseStorageService: FirebaseStorageService 
    ) {}

  delete() {
    const filePath = 'users/'+ this.data.uid +'/uploads/' + this.data.name
    this.subscription = this.firebaseStorageService.removeFile(filePath)
    .pipe(
      catchError(err => {
        throw err
      })
    )
    .subscribe()
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe()
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { catchError, take } from 'rxjs';
import { FirebaseStorageService } from 'src/app/firebase-storage.service';

@Component({
  selector: 'app-rename-image',
  templateUrl: './rename-image.component.html',
  styleUrls: ['./rename-image.component.css']
})
export class RenameImageComponent implements OnInit {
  @Input() currentName!: string
  @Input() uid!: string
  @Input() imageIndex!: number
  @Output() close = new EventEmitter<void>()
  form!: FormGroup

  constructor(
    private formBuilder: FormBuilder,
    private firebaseStorageService: FirebaseStorageService
    ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      newName: [this.currentName, [Validators.required]]
    })
  }

  onSave(newName: string) {
    if(newName === this.currentName) {
      this.onClose()
    }
    const oldPath = 'users/'+ this.uid +'/uploads/' + this.currentName
    this.firebaseStorageService.updateFileName(oldPath, newName)
      .pipe(
        take(1),
        catchError(err => {
          throw err
        })
      ).subscribe(() => {
        this.firebaseStorageService.images[this.imageIndex].fullName = newName
        this.onClose()
      })
  }

  onClose() {
    this.close.emit()
  }
}

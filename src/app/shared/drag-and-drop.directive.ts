import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  @HostBinding('class.file-over') fileOver!: boolean
  @Output() fileDropped = new EventEmitter<any>()

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragover(event: any) {
    event.preventDefault()
    event.stopPropagation()
    this.fileOver = true
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.fileOver = false;
    let file = event.dataTransfer.files[0]
    if(file) {
      this.fileDropped.emit(file)
    }
  }  

}

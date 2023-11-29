import { Directive, EventEmitter, HostBinding, HostListener, Output } from '@angular/core';

@Directive({
  selector: '[appDragAndDrop]'
})
export class DragAndDropDirective {

  @HostBinding('class.file-over') filesOver!: boolean
  @Output() filesDropped = new EventEmitter<any>()

  // Dragover listener
  @HostListener('dragover', ['$event']) onDragover(event: any) {
    event.preventDefault()
    event.stopPropagation()
    this.filesOver = true
  }

  // Dragleave listener
  @HostListener('dragleave', ['$event']) onDragLeave(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.filesOver = false;
  }

  // Drop listener
  @HostListener('drop', ['$event']) onDrop(event: any) {
    event.preventDefault();
    event.stopPropagation();
    this.filesOver = false;
    const files = event.dataTransfer.files
    if (files) {
      this.filesDropped.emit(files)
    }
  }

}

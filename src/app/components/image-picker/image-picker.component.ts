import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'image-picker',
  templateUrl: './image-picker.component.html',
  styleUrls: ['./image-picker.component.scss'],
})
export class ImagePickerComponent implements OnInit {

  @Input() label: string = '';
  @Input() id: string = '';
  @Input() showPreview: boolean = true;
  @Input() src: string = '';
  @Input() fileName: string = '';
  imagePath: string = '';
  imgSrc: any;

  @Output() selectedImage = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.imagePath = this.imagePath ? this.imagePath : this.fileName ? this.fileName : 'No File chosen';
    this.src = this.src ? this.src : this.imgSrc = this.imgSrc ? this.imgSrc : '/assets/image/image-placeholder.png';
  }

  handleImageChange(event: any) {
    const files = event?.target?.files;
    if (files.length === 1) {
      const file = files[0];
      this.imagePath = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imgSrc = reader.result;
        this.src = this.imgSrc;
        const params = { id: this.id, file }
        this.selectedImage.emit(params);
      }

      reader.readAsDataURL(file);
    }
  }

}

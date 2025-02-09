import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ImageCroppedEvent, LoadedImage, base64ToFile } from 'ngx-image-cropper';
import { Cropper } from '../../models/cropper';

@Component({
  selector: 'app-image-cropper-modal',
  templateUrl: './image-cropper-modal.component.html',
  styleUrls: ['./image-cropper-modal.component.scss']
})
export class ImageCropperModalComponent {
  imageChangedEvent = '';
  croppedImage = '';
  imageFile: Blob;
  invalidMinRequirements = false;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: {
      image: string;
      cropperConfig: Cropper;
    },
    public dialogRef: MatDialogRef<ImageCropperModalComponent>
  ) {}

  onConfirm(): void {
    this.dialogRef.close(this.imageFile);
  }

  fileChangeEvent(event: string): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.imageFile = base64ToFile(event.base64);
    this.croppedImage = event.base64;
  }

  imageLoaded(image: LoadedImage): void {
    const { height, width } = image.original.size;
    this.invalidMinRequirements = height < this.data.cropperConfig.cropperMinHeight || width < this.data.cropperConfig.cropperMinWidth;
  }

  loadImageFailed(): void {}
  cropperReady(): void {}
}

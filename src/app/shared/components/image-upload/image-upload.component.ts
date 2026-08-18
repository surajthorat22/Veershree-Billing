import { Component, input, output } from '@angular/core';
import { fileToResizedDataUrl } from '../../../core/utils/image';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
})
export class ImageUpload {
  readonly label = input.required<string>();
  readonly hint = input('');
  readonly image = input<string | undefined>('');
  readonly imageChange = output<string | undefined>();

  protected error = '';

  protected async onFileChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    input.value = '';
    if (!file) {
      return;
    }
    if (!file.type.startsWith('image/')) {
      this.error = 'Please choose an image file.';
      return;
    }
    try {
      this.error = '';
      const dataUrl = await fileToResizedDataUrl(file);
      this.imageChange.emit(dataUrl);
    } catch {
      this.error = 'Unable to read that image. Try another file.';
    }
  }

  protected remove(): void {
    this.error = '';
    this.imageChange.emit(undefined);
  }
}

import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { cloudUploadOutline, documentAttachOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule, IonIcon],
  templateUrl: './upload-zone.component.html',
  styleUrls: ['./upload-zone.component.scss']
})
export class UploadZoneComponent {
  // Configuration optionnelle
  label = input<string>('Cliquez ou glissez un fichier ici');
  accept = input<string>('.pdf,.doc,.docx,.jpg,.png');

  // Événement émis vers le parent
  fileSelected = output<File | null>();

  // État interne
  selectedFile = signal<File | null>(null);
  isDragOver = signal<boolean>(false);

  constructor() {
    addIcons({ cloudUploadOutline, documentAttachOutline, trashOutline });
  }

  openFileDialog(fileInput: HTMLInputElement) {
    fileInput.click();
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.updateFile(input.files[0]);
    }
  }

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    
    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
      this.updateFile(event.dataTransfer.files[0]);
    }
  }

  removeFile(event: Event) {
    event.stopPropagation(); // Empêche le clic d'ouvrir la boîte de dialogue
    this.updateFile(null);
  }

  private updateFile(file: File | null) {
    this.selectedFile.set(file);
    this.fileSelected.emit(file);
  }

  // Petit utilitaire pour afficher la taille du fichier
  formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  constructor(private http: HttpClient) { }

  uploadImageAndGetUrl(file: File): Promise<string> {
    const uniqueFileName = `${uuidv4()}.${this.getFileExtension(file.name)}`;
    const formData = new FormData();
    formData.append('file', file, uniqueFileName);
  
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/recipe-book-41dd4.appspot.com/o?uploadType=media&name=images/${encodeURIComponent(uniqueFileName)}`;
  
    return firstValueFrom(this.http.post<any>(uploadUrl, formData))
      .then(response => {
        const fileName = encodeURIComponent(response['name']);
        return `https://firebasestorage.googleapis.com/v0/b/recipe-book-41dd4.appspot.com/o/${fileName}?alt=media`;
      });
  }

  getImageAsBlob(imageUrl: string): Promise<Blob> {
    return firstValueFrom(this.http.get(imageUrl, { responseType: 'blob' }));
  }

  getFileExtension(filename: string): string {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  }
}
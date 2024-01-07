import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStorageService {
  constructor(private http: HttpClient) { }

  uploadImageAndGetUrl(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file, file.name);
  
    const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/recipe-book-41dd4.appspot.com/o?uploadType=media&name=images/${encodeURIComponent(file.name)}`;
  
    return this.http.post<any>(uploadUrl, formData)
      .toPromise()
      .then(response => {
        const fileName = encodeURIComponent(response['name']);
        return `https://firebasestorage.googleapis.com/v0/b/recipe-book-41dd4.appspot.com/o/${fileName}?alt=media`;
      });
  }
}

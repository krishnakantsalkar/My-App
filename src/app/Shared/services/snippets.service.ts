import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UiService } from './ui.service';

@Injectable({
  providedIn: 'root',
})
export class SnippetsService {
  constructor(private http: HttpClient, private uiService: UiService) {}

  getSnippets() {
    return this.http.get<any>(`http://localhost:3000/api/snippets/allSnippets`);
  }

  deleteSnippet(id: string) {
    return this.http.delete<any>(
      `http://localhost:3000/api/snippets/deleteSnippet/${id}`
    );
  }
}

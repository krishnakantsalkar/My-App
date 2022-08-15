import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class pollService {
  constructor(private http: HttpClient) {}

  getPolls(obj) {
    return this.http.post<any>(`http://localhost:3000/api/polls/getPolls`, obj);
  }
  getPollById(id) {
    return this.http.get<any>(`http://localhost:3000/api/polls/getPoll/${id}`);
  }
  newPoll(obj) {
    return this.http.post<any>(
      `http://localhost:3000/api/polls/createPoll`,
      obj
    );
  }
  updatePoll(obj, id) {
    return this.http.put<any>(
      `http://localhost:3000/api/polls/updatePoll/${id}`,
      obj
    );
  }
  deletePoll(id) {
    return this.http.post<any>(
      `http://localhost:3000/api/polls/deletePoll/${id}`,
      {}
    );
  }
}

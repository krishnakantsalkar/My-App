import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class pollService {
  constructor(private http: HttpClient) {}

  getPolls(obj) {
    return this.http.post<any>(
      `https://mybackend-1911.herokuapp.com/api/polls/getPolls`,
      obj
    );
  }
  getPollById(id) {
    return this.http.get<any>(
      `https://mybackend-1911.herokuapp.com/api/polls/getPoll/${id}`
    );
  }
  newPoll(obj) {
    return this.http.post<any>(
      `https://mybackend-1911.herokuapp.com/api/polls/createPoll`,
      obj
    );
  }
  updatePoll(obj, id) {
    return this.http.put<any>(
      `https://mybackend-1911.herokuapp.com/api/polls/updatePoll/${id}`,
      obj
    );
  }
  deletePoll(id) {
    return this.http.post<any>(
      `https://mybackend-1911.herokuapp.com/api/polls/deletePoll/${id}`,
      {}
    );
  }
}

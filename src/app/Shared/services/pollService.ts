import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class pollService {
  constructor(private http: HttpClient) {}

  getPolls(obj) {
    return this.http.post<any>(
      `https://my-app-backend-node.vercel.app/api/polls/getPolls`,
      obj
    );
  }
  getPollById(id) {
    return this.http.get<any>(
      `https://my-app-backend-node.vercel.app/api/polls/getPoll/${id}`
    );
  }
  newPoll(obj) {
    return this.http.post<any>(
      `https://my-app-backend-node.vercel.app/api/polls/createPoll`,
      obj
    );
  }
  updatePoll(obj, id) {
    return this.http.put<any>(
      `https://my-app-backend-node.vercel.app/api/polls/updatePoll/${id}`,
      obj
    );
  }
  deletePoll(id) {
    return this.http.post<any>(
      `https://my-app-backend-node.vercel.app/api/polls/deletePoll/${id}`,
      {}
    );
  }
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeneralUpdatesService {
  constructor(private http: HttpClient) {}

  getUpdates(currentPage, sortBy?, dateStart?, dateEnd?) {
    return this.http.get(
      `http://localhost:3000/api/updates/getAllUpdates?currentPage=${currentPage}&sortBy=${sortBy}&dateStart=${dateStart}&dateEnd=${dateEnd}`
    );
  }

  postUpdate(data) {
    return this.http.post(`http://localhost:3000/api/updates/postUpdate`, data);
  }

  editUpdate(data, id) {
    return this.http.post(
      `http://localhost:3000/api/updates/editUpdate/${id}`,
      data
    );
  }

  deleteUpdate(id) {
    return this.http.post(
      `http://localhost:3000/api/updates/deleteUpdate/${id}`,
      {}
    );
  }
}

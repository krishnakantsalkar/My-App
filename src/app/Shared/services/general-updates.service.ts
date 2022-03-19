import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GeneralUpdatesService {
  constructor(private http: HttpClient) {}

  getUpdates(currentPage, sortBy?, dateStart?, dateEnd?) {
    return this.http.get(
      `https://my-app-backend-node.vercel.app/api/updates/getAllUpdates?currentPage=${currentPage}&sortBy=${sortBy}&dateStart=${dateStart}&dateEnd=${dateEnd}`
    );
  }

  postUpdate(data) {
    return this.http.post(
      `https://my-app-backend-node.vercel.app/api/updates/postUpdate`,
      data
    );
  }

  editUpdate(data, id) {
    return this.http.put(
      `https://my-app-backend-node.vercel.app/api/updates/editUpdate/${id}`,
      data
    );
  }

  deleteUpdate(id) {
    return this.http.delete(
      `https://my-app-backend-node.vercel.app/api/updates/deleteUpdate/${id}`
    );
  }
}

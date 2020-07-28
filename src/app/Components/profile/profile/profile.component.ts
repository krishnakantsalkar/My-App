import { Component, OnInit } from '@angular/core';
import { uploadservices } from '../../../Shared/services/uploadservice';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public image;

  constructor(private upload: uploadservices) {}

  ngOnInit(): void {}

  selection(event) {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.image = file;
    }
  }

  Submit() {
    const formData = new FormData();
    formData.append('image', this.image);
    this.upload.uploadImg(formData).subscribe((item) => {
      console.log(item);
      alert('image uploaded');
    });
  }
}

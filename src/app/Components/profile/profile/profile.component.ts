import { Component, OnInit } from '@angular/core';
import { uploadservices } from '../../../Shared/services/uploadservice';
import { ActivatedRoute } from '@angular/router';
import { userloginservices } from '../../../Shared/services/userloginservice';
import * as AOS from 'aos';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  public image;
  public user;
  public brightness: boolean;
  public currentProfImgP;
  public currentProfImg;
  public editDp: boolean;

  constructor(
    private upload: uploadservices,
    private AR: ActivatedRoute,
    private loginService: userloginservices
  ) {}

  ngOnInit(): void {
    this.mode();
    this.AR.params.subscribe((item) => {
      let id = item['id'];
      this.loginService.getUsersById(id).subscribe((items) => {
        this.user = items;
      });
    });

    AOS.init({
      startEvent: 'DOMContentLoaded',
    });
  }

  selection(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.currentProfImgP = event.target.result;
      };
      const file = event.target.files[0];
      this.currentProfImg = file;
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
  //dark-light mode
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }
  pic() {
    this.editDp = !this.editDp;
  }

  SubmitFile() {
    let currentUserID = JSON.parse(localStorage.getItem('id'));
    const formData = new FormData();
    formData.append('userImage', this.currentProfImg);
    this.loginService
      .updateProfPic(formData, currentUserID)
      .subscribe((item) => {
        alert('profile pic updated successfully!');
        location.reload();
      });
  }
}

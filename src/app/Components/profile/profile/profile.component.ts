import { Component, OnInit } from '@angular/core';
import { uploadservices } from 'src/app/Shared/services/uploadservice';
import { ActivatedRoute, Router } from '@angular/router';
import { userloginservices } from 'src/app/Shared/services/userloginservice';
import * as AOS from 'aos';
import { CookieService } from 'ngx-cookie-service';
import { Title } from '@angular/platform-browser';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';

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

  public pageTitle = 'Profile';
  constructor(
    private upload: uploadservices,
    private AR: ActivatedRoute,
    private loginService: userloginservices,
    private router: Router,
    private cookies: CookieService,
    private titleService: Title,
    private defaultModeService: modeService
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.AR.params.subscribe((item) => {
      let id = item['id'];
      this.loginService.getUsersById(id).subscribe((items) => {
        this.user = items;
      });
    });

    //set page title
    this.titleService.setTitle(this.pageTitle);

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
      alert('image uploaded');
    });
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

  logout() {
    // localStorage.removeItem('userToken');
    this.cookies.delete('userToken');
    localStorage.removeItem('id');
    this.router.navigateByUrl('/home');
  }
}

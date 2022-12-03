import { Component, Inject, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, Meta, SafeUrl, Title } from '@angular/platform-browser';
import {
  UntypedFormGroup,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { userIp } from '../../../Shared/model/userViewModel';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { link } from 'fs';
import { UiService } from 'src/app/Shared/services/ui.service';
import { MatLegacyDialog as MatDialog, MatLegacyDialogRef as MatDialogRef } from '@angular/material/legacy-dialog';
import { DOCUMENT, Location } from '@angular/common';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomShareSheetComponent } from '../../shared-module/bottom-share-sheet/bottom-share-sheet.component';
import { ConfirmationDialogComponent } from '../../shared-module/confirmation-dialog/confirmation-dialog.component';
import { environment } from 'src/environments/environment';
import * as $ from 'jquery';
import { MyUploadAdapter } from 'src/app/Shared/services/ckeditor-upload-adapter';
import * as Editor from 'ckeditor5-custom-build/build/ckeditor';

@Component({
  selector: 'app-blogposts',
  templateUrl: './blogposts.component.html',
  styleUrls: ['./blogposts.component.css'],
})
export class BlogpostsComponent implements OnInit {
  public Editor = Editor;

  public brightness: boolean;
  public data;
  public url; // dom sanitizer url
  public url2; // dom sanitizer url
  public url3; // dom sanitizer url
  public url4; // dom sanitizer url
  public edit: boolean;
  public checkUser; //check user logged in
  public switchtoedit: boolean; //switch edit > blog panel

  public newEdit: UntypedFormGroup; // update by Id method

  public post;
  public adminName;
  public blogURL;
  public userIpObj;
  public postId;
  public postStuff;
  public postCollection = [];
  public nextPostData;
  public prevPostData;
  public markdown;
  public previewMarkdown;
  public pageId = '/blog/:postNumber/:postTitle/:id';

  public likeSet: number = 0;

  public pageTitle = 'Blogpost';

  config = {
    'emoji-toolbar': true,
    'emoji-textarea': true,
    'emoji-shortname': true,
  };
  postLinks = [];
  currentBlogImgP: string | ArrayBuffer;
  currentBlogImg: any;
  storeBlogImg: any;
  toolbarElement: any;
  editorElement: any;

  constructor(
    private blogservice: blogpostservice,
    private AR: ActivatedRoute,
    private sanitizer: DomSanitizer, // to sanitize urls , method below
    private fb: UntypedFormBuilder,
    private router: Router,
    private cookies: CookieService,
    private titleService: Title,
    private defaultModeService: modeService,
    private uiService: UiService,
    private meta: Meta,
    private dialog: MatDialog,
    private location: Location,
    private matBottomSheet: MatBottomSheet,
    private locationService: Location,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit(): void {
    // method calls

    this.postId = `${environment.baseUrl}${this.router.url}`.split('/');

    this.blogservice
      .trackPostViews(this.postId[6], {})
      .subscribe((response) => {});

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;

      if (this.editorElement) {
        if (this.brightness) {
          this.editorElement.style.backgroundColor = 'rgb(245, 245, 245)';
        } else {
          this.editorElement.style.backgroundColor = 'rgb(32,33,33)';
        }
      }
    });

    // check admin presence
    this.checkUserPresent();

    //set page title
    // this.titleService.setTitle(this.pageTitle);

    // AOS animation
    AOS.init({
      startEvent: 'DOMContentLoaded',
    });

    //Activated Routing
    this.AR.params.subscribe((item) => {
      let id = item['id'];
      this.blogservice.getBlogsbyId(id).subscribe((items) => {
        this.data = items;
        this.markdown = this.data.post;
        this.blogURL = environment.baseUrl + this.router.url;

        let urlReplace = this.blogURL
          .replace(/%20/g, '-')
          .split('/')
          .slice(3)
          .join()
          .replace(/,/g, '/');

        //
        //
        this.location.replaceState(urlReplace);

        this.data.postLinks.forEach((link) => {
          this.postLinks.push({ link });
        });
        // this.postLinks = this.data.postLinks;
        this.newEdit.patchValue({
          postTitle: this.data.postTitle,
          post: this.data.post,
        });
        if (localStorage.getItem('user')) {
          this.adminName = `${JSON.parse(localStorage.getItem('user')).name} ${
            JSON.parse(localStorage.getItem('user')).surname
          }`;
        }
        this.meta.updateTag({
          property: 'description',
          content: `${this.data.postTitle}`,
        });

        this.meta.updateTag({ property: 'og:type', content: 'blog' });
        this.meta.updateTag({ property: 'og:title', content: 'Blog' });
        this.meta.updateTag({ property: 'og:url', content: this.blogURL });
        this.meta.updateTag({
          property: 'og:site_name',
          content: 'https://krishnakantsalkar.in',
        });
        this.meta.updateTag({
          property: 'og:image',
          content: `${this.data.postImage}`,
        });
        this.meta.updateTag({ property: 'og:width', content: '1200' });

        this.meta.updateTag({ property: 'og:height', content: '630' });

        this.titleService.setTitle(this.data.postTitle);
        // like/dislike method call
        this.defaultLikes();

        //set page Id
        this.pageId = `/blog/${this.data.postNumber}/${this.data.postTitle}/${this.data.id}`;

        //make url links null on activated route
        this.url = null;
        this.url2 = null;
        this.url3 = null;
        this.url4 = null;
        // save reference urls
        // if (this.data.postLink.length > 3) {
        //   this.url = this.data.postLink;
        //   this.url2 = this.data.postLink2;
        //   this.url3 = this.data.postLink3;
        //   this.url4 = this.data.postLink4;
        // }
        // next and prev post impl
        this.nextPostData = undefined;
        this.prevPostData = undefined;
        this.getAllBlogsId();
      });
    });

    this.AR.queryParams.subscribe((item) => {
      if (item && item.edit && this.checkUser) {
        this.switchtoedit = true;
      }
    });

    // reactive form method
    this.newEdit = this.fb.group({
      postTitle: [''],
      post: [''],
      postAuthor: [''],
    });
  }

  //sanitize url method
  getLink(urlParam): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(urlParam);
  }

  //enable edit mode
  editmode() {
    this.edit = !this.edit;
  }

  //check if user logged in
  checkUserPresent() {
    // this.checkUser = localStorage.getItem('userToken');
    this.checkUser = this.cookies.get('userToken');
    if (!this.checkUser) {
    }
  }

  //method to display either edit mode or blog post panel
  switchToEdit() {
    this.switchtoedit = !this.switchtoedit;
  }

  //edit post by id [4], here id = [5] because the array elements are higher in the deployed page
  async editPostById(data) {
    let getBlogId = `${environment.baseUrl}${this.router.url}`.split('/');
    let id = getBlogId[6];
    let postData = { ...data };

    if (this.currentBlogImgP) {
      postData.postImageNew = await this.uploadImg();
    }

    postData.postLinks = this.postLinks.map((x) => x.link);
    postData.postAuthor = this.adminName;

    this.blogservice.updateBlog(postData, id).subscribe(
      (item) => {
        alert(item.message);
        location.reload();
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  async uploadImg() {
    const formData = new FormData();

    // form data element for blog image since files can't be sent via json
    formData.append('postImage', this.currentBlogImg);
    return await new Promise((resolve, reject) => {
      this.blogservice.uploadImg(formData).subscribe((item) => {
        resolve(item.result.postImage);
      });
    });
  }

  //delete post by id
  deletePostById() {
    let dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      minWidth: '30vw',
      data: {
        msg: 'Would you like to delete this post?',
      },
      backdropClass: 'bgBlur',
    });

    dialogRef.afterClosed().subscribe((item) => {
      if (item && item.confirm == true) {
        let getBlogId = `${environment.baseUrl}${this.router.url}`.split('/');
        let id = getBlogId[6];
        this.blogservice.deleteBlog(id).subscribe(
          (item) => {
            this.uiService.showSnackbar(`${item.message}`, null, 3500);
            this.router.navigateByUrl('/blog/1');
          },
          (err) => {
            this.uiService.showSnackbar(`${err.message}`, null, 3500);
          }
        );
      } else {
        return;
      }
    });
  }

  // method to navigate between posts

  // get all blogs
  getAllBlogsId() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.postStuff = item;
      if (this.postStuff && this.postStuff.length > 0) {
        var n = this.postStuff.length;
        for (let i of this.postStuff) {
          this.postCollection.push({ [n--]: i._id });
        }
      }
      this.getNextandPrev();
    });
  }

  // next and prev post method
  getNextandPrev() {
    // get current post details
    let currentPostId = `${environment.baseUrl}${this.router.url}`.split('/');
    let currentPostNumber = parseInt(currentPostId[4]);

    // wait for all blog posts in collection
    if (this.postCollection) {
      for (let obj of this.postCollection) {
        // get key of the object
        let keys = Object.keys(obj);

        // match current postNumber with objkey from collection
        if (currentPostNumber == parseInt(keys[0])) {
          let nextPost = currentPostNumber + 1;
          let prevPost = currentPostNumber - 1;

          // now compare newPostId with existing obj keys
          for (let newPostData of this.postCollection) {
            let newKeys = Object.keys(newPostData);
            if (nextPost == parseInt(newKeys[0]))
              //pass nextPost id to api call
              this.blogservice
                .getBlogsbyId(newPostData[nextPost])
                .subscribe((item) => {
                  this.nextPostData = item;
                });
          }

          // compare prevPostId with existing obj keys
          for (let prevPostData of this.postCollection) {
            let oldKeys = Object.keys(prevPostData);
            if (prevPost == parseInt(oldKeys[0]))
              // pass prevPost id to api call
              this.blogservice
                .getBlogsbyId(prevPostData[prevPost])
                .subscribe((item) => {
                  this.prevPostData = item;
                });
          }
        }
      }
    }
  }

  // like/dislike custom method
  like() {
    this.likeSet = null;
    this.likeSet = 1;
    let likedPostNumber = this.blogURL.split('/');
    localStorage.setItem(likedPostNumber[4], 'liked');
  }
  dislike() {
    this.likeSet = null;
    this.likeSet = 2;
    let disliekdPostNumber = this.blogURL.split('/');
    localStorage.setItem(disliekdPostNumber[4], 'disliked');
  }

  defaultLikes() {
    let blogUrlData = this.blogURL;
    if (blogUrlData) {
      let temp = blogUrlData.split('/');
      let checkLikesData = localStorage.getItem(`${temp[4]}`);
      if (!checkLikesData) {
        this.likeSet = 0;
      }
      if (checkLikesData == 'liked') {
        this.likeSet = null;
        this.likeSet = 1;
      }
      if (checkLikesData == 'disliked') {
        this.likeSet = null;
        this.likeSet = 2;
      }
    }
  }

  // preview post content in markdown
  getPostPreview() {
    this.previewMarkdown = $('#postContentMd').val();
  }

  // copy sharing link
  copyShareLink() {
    let val = environment.baseUrl + this.router.url;
    // const selBox = document.createElement('textarea');
    // selBox.style.position = 'fixed';
    // selBox.style.left = '0';
    // selBox.style.top = '0';
    // selBox.style.opacity = '0';
    // selBox.value = val;
    // document.body.appendChild(selBox);
    // selBox.focus();
    // selBox.select();
    // document.execCommand('copy');
    // document.body.removeChild(selBox);
    // this.snackbar.open("Link copied to clipboard !", "x", {
    //   duration: 2000,
    // });
    navigator.clipboard?.writeText && navigator.clipboard.writeText(val);

    this.uiService.showSnackbar('link copied to clipboard', null, 3500);
  }

  navigate(number, title, id) {
    this.data = undefined;
    this.router.navigate([`/blog/${number}/${title}/${id}`]);
  }

  // upload img live preview
  selection(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event) => {
        // called once readAsDataURL is completed
        this.currentBlogImgP = event.target.result; // current blog img Preview
      };
      const file = event.target.files[0];
      this.currentBlogImg = file; // main blog image file
    }
  }

  openShareSheet() {
    this.matBottomSheet.open(BottomShareSheetComponent, {
      data: {
        blogURL: this.blogURL,
        calledFrom: 'blogposts',
      },
      backdropClass: 'bgBlur',
    });
  }

  back() {
    this.locationService.back();
  }

  onCkReady(event) {
    console.log(event);
    this.toolbarElement = event.ui.view.toolbar.element;
    this.editorElement = event.ui.view.editable.element;
    this.editorElement.style.border = 'none';
    if (this.switchtoedit) {
      this.toolbarElement.style.display = 'flex';
    } else {
      this.toolbarElement.style.display = 'none';
    }

    if (this.brightness) {
      this.editorElement.style.backgroundColor = 'rgb(245, 245, 245)';
    } else {
      this.editorElement.style.backgroundColor = 'rgb(32,33,33)';
    }
    event.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      // Configure the URL to the upload script in your back-end here!
      return new MyUploadAdapter(loader);
    };
  }
}

// @Component({
//   selector: 'app-confirm-delete-dialog',
//   templateUrl: './confirmDeleteDialog.html',
// })
// export class ConfirmDeleteDialogComponent implements OnInit {
//   brightness: boolean;
//   constructor(
//     private dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
//     private defaultModeService: modeService
//   ) {}

//   ngOnInit() {
//     // brightness mode
//     this.defaultModeService.modeSwitch.subscribe((item) => {
//       this.brightness = item;
//     });
//   }

//   confirmTrue() {
//     this.dialogRef.close({
//       delete: true,
//     });
//   }
// }

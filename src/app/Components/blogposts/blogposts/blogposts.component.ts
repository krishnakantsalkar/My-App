import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { blogpostservice } from 'src/app/Shared/services/blogservice';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { clientIpService } from '../../../Shared/services/clientip-service';
import { userIp } from '../../../Shared/model/userViewModel';

@Component({
  selector: 'app-blogposts',
  templateUrl: './blogposts.component.html',
  styleUrls: ['./blogposts.component.css'],
})
export class BlogpostsComponent implements OnInit {
  public brightness: boolean;
  public data;
  public url; // dom sanitizer url
  public url2; // dom sanitizer url
  public url3; // dom sanitizer url
  public url4; // dom sanitizer url
  public edit: boolean;
  public checkUser; //check user logged in
  public switchtoedit: boolean; //switch edit > blog panel

  public newEdit: FormGroup; // update by Id method

  post;
  public adminName;
  public blogURL;
  public userIpObj;
  public postId;
  public postStuff;
  public postCollection = [];
  public nextPostData;
  public prevPostData;
  public markdown;
  public pageId = '/Blog/:postNumber/:postTitle/:id';

  public likeSet:number = 0
  constructor(
    private blogservice: blogpostservice,
    private AR: ActivatedRoute,
    private sanitizer: DomSanitizer, // to sanitize urls , method below
    private fb: FormBuilder,
    private router: Router,
    private cookies: CookieService,
    private clientIpObj: clientIpService
  ) {}

  ngOnInit(): void {
    // method calls
    this.mode(); // dark-light mode toggle

    this.checkUserPresent();

    this.showAdmin();

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
        this.blogURL = window.location.href;

        // like/dislike method call
        this.defaultLikes()

        //make url links null on activated route
        this.url = null;
        this.url2 = null;
        this.url3 = null;
        this.url4 = null;
        // save reference urls
        if (this.data.postLink.length > 3) {
          this.url = this.data.postLink;
          this.url2 = this.data.postLink2;
          this.url3 = this.data.postLink3;
          this.url4 = this.data.postLink4;
        }
        // next and prev post impl
        this.nextPostData = undefined;
        this.prevPostData = undefined;
        this.getAllBlogsId();

        // get client IP to track views
        this.clientIpObj.getClientIp().subscribe((ipObj: userIp) => {
          let ip = ipObj.ip;
          this.postId = window.location.href.split('/');
          this.blogservice
            .trackPostViews(this.postId[6], ip)
            .subscribe((response) => {});
        });
      });
    });

    // reactive form method
    this.newEdit = this.fb.group({
      postTitle: [''],
      post: [''],
      postLink: [''],
      edited: ['true'], // send a default edited = true on every API call (since its edited)!
    });

    // disable brightness toggle
    $(document).ready(() => {
      $('.modeLD a').css('pointer-events', 'none');
      $('.modeLD a').css('opacity', 0.4);
    });
  }

  //sanitize url method
  getLink(urlParam): SafeUrl {
    return this.sanitizer.bypassSecurityTrustUrl(urlParam);
  }

  //dark-light mode
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  //enable edit mode
  editmode() {
    this.edit = !this.edit;
  }

  //check if user logged in
  checkUserPresent() {
    // this.checkUser = localStorage.getItem('credentials');
    this.checkUser = this.cookies.get('credentials');
    if (!this.checkUser) {
    }
  }

  //method to display either edit mode or blog post panel
  switchToEdit() {
    this.switchtoedit = !this.switchtoedit;
  }

  //edit post by id [4], here id = [5] because the array elements are higher in the deployed page
  editPostById(data) {
    let getBlogId = window.location.href.split('/');
    let id = getBlogId[6];
    this.blogservice.updateBlog(data, id).subscribe(
      (item) => {
        alert(item.message);
        location.reload();
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  //delete post by id
  deletePostById() {
    let getBlogId = window.location.href.split('/');
    let id = getBlogId[6];
    this.blogservice.deleteBlog(id).subscribe(
      (item) => {
        alert(item.message);
        this.router.navigateByUrl('/Blog/1');
      },
      (err) => {
        alert(err.message);
      }
    );
  }

  // show admin method
  showAdmin() {
    let currentUser = JSON.parse(localStorage.getItem('user'));
    if (!currentUser) {
      return;
    }
    this.adminName = currentUser.name;
  }

  // scroll to top method
  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // method to navigate between posts

  // get all blogs
  getAllBlogsId() {
    this.blogservice.getBlogs().subscribe((item) => {
      this.postStuff = item;
      // console.log(this.postStuff);
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
    let currentPostId = window.location.href.split('/');
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
like(){
  this.likeSet= null
  this.likeSet=1
  let likedPostNumber = this.blogURL.split('/')
  localStorage.setItem(likedPostNumber[4],'liked')
}
dislike(){
  this.likeSet= null
  this.likeSet=2
  let disliekdPostNumber = this.blogURL.split('/')
  localStorage.setItem(disliekdPostNumber[4],'disliked')
}

defaultLikes(){
  let blogUrlData = this.blogURL
  if(blogUrlData){

   let temp = blogUrlData.split('/')
   let checkLikesData = localStorage.getItem(`${temp[4]}`)
   if(!checkLikesData){
     this.likeSet=0
   }
    if(checkLikesData == 'liked'){
      this.likeSet = null
      this.likeSet = 1
    }
    if(checkLikesData == 'disliked'){
      this.likeSet = null
      this.likeSet = 2
    }
  }
}
}

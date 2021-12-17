import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { SwiperOptions } from 'swiper';
import { Title, Meta } from '@angular/platform-browser';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import Swiper, {
  Autoplay,
  Pagination,
  Mousewheel,
  Navigation,
  Scrollbar,
  EffectCoverflow,
} from 'swiper';

import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  providers: [MessageService],
})
export class AboutComponent implements OnInit {
  public copiedMail;
  public copiedNumber;
  public brightness: boolean;
  public copyObjId;

  public pageTitle = 'About';

  // setup ngx-swiper
  config: SwiperOptions = {
    // pagination
    pagination: { el: '.swiper-pagination', clickable: true },
    // navigation
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    // effect
    effect: 'coverflow',
    grabCursor: true,
    centeredSlides: true,
    loop: true,
    slidesPerView: 4,
    // direction
    direction: 'horizontal',
    // autoplay
    autoplay: {
      delay: 1600,
      disableOnInteraction: true,
    },
    speed: 200,

    // effect options
    coverflowEffect: {
      rotate: 0,
      stretch: 100,
      depth: 200,
      modifier: 1,
      slideShadows: true,
    },
    // scrollbar
    scrollbar: {
      el: '.swiper-scrollbar',
      draggable: true,
    },
    // breakpoints for media-query~
    breakpoints: {
      320: {
        slidesPerView: 2,
        spaceBetween: 1,
      },
      // when window width is >= 480px
      480: {
        slidesPerView: 2,
        spaceBetween: 1,
      },
      // when window width is >= 640px
      640: {
        slidesPerView: 4,
        spaceBetween: 1,
      },
    },
  };

  // image slides
  public slides = [
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097257/about-swiper/Screenshot_20200925-205454_Brave_njcqby.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097253/about-swiper/Screenshot_20200925-205537_Brave_nxwogw.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097253/about-swiper/Screenshot_20200925-205540_Brave_pksoff.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097253/about-swiper/Screenshot_20200925-205904_Brave_wqv1un.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097253/about-swiper/Screenshot_20200925-205946_Brave_jfwjrt.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097254/about-swiper/Screenshot_20200925-205744_Brave_oltsye.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097255/about-swiper/Screenshot_20200925-205753_Brave_tnh6rq.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097257/about-swiper/Screenshot_20200925-205758_Brave_q12rsa.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097254/about-swiper/Screenshot_20200925-205812_Brave_zmxg0t.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097256/about-swiper/Screenshot_20200925-205608_Brave_muscta.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097255/about-swiper/Screenshot_20200925-205729_Brave_qiw8le.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097254/about-swiper/Screenshot_20200925-205709_Brave_qsru4v.png',
    'https://res.cloudinary.com/dq766ltjh/image/upload/v1601097255/about-swiper/Screenshot_20200925-205955_Brave_faafzu.png',
  ];

  constructor(
    private titleService: Title,
    private defaultModeService: modeService,
    private messagingService: MessageService,
    private meta: Meta
  ) {}

  ngOnInit() {
    // page title
    this.titleService.setTitle(this.pageTitle);

    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ property: 'og:title', content: 'About' });
    this.meta.updateTag({
      property: 'og:url',
      content: 'https://krishnakantsalkar.in/about',
    });
    this.meta.updateTag({
      property: 'og:site_name',
      content: 'https://krishnakantsalkar.in',
    });
    this.meta.updateTag({
      property: 'og:image',
      content: 'assets/images/about_me.jpg',
    });
    this.meta.updateTag({ property: 'og:width', content: '1200' });

    this.meta.updateTag({ property: 'og:height', content: '630' });

    // aos animations
    AOS.init({
      startEvent: 'DomContentLoaded',
    });
    // swiper force use following features
    Swiper.use([
      Autoplay,
      Pagination,
      Navigation,
      Mousewheel,
      Scrollbar,
      EffectCoverflow,
    ]);

    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    // text loop
    textSequence(0);
    async function textSequence(i) {
      var textLoop = [
        '.....Loading',
        '"Built using Angular & NodeJS.."',
        `"Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.
         - Martin Golding"`,
        '"Computers make very fast, very accurate mistakes."',
        '"Only half of programming is coding. The other 90% is debugging."',
        '"There is no place like 127.0.0.1"',
        '“Experience is the name everyone gives to their mistakes.” – Oscar Wilde',
        '“Java is to JavaScript what car is to Carpet.” – Chris Heilmann',
        '"The best method for accelerating a computer is the one that boosts it by 9.8 m/s2."',
        '"There are two ways to write error-free programs; only the third one works" - Alan J. Perlis',
        '"It’s not a bug – it’s an undocumented feature!"',
      ];

      if (document.getElementById('loopQuotes')) {
        if (textLoop.length > i) {
          setTimeout(function () {
            if (document.getElementById('loopQuotes')) {
              document.getElementById('loopQuotes').innerHTML = textLoop[i];
              document.getElementById('loopQuotes').style.fontFamily =
                "'Lucida Console', 'LucidaConsole', 'monospace'";
              textSequence(++i);
            }
          }, 3000); // enter seconds (in milliseconds)
        } else if (textLoop.length == i) {
          // Loop
          textSequence(0);
        }
      }
    }
  }

  // scroll to page section
  scrollTo(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }

  // copy to clipboard
  copyShareLink(param, type) {
    let val = param;
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
    // this.snackbar.open("Link copied to clipboard !", "x", {
    //   duration: 2000,
    // });
    if (type == 'number') {
      this.messagingService.add({
        key: 'clipboard',
        severity: 'success',
        summary: 'number copied to clipboard',
      });
    } else if (type == 'mail') {
      this.messagingService.add({
        key: 'clipboard',
        severity: 'success',
        summary: 'mail id copied to clipboard',
      });
    }
  }
}

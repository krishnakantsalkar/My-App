import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';
import { SwiperOptions } from 'swiper';
import Swiper, {
  Autoplay,
  Pagination,
  Mousewheel,
  Navigation,
  Scrollbar,
  EffectCoverflow,
} from 'swiper';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  public copiedMail;
  public copiedNumber;
  public brightness: boolean;
  public copyObjId;

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
      delay: 1000,
      disableOnInteraction: true,
    },
    speed: 1000,

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

  constructor() {}

  ngOnInit() {
    // aos animations
    AOS.init({
      startEvent: 'scroll',
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
    this.mode();

    //Get the button
    var mybutton = document.getElementById('myBtn');
    let mediaQ = window.matchMedia('(max-width: 600px)');

    // When the user scrolls down 20px from the top of the document, show the button
    window.onscroll = function () {
      scrollFunction();
      scrollFunctionMedia(mediaQ);
    };

    // various methods on scroll
    function scrollFunction() {
      if (
        document.body.scrollTop > 50 ||
        document.documentElement.scrollTop > 50
      ) {
        mybutton.style.bottom = '20px';
        document.getElementById('top-panel').style.height = '75px';
        document.getElementById('top-panel').style.transitionDuration = '0.3s';
        document.getElementById('top-panel').style.transitionTimingFunction =
          'ease-in';
        document.getElementById('top-panel-nametag').style.paddingTop = '20px';
        document.getElementById('links').style.marginTop = '5px';
      } else {
        mybutton.style.bottom = '-50px';
        document.getElementById('top-panel').style.height = '90px';
        document.getElementById('top-panel-nametag').style.paddingTop = '25px';
        document.getElementById('links').style.marginTop = '10px';
      }
    }

    function scrollFunctionMedia(mediaQuery) {
      if (
        (mediaQuery.matches && document.body.scrollTop > 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop > 50)
      ) {
        document.getElementById('top-panel').style.height = '85px';
        document.getElementById('top-panel-nametag').style.paddingTop = '15px';
        document.getElementById('links').style.marginTop = '-15px';
      } else if (
        (mediaQuery.matches && document.body.scrollTop < 50) ||
        (mediaQuery.matches && document.documentElement.scrollTop < 50)
      ) {
        document.getElementById('top-panel').style.height = '110px';
        document.getElementById('top-panel-nametag').style.paddingTop = '25px';
        document.getElementById('links').style.marginTop = '-5px';
      }
    }

    // text loop
    textSequence(0);
    async function textSequence(i) {
      var textLoop = [
        '"Built using Angular 9 & NodeJS.."',
        `"Always code as if the guy who ends up maintaining your code will be a violent psychopath who knows where you live.
         - Martin Golding"`,
        '"Computers make very fast, very accurate mistakes."',
        '"Only half of programming is coding. The other 90% is debugging."',
        '"There is no place like 127.0.0.1"',
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
  // brightness mode
  mode() {
    this.brightness = JSON.parse(localStorage.getItem('mode'));
  }

  // scroll to page section
  scrollTo(id) {
    document.getElementById(id).scrollIntoView({ behavior: 'smooth' });
  }

  // copy to clipboard
  copyToClip(param) {
    var data = document.createElement('input');
    if (param == 'mail') {
      this.copyObjId = 'copyMail';
    } else if (param == 'number') {
      this.copyObjId = 'copyNumber';
    }

    data.setAttribute(
      'value',
      document.getElementById(this.copyObjId).innerHTML
    );
    var elemnt = document.getElementById(this.copyObjId).innerHTML;
    document.body.appendChild(data);
    data.select();
    document.execCommand('copy');
    if (param == 'mail') {
      this.copiedMail = elemnt;
      setTimeout(() => {
        document.getElementById('copyAlert1').classList.add('hidden');
      }, 3000);
    } else {
      this.copiedNumber = elemnt;
      setTimeout(() => {
        document.getElementById('copyAlert2').classList.add('hidden');
      }, 3000);
    }
  }

  // scroll to topg
  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

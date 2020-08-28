import { Component, OnInit } from '@angular/core';
import * as AOS from 'aos';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent implements OnInit {
  public copied;
  public brightness: boolean;
  constructor() {}

  ngOnInit() {
    // aos animations
    AOS.init({
      startEvent: 'scroll',
    });

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
        mybutton.style.display = 'block';
        document.getElementById('top-panel').style.height = '75px';
        document.getElementById('top-panel').style.transitionDuration = '0.3s';
        document.getElementById('top-panel').style.transitionTimingFunction =
          'ease-in';
        document.getElementById('top-panel-nametag').style.paddingTop = '20px';
        document.getElementById('links').style.marginTop = '5px';
      } else {
        mybutton.style.display = 'none';
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
        '"Indulge in the fast Experience.. Build the Future!"',
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
  copyToClip() {
    var data = document.createElement('input');
    data.setAttribute('value', document.getElementById('copyText').innerHTML);
    var elemnt = document.getElementById('copyText').innerHTML;
    document.body.appendChild(data);
    data.select();
    document.execCommand('copy');
    this.copied = elemnt;
    setTimeout(() => {
      document.getElementById('copyAlert').classList.add('hidden');
    }, 3000);
  }

  // scroll to topg
  topFunction() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

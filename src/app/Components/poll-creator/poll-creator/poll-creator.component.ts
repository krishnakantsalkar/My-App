import { Component, OnInit } from '@angular/core';
import { modeService } from 'src/app/Shared/services/light-dark-Modeservice';
import { pollService } from 'src/app/Shared/services/pollService';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-poll-creator',
  templateUrl: './poll-creator.component.html',
  styleUrls: ['./poll-creator.component.css'],
  providers: [MessageService],
})
export class PollCreatorComponent implements OnInit {
  public brightness: boolean;

  public newPollSwitch: boolean = false;
  public pollList = [];
  public pollOptions = [];
  public pollName: string;
  public pollDescription: string;
  constructor(
    private defaultModeService: modeService,
    private pollservice: pollService,
    private messagingService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.addOption();
  }

  public addOption() {
    this.pollOptions.push({
      option: '',
    });
  }
  public deleteOption(i) {
    this.pollOptions.splice(i, 1);
  }

  public newPoll() {
    this.newPollSwitch = !this.newPollSwitch;
  }

  private getPolls() {
    let pollIds = localStorage.getItem('pollIds');
    let profileId = localStorage.getItem('profileId');
    let token = localStorage.getItem('token');

    if (profileId && token) {
      var obj: any = {
        profileId,
        pollIds,
      };
    } else {
      var obj: any = {
        pollIds,
      };
    }
    this.pollservice.getPolls(obj).subscribe(
      (item) => {
        this.pollList = item.result;
      },
      (err) => {}
    );
  }

  public savePoll() {
    let pollObj: any = {};
    pollObj.pollId = `POLL${Date.now().toString(8)}`;
    pollObj.pollName = this.pollName;
    pollObj.pollDescription = this.pollDescription;
    pollObj.pollDate = new Date();
    pollObj.pollStatus = 'inactive';
    pollObj.pollTotal = 0;

    let optArr = [];
    for (let opt of this.pollOptions) {
      optArr.push({ [opt.option]: 0 });
    }
    pollObj.pollOptions = optArr;

    this.pollservice.newPoll(pollObj).subscribe((item) => {
      this.messagingService.add({
        key: 'clipboard',
        severity: 'success',
        summary: `${item.message}`,
      });

      this.router.navigate(['/view/' + pollObj.pollId]);
    });
  }
}

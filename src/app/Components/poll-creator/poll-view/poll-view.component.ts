import { Component, OnInit } from '@angular/core';
import { pollService } from '../../../Shared/services/pollService';
import { modeService } from '../../../Shared/services/light-dark-Modeservice';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-poll-view',
  templateUrl: './poll-view.component.html',
  styleUrls: ['./poll-view.component.css'],
})
export class PollViewComponent implements OnInit {
  public brightness: boolean;
  public pollObj;

  public Object: ObjectConstructor;
  constructor(
    private defaultModeService: modeService,
    private pollservice: pollService,
    private AR: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // brightness mode
    this.defaultModeService.modeSwitch.subscribe((item) => {
      this.brightness = item;
    });

    this.AR.params.subscribe((item) => {
      let pollId = item.id;

      this.pollservice.getPollById(pollId).subscribe((item) => {
        this.pollObj = item.result;
      });
    });
  }
}

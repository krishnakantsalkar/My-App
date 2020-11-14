import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({providedIn: 'root'})

export class modeService {

    public brightness: boolean
    public mode : BehaviorSubject<boolean>
    public modeSwitch: Observable<boolean>

    constructor(){

        this.mode = new BehaviorSubject<boolean>(false)

        this.modeSwitch = this.mode.asObservable()
    }

    switchMode(){
        this.brightness = !this.brightness
        this.mode.next(this.brightness)
    }
}
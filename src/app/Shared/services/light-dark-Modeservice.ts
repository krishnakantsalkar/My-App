import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';



@Injectable({providedIn: 'root'})

export class modeService {

    public brightness: boolean
    public mode : BehaviorSubject<boolean>
    public modeSwitch: Observable<boolean>

    constructor(){

        // save default website theme as dark mode
        if(!localStorage.getItem('mode')){

            localStorage.setItem('mode', 'false')

        }

        // init behavior subject default value

        this.mode = new BehaviorSubject<boolean>(JSON.parse(localStorage.getItem('mode'))) || new BehaviorSubject<boolean>(false)
        
        // get value of brightness from storage, since the value is null on reload
        this.brightness = JSON.parse(localStorage.getItem('mode'))

        // create observable
        this.modeSwitch = this.mode.asObservable()


    }

    // switch mode method, save value to localStorage for user preference
    switchMode(){

        this.brightness = !this.brightness
        localStorage.setItem('mode', `${this.brightness}`)
        this.mode.next(this.brightness)
    }
}
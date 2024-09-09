import { NgClass, NgFor, NgIf } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { BUTTONS } from "src/app/core/constants/buttons.constant";
import { PARAGRAPHS } from "src/app/core/constants/paragraphs.constant";
import { TITLES } from "src/app/core/constants/title.constant";

@Component({
    selector: 'app-signup',
    standalone: true,
    imports: [NgFor, NgClass, NgIf],
    templateUrl: './signup.component.html',
    styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {

    @Output() onSwitch = new EventEmitter<boolean>();
    public buttons = BUTTONS;
    public titles = TITLES;
    public paragraphs = PARAGRAPHS;
    constructor(){}

    ngOnInit(): void {
        
    }

    navigateTo(){
        this.onSwitch.emit(true);
    }
}
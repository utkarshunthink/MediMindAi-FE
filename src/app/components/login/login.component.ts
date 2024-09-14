import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { BUTTONS } from "src/app/core/constants/buttons.constant";
import { PARAGRAPHS } from "src/app/core/constants/paragraphs.constant";
import { TITLES } from "src/app/core/constants/title.constant";
import { ApiService } from "src/app/core/services";

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [ CommonModule ],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    @Output() onSwitch = new EventEmitter<boolean>();
    public buttons = BUTTONS;
    public titles = TITLES;
    public paragraphs = PARAGRAPHS;

    constructor(private router: Router, private apiService: ApiService){}

    ngOnInit(): void {
        
    }

    navigateTo(): void{
        this.onSwitch.emit(false);
    }

    login(): void{
        this.router.navigate(['home/dashboard']);
    }

    signInWithGoogle() {
        this.apiService.signInWithGoogle();
    }
}
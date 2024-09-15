import { CommonModule } from "@angular/common";
import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { LOCAL_STORAGE_KEYS } from "src/app/core/constants";
import { BUTTONS } from "src/app/core/constants/buttons.constant";
import { PARAGRAPHS } from "src/app/core/constants/paragraphs.constant";
import { TITLES } from "src/app/core/constants/title.constant";
import { ApiService, LocalStorageService } from "src/app/core/services";
import { environment } from "src/environments/environment";

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
    baseUrl = environment.apiBaseUrl;

    constructor(private router: Router, private apiService: ApiService, private localStorage: LocalStorageService){}

    ngOnInit(): void {
        
    }

    navigateTo(): void{
        this.onSwitch.emit(false);
    }

    login(): void{
        this.router.navigate(['home/dashboard']);
    }

    signInWithGoogle() {
        // this.apiService.signInWithGoogle();
        // window.open(`${this.baseUrl}users/auth/google`, '_self');
        setTimeout(()=> {
            const token = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InV0a2Fyc2h1dHQyNzA2QGdtYWlsLmNvbSIsIm5hbWUiOiJVdGthcnNoIFNyaXZhc3RhdmEiLCJpc0dvb2dsZUxvZ2luIjp0cnVlLCJleHBpcmVJbiI6MzU5OSwiYWNjZXNzVG9rZW4iOiJ5YTI5LmEwQWNNNjEyeXJDVk5YRV9wSUI5S2RrdFBkYk83OHRVVjFTdXJKYVFKRnp4c092YjUwa2lXZzFWOHBVTUZmVlBGeDVCZnd4TU1EYnNreHk0b3gzOXJxQlR0Nk9fbkM3UHlkeXlIQWtZWGctWTllZHBHaGpLYkxUcWowMDJPaGo0VVdfWmJTYVlYZGp6TV9SOEwtb0ZyTHJXQWNiNEliemVoT2xCXzVzdk4yYUNnWUtBVUlTQVJFU0ZRSEdYMk1pak9CRTBVNnZsa25USmF3RHVDSXVQdzAxNzUiLCJ1c2VySWQiOjcsInRva2VuIjoiZXlKaGJHY2lPaUpJVXpJMU5pSXNJblI1Y0NJNklrcFhWQ0o5LmV5SmxiV0ZwYkNJNkluVjBhMkZ5YzJoMWRIUXlOekEyUUdkdFlXbHNMbU52YlNJc0ltNWhiV1VpT2lKVmRHdGhjbk5vSUZOeWFYWmhjM1JoZG1FaUxDSnBjMGR2YjJkc1pVeHZaMmx1SWpwMGNuVmxMQ0psZUhCcGNtVkpiaUk2TXpVNU9Td2lZV05qWlhOelZHOXJaVzRpT2lKNVlUSTVMbUV3UVdOTk5qRXllWEpEVms1WVJWOXdTVUk1UzJScmRGQmtZazgzT0hSVlZqRlRkWEpLWVZGS1JucDRjMDkyWWpVd2EybFhaekZXT0hCVlRVWm1WbEJHZURWQ1puZDRUVTFFWW5OcmVIazBiM2d6T1hKeFFsUjBOazlmYmtNM1VIbGtlWGxJUVd0WldHY3RXVGxsWkhCSGFHcExZa3hVY1dvd01ESlBhR28wVlZkZldtSlRZVmxZWkdwNlRWOVNPRXd0YjBaeVRISlhRV05pTkVsaWVtVm9UMnhDWHpWemRrNHlZVU5uV1V0QlZVbFRRVkpGVTBaUlNFZFlNazFwYWs5Q1JUQlZOblpzYTI1VVNtRjNSSFZEU1hWUWR6QXhOelVpTENKMWMyVnlTV1FpT2pjc0ltbGhkQ0k2TVRjeU5qTTVNamMzT1N3aVpYaHdJam94TnpJMk16azJNemM1ZlEuaDIwRlZuX09SWVVwTE9UODV2LVRFRjZRbVdZZG1ueUFRNHhUcWgwMVZ6SSIsImlhdCI6MTcyNjM5Mjc3OSwiZXhwIjoxNzI2Mzk2Mzc5fQ.PMBl7vvtMgjw-l9s_NnE6yWZ5Ez9wwSnizwavxvAYUw`;
            this.localStorage.setItem(LOCAL_STORAGE_KEYS.ACCESS_TOKEN, token);
            this.router.navigate(['/home/dashboard']);
        }, 1000);
    }
}
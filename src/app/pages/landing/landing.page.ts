import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { LoginComponent } from 'src/app/components/login/login.component';
import { SignupComponent } from 'src/app/components/signup/signup.component';
import { BUTTONS } from 'src/app/core/constants/buttons.constant';
import { IMAGES } from 'src/app/core/constants/images.constant';
import { PARAGRAPHS } from 'src/app/core/constants/paragraphs.constant';
import { TITLES } from 'src/app/core/constants/title.constant';
import { GetMedicine } from 'src/app/core/dtos/medicines.dto';
import { ApiService } from 'src/app/core/services';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [ NgFor, NgIf, LoginComponent, SignupComponent, FormsModule ],
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage {
  public titles = TITLES;
  public paragraphs = PARAGRAPHS;
  public buttons = BUTTONS;
  public images = IMAGES;

  public isLogin: boolean = true;
  public searchMedicine: string = '';
  private searchSubject = new Subject<string>();
  public pageNo = 1;
  public pageSize = 10;
  public medicines: any = [];

  constructor(private apiService: ApiService){
    this.searchSubject.pipe(debounceTime(2000)).subscribe((query) => {
      this.apiService.searchMedicines(this.searchMedicine, this.pageSize, this.pageNo).then((res)=>{
        console.log('',res);
        const getMedicines = res as GetMedicine;
        this.medicines = getMedicines.data.medicines;
      }).catch(err=> console.log(err));
    });
  }

  scrollToSection(section:any): void{
    const ele = document.getElementById(section) as HTMLElement;
    ele.scrollIntoView({ behavior: "smooth" });
  }

  onLoginChange(event: any): void{
    this.isLogin = event;
  }

  onSearch(){
    this.searchSubject.next('');
  }
}

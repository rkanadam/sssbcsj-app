import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {UtilsService} from '../../common-ui/utils.service';
import {AuthService} from '../../auth/auth.service';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';

interface SignupItem {
  item: string;
  itemIndex: number;
  quantity: string;
  itemCount: number;
  notes: string;
}

interface SignupSheet {
  date: string;
  location: string;
  tags: string[];
  title: string;
  description: string;
  signups: Array<SignupItem>;
  spreadsheetId: string;
  sheetTitle: string;
  sheetId: number;
}

interface Signup {
  spreadSheetId: string;
  sheetTitle: string;
  itemIndex: number;
  itemCount: number;
}


@Component({
  selector: 'app-signups-home',
  templateUrl: './signups-home.component.html',
  styleUrls: ['./signups-home.component.scss']
})
export class SignupsHomeComponent implements OnInit, OnDestroy {
  signupSheets = new Array<SignupSheet>();
  mobileQuery: MediaQueryList;

  private selectedTag = '';
  private params$$: Subscription | undefined;
  selectedSignupSheetFormControl = new FormControl();
  selectedSignupSheet: SignupSheet | null = null;
  selectedSignupItemFormControl = new FormControl();
  selectedSignupItem: SignupItem | null = null;
  selectedSignupItemQuantityFormControl = new FormControl(0, [
    this.minCountValidator.bind(this),
    this.maxCountValidator.bind(this),
    this.integerValidator.bind(this)
  ]);

  selectedSignupSheetForm = new FormGroup({
    selectedSignupSheet: this.selectedSignupSheetFormControl,
    selectedSignupItem: this.selectedSignupItemFormControl,
    selectedSignupItemQuantity: this.selectedSignupItemQuantityFormControl
  });


  constructor(private changeDetectorRef: ChangeDetectorRef, media: MediaMatcher,
              private httpClient: HttpClient,
              private route: ActivatedRoute,
              private utils: UtilsService,
              private authService: AuthService) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  mobileQueryListener(): void {
    this.changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    if (this.params$$) {
      this.params$$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.params$$ = this.route.queryParams.subscribe((p: Params) => {
      this.setSelectedTag(p.tag);
    });
    this.selectedSignupSheetFormControl.valueChanges.subscribe((selectedSignupSheet: SignupSheet) => {
      this.selectedSignupSheet = selectedSignupSheet;
    });
    this.selectedSignupItemFormControl.valueChanges.subscribe((selectedSignupItem: SignupItem) => {
      this.selectedSignupItem = selectedSignupItem;
    });
  }

  maxCountValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (this && this.selectedSignupItem && this.selectedSignupItem.itemCount < control.value) {
      return {
        max: true
      };
    }
    return null;
  }

  integerValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (this && this.selectedSignupItem && !Number.isInteger(control.value)) {
      return {
        integer: true
      };
    }
    return null;
  }

  minCountValidator(control: AbstractControl): { [key: string]: boolean } | null {
    if (this && this.selectedSignupItem && control.value <= 0) {
      return {
        min: true
      };
    }
    return null;
  }

  signup(): void {
    if (this.selectedSignupItem && this.selectedSignupSheet) {
      const s: Signup = {
        itemCount: parseInt(this.selectedSignupItemQuantityFormControl.value, 10),
        itemIndex: this.selectedSignupItem.itemIndex,
        sheetTitle: this.selectedSignupSheet.sheetTitle,
        spreadSheetId: this.selectedSignupSheet.spreadsheetId
      };

      this.httpClient.post<boolean>(`${this.utils.getBaseApiUrl()}/signups`, s, {
        headers: this.authService.getHeaders()
      }).subscribe(result => {
        console.log(result);
      });
    }
  }


  setSelectedTag(tag: string): void {
    this.selectedTag = tag;
    this.httpClient.get<SignupSheet[]>(`${this.utils.getBaseApiUrl()}/signups`, {
      headers: this.authService.getHeaders(),
      params: {
        tag: this.selectedTag || ''
      }
    }).subscribe(signupSheets => {
      this.signupSheets = signupSheets;
    });
  }

  getSignupLocation(selectedSignupSheet: SignupSheet): string {
    return `https://www.google.com/maps/search/${encodeURIComponent(selectedSignupSheet.location)}`;
  }
}

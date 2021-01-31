import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Params} from '@angular/router';
import {Subscription} from 'rxjs';
import {UtilsService} from '../../common-ui/utils.service';
import {AuthService} from '../../auth/auth.service';

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
  description: string;
  signups: Array<SignupItem>;
  spreadsheetId: string;
  sheetId: number;
}

@Component({
  selector: 'app-signups-home',
  templateUrl: './signups-home.component.html',
  styleUrls: ['./signups-home.component.scss']
})
export class SignupsHomeComponent implements OnInit, OnDestroy {
  signupSheets = new Array<SignupSheet>();
  mobileQuery: MediaQueryList;

  private selectedTag = 'service';
  private params$$: Subscription | undefined;

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
      this.setSelectedTag(p.tag || 'service');
    });
  }

  setSelectedTag(tag: string): void {
    this.selectedTag = tag;
    this.httpClient.get<SignupSheet[]>(`${this.utils.getBaseApiUrl()}/signups`, {
      headers: this.authService.getHeaders(),
      params: {
        tag: this.selectedTag
      }
    }).subscribe(signupSheets => {
      this.signupSheets = signupSheets;
    });
  }
}

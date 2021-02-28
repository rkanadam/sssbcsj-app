import {Component, OnDestroy, OnInit} from '@angular/core';
import * as dateFormat from 'dateformat';
import {Subject, Subscription} from 'rxjs';
import {ApiService} from '../../common-ui/api.service';
import {ActivatedRoute} from '@angular/router';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatDialog} from '@angular/material/dialog';
import {debounceTime, filter, map} from 'rxjs/operators';
import {isEmpty} from 'lodash-es';
import {FormControl, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {BhajanSignup, BhajanSignupSheet, ParsedSheet, SignupForBhajanRequest} from '../types';


@Component({
  selector: 'app-devotion',
  templateUrl: './devotion.component.html',
  styleUrls: ['./devotion.component.scss']
})
export class DevotionComponent implements OnInit, OnDestroy {

  private fetchSignupsSubject = new Subject<boolean>();
  private fetchSignups$$: Subscription | null = null;
  private params$$: Subscription | null = null;
  selectedSignupSheet: BhajanSignupSheet | null = null;
  private selectedSignupItemFormControl = new FormControl();
  private selectedSignupItem: BhajanSignup | null = null;
  private selectedSignupSheetFormControl = new FormControl();
  signupSheets: Array<ParsedSheet> = [];
  selectedSignupSheetForm = new FormGroup({
    selectedSignupSheet: this.selectedSignupSheetFormControl,
    selectedSignupItem: this.selectedSignupItemFormControl,
    optional: new FormGroup({
      scale: new FormControl(),
      notes: new FormControl(),
      bhajanOrTFD: new FormControl()
    })
  });
  signeesDataSource = new MatTableDataSource<BhajanSignup>();


  constructor(public api: ApiService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {
  }

  ngOnDestroy(): void {
    if (this.params$$) {
      this.params$$.unsubscribe();
    }
    if (this.fetchSignups$$) {
      this.fetchSignups$$.unsubscribe();
    }
  }

  ngOnInit(): void {
    let selectedSpeadsheetId = '';
    this.params$$ = this.route.queryParams
      .pipe(
        map(params => (params.q || '').toString())
      ).subscribe((q) => {
        selectedSpeadsheetId = q;
        this.fetchSignups();
      });
    this.fetchSignups$$ = this.fetchSignupsSubject.asObservable().pipe(
      debounceTime(500),
      filter(v => v)
    ).subscribe(() => {
      this.api.get<Array<ParsedSheet>>('devotion/signups:summarised', {}).subscribe(signupSheets => {
        this.signupSheets = signupSheets;
        this.selectedSignupSheet = null;
        this.selectedSignupItem = null;
        if (!isEmpty(selectedSpeadsheetId)) {
          const ss = signupSheets.find(s => s.spreadsheetId.localeCompare(selectedSpeadsheetId) === 0);
          if (ss) {
            this.selectedSignupSheetFormControl.setValue(ss);
          }
        }
      });
    });
    this.selectedSignupSheetFormControl.valueChanges.subscribe((selected: ParsedSheet) => {
      this.selectedSignupSheet = null;
      this.selectedSignupItem = null;
      // tslint:disable-next-line:max-line-length
      this.api.get<BhajanSignupSheet>(`devotion/signups:detailed/${encodeURIComponent(selected.spreadsheetId)}/${encodeURIComponent(selected.sheetTitle)}`,
        {}).subscribe((signupSheet) => {
        this.selectedSignupSheet = signupSheet;
        this.signeesDataSource.data = signupSheet.signees || [];
      });
    });
    this.selectedSignupItemFormControl.valueChanges.subscribe((selectedSignupItem: BhajanSignup) => {
      this.selectedSignupItem = selectedSignupItem;
    });
    this.fetchSignups();
  }

  fetchSignups(): void {
    this.fetchSignupsSubject.next(true);
  }

  formatDate(date: Date): string {
    return dateFormat(date, 'DDDD, mmm/dd/yyyy');
  }


  signup(): void {
    if (this.selectedSignupItem && this.selectedSignupSheet) {
      const req: SignupForBhajanRequest = {
        ...this.selectedSignupSheetForm.get('optional')?.value,
        row: this.selectedSignupItem.row,
        sheetTitle: this.selectedSignupSheet.sheetTitle,
        spreadSheetId: this.selectedSignupSheet.spreadsheetId,
      };
      this.api.post<boolean>(`devotion/signups`, req).subscribe(result => {
        if (result) {
          this.fetchSignups();
          this.snackBar.open(`You successfully signed up.`, 'OK', {
            duration: 2000
          });
        } else {
          this.snackBar.open(`Something went wrong, please try again in sometime.`, 'OK', {
            duration: 2000
          });
        }
      });
    }
  }
}

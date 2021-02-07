import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Subscription} from 'rxjs';
import {AbstractControl, FormControl, FormGroup} from '@angular/forms';
import {ApiService} from '../../common-ui/api.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import * as dateFormat from 'dateformat';
import {MatTableDataSource} from '@angular/material/table';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog} from '@angular/material/dialog';
import {SmsReminderComponent} from '../sms-reminder/sms-reminder.component';
import {ParsedSheet, Signee, Signup, SignupItem, SignupSheet} from '../types';
import {EmailReminderComponent} from '../email-reminder/email-reminder.component';


@Component({
  selector: 'app-signups-home',
  templateUrl: './signups-home.component.html',
  styleUrls: ['./signups-home.component.scss']
})
export class SignupsHomeComponent implements OnInit, OnDestroy {
  signupSheets = new Array<ParsedSheet>();
  mobileQuery: MediaQueryList;
  displayedColumns: string[] = ['select', 'position', 'item', 'itemCount', 'name', 'phoneNumber', 'email', 'signedUpOn'];


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

  signeesDataSource = new MatTableDataSource<Signee>();

  initialSelection = [];
  selectedSignees = new SelectionModel<Signee>(true, this.initialSelection);

  constructor(private changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              private api: ApiService,
              private snackBar: MatSnackBar,
              private dialog: MatDialog
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 600px)');
    this.mobileQuery.addEventListener('change', this.mobileQueryListener);
  }

  mobileQueryListener(): void {
    if (this.changeDetectorRef) {
      this.changeDetectorRef.detectChanges();
    }
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this.mobileQueryListener);
    if (this.params$$) {
      this.params$$.unsubscribe();
    }
  }

  ngOnInit(): void {
    this.fetchSignups();
    this.selectedSignupSheetFormControl.valueChanges.subscribe((selected: ParsedSheet) => {
      this.selectedSignupSheet = null;
      this.selectedSignupItem = null;
      this.api.get<SignupSheet>('signupSheet',
        {
          spreadSheetId: selected.spreadsheetId,
          sheetTitle: selected.sheetTitle
        }).subscribe((signupSheet) => {
        this.selectedSignupSheet = signupSheet;
        this.signeesDataSource.data = signupSheet.signees || [];
      });
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
      const signup: Signup = {
        itemCount: parseInt(this.selectedSignupItemQuantityFormControl.value, 10),
        itemIndex: this.selectedSignupItem.itemIndex,
        sheetTitle: this.selectedSignupSheet.sheetTitle,
        spreadSheetId: this.selectedSignupSheet.spreadsheetId
      };

      this.api.post<boolean>(`signups`, signup).subscribe(result => {
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


  fetchSignups(): void {
    this.api.get<Array<ParsedSheet>>('signups', {}).subscribe(signupSheets => {
      this.signupSheets = signupSheets;
      this.selectedSignupSheet = null;
      this.selectedSignupItem = null;
    });
  }

  getSignupLocation(selectedSignupSheet: SignupSheet): string {
    return `https://www.google.com/maps/search/${encodeURIComponent(selectedSignupSheet.location)}`;
  }

  formatDate(date: Date): string {
    return dateFormat(date, 'DDDD, mmm/dd/yyyy');
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selectedSignees.selected.length;
    const numRows = this.signeesDataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected() ?
      this.selectedSignees.clear() :
      this.signeesDataSource.data.forEach(row => this.selectedSignees.select(row));
  }

  openSmsReminderDialog(): void {
    this.dialog.open(SmsReminderComponent, {
      data: {
        signees: this.selectedSignees.selected,
        signupSheet: this.selectedSignupSheet
      }
    });
  }

  openEmailReminderDialog(): void {
    this.dialog.open(EmailReminderComponent, {
      data: {
        signees: this.selectedSignees.selected,
        signupSheet: this.selectedSignupSheet
      }
    });
  }

}

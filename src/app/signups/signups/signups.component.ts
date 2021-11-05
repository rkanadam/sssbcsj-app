import {ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MediaMatcher} from '@angular/cdk/layout';
import {Subject, Subscription} from 'rxjs';
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
import * as FileSaver from 'file-saver';
import {ActivatedRoute} from '@angular/router';
import {debounceTime, filter, map} from 'rxjs/operators';
import {isEmpty} from 'lodash-es';
import {MatSelect} from '@angular/material/select';
import {UtilsService} from '../../common-ui/utils.service';

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/i;

@Component({
  selector: 'app-signups-home',
  templateUrl: './signups.component.html',
  styleUrls: ['./signups.component.scss']
})
export class SignupsComponent implements OnInit, OnDestroy {
  signupSheets = new Array<ParsedSheet>();
  mobileQuery: MediaQueryList;
  displayedColumns: string[] = ['select', 'position', 'item', 'itemCount', 'name', 'phoneNumber', 'email', 'signedUpOn'];


  private params$$: Subscription | undefined;
  selectedSignupSheetFormControl = new FormControl(null);
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

  signupItemsDataSource = new MatTableDataSource<SignupItem>();
  selectedSignupItems = new SelectionModel<SignupItem>(true, []);


  private fetchSignupsSubject = new Subject<boolean>();
  private fetchSignups$$: Subscription | null = null;

  @ViewChild('selectedSignupSheetSelect') selectedSignupSheetSelect: MatSelect | null = null;
  @ViewChild('selectedSignupItemSelect') selectedSignupItemSelect: MatSelect | null = null;


  constructor(private changeDetectorRef: ChangeDetectorRef,
              media: MediaMatcher,
              public api: ApiService,
              private route: ActivatedRoute,
              private snackBar: MatSnackBar,
              private dialog: MatDialog,
              private utils: UtilsService
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
    if (this.fetchSignups$$) {
      this.fetchSignups$$.unsubscribe();
    }
  }

  ngOnInit(): void {
    let selectedSpreadsheetId = '';
    this.params$$ = this.route.queryParams
      .pipe(
        map(params => (params.q || '').toString())
      ).subscribe((q) => {
        selectedSpreadsheetId = q;
        this.fetchSignups();
      });
    this.fetchSignups$$ = this.fetchSignupsSubject.asObservable().pipe(
      debounceTime(500),
      filter(v => v)
    ).subscribe(() => {
      this.api.get<Array<ParsedSheet>>('service/signups:summarised', {}).subscribe(signupSheets => {
        this.signupSheets = signupSheets;
        this.selectedSignupSheet = null;
        this.selectedSignupItem = null;
        if (!isEmpty(selectedSpreadsheetId)) {
          const ss = signupSheets.find(s => s.spreadsheetId.localeCompare(selectedSpreadsheetId) === 0);
          if (ss) {
            this.selectedSignupSheetFormControl.setValue(ss);
          }
        } else {
          setTimeout(() => {
            if (this.selectedSignupSheetSelect) {
              this.selectedSignupSheetSelect.open();
            }
          }, 1);
        }
      });
    });
    this.selectedSignupSheetFormControl.valueChanges.subscribe((selected: ParsedSheet) => {
      this.selectedSignupSheet = null;
      this.selectedSignupItem = null;
      // tslint:disable-next-line:max-line-length
      this.api.get<SignupSheet>(`service/signups:detailed/${encodeURIComponent(selected.spreadsheetId)}/${encodeURIComponent(selected.sheetTitle)}`,
        {}).subscribe((signupSheet) => {
        this.selectedSignupSheet = signupSheet;
        this.signeesDataSource.data = signupSheet.signees || [];
        if (this.isTabularDisplayPossible()) {
          this.signupItemsDataSource.data = signupSheet.signupItems;
        } else {
          this.signupItemsDataSource.data = [];
        }
        this.selectedSignupItems.clear();
      });
    });
    this.selectedSignupItemFormControl.valueChanges.subscribe((selectedSignupItem: SignupItem) => {
      this.selectedSignupItem = selectedSignupItem;
      this.selectedSignupItemQuantityFormControl.setValue(1);
    });
    this.fetchSignups();
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

  signupOneItem(): void {
    if (this.selectedSignupItem && this.selectedSignupSheet) {
      const signup = {
        itemCount: parseInt(this.selectedSignupItemQuantityFormControl.value, 10),
        itemIndex: this.selectedSignupItem.itemIndex,
      };
      this.signup([signup]);
    }
  }

  signupMultipleItems(): void {
    if (this.selectedSignupSheet && !this.selectedSignupItems.isEmpty()) {
      const items = this.selectedSignupItems.selected.map(s => ({
          itemCount: s.itemCount,
          itemIndex: s.itemIndex
        })
      );
      this.signup(items);
    }
  }


  private signup(items: Array<{
    itemIndex: number;
    itemCount: number;
  }>): void {
    if (this.selectedSignupSheet) {
      const signup: Signup = {
        spreadSheetId: this.selectedSignupSheet.spreadsheetId,
        sheetTitle: this.selectedSignupSheet.sheetTitle,
        items
      };
      this.api.post<boolean>(`service/signups`, signup).subscribe(result => {
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
    this.fetchSignupsSubject.next(true);
  }

  getSignupLocation(selectedSignupSheet: SignupSheet): string {
    return `https://www.google.com/maps/search/${encodeURIComponent(selectedSignupSheet.location)}`;
  }

  formatDate(date: Date | number): string {
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

  export(): void {
    this.api.getBlob('service/export', {}).subscribe((blob: Blob) => {
        const date = dateFormat(new Date(), 'mmddyyyy_HHMMss');
        FileSaver.saveAs(blob, `export_signups_${date}.csv`);
      },
      error => {
        console.log('Error downloading the file.', error);
        this.snackBar.open(`Could not download export.`, 'OK', {
          duration: 2000
        });
      },
    );
  }

  isTabularDisplayPossible(): boolean {
    if (this.selectedSignupSheet && !isEmpty(this.selectedSignupSheet.signupItems)) {
      const hasAtleastOneItemWhichNeedsMoreThanOne = this.selectedSignupSheet.signupItems.find(s => s.itemCount > 1);
      return isEmpty(hasAtleastOneItemWhichNeedsMoreThanOne);
    }
    return false;
  }

  parseDescription(description: string): string {
    return this.utils.parseMultiLineString(description);
  }
}

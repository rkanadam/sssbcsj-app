import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../common-ui/api.service';
import {BhajanSignup, BhajanSignupSheet, MySignups, Signee, SignupSheet} from '../types';
import * as dateFormat from 'dateformat';
import {ArrayDataSource, DataSource} from '@angular/cdk/collections';
import {UtilsService} from '../../common-ui/utils.service';

@Component({
  selector: 'app-my-signups',
  templateUrl: './my-signups.component.html',
  styleUrls: ['./my-signups.component.scss']
})
export class MySignupsComponent implements OnInit {
  mySignups: MySignups | null = null;

  displayedColumns: string[] = ['position', 'item', 'itemCount', 'name', 'email', 'phoneNumber', 'signedUpOn'];

  displayedBhajanSignupColumns: string[] = ['position', 'signupType', 'bhajanOrTFD', 'name', 'email', 'phoneNumber', 'signedUpOn'];

  constructor(private api: ApiService, private utils: UtilsService) {
  }

  ngOnInit(): void {
    this.api.get<MySignups>('signups:my', {}).subscribe(mySignups => {
      this.mySignups = mySignups;
    });
  }

  getSignupLocation(selectedSignupSheet: SignupSheet | BhajanSignupSheet): string {
    return `https://www.google.com/maps/search/${encodeURIComponent(selectedSignupSheet.location)}`;
  }

  formatDate(date: Date): string {
    return dateFormat(date, 'DDDD, mmm/dd/yyyy');
  }

  getDataSource(signees: Array<Signee> | undefined): DataSource<Signee> {
    return new ArrayDataSource(signees || []);
  }

  getBhajanSignupDataSource(signees: Array<BhajanSignup> | undefined): DataSource<BhajanSignup> {
    return new ArrayDataSource(signees || []);
  }

  parseDescription(description: string): string {
    return this.utils.parseMultiLineString(description);
  }


}

import {Component, OnInit} from '@angular/core';
import {ApiService} from '../../common-ui/api.service';
import {Signee, SignupSheet} from '../types';
import * as dateFormat from 'dateformat';
import {ArrayDataSource, DataSource} from '@angular/cdk/collections';

@Component({
  selector: 'app-my-signups',
  templateUrl: './my-signups.component.html',
  styleUrls: ['./my-signups.component.scss']
})
export class MySignupsComponent implements OnInit {
  mySignupSheets: Array<SignupSheet> = [];

  displayedColumns: string[] = ['position', 'item', 'itemCount', 'signedUpOn'];

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.api.get<Array<SignupSheet>>('signups:my', {}).subscribe(mySignupSheets => {
      this.mySignupSheets = mySignupSheets;
    });
  }

  getSignupLocation(selectedSignupSheet: SignupSheet): string {
    return `https://www.google.com/maps/search/${encodeURIComponent(selectedSignupSheet.location)}`;
  }

  formatDate(date: Date): string {
    return dateFormat(date, 'DDDD, mmm/dd/yyyy');
  }

  getDataSource(signees: Array<Signee> | undefined): DataSource<Signee> {
    return new ArrayDataSource(signees || []);
  }
}

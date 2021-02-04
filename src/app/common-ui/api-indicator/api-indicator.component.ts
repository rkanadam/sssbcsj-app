import {Component, OnInit} from '@angular/core';
import {ApiRequestState, ApiService} from '../api.service';

@Component({
  selector: 'app-api-indicator',
  templateUrl: './api-indicator.component.html',
  styleUrls: ['./api-indicator.component.scss']
})
export class ApiIndicatorComponent implements OnInit {

  isProcessingApiRequest = false;

  constructor(private api: ApiService) {
  }

  ngOnInit(): void {
    this.api.apiRequest$.subscribe(
      (state: ApiRequestState) => {
        this.isProcessingApiRequest = state === ApiRequestState.IN_PROGRESS;
      }
    );
  }
}

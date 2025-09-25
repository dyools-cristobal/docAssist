import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loading',
  imports: [MatProgressSpinnerModule, NgIf],
  templateUrl: './loading.html',
  styleUrl: './loading.scss'
})
export class Loading {
@Input() show = false;
}

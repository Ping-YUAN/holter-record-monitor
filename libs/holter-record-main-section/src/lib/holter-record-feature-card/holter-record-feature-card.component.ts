/* eslint-disable @angular-eslint/component-selector */
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'holter-record-feature-card',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './holter-record-feature-card.component.html',
  styleUrl: './holter-record-feature-card.component.scss',
})
export class HolterRecordFeatureCardComponent {
  @Input() featureName = '';
  @Input() featureNumber: string | undefined = '';
  @Input({
    required: false,
  })
  featureTime? = '';
}

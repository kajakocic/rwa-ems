import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'pm-about',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
})
export class AboutComponent {}

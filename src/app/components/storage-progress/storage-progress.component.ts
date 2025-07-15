import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-storage-progress',
  templateUrl: './storage-progress.component.html',
  styleUrls: ['./storage-progress.component.scss'],
  standalone: true,
})
export class StorageProgressComponent implements OnChanges {
  @Input() itemCount = 0;
  percent = 0;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['itemCount']) {
      this.percent = Math.min(this.itemCount * 2, 100);
    }
  }
}

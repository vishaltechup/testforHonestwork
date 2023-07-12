import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
  downloadLink() {
    const link = document.createElement('a');
    link.setAttribute('target', '');
    link.setAttribute('href', 'https://honestwork.daalvinservice.com/assets/download/HonestWindowsSetup.zip');
    link.setAttribute('download', `HonestWindowsSetup.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

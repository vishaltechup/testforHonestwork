import { Component } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'honest-angular';
  showLayout: boolean;

  constructor(private router:Router) {
    
    const firebaseconfig = {
      apiKey: "AIzaSyB5o0cpHlhKEWSnGK8-kLxB1oUU0U90yEA",
      authDomain: "angularchat-f45ad.firebaseapp.com",
      databaseURL: "https://angularchat-f45ad-default-rtdb.firebaseio.com",
      projectId: "angularchat-f45ad",
      storageBucket: "angularchat-f45ad.appspot.com",
      messagingSenderId: "610140466688",
      appId: "1:610140466688:web:ca4eca8cd125bca1b3b2e5",
      measurementId: "G-N3GZ01NVB1"
    };
    firebase.initializeApp(firebaseconfig);

    router.events.forEach((event) => {
      if(event instanceof NavigationStart) {
      }    
    });
  }
}

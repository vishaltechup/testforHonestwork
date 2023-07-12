import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import * as firebase from 'firebase';
import { DatePipe } from '@angular/common';
import * as $ from 'jquery'

export const snapshotToArray = (snapshot: any) => {
  const returnArr = [];

  snapshot.forEach((childSnapshot: any) => {
    const item = childSnapshot.val();
    item.key = childSnapshot.key;
    returnArr.push(item);
  });

  return returnArr;
};

@Component({
  selector: 'app-chat-room',
  templateUrl: './chat-room.component.html',
  styleUrls: ['./chat-room.component.scss']
})
export class ChatRoomComponent implements OnInit {

  @ViewChild('chatcontent') chatcontent: ElementRef;
  scrolltop: number = null;

  chatForm: FormGroup;
  nickname = '';
  roomname = '';
  message = '';
  users = [];
  chats = [];
  ChannelId: any;
  Chatshow: boolean = false;
  userName: any;

  constructor(private router: Router, private route: ActivatedRoute, private formBuilder: FormBuilder, public datepipe: DatePipe) {

    this.nickname = localStorage.getItem('nickname');
    this.roomname = localStorage.getItem('roomname');

    this.ChannelId = "Channel1";

    firebase.database().ref('chats/' + this.ChannelId).on('value', resp => {
      this.chats = [];
      this.chats = snapshotToArray(resp).filter(x => x.roomname === this.roomname);;
      setTimeout(() => this.scrolltop = this.chatcontent?.nativeElement.scrollHeight, 500);
    });

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp2: any) => {
      const roomusers = snapshotToArray(resp2);
      this.users = roomusers.filter(x => x.status === 'online');
    });
  }

  ngOnInit(): void {
    //this.ChannelId = "127-125";
    this.userName = "Chat";
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }

  onFormSubmit(form: any) {
    const chat = form;
    chat.roomname = this.roomname;
    chat.nickname = this.nickname;
    chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    chat.type = 'message';
    const newMessage = firebase.database().ref('chats/' + this.ChannelId).push();
    newMessage.set(chat);
   
    // firebase.database().ref('chats/' + this.ChannelId).on('value', resp => {
    //   this.chats = [];
    //   this.chats = snapshotToArray(resp).filter(x => x.roomname === this.roomname);;
    //   setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
    // });
    this.chatForm = this.formBuilder.group({
      'message': [null, Validators.required]
    });
  }
  getDate(date) {
    var strDate = date
    var regex = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
    var arrDate = regex.exec(strDate);
    var objDate = new Date(
      (+arrDate[1]),
      (+arrDate[2]) - 1, // Month starts at 0!
      (+arrDate[3]),
      (+arrDate[4]),
      (+arrDate[5]),
      (+arrDate[6])
    );

    /* Convert the date object to string with format of your choice */

    var newDate = objDate.getMonth() + 1 + '/' + objDate.getDate() + '/' + objDate.getFullYear();

    /* Get the time in your format */

    var newTime = objDate.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

    /* Concatenate new date and new time */

    //
    const date1 = newTime;
    return date1;
  }

  // OpenChat(nnickname)
  // {
  //   this.ChannelId= nnickname+'-'+this.nickname;
  //   this.userName=nnickname;
  //   firebase.database().ref('chats/'+this.ChannelId).on('value', resp => {
  //     this.chats = [];
  //     this.chats = snapshotToArray(resp).filter(x => x.roomname ===   this.roomname );;
  //     setTimeout(() => this.scrolltop = this.chatcontent.nativeElement.scrollHeight, 500);
  //   });
  //   this.Chatshow=true;
  // }

  // CloseChat()
  // {
  //   this.Chatshow=false;
  //   this.ChannelId= "";
  //   this.userName="Chat";
  // }

  exitChat() {
    // const chat = { roomname: '', nickname: '', message: '', date: '', type: '' };
    // chat.roomname = this.roomname;
    // chat.nickname = this.nickname;
    // chat.date = this.datepipe.transform(new Date(), 'dd/MM/yyyy HH:mm:ss');
    // chat.message = `${this.nickname} leave the room`;
    // chat.type = 'exit';
    // const newMessage = firebase.database().ref('chats/').push();
    // newMessage.set(chat);

    firebase.database().ref('roomusers/').orderByChild('roomname').equalTo(this.roomname).on('value', (resp: any) => {
      let roomuser = [];
      roomuser = snapshotToArray(resp);
      const user = roomuser.find(x => x.nickname === this.nickname);
      if (user !== undefined) {
        const userRef = firebase.database().ref('roomusers/' + user.key);
        userRef.update({ status: 'offline' });
      }
    });

    this.router.navigate(['/dashboard']);
  }

  OpenclosePopup() {
    $('.main-section').toggleClass("open-more");
    this.Chatshow = !this.Chatshow;
  }


}

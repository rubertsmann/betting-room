import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  constructor(private socket: Socket) { }

  // emit event
  loginClientToServer() {
    const login = {
      'username': "test",
      'password': "testPassword"
    }

    this.socket.emit('loginClientToServer', login, (response: any) => {
      // errorHandler(response);

      console.log(response);
      // applicationState.username = response.username;
      // applicationState.points = response.points;
      // applicationState.betPoints = response.currentBet.betPoints;

      // updatePage();
    })
  }
}
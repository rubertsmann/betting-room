import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Message } from '@new-betting-room/api-interfaces';
import { SocketService } from './services/socket-service.service';

@Component({
  selector: 'new-betting-room-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  hello$ = this.http.get<Message>('/api/hello');

  gameState = this.socketService.onGameStateChange();
  userState = this.socketService.onUserStateChange();
  constructor(
    private http: HttpClient,
    private socketService: SocketService,
  ) {
    this.sendLogin1();
   }

  
  public sendLogin1(): void {
    this.socketService.loginClientToServer();
  }
}

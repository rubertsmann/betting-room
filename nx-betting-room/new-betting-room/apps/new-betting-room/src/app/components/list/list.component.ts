import { Component } from '@angular/core';
import { SocketService } from '../../services/socket-service.service';

@Component({
  selector: 'new-betting-room-list',
  template: `
      <p>list works!</p>
      <button onclick="this.sendLogin1()">Connect</button>
  `,
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {

  constructor(
    private socketService: SocketService,
  ) { }

  public sendLogin1(): void {
    this.socketService.loginClientToServer();
  }
}
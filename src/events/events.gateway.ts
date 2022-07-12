import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse
} from '@nestjs/websockets';

import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Server } from 'socket.io';
import { PromptManagerService as PromptManagerService } from 'src/prompt-manager/prompt-manager.service';
import { UsermanagerService } from 'src/usermanager/usermanager.service';
// import { instrument } from 'socket.io/admin-ui';
import { BetPromptRequest, BetPromptResponse, BetRequest, Error, LoginRequest, UserState } from 'src/models/interface.collection';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class EventsGateway {

  constructor(private usermanagerService: UsermanagerService, private promptManagerService: PromptManagerService) {

  }

  @WebSocketServer()
  server: Server;

  @SubscribeMessage('connect')
  onConnect(@MessageBody() data: any) {
    return true;
  }

  @SubscribeMessage('loginClientToServer')
  loginClientToServer(@MessageBody() data: LoginRequest) {

    console.log(data);

    const user = this.usermanagerService.saveOrGetUser(data);


    if (user.password == data.password) {

      this.getAllUserState();

      return user
    } else {
      return <Error>{
        errorName: 'loginClientToServerError',
        message: 'There was an issue when logging in'
      }
    }
  }

  @SubscribeMessage('betClientToServer')
  betClientToServer(@MessageBody() data: BetRequest) {
    try {
      const user = this.promptManagerService.updateOrGetUserBet(data);

      const currentPrompt = this.promptManagerService.getCurrentPromptState();

      this.server.emit('currentPromptStateServerToClient', currentPrompt);

      return this.promptManagerService.getCurrentPromptState();

    } catch (error) {
      return <Error>{
        errorName: 'betClientToServer',
        message: error
      }
    }
  }

  @SubscribeMessage('claimGroupLeaderClientToServer')
  claimGroupLeaderClientToServer(@MessageBody() userName: string) {
    try {
      this.usermanagerService.updateGroupLeader(userName);
      this.getAllUserState();
    } catch (error) {
      return <Error>{
        errorName: 'claimGroupLeaderClientToServer',
        message: error
      }
    }
  }

  @SubscribeMessage('allUsersClientToServer')
  allUsersClientToServer(@MessageBody() data: any) {
    this.getAllUserState();
  }



  @SubscribeMessage('sendBetPromptClientToServer')
  sendBetPromptClientToServer(@MessageBody() data: BetPromptRequest) {

    if (this.promptManagerService.getCurrentPrompt()) {
      return <Error>{
        errorName: 'sendBetPromptClientToServer',
        message: "Prompt is open"
      }
    }


    const generatedPrompt = this.promptManagerService.generatePrompt(data);

    // const response: BetPromptResponse = generatedPrompt;
    this.server.emit('betPromptServerToClient', generatedPrompt)
  }


  getAllUserState() {
    const allUsers = this.usermanagerService.getAllUser();

    const mappedUsers: UserState[] = allUsers.map(user => {
      return {
        username: user.username,
        points: user.points,
        // betPoints: user.currentBet.betPoints,
        groupLeader: user.groupLeader
      }
    });

    this.server.emit('allUsersServerToClient', mappedUsers);

    return mappedUsers
  }

  @SubscribeMessage('identityClientToServer')
  async identity(@MessageBody() data: any): Promise<number> {
    return data;
  }
}

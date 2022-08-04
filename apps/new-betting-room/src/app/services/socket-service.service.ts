import { Injectable } from '@angular/core';
import { BetPromptCurrent, BetPromptResponse, GameState, UserState } from '@new-betting-room/api-interfaces';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs';

export interface ApplicationState {
  currentAnswers: any;
  currentPrompt: string;
  betPrompt: any;
}

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  applicationState: ApplicationState = {
    currentAnswers: undefined,
    currentPrompt: '',
    betPrompt: undefined
  };

  constructor(private socket: Socket) { 
    this.applicationState.betPrompt = socket.on('betPromptServerToClient', (response: BetPromptResponse | null) => {
        errorHandler(response);

        return setCurrentPrompt(response);
        // updatePage();
      })

    socket.on('currentPromptStateServerToClient', (response: BetPromptCurrent) => {
        errorHandler(response);

        // this.this.applicationState.userBets = response.userBets;
        // updatePage();
      })

    // socket.on('groupLeaderServerToClient', function (response: any) {
    //   // this.errorHandler(response);

    //   // updatePage();
    // })


    socket.on('connect', function (data: any) {
      // sendAllUsers();
    });

    socket.on('events', function (data: any) {
      console.log('event', data);
    });

    socket.on('exception', function (data: any) {
      console.log('event', data);
    });

    socket.on('disconnect', function () {
      console.log('Disconnected');
      // document.location.reload(true)
    });

  }

  onGameStateChange() {
    return this.socket.fromEvent<GameState>('gameStateServerToClient');
  }

  onUserStateChange() {
    return this.socket.fromEvent<UserState[]>('allUsersServerToClient').pipe(errorHandler, map( _ => _ as UserState[]))
  }

  setCurrentPrompt(currentPromptFromServer: { prompt: any; answers: any; } | null) {
    // if (currentPromptFromServer == null) {
    //   this.this.applicationState.currentPrompt = ''
    //   this.this.applicationState.currentAnswers = []
    // } else {
    //   this.this.applicationState.currentPrompt = currentPromptFromServer.prompt;
    //   this.this.applicationState.currentAnswers = currentPromptFromServer.answers;
    // }
  }

  // emit event
  loginClientToServer() {
    const login = {
      'username': "test",
      'password': "testPassword"
    }

    this.socket.emit('loginClientToServer', login, (response: any) => {
      // errorHandler(response);

      console.log(response);
      // this.this.applicationState.username = response.username;
      // this.this.applicationState.points = response.points;
      // this.this.applicationState.betPoints = response.currentBet.betPoints;

      // updatePage();
    })
  }

}

function errorHandler(response: any | null) {
  if(response == null ) {
    throw "Error No Message Received"
  }

  if (response.errorName) {
    console.error("ErrorName: " + response.errorname);
    console.error("ErrorMessage: " + response.message);
    throw "Error";
  }

  return response;
}

function setCurrentPrompt(currentPromptFromServer: { prompt: string; answers: any; } | null) {
  const applicationState: ApplicationState = {
    currentAnswers: undefined,
    currentPrompt: '',
    betPrompt: undefined
  };

  if (currentPromptFromServer == null) {
    applicationState.currentPrompt = ''
    applicationState.currentAnswers = []
  } else {
    applicationState.currentPrompt = currentPromptFromServer.prompt;
    applicationState.currentAnswers = currentPromptFromServer.answers;
  }

  return applicationState;
}
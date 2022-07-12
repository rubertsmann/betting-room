import { Injectable } from '@nestjs/common';
import { BetPromptRequest, BetPromptResponse, BetRequest, UserBet } from 'src/models/interface.collection';
import { UsermanagerService } from 'src/usermanager/usermanager.service';

@Injectable()
export class PromptManagerService {
    getCurrentPromptState() {
        return this.promptCurrent;
    }

    constructor(private usermanagerService: UsermanagerService) { }

    updateOrGetUserBet(userBetRequest: BetRequest): UserBet {
        const currentPrompt = this.getCurrentPrompt();
        let userBet = currentPrompt.userBets.find(userBet => userBet.userName === userBetRequest.username);

        if (userBet == undefined || userBet == null) {
            const newUserId = this.newUserBetForCurrentPrompt(userBetRequest)
            userBet = currentPrompt.userBets.find(userBet => userBet.userName === userBetRequest.username);
        }

        const user = this.usermanagerService.findUser(userBet.userName);

        if (userBet.betAmount + userBetRequest.betAmount < 0) {
            throw "Bet cannot be smaller than 0";
        }

        if (userBet.betAmount + userBetRequest.betAmount > user.points) {
            throw "Bet cannot be higher than available points";
        }

        console.log(this.promptCurrent);

        userBet.answerId = userBetRequest.answerId
        userBet.betAmount += userBetRequest.betAmount;

        console.log(this.promptCurrent);

        return userBet;
    }

    newUserBetForCurrentPrompt(userBetRequest: BetRequest): number {
        return this.promptCurrent.userBets.push({
            userName: userBetRequest.username,
            answerId: null,
            betAmount: 0
        })
    }



    // const userBet = this.promptManagerService.saveOrGetUserBet(userName);

    // const user = this.users.find(user => user.username === userName)

    // if (user.currentBet.betPoints + bet < 0) {
    //     throw "Bet cannot be smaller than 0";
    // }

    // if (user.currentBet.betPoints + bet > user.points) {
    //     throw "Bet cannot be higher than available points";
    // }

    // user.currentBet.betPoints += bet;


    // return user;


    private promptHistory: BetPromptResponse[];
    private promptCurrent: BetPromptResponse = null;

    getCurrentPrompt() {
        return this.promptCurrent;
    }

    generatePrompt(data: BetPromptRequest): BetPromptResponse {

        // data.prompt.mapToObjectWithId
        // data.answer.mapToObjectWithId
        // promptHistory.getLatestId

        // @ToDo replace with correctly mapped input prompt

        this.promptCurrent = {
            id: 0,
            prompt: "Is cedric gay",
            answers: [
                {
                    id: 0,
                    text: "This is The First Answer 0"
                },
                {
                    id: 1,
                    text: "This is The Second Answer 1"
                },
            ],
            userBets: []
        };

        return this.promptCurrent;

    }
}

import { Injectable } from '@nestjs/common';
import { BetPromptCurrent, BetPromptHistory, BetPromptHistoryResponse, BetPromptRequest, BetPromptResponse, BetRequest, UserBet } from 'src/models/interface.collection';
import { UsermanagerService } from 'src/usermanager/usermanager.service';

@Injectable()
export class PromptManagerService {

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

    setCorrectAnswerForPrompt(promptId: number, answerId: number) {
        const prompt = this.promptHistory.find(prompt => prompt.id === promptId)

        if (prompt === null || prompt === undefined) {
            throw "Bet Prompt Not Found"
        }
        const answer = prompt.answers.find(answer => answer.id === answerId)

        if (answer === null || answer === undefined) {
            throw "Bet Answer Not Found"
        }
        prompt.correctAnswerId = answerId;

        this.calculateAndSetPoints(prompt);
    }

    calculateAndSetPoints(prompt: BetPromptHistory) {
        let betSum = 0;

        prompt.userBets.forEach(userBet => betSum += userBet.betAmount)

        const winnerUsers: UserBet[] = prompt.userBets.filter(userBet => userBet.answerId != prompt.correctAnswerId)
        const loserUsers: UserBet[] = prompt.userBets.filter(userBet => userBet.answerId == prompt.correctAnswerId)

        if (betSum <= 0) {
            throw "Incorrect Bets or No One Bet"
        }

        if (winnerUsers.length != 0) {
            const eachUserAmount = betSum / winnerUsers.length
            winnerUsers.forEach(user => {
                this.usermanagerService.updateUserBetPoints(user.userName, eachUserAmount)
            })
        }

        if (loserUsers.length != 0) {
            loserUsers.forEach(user => {
                this.usermanagerService.updateUserBetPoints(user.userName, -user.betAmount)
            })
        }

    }

    getCurrentPromptState() {
        return this.promptCurrent;
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


    private promptHistory: BetPromptHistory[] = [];
    private promptCurrent: BetPromptCurrent = null;

    getCurrentPrompt() {
        return this.promptCurrent;
    }

    generatePrompt(data: BetPromptRequest): BetPromptResponse {

        // data.prompt.mapToObjectWithId
        // data.answer.mapToObjectWithId
        // promptHistory.getLatestId

        // @ToDo replace with correctly mapped input prompt

        this.promptCurrent = {
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

        const promptResponse: BetPromptResponse = this.promptCurrent

        return promptResponse;

    }

    closeCurrentBetPrompt(invalidBet: boolean) {

        if (this.promptCurrent == null) {
            throw "No Prompt currently Open"
        }
        const currentPrompt = this.promptCurrent;
        console.log(currentPrompt);
        const promptHistoryEntity: BetPromptHistoryResponse = {
            ...currentPrompt,
            id: this.getNewPromptId(),
            invalidBet
        }

        this.promptCurrent = null;
        this.promptHistory.push(promptHistoryEntity);
    }

    getNewPromptId(): number {
        let promptId = 0;
        if (this.promptHistory != undefined) {
            this.promptHistory.forEach(singlePrompt => {
                if (singlePrompt.id > promptId)
                    promptId = singlePrompt.id
            })
        }


        return promptId++;
    }
}

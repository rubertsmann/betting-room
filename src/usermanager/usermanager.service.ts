import { Injectable } from '@nestjs/common';
import { LoginRequest, User } from 'src/models/interface.collection';
import { PromptManagerService } from 'src/prompt-manager/prompt-manager.service';
import internal from 'stream';

@Injectable()
export class UsermanagerService {
    findUser(userName: string): User {
        const user = this.users.find(user => user.username === userName);
        return user;
    }

    private users: User[] = [];

    getAllUser() {
        return this.users;
    }


    updateUserBetPoints(userName: string, points: number) {
        const user = this.users.find(user => user.username === userName);
        user.points += points;
    }

    updateGroupLeader(userName: string) {
        const currentGroupLeader = this.users.find(user => user.groupLeader === true);

        if (currentGroupLeader == undefined) {
            const user = this.users.find(user => user.username === userName)
            user.groupLeader = true;
        } else {
            throw "Cannot claim Group Leader: " + currentGroupLeader.username + " is currently the Group leader";
        }
    }

    public saveOrGetUser(data: LoginRequest) {

        const user = this.users.find(user => user.username === data.username)

        if (user != null && user != undefined) {
            return user
        }

        const newUser = {
            username: data.username,
            password: data.password,
            points: 1000,
            currentBet: {
                betPoints: 0,
                promptId: null,
                answerId: null
            },
            groupLeader: false
        }

        this.users.push(newUser)

        return newUser;
    }
}

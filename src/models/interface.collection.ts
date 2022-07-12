export interface LoginRequest {
    username: string,
    password: string
}

export interface BetRequest {
    username: string,
    betAmount: number,
    answerId: number
}

export interface Error {
    errorName: string,
    message: string
}

export interface UserState {
    username: string,
    points: number,
    // betPoints: number,
    groupLeader: boolean
}

export interface BetPromptRequest {
    prompt: string,
    answers: string[]
}

export interface BetPromptResponse {
    id: number,
    prompt: string,
    answers: BetPrompAnswerResponse[],
    userBets?: UserBet[]
}

export interface UserBet {
    userName: string,
    answerId: number,
    betAmount: number
}

export interface BetPrompAnswerResponse {
    id: number,
    text: string
}


// export interface BetResponse {
//     username: string,
//     bet: number
// }


export interface User {
    username: string,
    password: string,
    points: number,
    groupLeader: boolean
}

export interface CurrentBet {
    betPoints: number,
    promptId: number
    answerId: number
}

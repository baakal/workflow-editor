import { Events } from "./Events";

export interface _Action{
    Name: string;
    Actors?: string[];
    Events?: Events[];
    Options?: any;
    ToStatus?: string;
}

export class Action implements _Action{
    Name: string;
    Actors: string[];
    Events: Events[];
    Options: any;
    ToStatus: string;
}

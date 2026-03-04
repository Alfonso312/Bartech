import { User } from './user.model';
export declare class UsersService {
    private userModel;
    constructor(userModel: typeof User);
    findAll(): Promise<User[]>;
    findByEmail(email: string): Promise<User | null>;
    create(userData: any): Promise<User>;
}

import { User } from './user.model';
export declare class UsersService {
    private userModel;
    constructor(userModel: typeof User);
    create(data: any): Promise<User>;
    findByEmail(email: string): Promise<User | null>;
    findAll(): Promise<User[]>;
}

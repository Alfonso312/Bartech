import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
    constructor(@InjectModel(User) private userModel: typeof User) { }

    create(data: any) {
        return this.userModel.create(data);
    }

    findByEmail(email: string) {
        return this.userModel.findOne({ where: { email } });
    }

    findAll() {
        return this.userModel.findAll();
    }
}
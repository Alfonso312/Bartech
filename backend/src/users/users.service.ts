import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {

    constructor(
        @InjectModel(User)
        private userModel: typeof User,
    ) { }

    async findAll() {
        return this.userModel.findAll();
    }

    async findByEmail(email: string) {
        return this.userModel.findOne({ where: { email } });
    }

    async create(userData: any) {
        return this.userModel.create(userData);
    }
}
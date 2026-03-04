import {
    Table,
    Column,
    Model,
    DataType,
} from 'sequelize-typescript';

@Table({
    tableName: 'Users',
})
export class User extends Model {

    @Column({
        type: DataType.STRING,
    })
    declare username: string;

    @Column({
        type: DataType.STRING,
        unique: true,
    })
    declare email: string;

    @Column({
        type: DataType.STRING,
    })
    declare password: string;

    @Column({
        type: DataType.STRING,
        defaultValue: 'user',
    })
    declare role: string;
}
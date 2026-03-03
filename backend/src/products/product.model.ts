import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table
export class Product extends Model {
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Column({
        type: DataType.FLOAT,
        allowNull: false,
    })
    price: number;
}
import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class VenueAmenity{
    @PrimaryGeneratedColumn("uuid")
    id!: string;

    @Index({unique: true})
    @Column({type: "varchar", length: 100})
    name!: string;

    @Column("boolean")
    isActive!: boolean;
}
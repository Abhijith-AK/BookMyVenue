import { Column, CreateDateColumn, Entity, Index, JoinColumn, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { Districts, VenueStatus, WeekDays } from "../enums/venue.enums";
import { User } from "src/users/user.entity";
import { VenueCategory } from "./venue-category.entity";
import { VenueAmenity } from "./venue-amenity.entity";
import { Photos } from "../photos.model";

@Entity()
export class Venue{
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @ManyToOne(() => User)
    @JoinColumn({name: "ownerId"})
    owner!: User;

    @Index()
    @Column("uuid")
    ownerId!:string;

    @Column({type: "varchar", length: 100})
    name!: string;

    @Column({ type: "varchar", length: 1000})
    description!: string;

    @Column({ type: "varchar", length: 600})
    address!: string;

    @Index()
    @Column({
        type: "enum",
        enum: Districts,
    })
    district!: Districts;

    @Column("text", { array: true})
    photos!: Photos[];

    @Column("int")
    minCapacity!: number;

    @Column("int")
    maxCapacity!: number;

    @Column("text", { array: true, nullable: true })
    tags?: string[];

    @Column({
        type: "enum",
        enum: VenueStatus
    })
    status!: VenueStatus;

    @Column("date")
    availableFrom!: Date;

    @Column("date")
    availableUntil!: Date;

    @Column("time")
    openingTime!: string;

    @Column("time")
    closingTime!: string;

    @Column("date", { array: true, nullable: true, default: [] })
    holidays?: Date[];

    @Column({
        type: "enum",
        enum: WeekDays,
        array: true,
        nullable: true,
        default: []
    })
    weekDayOff?: WeekDays[];

    @Column("int")
    slotDurationMinutes!: number;

    @Column("decimal", {
        precision: 10,
        scale: 2,
    })
    pricePerSlot!: number;

    @Column("int")
    bookingBufferMinutes!: number;

    @ManyToMany(() => VenueCategory)
    @JoinTable({name: "venue_categories"})
    categories!: VenueCategory[];
    
    @ManyToMany(() => VenueAmenity)
    @JoinTable({name: "venue_amenities"})
    amenities!: VenueAmenity[]

    @CreateDateColumn()
    createdAt!: Date
}
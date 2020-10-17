import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import Orphanage from "./Orphanage";

@Entity('images')
export default class Image {

    @PrimaryGeneratedColumn('increment')
    id: number;

    @Column()
    path: string;

    @ManyToOne(() => Orphanage, o => o.images)
    @JoinColumn({ name: 'orphanage_id'})
    orphanage: Orphanage;
}
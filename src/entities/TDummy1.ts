import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("untitled_table_215_pkey", ["idp"], { unique: true })
@Entity("t_dummy1", { schema: "public" })
export class TDummy1 {
  @PrimaryGeneratedColumn({ type: "integer", name: "idp" })
  idp: number;

  @Column("character varying", {
    name: "name",
    nullable: true,
    length: 300,
    default: () => "''''",
  })
  name: string | null;
}

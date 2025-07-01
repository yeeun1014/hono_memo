import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("t_memo_pkey", ["idp"], { unique: true })
@Entity("t_memo", { schema: "public" })
export class TMemo {
  @PrimaryGeneratedColumn({ type: "integer", name: "idp" })
  idp: number;

  @Column("character varying", {
    name: "title",
    nullable: true,
    length: 500,
    default: () => "''''",
  })
  title: string | null;

  @Column("text", { name: "content", nullable: true, default: () => "''''''" })
  content: string | null;

  @Column("integer", { name: "user_idp", nullable: true, default: () => "0" })
  userIdp: number | null;

  @Column("timestamp with time zone", {
    name: "created_dt",
    nullable: true,
    default: () => "now()",
  })
  createdDt: Date | null;
}

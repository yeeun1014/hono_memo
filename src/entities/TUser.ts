import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TUserRoles } from "./TUserRoles";

@Index("t_user_pkey", ["idp"], { unique: true })
@Entity("t_user", { schema: "public" })
export class TUser {
  @PrimaryGeneratedColumn({ type: "integer", name: "idp" })
  idp: number;

  @Column("character varying", {
    name: "username",
    nullable: true,
    length: 50,
    default: () => "''''",
  })
  username: string | null;

  @Column("character varying", {
    name: "password",
    nullable: true,
    length: 255,
    default: () => "''''''",
  })
  password: string | null;

  @OneToMany(() => TUserRoles, (tUserRoles) => tUserRoles.uesrIdp)
  tUserRoles: TUserRoles[];
}

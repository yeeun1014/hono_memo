import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { TUser } from "./TUser";

@Index("t_user_roles_pkey", ["idp"], { unique: true })
@Entity("t_user_roles", { schema: "public" })
export class TUserRoles {
  @PrimaryGeneratedColumn({ type: "integer", name: "idp" })
  idp: number;

  @Column("character varying", {
    name: "role_name",
    nullable: true,
    length: 50,
    default: () => "''''''",
  })
  roleName: string | null;

  @ManyToOne(() => TUser, (tUser) => tUser.tUserRoles, {
    onDelete: "CASCADE",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "user_idp", referencedColumnName: "idp" }])
  userIdp: TUser;
}

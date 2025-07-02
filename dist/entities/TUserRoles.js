"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TUserRoles = void 0;
const typeorm_1 = require("typeorm");
const TUser_1 = require("./TUser");
let TUserRoles = class TUserRoles {
    idp;
    roleName;
    userIdp;
};
exports.TUserRoles = TUserRoles;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "integer", name: "idp" }),
    __metadata("design:type", Number)
], TUserRoles.prototype, "idp", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "role_name",
        nullable: true,
        length: 50,
        default: () => "''''''",
    }),
    __metadata("design:type", String)
], TUserRoles.prototype, "roleName", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => TUser_1.TUser, (tUser) => tUser.tUserRoles, {
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
    }),
    (0, typeorm_1.JoinColumn)([{ name: "user_idp", referencedColumnName: "idp" }]),
    __metadata("design:type", TUser_1.TUser)
], TUserRoles.prototype, "userIdp", void 0);
exports.TUserRoles = TUserRoles = __decorate([
    (0, typeorm_1.Index)("t_user_roles_pkey", ["idp"], { unique: true }),
    (0, typeorm_1.Entity)("t_user_roles", { schema: "public" })
], TUserRoles);

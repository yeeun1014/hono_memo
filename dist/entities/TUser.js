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
exports.TUser = void 0;
const typeorm_1 = require("typeorm");
const TUserRoles_1 = require("./TUserRoles");
let TUser = class TUser {
    idp;
    username;
    password;
    tUserRoles;
};
exports.TUser = TUser;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "integer", name: "idp" }),
    __metadata("design:type", Number)
], TUser.prototype, "idp", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "username",
        nullable: true,
        length: 50,
        default: () => "''''''",
    }),
    __metadata("design:type", String)
], TUser.prototype, "username", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "password",
        nullable: true,
        length: 255,
        default: () => "''''''",
    }),
    __metadata("design:type", String)
], TUser.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => TUserRoles_1.TUserRoles, (tUserRoles) => tUserRoles.userIdp),
    __metadata("design:type", Array)
], TUser.prototype, "tUserRoles", void 0);
exports.TUser = TUser = __decorate([
    (0, typeorm_1.Index)("t_user_pkey", ["idp"], { unique: true }),
    (0, typeorm_1.Entity)("t_user", { schema: "public" })
], TUser);

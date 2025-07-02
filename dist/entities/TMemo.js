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
exports.TMemo = void 0;
const typeorm_1 = require("typeorm");
let TMemo = class TMemo {
    idp;
    title;
    content;
    userIdp;
    createdDt;
};
exports.TMemo = TMemo;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "integer", name: "idp" }),
    __metadata("design:type", Number)
], TMemo.prototype, "idp", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "title",
        nullable: true,
        length: 500,
        default: () => "''''",
    }),
    __metadata("design:type", String)
], TMemo.prototype, "title", void 0);
__decorate([
    (0, typeorm_1.Column)("text", { name: "content", nullable: true, default: () => "''''''" }),
    __metadata("design:type", String)
], TMemo.prototype, "content", void 0);
__decorate([
    (0, typeorm_1.Column)("integer", { name: "user_idp", nullable: true, default: () => "0" }),
    __metadata("design:type", Number)
], TMemo.prototype, "userIdp", void 0);
__decorate([
    (0, typeorm_1.Column)("timestamp with time zone", {
        name: "created_dt",
        nullable: true,
        default: () => "now()",
    }),
    __metadata("design:type", Date)
], TMemo.prototype, "createdDt", void 0);
exports.TMemo = TMemo = __decorate([
    (0, typeorm_1.Index)("t_memo_pkey", ["idp"], { unique: true }),
    (0, typeorm_1.Entity)("t_memo", { schema: "public" })
], TMemo);

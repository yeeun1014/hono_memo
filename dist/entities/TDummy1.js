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
exports.TDummy1 = void 0;
const typeorm_1 = require("typeorm");
let TDummy1 = class TDummy1 {
};
exports.TDummy1 = TDummy1;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)({ type: "integer", name: "idp" }),
    __metadata("design:type", Number)
], TDummy1.prototype, "idp", void 0);
__decorate([
    (0, typeorm_1.Column)("character varying", {
        name: "name",
        nullable: true,
        length: 300,
        default: () => "''''",
    }),
    __metadata("design:type", Object)
], TDummy1.prototype, "name", void 0);
exports.TDummy1 = TDummy1 = __decorate([
    (0, typeorm_1.Index)("untitled_table_213_pkey", ["idp"], { unique: true }),
    (0, typeorm_1.Entity)("t_dummy1", { schema: "public" })
], TDummy1);

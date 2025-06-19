"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_server_1 = require("@hono/node-server");
const hono_1 = require("hono");
const data_source1_1 = require("./data-source1");
const dotenv = __importStar(require("dotenv"));
const TDummy1_1 = require("./entities/TDummy1");
const test1_route_1 = __importDefault(require("./router/test1/test1_route"));
const memo_1 = __importDefault(require("./router/memo/memo"));
/** 쿠팡 회사를 설립한거와 비슷
 * 웹 서버의 핵심 객체를 만듬
 */
const app = new hono_1.Hono();
const envFile = process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });
// 내가 만든 router 등록
app.route("/test1", test1_route_1.default);
app.route("/api/memo", memo_1.default);
/** DB 연결 */
data_source1_1.AppDataSource.initialize()
    .then(() => {
    console.log("Data Source has been initialized!");
})
    .catch((err) => {
    console.error("Error during Data Source initialization:", err);
});
/** DB 연결 END */
function fetchData() {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log("fetchdata 입니다");
        }, 1);
    });
}
/** 고객 요청 창구를 개설
 * get method 방식, "/" 경로로 요청을 받겠다
 */
app.get("/", async (c) => {
    // c 라는 놈은, 요청 & 응답 기능을 가지고 있다
    const dummy1Repo = data_source1_1.AppDataSource.getRepository(TDummy1_1.TDummy1);
    let data;
    data = await dummy1Repo.find();
    let dummy2 = 1 + 1;
    return c.json({ data, dummy2 });
});
/** 회사 운영 시작
 * 서버 구동 코드. 포트번호는 3000으로 하겠다
 */
(0, node_server_1.serve)({
    fetch: app.fetch,
    port: 3000,
}, (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
});

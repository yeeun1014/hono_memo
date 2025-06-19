import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { AppDataSource } from "./data-source1";
import * as dotenv from "dotenv";
import { TDummy1 } from "./entities/TDummy1";

import test1_route from "./router/test1/test1_route";
import memoRoute from "./router/memo/memo";

/** 쿠팡 회사를 설립한거와 비슷
 * 웹 서버의 핵심 객체를 만듬
 */
const app = new Hono();

const envFile =
  process.env.NODE_ENV === "production"
    ? ".env.production"
    : ".env.development";
dotenv.config({ path: envFile });

// 내가 만든 router 등록
app.route("/test1", test1_route);
app.route("/api/memo", memoRoute);

/** DB 연결 */
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
/** DB 연결 END */

function fetchData(): Promise<string> {
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
  const dummy1Repo = AppDataSource.getRepository(TDummy1);

  let data: any;
  data = await dummy1Repo.find();
  let dummy2 = 1 + 1;
  return c.json({ data, dummy2 });
});

/** 회사 운영 시작
 * 서버 구동 코드. 포트번호는 3000으로 하겠다
 */
serve(
  {
    fetch: app.fetch,
    port: 3001,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);

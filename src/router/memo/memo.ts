/**
 * 이건 내가 만든 라우터. 이걸 서버가 사용하게 하려면 등록을 시켜줘야함
 */

import { Hono } from "hono";
import { AppDataSource } from "../../data-source";
import { TDummy1 } from "../../entities/TDummy1";
import { TMemo } from "../../entities/TMemo";
import { verifyToken } from "../../utils/utils";

const router = new Hono();

router.get("/list", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    code: "",
    data: null,
    message: ``,
  };
  try {
    let authHeader = c?.req?.header("Authorization") ?? "";
    try {
      authHeader = authHeader.split("Bearer ")[1];
    } catch (error: any) {
      authHeader = "";
    }
    console.log(`## authHeader:`, authHeader);
    const tokenData: any = verifyToken(authHeader);
    console.log(`## tokenData:`, tokenData);
    if (!tokenData?.idp) {
      result.success = false;
      result.message = "로그인이 필요합니다";
      return c.json(result);
    }
    const memoRepo = AppDataSource.getRepository(TMemo);
    let memos =
      (await memoRepo.find({
        where: { userIdp: tokenData?.idp },
        take: 1000,
        order: { createdDt: "DESC" },
      })) ?? [];
    result.data = memos;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

router.get("/get_memo_by_idp", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    code: "",
    data: null,
    message: ``,
  };
  try {
    const idp = Number(c?.req?.query("idp"));
    const memoRepo = AppDataSource.getRepository(TMemo);
    let memos = await memoRepo.findOne({ where: { idp: idp } });
    result.data = memos;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

router.post("/upsert", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    code: "",
    data: null,
    message: ``,
  };
  try {
    let authHeader = c?.req?.header("Authorization") ?? "";
    try {
      authHeader = authHeader.split("Bearer ")[1];
    } catch (error: any) {
      authHeader = "";
    }
    console.log(`## authHeader:`, authHeader);
    const tokenData: any = verifyToken(authHeader);
    console.log(`## tokenData:`, tokenData);
    if (!tokenData?.idp) {
      result.success = false;
      result.message = "로그인이 필요합니다";
      return c.json(result);
    }
    // const : 변경 불가능
    const body = await c?.req?.json();
    const idp = Number(body?.idp ?? 0);
    let title = String(body?.title ?? "");
    title = title?.trim();
    let content = String(body?.content ?? "");
    content = content?.trim();

    if (!title || !content) {
      result.success = false;
      result.message = "제목이나 내용을 입력해주세요";
      return c.json(result);
    }

    const memoRepo = AppDataSource.getRepository(TMemo);

    /*
    body 에서 준 idp(리엑트)와 실제 t_memo 테이블 데이터에 있는 idp를 비교해서
    body idp 랑 완전히 똑같은 데이터 가져와라
    못찾았으면, 새로운 데이터로 만들어라(idp=0, title="", content="")
     */
    let memo = (await memoRepo.findOne({ where: { idp: idp } })) ?? new TMemo();

    memo.title = title;
    memo.content = content;
    memo.userIdp = tokenData?.idp;

    memo = await memoRepo.save(memo);
    result.data = memo;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

router.post("/delete", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    code: "",
    data: null,
    message: ``,
  };
  try {
    // const : 변경 불가능
    const body = await c?.req?.json();
    const idp = Number(body?.idp ?? 0);

    const memoRepo = AppDataSource.getRepository(TMemo);

    let memo = (await memoRepo.findOne({ where: { idp: idp } })) ?? new TMemo();
    if (!memo?.idp) {
      result.success = false;
      result.message = `없는 데이터를 삭제하려고 합니다`;
      return c.json(result);
    }
    await memoRepo.remove(memo);

    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

export default router;

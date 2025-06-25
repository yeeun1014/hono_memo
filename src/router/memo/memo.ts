import { Hono } from "hono";
import { AppDataSource } from "../../data-source1";
import { TDummy1 } from "../../entities/TDummy1";
import { TMemo } from "../../entities/TMemo";

const router = new Hono();

router.get("/list", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    code: "",
    data: null,
    message: ``,
  };
  try {
    const memoRepo = AppDataSource.getRepository(TMemo);
    let memos =
      (await memoRepo.find({ take: 1000, order: { createdDt: "DESC" } })) ?? [];
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
    // 1. 요청에서 idp 추출
    const body = await c.req.json();
    const idp = body.idp;

    // 2. TMemo 레포지토리 가져오기
    const memoRepo = AppDataSource.getRepository(TMemo);

    // 3. idp로 메모 찾기
    const memo = await memoRepo.findOneBy({ idp: idp });

    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

export default router;

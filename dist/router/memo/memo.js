"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const data_source1_1 = require("../../data-source1");
const TDummy1_1 = require("../../entities/TDummy1");
const TMemo_1 = require("../../entities/TMemo");
const router = new hono_1.Hono();
router.get("/list", async (c) => {
    let result = {
        success: true,
        code: "",
        data: null,
        message: ``,
    };
    try {
        const memoRepo = data_source1_1.AppDataSource.getRepository(TMemo_1.TMemo);
        let memos = (await memoRepo.find({ take: 1000, order: { createdDt: "DESC" } })) ?? [];
        result.data = memos;
        return c.json(result);
    }
    catch (error) {
        result.success = false;
        result.message = error?.message ?? "";
        return c.json(result);
    }
});
router.post("/upsert", async (c) => {
    let result = {
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
        const memoRepo = data_source1_1.AppDataSource.getRepository(TMemo_1.TMemo);
        /*
        body 에서 준 idp(리엑트)와 실제 t_memo 테이블 데이터에 있는 idp를 비교해서
        body idp 랑 완전히 똑같은 데이터 가져와라
        못찾았으면, 새로운 데이터로 만들어라(idp=0, title="", content="")
         */
        let memo = (await memoRepo.findOne({ where: { idp: idp } })) ?? new TMemo_1.TMemo();
        memo.title = title;
        memo.content = content;
        memo = await memoRepo.save(memo);
        result.data = memo;
        return c.json(result);
    }
    catch (error) {
        result.success = false;
        result.message = error?.message ?? "";
        return c.json(result);
    }
});
exports.default = router;

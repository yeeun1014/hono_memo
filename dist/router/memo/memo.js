"use strict";
/**
 * 이건 내가 만든 라우터. 이걸 서버가 사용하게 하려면 등록을 시켜줘야함
 */
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const data_source_js_1 = require("../../data-source.js");
const TMemo_js_1 = require("../../entities/TMemo.js");
const utils_js_1 = require("../../utils/utils.js");
const router = new hono_1.Hono();
router.get("/list", async (c) => {
    let result = {
        success: true,
        code: "",
        data: null,
        message: ``,
    };
    try {
        let authHeader = c?.req?.header("Authorization") ?? "";
        try {
            authHeader = authHeader.split("Bearer ")[1];
        }
        catch (error) {
            authHeader = "";
        }
        console.log(`## authHeader:`, authHeader);
        const tokenData = (0, utils_js_1.verifyToken)(authHeader);
        console.log(`## tokenData:`, tokenData);
        if (!tokenData?.idp) {
            result.success = false;
            result.message = "로그인이 필요합니다";
            return c.json(result);
        }
        const memoRepo = data_source_js_1.AppDataSource.getRepository(TMemo_js_1.TMemo);
        let memos = (await memoRepo.find({
            where: { userIdp: tokenData?.idp },
            take: 1000,
            order: { createdDt: "DESC" },
        })) ?? [];
        result.data = memos;
        return c.json(result);
    }
    catch (error) {
        result.success = false;
        result.message = error?.message ?? "";
        return c.json(result);
    }
});
router.get("/get_memo_by_idp", async (c) => {
    let result = {
        success: true,
        code: "",
        data: null,
        message: ``,
    };
    try {
        const idp = Number(c?.req?.query("idp"));
        const memoRepo = data_source_js_1.AppDataSource.getRepository(TMemo_js_1.TMemo);
        let memos = await memoRepo.findOne({ where: { idp: idp } });
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
        let authHeader = c?.req?.header("Authorization") ?? "";
        try {
            authHeader = authHeader.split("Bearer ")[1];
        }
        catch (error) {
            authHeader = "";
        }
        console.log(`## authHeader:`, authHeader);
        const tokenData = (0, utils_js_1.verifyToken)(authHeader);
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
        const memoRepo = data_source_js_1.AppDataSource.getRepository(TMemo_js_1.TMemo);
        /*
        body 에서 준 idp(리엑트)와 실제 t_memo 테이블 데이터에 있는 idp를 비교해서
        body idp 랑 완전히 똑같은 데이터 가져와라
        못찾았으면, 새로운 데이터로 만들어라(idp=0, title="", content="")
         */
        let memo = (await memoRepo.findOne({ where: { idp: idp } })) ?? new TMemo_js_1.TMemo();
        memo.title = title;
        memo.content = content;
        memo.userIdp = tokenData?.idp;
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
router.post("/delete", async (c) => {
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
        const memoRepo = data_source_js_1.AppDataSource.getRepository(TMemo_js_1.TMemo);
        let memo = (await memoRepo.findOne({ where: { idp: idp } })) ?? new TMemo_js_1.TMemo();
        if (!memo?.idp) {
            result.success = false;
            result.message = `없는 데이터를 삭제하려고 합니다`;
            return c.json(result);
        }
        await memoRepo.remove(memo);
        return c.json(result);
    }
    catch (error) {
        result.success = false;
        result.message = error?.message ?? "";
        return c.json(result);
    }
});
exports.default = router;

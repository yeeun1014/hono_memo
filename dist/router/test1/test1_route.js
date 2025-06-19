"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hono_1 = require("hono");
const data_source1_1 = require("../../data-source1");
const TDummy1_1 = require("../../entities/TDummy1");
const router = new hono_1.Hono();
// async = 이 함수 안에 느린코드 있어. 라고 준비시켜줌
router.get("/", async (c) => {
    // 자료구조화된 객체
    let result = {
        success: true,
        data: null,
        code: "",
        message: ``,
    };
    try {
        // AppDataSource == DB   t_dummy1 테이블에 접근할 준비를 해라. 전문용어로 repository
        const dummy1Repo = data_source1_1.AppDataSource.getRepository(TDummy1_1.TDummy1);
        // dummy1 repository 를 사용해서 데이터 1000개 가져옴
        let data = await dummy1Repo.find({ take: 1000 });
        // result.data 여기에 데이터 가져올걸 저장시킴
        result.data = data;
        // 클라이언트에 보내줌
        return c.json(result);
    }
    catch (error) {
        result.success = false;
        result.data = null;
        result.message = `!!! test1.get 에러. ${error?.message ?? ""}`;
        return c.json(result);
    }
});
router.post("/insert", async (c) => {
    // 자료구조화된 객체
    let result = {
        success: true,
        data: null,
        code: "",
        message: ``,
    };
    try {
        // 클라이언트에서 json 데이터를 body로 보냄
        let _body = await c.req.json(); // JSON 형태로 body 파싱
        let name = _body?.name ?? "";
        // AppDataSource == DB   t_dummy1 테이블에 접근할 준비를 해라. 전문용어로 repository
        const dummy1Repo = data_source1_1.AppDataSource.getRepository(TDummy1_1.TDummy1);
        // 클래스를 진짜 사용하기위해서 인스턴스화 함. TDummy1 클래스를 직접 봐보면 @ 것들이 붙어있음
        // 이건 클래스를 db테이블 이랑 1:1로 연결시킨것임
        // 여기서 new TDummy1 이건 새로운 데이터란 뜻임
        let newDummy1 = new TDummy1_1.TDummy1();
        newDummy1.name = name;
        // 테이블에 데이터 저장
        let data = await dummy1Repo.save(newDummy1);
        // result.data 여기에 데이터 가져올걸 저장시킴
        result.data = data;
        // 클라이언트에 보내줌
        return c.json(result);
    }
    catch (error) {
        result.success = false;
        result.data = null;
        result.message = `!!! test1.get 에러. ${error?.message ?? ""}`;
        return c.json(result);
    }
});
router.post("/update", async (c) => {
    // 자료구조화된 객체
    let result = {
        success: true,
        data: null,
        code: "",
        message: ``,
    };
    try {
        // 클라이언트에서 json 데이터를 body로 보냄
        let _body = await c.req.json(); // JSON 형태로 body 파싱
        let name = _body?.name ?? "";
        let idp = Number(_body?.idp ?? 0);
        console.log(idp);
        // AppDataSource == DB   t_dummy1 테이블에 접근할 준비를 해라. 전문용어로 repository
        const dummy1Repo = data_source1_1.AppDataSource.getRepository(TDummy1_1.TDummy1);
        let existData = (await dummy1Repo.findOne({ where: { idp: idp } })) ?? new TDummy1_1.TDummy1();
        existData.name = name;
        existData = await dummy1Repo.save(existData);
        result.data = existData;
        // 클라이언트에 보내줌
        return c.json(result);
    }
    catch (error) {
        result.success = false;
        result.data = null;
        result.message = `!!! test1.get 에러. ${error?.message ?? ""}`;
        return c.json(result);
    }
});
router.get("/:id", (c) => {
    const id = c.req.param("id");
    return c.text(`👤 유저 상세: ${id}`);
});
exports.default = router;

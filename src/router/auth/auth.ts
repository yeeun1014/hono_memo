/**
 * 이건 내가 만든 라우터. 이걸 서버가 사용하게 하려면 등록을 시켜줘야함
 */

import { Hono } from "hono";
import { AppDataSource } from "../../data-source.js";
import { TUser } from "../../entities/TUser.js";
import {
  comparePassword,
  generateToken,
  hashPassword,
  verifyToken,
} from "../../utils/utils.js";
import { instanceToPlain } from "class-transformer";

const router = new Hono();

router.post("/register", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    // body 에서 받은 데이터들
    const reqs = await c?.req?.json();
    // reqs 에서 username 꺼내기
    let username = String(reqs?.username ?? "");
    let password = String(reqs?.password ?? "");

    const userRepo = AppDataSource.getRepository(TUser);
    let userData =
      (await userRepo.findOne({ where: { username: username } })) ??
      new TUser();
    // 이미 가입된 유저가 있으면
    if (userData?.idp) {
      result.success = false;
      result.message = `이미 가입된 회원입니다`;
      return c.json(result);
    }
    // 단방향 암호화
    const hashedPassword = await hashPassword(password);
    userData.username = username;
    userData.password = hashedPassword;
    userData = await userRepo.save(userData);
    userData.password = "";

    let payload = instanceToPlain(userData);

    // 민증 발급. "999d" 이뜻은 만료기한 999일
    let userToken = generateToken(payload, "999d");
    // 유저의 회원가입 정보 전체 + 민증 data에 실어서 보내기
    result.data = { userData: userData, userToken: userToken };
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

router.post("/login", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    // body 에서 받은 데이터들
    const reqs = await c?.req?.json();
    // reqs 에서 username 꺼내기
    let username = String(reqs?.username ?? "");
    let password = String(reqs?.password ?? "");

    const userRepo = AppDataSource.getRepository(TUser);
    let userData =
      (await userRepo.findOne({
        where: { username: username },
        relations: { tUserRoles: true },
      })) ?? new TUser();
    // username 으로 테이블에서 유저 찾으라고 했는데, 없으면, 데이터가 채워지지 않은(idp = 0)
    // 객체로 생성된다
    // 이 뜻은 userData 에 idp 가 0이면
    if (!userData?.idp) {
      result.success = false;
      result.message = `가입되지 않거나, 잘못된 비밀번호 입니다`;
      return c.json(result);
    }
    // 비밀번호가 안맞을때
    if (!(await comparePassword(password, userData?.password ?? ""))) {
      result.success = false;
      result.message = `가입되지 않거나, 잘못된 비밀번호 입니다`;
      return c.json(result);
    }
    userData.password = "";

    let payload = instanceToPlain(userData);
    let userToken = generateToken(payload, "999d");
    result.data = {
      userData: userData,
      userToken: userToken,
    };

    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

router.post("/validate", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    // body 에서 받은 데이터들
    const reqs = await c?.req?.json();
    // reqs 에서 username 꺼내기
    const token = String(reqs?.token ?? "");
    const btoken = verifyToken(token);
    if (!btoken) {
      result.success = false;
      result.message = `토근정보가 잘못됬습니다. 다시 로그인 해주세요`;
      return c.json(result);
    }

    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

router.get("/info", async (c) => {
  let result: { success: boolean; data: any; code: string; message: string } = {
    success: true,
    data: null,
    code: "",
    message: ``,
  };
  try {
    const authHeader = String(c?.req?.header("Authorization") ?? "");
    const token = authHeader.split(" ")[1];
    const decoded: any = verifyToken(token);
    console.log(decoded);
    const hasMasterRole = decoded?.tUserRoles?.some(
      (role: any) => role.roleName === "master"
    );
    if (hasMasterRole) result.data = `마스터 권한이 있습니다`;
    else result.data = `마스터 권한이 없습니다`;
    return c.json(result);
  } catch (error: any) {
    result.success = false;
    result.message = error?.message ?? "";
    return c.json(result);
  }
});

export default router;

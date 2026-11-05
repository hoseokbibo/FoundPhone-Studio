import Dexie, { type Table } from "dexie";
import type { Work, Runtime } from "./schema";

class Database extends Dexie {
  works!: Table<Work, string>;
  saves!: Table<{ id: string; state: Runtime }, string>;
  constructor() {
    super("foundphone-studio");
    // 彻底移除 saves 表的持久化，让它变成一个假表（永远存不进）
    this.version(2).stores({ 
      works: "id,updatedAt",
      saves: null // 移除 saves 表
    }).upgrade((tx) => {
      // 升级时顺手把以前的旧存档清空
      return tx.table("saves").clear();
    });
  }
}

// 创建一个假的 saves 对象拦截所有读写请求
const fakeSaves = {
  get: async () => undefined,
  put: async () => {},
  delete: async () => {},
} as unknown as Table<{ id: string; state: Runtime }, string>;

export const db = new Database();
// 用假对象替换掉真实的表
db.saves = fakeSaves;
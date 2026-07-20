/**
 * 省份代码 → 名称映射
 * 数据来源：bookProjects.ts 中实际使用的 provinceCode
 */

export interface ProvinceInfo {
  code: string;
  name: string;
  shortName: string;
}

/** 全部出现过的省份（不含 nationwide） */
export const PROVINCE_MAP: Record<string, ProvinceInfo> = {
  anhui: { code: "anhui", name: "安徽省", shortName: "安徽" },
  aomen: { code: "aomen", name: "澳门特别行政区", shortName: "澳门" },
  beijing: { code: "beijing", name: "北京市", shortName: "北京" },
  chongqing: { code: "chongqing", name: "重庆市", shortName: "重庆" },
  fujian: { code: "fujian", name: "福建省", shortName: "福建" },
  gansu: { code: "gansu", name: "甘肃省", shortName: "甘肃" },
  guangdong: { code: "guangdong", name: "广东省", shortName: "广东" },
  guangxi: { code: "guangxi", name: "广西壮族自治区", shortName: "广西" },
  guizhou: { code: "guizhou", name: "贵州省", shortName: "贵州" },
  hainan: { code: "hainan", name: "海南省", shortName: "海南" },
  hebei: { code: "hebei", name: "河北省", shortName: "河北" },
  heilongjiang: { code: "heilongjiang", name: "黑龙江省", shortName: "黑龙江" },
  henan: { code: "henan", name: "河南省", shortName: "河南" },
  hubei: { code: "hubei", name: "湖北省", shortName: "湖北" },
  hunan: { code: "hunan", name: "湖南省", shortName: "湖南" },
  jiangsu: { code: "jiangsu", name: "江苏省", shortName: "江苏" },
  jiangxi: { code: "jiangxi", name: "江西省", shortName: "江西" },
  jilin: { code: "jilin", name: "吉林省", shortName: "吉林" },
  liaoning: { code: "liaoning", name: "辽宁省", shortName: "辽宁" },
  neimenggu: { code: "neimenggu", name: "内蒙古自治区", shortName: "内蒙古" },
  ningxia: { code: "ningxia", name: "宁夏回族自治区", shortName: "宁夏" },
  qinghai: { code: "qinghai", name: "青海省", shortName: "青海" },
  shaanxi: { code: "shaanxi", name: "陕西省", shortName: "陕西" },
  shandong: { code: "shandong", name: "山东省", shortName: "山东" },
  shanghai: { code: "shanghai", name: "上海市", shortName: "上海" },
  shanxi: { code: "shanxi", name: "山西省", shortName: "山西" },
  sichuan: { code: "sichuan", name: "四川省", shortName: "四川" },
  taiwan: { code: "taiwan", name: "台湾省", shortName: "台湾" },
  tianjin: { code: "tianjin", name: "天津市", shortName: "天津" },
  xianggang: { code: "xianggang", name: "香港特别行政区", shortName: "香港" },
  xinjiang: { code: "xinjiang", name: "新疆维吾尔自治区", shortName: "新疆" },
  xizang: { code: "xizang", name: "西藏自治区", shortName: "西藏" },
  yunnan: { code: "yunnan", name: "云南省", shortName: "云南" },
  zhejiang: { code: "zhejiang", name: "浙江省", shortName: "浙江" },
};

/** 根据 provinceCode 获取省份名称 */
export function getProvinceName(code: string): string {
  return PROVINCE_MAP[code]?.name ?? code;
}

/** 根据 provinceCode 获取省份简称 */
export function getProvinceShortName(code: string): string {
  return PROVINCE_MAP[code]?.shortName ?? code;
}

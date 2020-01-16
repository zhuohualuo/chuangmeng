const gender = {
  MALE: "男性",
  FEMALE: "女性"
};
const education = {
  DOCTOR: "博士",
  MASTER: "硕士",
  BACHELOR: "本科",
  JUNIOR_COLLEGE: "专科",
  SENIOR: "高中",
  JUNIOR: "初中",
  PRIMARY: "小学"
};
const marital_status = {
  SINGLE: "单身",
  NEWLY_MARRIED: "新婚",
  MARRIED: "已婚",
  PARENTING: "育儿（全部）"
};
const working_status = {
  COLLEGE_STUDENT: "在校大学生",
  BUSINESS_USER: "商旅用户",
  GOVERNMENT_OFFICER: "政府公职人员",
  SCIENCE_EDUCATOR: "科研教育者",
  IT_WORKER: "IT 互联网工作者",
  HEALTH_CARE_WORKER: "医护工作者"
};
const user_os = {
  IOS: "IOS 系统",
  ANDROID: "安卓系统",
  WINDOWS: "Windows 系统",
  SYMBIAN: "塞班系统",
  JAVA: "JAVA 系统"
};
const new_device = {
  IOS: "苹果新用户",
  ANDROID: "安卓新用户"
};
const device_price = {
  PRICE_1500_LESS: "￥ 1500 以下",
  PRICE_1500_2500: "￥ 1500 ~ 2500",
  PRICE_2500_3500: "￥ 2500 ~ 3500",
  PRICE_3500_4500: "￥ 3500 ~ 4500",
  PRICE_4500_MORE: "￥ 4500 以上"
  //UNKNOWN: "未知"
};
const network_type = {
  WIFI: "无线网络",
  NET_2G: "2G 网络",
  NET_3G: "3G 网络",
  NET_4G: "4G 网络"
};
const network_operator = {
  CMCC: "中国移动",
  CUC: "中国联通",
  CTC: "中国电信"
};

const network_scene = {
  PUBLIC_PLACE: "公共场所",
  HOME: "家庭",
  COMPANY: "企业",
  SCHOOL: "学校"
};

const dressing_index = {
  FREEZING: "寒冷",
  COLD: "冷",
  CHILLY: "凉",
  COOL: "温凉",
  MILDLY_COOL: "凉舒适",
  MILD: "舒适",
  WARM: "热舒适",
  TORRIDITY: "炎热"
};
const uv_index = {
  WEAK: "弱",
  TEND_WEAK: "偏弱",
  MEDIUM: "中等",
  TEND_STRONG: "偏强",
  STRONG: "强"
};
const makeup_index = {
  PREVENT_CRACKING: "防龟裂",
  MOISTURING: "保湿",
  OIL_CONTROL: "控油",
  UV_PROTECT: "防晒"
};
const climate = {
  SHINE: "晴天",
  CLOUDY: "阴天",
  RAINY: "雨天",
  FOGGY: "雾",
  SNOWY: "雪",
  SANDY: "沙尘"
};

const app_install_status = {
  NOT_INSTALLED: "未安装",
  INSTALLED: "已安装"
};

const behavior_scene = {
  BEHAVIOR_INTEREST_SCENE_ALL: "全部场景",
  BEHAVIOR_INTEREST_SCENE_APP: "APP",
  BEHAVIOR_INTEREST_SCENE_ECOMMERCE: "电商",
  BEHAVIOR_INTEREST_SCENE_INFORMATION: "资讯"
};

const behavior_time_window = {
  BEHAVIOR_INTEREST_TIME_WINDOW_SEVEN_DAY: "7天",
  BEHAVIOR_INTEREST_TIME_WINDOW_FIFTEEN_DAY: "15天",
  BEHAVIOR_INTEREST_TIME_WINDOW_THIRTY_DAY: "30 天",
  BEHAVIOR_INTEREST_TIME_WINDOW_THREE_MONTH: "3个月",
  BEHAVIOR_INTEREST_TIME_WINDOW_SIX_MONTH: "6个月",
  BEHAVIOR_INTEREST_TIME_WINDOW_ONE_YEAR: "一年"
};

const behavior_intensity = {
  BEHAVIOR_INTEREST_INTENSITY_ALL: "全部强度",
  BEHAVIOR_INTEREST_INTENSITY_HIGH: "高强度"
};

const air_quality_index = {
  GOOD: "优",
  MODERATE: "良",
  LIGHTLY_POLLUTED: "轻度污染",
  MODERATELY_POLLUTED: "中度污染",
  HEAVILY_POLLUTED: "重度污染",
  SEVERELY_POLLUTED: "严重污染"
};

const consumption_status = {
  HIGH: "高消费",
  LOW: "低消费"
};

const consumption_type = {
  PAID_GOODS_VIRTUAL: "虚拟商品",
  PAID_GOODS_REAL: "实物商品"
};

const act_id_list = {
  ACTIVE: "活跃用户",
  PAID: "付费用户"
};

const location_types = {
  // RECENTLY_IN: "近期在这里的人",
  LIVE_IN: "常住这里的人",
  // TRAVEL_IN: "旅行到这里的人",
  VISITED_IN: "去过这里的人"
};

const targeting_types = {
  gender: "性别",
  age: "年龄",
  education: "用户学历",
  marital_status: "婚恋状态",
  working_status: "生活状态",
  behavior_or_interest: "行为兴趣",
  app_category: "app 类型",
  keyword: "关键词",
  geo_location: "地理位置",
  user_os: "操作系统",
  new_device: "新设备",
  device_price: "设备价格",
  network_type: "联网方式",
  network_operator: "移动运营商",
  dressing_index: "穿衣指数",
  uv_index: "紫外线指数",
  makeup_index: "化妆指数",
  climate: "气象",
  temperature: "温度",
  app_install_status: "应用用户",
  app_behavior: "app 行为",
  consumption_status: "消费能力",
  gamer_consumption_ability: "游戏用户消费能力",
  player_consupt: "游戏用户消费能力",
  consumption_type: "消费类型",
  custom_audience: "定向人群",
  excluded_custom_audience: "排除人群",
  network_scene: "上网场景",
  air_quality_index: "空气质量指数"
};

export default {
  gender,
  education,
  marital_status,
  working_status,
  user_os,
  new_device,
  device_price,
  network_type,
  network_operator,
  network_scene,
  dressing_index,
  uv_index,
  makeup_index,
  climate,
  app_install_status,
  consumption_status,
  consumption_type,
  act_id_list,
  location_types,
  targeting_types,
  behavior_scene,
  behavior_time_window,
  behavior_intensity,
  air_quality_index
};

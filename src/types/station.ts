import { Station as PrismaStation, RecyclableItem } from "@prisma/client";

// 从 Prisma 生成的类型中排除我们不需要或将要覆盖的字段
type PrismaStationOmit = Omit<PrismaStation, "createdAt" | "updatedAt">;

// 客户端使用的基础 Station 类型，不再包含 isFavorite
export interface Station extends PrismaStationOmit {
  items: {
    plastics?: {
      enabled: boolean;
      types: PlasticType[];
      remaining: number;
    };
    alu?: {
      enabled: boolean;
      remaining: number;
    };
    battery?: {
      enabled: boolean;
      remaining: number;
    };
  };
  // isFavorite: boolean; // 已移除
  recyclableItems: RecyclableItem[];
}

export type PlasticType = "PET" | "HDPE" | "PP";

export type CampaignTag = {
  id: string;
  name: string;
  type: string;
  priority: number;
  icon: string;
  color: string;
  textColor: string;
  startDate: string;
  endDate: string;
  shortDescription: string;
};

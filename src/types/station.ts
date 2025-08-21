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

export type Station = {
  id: string;
  name: string;
  address: string;
  city: string;
  district: string;
  lat: number;
  lng: number;
  openHours: string;
  items: {
    plastics?: {
      enabled: boolean;
      types: Array<"PET" | "HDPE" | "PP">;
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
  isOpen: boolean;
  showOnWeb: boolean;
  campaignTags: CampaignTag[];
  distance?: number;
  isFavorite: boolean;
}; 
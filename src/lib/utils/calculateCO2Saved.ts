import { User } from "@prisma/client";

// 根據提供的回收物個數計算總減碳量 (kg CO2e)

// 減碳係數 (kg CO2e / 個)
const CARBON_FACTORS = {
  PET: 0.05, // 0.025 kg * 2.0 kg CO2e/kg
  PP: 0.0225, // 0.015 kg * 1.5 kg CO2e/kg
  HDPE: 0.075, // 0.05 kg * 1.5 kg CO2e/kg
  ALUMINUM_CAN: 0.1235, // 0.013 kg * 9.5 kg CO2e/kg
  BATTERY: 0.0184, // 0.023 kg * 0.8 kg CO2e/kg
};

type RecycledItemsCounts = Pick<
  User,
  | "totalPETCount"
  | "totalHDPECount"
  | "totalPPCount"
  | "totalAluminumCanCount"
  | "totalBatteryCount"
>;

/**
 * 根據回收物個數計算總減碳量，如果要在擴充額外減碳來源，可以增加parameter
 * @param counts - 包含各類回收物數量的物件
 * @returns 總減碳量 (kg CO2e)
 */
export const calculateCO2Saved = (counts: RecycledItemsCounts): number => {
  if (!counts) {
    return 0;
  }

  const petReduction = (counts.totalPETCount || 0) * CARBON_FACTORS.PET;
  const ppReduction = (counts.totalPPCount || 0) * CARBON_FACTORS.PP;
  const hdpeReduction = (counts.totalHDPECount || 0) * CARBON_FACTORS.HDPE;
  const aluminumCanReduction =
    (counts.totalAluminumCanCount || 0) * CARBON_FACTORS.ALUMINUM_CAN;
  const batteryReduction =
    (counts.totalBatteryCount || 0) * CARBON_FACTORS.BATTERY;

  const totalReduction =
    petReduction +
    ppReduction +
    hdpeReduction +
    aluminumCanReduction +
    batteryReduction;

  return totalReduction;
};

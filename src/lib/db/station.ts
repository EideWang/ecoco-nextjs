import { prisma } from "./prisma";

export const getStations = async () => {
  try {
    const stations = await prisma.station.findMany({
      where: {
        showOnWeb: true,
      },
      include: {
        recyclableItems: true,
      },
      orderBy: {
        id: "asc",
      },
    });
    return stations;
  } catch (error) {
    console.error("Failed to fetch stations:", error);
    return [];
  }
};


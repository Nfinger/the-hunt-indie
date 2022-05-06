import { prisma } from "~/db.server";
import type { Location } from "@prisma/client";

export function getLocations() {
  return prisma.location.findMany({
    orderBy: {
      id: "asc",
    },
  });
}

export function updateCorrectGuess(id: Location["id"]) {
  return prisma.location.update({
    where: {
      id,
    },
    data: {
      hasBeenGuessed: true,
    },
  });
}

export function updateHasVisited(id: Location["id"]) {
  return prisma.location.update({
    where: {
      id,
    },
    data: {
      hasBeenVisited: true,
    },
  });
}

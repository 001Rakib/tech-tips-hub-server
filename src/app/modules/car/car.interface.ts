export type TCar = {
  name: string;
  description: string;
  color: string;
  category: string;
  image: string;
  status: "available" | "unavailable";
  features: string[];
  pricePerHour: number;
  isDeleted: boolean;
};

export type TPost = {
  title: string;
  description: string;
  author: string;
  image: string;
  category: string;
  status: "free" | "premium";
  isDeleted: boolean;
};

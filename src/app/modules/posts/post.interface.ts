export type TPost = {
  title: string;
  description: string;
  author: string;
  authorImage: string;
  image: string;
  category: string;
  status: "free" | "premium";
  isDeleted: boolean;
};

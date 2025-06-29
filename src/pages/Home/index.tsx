import type { FC } from "react";
import { Posts } from "../../components/Posts";

interface HomeProps {}

export const Home: FC<HomeProps> = () => {
  return <Posts title="Trending Posts" />;
};

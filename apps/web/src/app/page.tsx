import { auth } from "@/auth/auth";

const Home = async () => {
  const user = await auth();
  console.log("🚀 ~ Home ~ user:", user);
  // return <pre>{JSON.stringify(user, null, 2)}</pre>;
};

export default Home;

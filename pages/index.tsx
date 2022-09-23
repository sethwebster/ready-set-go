import type { NextPage } from "next";
import Head from "next/head";
import StopLights from "../components/StopLights";

const Home: NextPage = () => {
  return (
    <div className="bg-amber-500 h-screen ">
      <Head>
        <title>Ready, Set, Go!</title>
        <meta name="description" content="Test your reaction time!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="w-full mt-20">
        <StopLights />
      </div>
      <footer className="m-auto"></footer>
    </div>
  );
};

export default Home;

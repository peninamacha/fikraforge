"use client";

import dynamic from "next/dynamic";

const AppMain = dynamic(() => import("../components/AppMain"), {
  ssr: false,
});

export default function Home() {
  return <AppMain />;
}

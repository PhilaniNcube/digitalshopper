"use client"

import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { ArrowLeft } from "lucide-react";

const BackButton = () => {

  const router = useRouter();

  return <Button type="button" onClick={() => router.back()} className="rounded-none" > <ArrowLeft />{" "}Back</Button>;
};
export default BackButton;

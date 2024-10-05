import { validateRequest } from "@/lib/util";
import { redirect } from "next/navigation";
import { NewPage } from "./new-page";

export default async function NewNote() {

  if (!(await validateRequest())) {
    redirect("/signin");
  }

  return <NewPage />;
}
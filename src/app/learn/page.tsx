import { redirect } from "next/navigation";

// "Learn" was renamed to "Nano Technology" — keep old links working.
export default function LearnRedirect() {
  redirect("/nano-technology");
}

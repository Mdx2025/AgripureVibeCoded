import { redirect } from "next/navigation";

// "Find your formula" is now the "Order Now" custom-formulation flow.
export default function FindYourFormulaPage() {
  redirect("/order-now");
}

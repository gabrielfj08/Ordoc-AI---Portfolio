import { redirect } from "next/navigation";

export default function RootPage() {
  // Redireciona automaticamente para o dashboard do My Day
  redirect("/my-day");
}
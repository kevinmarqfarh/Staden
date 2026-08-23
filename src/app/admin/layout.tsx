import type { Metadata } from "next";
import "./admin.css";

export const metadata: Metadata = {
  title: "Redaktionen",
  description: "STADENs skyddade redaktionella arbetsyta.",
  robots: {
    index: false,
    follow: false,
    noarchive: true,
  },
};

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return children;
}

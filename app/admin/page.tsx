import type { Metadata } from "next";
import AdminPanel from "./panel";
export const metadata: Metadata = { title: "Szervezői felület", robots: { index: false, follow: false } };
export default function AdminPage() { return <main className="admin-shell"><AdminPanel /></main>; }

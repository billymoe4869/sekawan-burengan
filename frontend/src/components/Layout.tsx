import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="bg-[var(--bg)] text-[var(--ink)]">
      <Navbar />

      <main className="bg-[var(--bg)]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

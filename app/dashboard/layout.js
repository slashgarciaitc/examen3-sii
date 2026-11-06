import Menu from "@/components/Menu";

export default function DashboardLayout({ children }) {
  return (
    <div className="flex flex-1 flex-col">
      <Menu />
      <main className="flex-1 pb-20">{children}</main>
    </div>
  );
}

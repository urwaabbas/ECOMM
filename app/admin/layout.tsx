import AdminSidebar from "@/components/AdminSidebar";
import Providers from "@/components/Providers";
import ShoppingProvider from "@/components/ShoppingProvider";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <ShoppingProvider>
        <div className="flex min-h-screen bg-gray-100">
        
          <div className="hidden md:block">
            <AdminSidebar />
          </div>
          <main className="flex-1 overflow-auto w-full">
            {children}
          </main>
        </div>
      </ShoppingProvider>
    </Providers>
  );
}
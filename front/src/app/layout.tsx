import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import NavBar from "@/components/nav-bar";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <NavBar />
        <main className="max-w-6xl m-auto">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}

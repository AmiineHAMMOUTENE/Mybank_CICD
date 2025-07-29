"use client"
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const NavBar: React.FC = () => {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check authentication status
        const authStatus = localStorage.getItem("isAuthenticated");
        const userData = localStorage.getItem("user");
        
        if (authStatus === "true" && userData) {
            setIsAuthenticated(true);
            setUser(JSON.parse(userData));
        }
    }, [pathname]); // Re-check on route changes

    const getLinkClass = (path: string) => {
        return cn(
            "text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium",
            pathname.startsWith(path) && "text-emerald-400 font-bold"
        );
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
        setUser(null);
        setIsAuthenticated(false);
        router.push("/");
    };

    return (
        <nav className={cn("bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-4 border-b border-slate-700", "shadow-xl")}>
            <div className="container mx-auto flex justify-between items-center max-w-6xl">
                <Link href="/" className="text-white text-2xl font-bold hover:text-emerald-400 transition-colors duration-200" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    MyBank
                </Link>
                
                <div className="flex items-center space-x-6">
                    <Link href="/" className={pathname === "/" ? "text-emerald-400 font-bold" : "text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium"}>
                        Accueil
                    </Link>
                    
                    {/* Afficher ces liens seulement si l'utilisateur est connecté */}
                    {isAuthenticated && (
                        <>
                            <Link href="/categories" className={getLinkClass("/categories")}>
                                Catégories
                            </Link>
                            <Link href="/operations" className={getLinkClass("/operations")}>
                                Opérations
                            </Link>
                            <Link href="/dashboard" className={getLinkClass("/dashboard")}>
                                Dashboard
                            </Link>
                        </>
                    )}
                    
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-3">
                            <span className="text-gray-300 text-sm">
                                Bonjour, {user?.name}
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-200"
                            >
                                Déconnexion
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-3">
                            <Link 
                                href="/login" 
                                className="text-gray-300 hover:text-emerald-400 transition-colors duration-200 font-medium"
                            >
                                Connexion
                            </Link>
                            <Link 
                                href="/register" 
                                className="bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 px-4 py-2 rounded-lg font-semibold hover:from-emerald-500 hover:to-emerald-600 transition-all duration-200"
                                style={{ fontFamily: 'Montserrat, sans-serif' }}
                            >
                                S'inscrire
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default NavBar;

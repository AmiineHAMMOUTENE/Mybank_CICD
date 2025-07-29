"use client"
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");

    if (!isAuthenticated || !userData) {
      router.push("/login");
      return;
    }

    setUser(JSON.parse(userData));
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Tableau de bord
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Déconnexion
          </button>
        </div>
        
        <div className="bg-gradient-to-r from-emerald-50 to-emerald-100 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Bienvenue, {user.name} !
          </h2>
          <p className="text-gray-600">
            Email: {user.email}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Catégories</h3>
            <p className="text-gray-600">Gérez vos catégories de transactions</p>
            <a href="/categories" className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
              Voir les catégories →
            </a>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Opérations</h3>
            <p className="text-gray-600">Consultez vos opérations bancaires</p>
            <a href="/operations" className="inline-block mt-4 text-emerald-600 hover:text-emerald-700 font-medium">
              Voir les opérations →
            </a>
          </div>
          
          <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Profil</h3>
            <p className="text-gray-600">Gérez vos informations personnelles</p>
            <span className="inline-block mt-4 text-gray-400">Bientôt disponible</span>
          </div>
        </div>
      </div>
    </div>
  );
}

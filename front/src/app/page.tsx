"use client"
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const authStatus = localStorage.getItem("isAuthenticated");
    const userData = localStorage.getItem("user");
    
    if (authStatus === "true" && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold mb-6 text-gradient" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            MyBank
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Gérez vos finances personnelles avec simplicité et élégance. 
            Suivez vos opérations, organisez vos catégories et prenez le contrôle de votre budget.
          </p>
          
          {isAuthenticated ? (
            <div className="space-y-6">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-emerald-100">
                <h2 className="text-2xl font-semibold text-gray-800 mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Bon retour, {user?.name} ! 👋
                </h2>
                <p className="text-gray-600 mb-4">
                  Prêt à gérer vos finances aujourd'hui ?
                </p>
                <Link href="/dashboard" className="btn-primary inline-block">
                  Accéder au tableau de bord
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register" className="btn-primary">
                  Commencer gratuitement
                </Link>
                <Link href="/login" className="btn-secondary">
                  Se connecter
                </Link>
              </div>
              <p className="text-sm text-gray-500">
                Déjà plus de 1000+ utilisateurs nous font confiance
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="heading-primary mb-4">
            Pourquoi choisir MyBank ?
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Une solution complète pour gérer vos finances personnelles avec des outils modernes et intuitifs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="card-modern p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="heading-secondary mb-4">Suivi des opérations</h3>
            <p className="text-gray-600">
              Enregistrez et suivez toutes vos transactions bancaires en temps réel avec une interface claire et intuitive.
            </p>
          </div>

          <div className="card-modern p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🏷️</span>
            </div>
            <h3 className="heading-secondary mb-4">Catégories personnalisées</h3>
            <p className="text-gray-600">
              Organisez vos dépenses par catégories personnalisables pour une meilleure visibilité de votre budget.
            </p>
          </div>

          <div className="card-modern p-8 text-center">
            <div className="w-16 h-16 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="heading-secondary mb-4">Sécurité avancée</h3>
            <p className="text-gray-600">
              Vos données sont protégées avec les dernières technologies de sécurité et de chiffrement.
            </p>
          </div>
        </div>
      </div>

      {/* Quick Access Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Accès rapide
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            Explorez dès maintenant les fonctionnalités principales de MyBank
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-md mx-auto">
            <Link 
              href="/categories" 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="text-2xl mb-3">🏷️</div>
              <h3 className="font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                Catégories
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                Gérer vos catégories
              </p>
            </Link>
            
            <Link 
              href="/operations" 
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all duration-200 group"
            >
              <div className="text-2xl mb-3">📊</div>
              <h3 className="font-semibold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                Opérations
              </h3>
              <p className="text-sm text-gray-300 mt-2">
                Voir vos transactions
              </p>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Link from "next/link";

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:8082/api/login", formData);
      
      if (response.data.success) {
        // Store user info in localStorage for local auth
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("isAuthenticated", "true");
        
        // Redirect to dashboard or home
        router.push("/dashboard");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Une erreur est survenue lors de la connexion");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: 'Montserrat, sans-serif' }}>
            Connexion
          </h2>
          <p className="text-gray-300">Accédez à votre compte MyBank</p>
        </div>
        
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                placeholder="votre@email.com"
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent transition-all duration-200"
                placeholder="••••••••"
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-slate-900 font-semibold py-3 px-4 rounded-lg hover:from-emerald-500 hover:to-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>
          
          <div className="mt-6 text-center">
            <p className="text-gray-300">
              Pas encore de compte ?{" "}
              <Link 
                href="/register" 
                className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-200"
              >
                S'inscrire
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from "react";
import { Label, TextInput, Card } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";

export default function LoginUser() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();
  setError(""); 

  try {
    // 1. On connecte l'utilisateur
    const data = await loginUser({ email: email, password: password });
    localStorage.setItem("token", data.access);
    
    // 2. On interroge le backend pour connaître l'état du profil
    // Attention : Vérifie que l'URL correspond bien au chemin de CurrentUserView dans ton urls.py (souvent /api/me/ ou /api/current-user/)
  const response = await fetch("https://flowlance-api.onrender.com/api/users/me/", 
    { method: "GET",
      headers: {
        "Authorization": `Bearer ${data.access}`,
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const userData = await response.json();
      
      // 3. L'aiguillage logique
      if (userData.is_profile_active) {
        navigate("/dashboard");
      } else {
        // Redirige vers la page de création/édition de profil 
        // (Ajuste "/profile" selon le nom de ta vraie route React)
        navigate("/profile"); 
      }
    } else {
      // Par sécurité, si la vérification échoue, on l'envoie sur son profil
      navigate("/profile");
    }

  } catch  {
    setError("Identifiants incorrects ou serveur éteint.");
  }
};

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal p-4">
      <Card className="max-w-lg w-full border-none shadow-2xl bg-navy! p-8">
        <div className="text-center flex flex-col items-center">
          <img src="/logo.png" alt="Logo Flowlance" className="h-32 mb-6 object-contain" />
          <h2 className="text-5xl font-black italic tracking-tighter" style={{ color: '#CE6A6B' }}>
            FLOWLANCE
          </h2>
          <p className="font-medium mt-2 uppercase text-xs tracking-widest" style={{ color: '#BED3C3' }}>
            Espace de connexion
          </p>
        </div>

        <form className="flex flex-col gap-6 mt-8" onSubmit={handleSubmit}>
          {error && <p className="text-coral text-sm font-bold bg-coral/10 p-3 rounded-lg border border-coral/20">{error}</p>}

          <div className="w-full">
            <Label htmlFor="email" className="font-bold mb-2 block" style={{ color: '#BED3C3' }}>Identifiant</Label>
            <TextInput 
              id="email" 
              type="email" 
              placeholder="votre@email.be" 
              sizing="lg"
              className="w-full shadow-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>

          <div className="w-full">
            <Label htmlFor="password" style={{ color: '#BED3C3' }} className="font-bold mb-2 block">Mot de passe</Label>
            <TextInput 
              id="password" 
              type="password" 
              placeholder="********"
              sizing="lg"
              className="w-full shadow-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>

          <button 
            type="submit"
            className="w-full py-5 rounded-xl font-black text-navy text-xl transition-all shadow-lg hover:scale-[1.02] active:scale-95"
            style={{ backgroundColor: '#CE6A6B' }}
          >
            SE CONNECTER
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <Link to="/register" className="font-black text-xl hover:underline" style={{ color: '#CE6A6B' }}>
            Créer un compte
          </Link>
        </div>
      </Card>
    </div>
  );
}
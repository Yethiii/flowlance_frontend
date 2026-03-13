import { useState } from "react";
import { Label, TextInput, Card, Select } from "flowbite-react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../services/api"; // On importe la nouvelle fonction !

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("FREELANCE");
  const [error, setError] = useState(""); // Pour afficher les erreurs Django

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // On nettoie les anciennes erreurs

    try {
      // On envoie les données à Django
      await registerUser({ 
        email: email, 
        password: password, 
        role: role // Vérifie si ton backend attend 'role' ou 'user_type'
      });
      
      // Si ça marche, on le redirige vers le login pour qu'il se connecte !
      // (Ou vers '/dashboard' si ton backend connecte l'utilisateur automatiquement)
      navigate("/login");
    } catch (err) {
      setError(err.message); // Affiche "Cet email existe déjà", etc.
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
            Espace d'inscription
          </p>
        </div>

        {/* On branche la fonction handleSubmit ici */}
        <form className="flex flex-col gap-6 mt-8" onSubmit={handleSubmit}>
          
          {/* Bloc d'affichage d'erreur */}
          {error && <p className="text-coral text-sm font-bold bg-coral/10 p-3 rounded-lg border border-coral/20">{error}</p>}

          <div className="w-full">
            <Label htmlFor="role" className="font-bold mb-2 block" style={{ color: '#BED3C3' }}>Vous êtes ?</Label>
            <Select 
              id="role" 
              className="w-full"
              sizing="lg"
              required 
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ backgroundColor: 'white', color: '#212E53' }}
            >
              {/* Valeurs en majuscules pour correspondre à la base de données Django */}
              <option value="FREELANCE">Freelance</option>
              <option value="COMPANY">Entreprise</option>
            </Select>
          </div>

          <div className="w-full">
            <Label htmlFor="email" className="font-bold mb-2 block" style={{ color: '#BED3C3' }}>Identifiant (Email)</Label>
            <TextInput 
              id="email" 
              type="email" 
              placeholder="votre@email.be" 
              className="w-full"
              sizing="lg"
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
              className="w-full"
              sizing="lg"
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
            CRÉER MON COMPTE
          </button>
        </form>

        <div className="mt-8 text-center border-t border-white/10 pt-6">
          <Link to="/login" className="font-black text-xl hover:underline" style={{ color: '#CE6A6B' }}>
            Se connecter
          </Link>
        </div>
      </Card>
    </div>
  );
}
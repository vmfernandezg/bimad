import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { PlayCircle, LogIn, UserPlus, Loader2 } from 'lucide-react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
        alert("Revisa tu correo para confirmar tu cuenta y luego inicia sesión.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      alert(err.message || 'Error en autenticación');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-pulse delay-75"></div>
      
      <div className="bg-slate-800/50 backdrop-blur-xl border border-slate-700 p-10 rounded-2xl shadow-2xl max-w-md w-full text-center z-10">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-red-500/10 rounded-full">
            <PlayCircle className="w-16 h-16 text-red-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">YouTube Indexer</h1>
        <p className="text-slate-400 mb-6 max-w-sm mx-auto">
          Autentícate para crear tu biblioteca.
        </p>

        <form onSubmit={handleAuth} className="flex flex-col gap-4 text-left">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 focus:border-red-500 focus:outline-none transition-colors text-white" 
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm font-medium text-slate-300 mb-1">Contraseña</label>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-2 focus:border-red-500 focus:outline-none transition-colors text-white" 
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white font-semibold py-3 px-6 rounded-xl transition-all shadow-[0_0_15px_rgba(220,38,38,0.2)] disabled:bg-slate-700"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isSignUp ? <UserPlus className="w-5 h-5" /> : <LogIn className="w-5 h-5" />)}
            {isSignUp ? 'Crear Cuenta' : 'Entrar'}
          </button>
        </form>

        <p className="mt-6 text-sm text-slate-400">
          {isSignUp ? '¿Ya tienes cuenta?' : '¿No tienes cuenta?'}
          <button 
            onClick={() => setIsSignUp(!isSignUp)}
            className="ml-2 text-red-400 hover:text-red-300 font-medium"
          >
            {isSignUp ? 'Inicia Sesión' : 'Regístrate aquí'}
          </button>
        </p>
      </div>
    </div>
  );
}

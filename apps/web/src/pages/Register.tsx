import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro no registo');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen min-h-[100dvh] flex items-center justify-center bg-bet-900 relative overflow-hidden" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-neon-blue/5 via-transparent to-transparent" />
      <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-neon-green/5 rounded-full blur-3xl" />

      <div className="card-bet w-full max-w-md p-8 mx-4 relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neon-blue/10 border border-neon-blue/30 mb-4">
            <span className="text-3xl">🏆</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-white">Criar Conta</span>
          </h1>
          <p className="text-gray-500 text-sm mt-2">Começa com 100 créditos grátis</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-neon-red/10 border border-neon-red/30 text-neon-red p-3 rounded-lg text-sm animate-slide-up">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Nome</label>
            <input
              type="text"
              className="input-bet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="O teu nome"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Email</label>
            <input
              type="email"
              className="input-bet"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="teu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Password</label>
            <input
              type="password"
              className="input-bet"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
              autoComplete="new-password"
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-neon-solid w-full" disabled={loading}>
            {loading ? 'A criar...' : 'Criar Conta'}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          Já tens conta?{' '}
          <Link to="/login" className="text-neon-green hover:underline font-semibold">Entrar</Link>
        </p>
      </div>
    </div>
  );
}

import { useState } from 'react';
import api from '../lib/api';

export default function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('As passwords não coincidem');
      return;
    }

    if (newPassword.length < 6) {
      setError('Nova password deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      await api.post('/users/change-password', { currentPassword, newPassword });
      setSuccess('Password alterada com sucesso!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.response?.data?.error || 'Erro ao alterar password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 animate-fade-in" style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <h1 className="text-2xl font-black">Alterar Password</h1>

      <div className="card-bet p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-neon-red/10 border border-neon-red/30 text-neon-red p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-neon-green/10 border border-neon-green/30 text-neon-green p-3 rounded-lg text-sm">
              {success}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Password Atual</label>
            <input
              type="password"
              className="input-bet"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Nova Password</label>
            <input
              type="password"
              className="input-bet"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-2">Confirmar Nova Password</label>
            <input
              type="password"
              className="input-bet"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button type="submit" className="btn-neon-solid w-full" disabled={loading}>
            {loading ? 'A alterar...' : 'Alterar Password'}
          </button>
        </form>
      </div>
    </div>
  );
}

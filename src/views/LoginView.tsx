import { useAuthController } from '@/controllers/useAuthController'

export function LoginView({ auth }: { auth: ReturnType<typeof useAuthController> }) {
  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Georgia', serif", padding: 20 }}>
      <form onSubmit={auth.handleLogin} style={{ background: '#141414', padding: 40, borderRadius: 16, border: '1px solid #222', width: '100%', maxWidth: 360, boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.5px', color: '#f5c842' }}>ACCÈS CAISSE</div>
          <div style={{ fontSize: 13, color: '#888', marginTop: 8 }}>Veuillez vous identifier pour accéder au système</div>
        </div>
        
        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#aaa', marginBottom: 8 }}>Nom d'utilisateur</label>
          <input type="text" value={auth.username} onChange={e => auth.setUsername(e.target.value)} style={{ width: '100%', background: '#0f0f0f', border: '1px solid #333', borderRadius: 8, padding: '12px', color: '#f5f0e8', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} autoFocus />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 12, color: '#aaa', marginBottom: 8 }}>Mot de passe</label>
          <input type="password" value={auth.password} onChange={e => auth.setPassword(e.target.value)} style={{ width: '100%', background: '#0f0f0f', border: '1px solid #333', borderRadius: 8, padding: '12px', color: '#f5f0e8', fontSize: 14, fontFamily: 'inherit', boxSizing: 'border-box' }} />
        </div>

        {auth.loginError && <div style={{ color: '#ef4444', fontSize: 13, marginBottom: 16, textAlign: 'center', background: 'rgba(239,68,68,0.1)', padding: '8px', borderRadius: 6 }}>{auth.loginError}</div>}

        <button type="submit" style={{ width: '100%', padding: '14px', background: '#f5c842', color: '#0f0f0f', border: 'none', borderRadius: 8, fontSize: 15, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit' }}>
          Se connecter
        </button>
      </form>
    </div>
  )
}

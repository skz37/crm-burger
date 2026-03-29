'use client'

import { useAuthController } from '@/controllers/useAuthController'
import { useCaisseController } from '@/controllers/useCaisseController'
import { LoginView } from '@/views/LoginView'
import { MenuSection } from '@/views/caisse/MenuSection'
import { CartSection } from '@/views/caisse/CartSection'
import { HistoriqueSection } from '@/views/caisse/HistoriqueSection'
import { RapportSection } from '@/views/RapportSection'

export default function CRMBurger() {
  const auth = useAuthController()
  const caisse = useCaisseController()

  if (auth.isCheckingAuth) return null

  if (!auth.isAuthenticated) {
    return <LoginView auth={auth} />
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f0f0f', color: '#f5f0e8', fontFamily: "'Georgia', serif" }}>
      {/* Header */}
      <div style={{ background: '#1a1a1a', borderBottom: '1px solid #2a2a2a', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.5px', color: '#f5c842' }}>BURGER CRM</div>
            <button onClick={auth.handleLogout} style={{ background: '#222', border: '1px solid #333', padding: '6px 12px', borderRadius: 6, color: '#888', fontSize: 12, cursor: 'pointer', fontFamily: 'inherit' }}>Déconnexion</button>
          </div>
          <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>{new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</div>
        </div>
        {caisse.rapportJour && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 700, color: '#4ade80' }}>{Number(caisse.rapportJour.chiffre_affaires).toFixed(2)} MAD</div>
            <div style={{ fontSize: 12, color: '#888' }}>{caisse.rapportJour.nb_commandes} commandes aujourd'hui</div>
          </div>
        )}
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', borderBottom: '1px solid #2a2a2a', background: '#141414' }}>
        {(['commande', 'historique', 'rapport'] as const).map(o => (
          <button key={o} onClick={() => caisse.setOnglet(o)} style={{
            padding: '12px 24px', border: 'none', background: 'none', cursor: 'pointer',
            color: caisse.onglet === o ? '#f5c842' : '#888',
            borderBottom: caisse.onglet === o ? '2px solid #f5c842' : '2px solid transparent',
            fontSize: 13, fontFamily: 'inherit', textTransform: 'capitalize', fontWeight: 500
          }}>
            {o === 'commande' ? 'Nouvelle commande' : o === 'historique' ? 'Commandes du jour' : 'Rapport du jour'}
          </button>
        ))}
      </div>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '24px 16px' }}>
        {caisse.onglet === 'commande' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: 24 }}>
            <MenuSection caisse={caisse} />
            <CartSection caisse={caisse} />
          </div>
        )}

        {caisse.onglet === 'historique' && (
          <HistoriqueSection caisse={caisse} />
        )}

        {caisse.onglet === 'rapport' && (
          <RapportSection 
            typeRapport={caisse.typeRapport} 
            setTypeRapport={caisse.setTypeRapport} 
            rapportAffiche={caisse.rapportAffiche} 
          />
        )}
      </div>
    </div>
  )
}

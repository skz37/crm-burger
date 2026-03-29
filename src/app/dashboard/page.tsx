'use client'

import { useDashboardController } from '@/controllers/useDashboardController'
import { RapportSection } from '@/views/RapportSection'
import { DashboardCommandes } from '@/views/dashboard/DashboardCommandes'

export default function Dashboard() {
  const dash = useDashboardController()

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#f5f0e8', fontFamily: "'Georgia', serif", padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32, borderBottom: '1px solid #222', paddingBottom: 16 }}>
        <div>
          <h1 style={{ fontSize: 28, color: '#f5c842', margin: 0 }}>Tableau de Bord Propriétaire</h1>
          <p style={{ color: '#888', margin: '4px 0 0 0', fontSize: 14 }}>
            Aujourd'hui{dash.mounted ? `, ${new Date().toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}` : ''}
          </p>
        </div>
        <div style={{ textAlign: 'right', fontSize: 12, color: '#555' }}>
          Dernière mise à jour : {dash.mounted ? dash.lastUpdate.toLocaleTimeString('fr-FR') : '...'}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: 40, alignItems: 'start' }}>
        <div>
          <div style={{ paddingBottom: 8, marginBottom: 16 }}>
            <h2 style={{ fontSize: 18, borderBottom: '2px solid #333', paddingBottom: 8, color: '#aaa', letterSpacing: '0.05em', margin: 0 }}>RÉSUMÉ RAPPORT</h2>
          </div>
          <RapportSection 
            typeRapport={dash.typeRapport} 
            setTypeRapport={dash.setTypeRapport} 
            rapportAffiche={dash.rapportAffiche} 
          />
        </div>

        <div>
           <DashboardCommandes commandes={dash.commandes} />
        </div>
      </div>
    </div>
  )
}

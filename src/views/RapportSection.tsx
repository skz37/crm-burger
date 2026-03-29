import { RapportJournalier } from '@/models/types'

type RapportSectionProps = {
  typeRapport: 'jour' | 'semaine' | 'mois'
  setTypeRapport: (t: 'jour' | 'semaine' | 'mois') => void
  rapportAffiche: RapportJournalier | null
}

export function RapportSection({ typeRapport, setTypeRapport, rapportAffiche }: RapportSectionProps) {
  return (
    <div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
        {(['jour', 'semaine', 'mois'] as const).map(t => (
          <button key={t} onClick={() => setTypeRapport(t)} style={{
            padding: '8px 16px', borderRadius: 20, border: '1px solid',
            background: typeRapport === t ? '#f5c842' : 'transparent',
            borderColor: typeRapport === t ? '#f5c842' : '#333',
            color: typeRapport === t ? '#0f0f0f' : '#888',
            cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', textTransform: 'capitalize', fontWeight: 500
          }}>
            {t === 'jour' ? "Aujourd'hui" : t === 'semaine' ? 'Cette Semaine' : 'Ce Mois'}
          </button>
        ))}
      </div>
      
      {rapportAffiche ? (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
            {[
              { label: "Chiffre d'affaires", valeur: `${Number(rapportAffiche.chiffre_affaires).toFixed(2)} MAD`, couleur: '#4ade80' },
              { label: "Commandes payées", valeur: rapportAffiche.nb_commandes, couleur: '#f5c842' },
              { label: "Espèces", valeur: `${Number(rapportAffiche.total_especes).toFixed(2)} MAD`, couleur: '#f5f0e8' },
              { label: "Carte", valeur: `${Number(rapportAffiche.total_carte).toFixed(2)} MAD`, couleur: '#f5f0e8' },
              { label: "Annulations", valeur: rapportAffiche.nb_annulations, couleur: '#ef4444' },
            ].map(s => (
              <div key={s.label} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 10, padding: '16px 20px' }}>
                <div style={{ fontSize: 12, color: '#555', marginBottom: 8, letterSpacing: '0.05em' }}>{s.label.toUpperCase()}</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: s.couleur }}>{s.valeur}</div>
              </div>
            ))}
          </div>
          {/* Répartition paiements */}
          {Number(rapportAffiche.chiffre_affaires) > 0 && (
            <div style={{ background: '#1a1a1a', borderRadius: 10, border: '1px solid #2a2a2a', padding: 20 }}>
              <div style={{ fontSize: 12, color: '#555', marginBottom: 12, letterSpacing: '0.05em' }}>RÉPARTITION PAIEMENTS</div>
              {[
                { label: 'Espèces', val: Number(rapportAffiche.total_especes), color: '#f5c842' },
                { label: 'Carte', val: Number(rapportAffiche.total_carte), color: '#60a5fa' },
              ].map(r => {
                const pct = Number(rapportAffiche.chiffre_affaires) > 0 ? Math.round(r.val / Number(rapportAffiche.chiffre_affaires) * 100) : 0
                return (
                  <div key={r.label} style={{ marginBottom: 12 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6, fontSize: 13 }}>
                      <span style={{ color: '#888' }}>{r.label}</span>
                      <span style={{ color: r.color }}>{r.val.toFixed(2)} MAD ({pct}%)</span>
                    </div>
                    <div style={{ height: 6, background: '#222', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: r.color, borderRadius: 3, transition: 'width 0.5s' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>Aucune donnée pour la période sélectionnée</div>
      )}
    </div>
  )
}

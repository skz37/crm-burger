import { useCaisseController } from '@/controllers/useCaisseController'

export function HistoriqueSection({ caisse }: { caisse: ReturnType<typeof useCaisseController> }) {
  const { commandes, annulerCommande } = caisse

  return (
    <div>
      <div style={{ fontSize: 14, color: '#888', marginBottom: 16 }}>{commandes.length} commande(s) aujourd'hui</div>
      {commandes.length === 0 ? (
        <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>Aucune commande pour aujourd'hui</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {commandes.map((c: any) => (
            <div key={c.id} style={{
              background: '#1a1a1a', borderRadius: 10, border: '1px solid #2a2a2a', padding: '14px 18px',
              opacity: c.statut === 'annulee' ? 0.5 : 1
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>#{c.numero_commande}</span>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500,
                      background: c.statut === 'payee' ? 'rgba(74,222,128,0.1)' : c.statut === 'annulee' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
                      color: c.statut === 'payee' ? '#4ade80' : c.statut === 'annulee' ? '#ef4444' : '#fbbf24'
                    }}>{c.statut}</span>
                    <span style={{ fontSize: 11, color: '#555', background: '#222', padding: '2px 8px', borderRadius: 20 }}>{c.mode_paiement}</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#555', marginTop: 4 }}>
                    {new Date(c.heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    {(c.nom_client || c.telephone) && (
                      <span style={{ marginLeft: 8, color: '#aaa' }}>
                        — Client : {c.nom_client || 'N/A'} {c.telephone ? `(${c.telephone})` : ''}
                      </span>
                    )}
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <span style={{ fontSize: 18, fontWeight: 700, color: '#f5c842' }}>{Number(c.total).toFixed(2)} MAD</span>
                  {c.statut === 'payee' && (
                    <button onClick={() => annulerCommande(c.id)} style={{
                      padding: '4px 12px', border: '1px solid #333', borderRadius: 6, background: 'transparent',
                      color: '#ef4444', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit'
                    }}>Annuler</button>
                  )}
                </div>
              </div>
              {c.commande_articles && c.commande_articles.length > 0 && (
                <div style={{ marginTop: 10, fontSize: 12, color: '#666', borderTop: '1px solid #222', paddingTop: 8 }}>
                  {c.commande_articles.map((l: any) => (
                    <span key={l.id} style={{ marginRight: 12 }}>{l.quantite}× {l.nom_article}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

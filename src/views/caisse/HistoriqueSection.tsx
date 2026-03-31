import { useCaisseController } from '@/controllers/useCaisseController'
import { Commande, CommandeArticle } from '@/models/types'

type CommandeFull = Commande & { commande_articles?: CommandeArticle[] }

export function HistoriqueSection({ caisse }: { caisse: ReturnType<typeof useCaisseController> }) {
  const { commandes, annulerCommande, marquerPrete } = caisse

  return (
    <div>
      <div className="stack-mobile" style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
        <div style={{ flex: 1, background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, padding: '12px 14px', width: '100%' }}>
          <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>JOURNÉE</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#f5c842' }}>{Number(caisse.totalJournalier).toFixed(2)}</div>
        </div>
        <div style={{ flex: 1, background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, padding: '12px 14px', borderLeft: '3px solid #fbbf24', width: '100%' }}>
          <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>À PRÉPARER</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fbbf24' }}>
            {commandes.filter(c => c.statut === 'payee').reduce((acc, c) => acc + Number(c.total), 0).toFixed(2)}
          </div>
        </div>
        <div style={{ flex: 1, background: '#1a1a1a', border: '1px solid #222', borderRadius: 12, padding: '12px 14px', borderLeft: '3px solid #4ade80', width: '100%' }}>
          <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', fontWeight: 600 }}>PRÊTES</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#4ade80' }}>
            {commandes.filter(c => c.statut === 'prete').reduce((acc, c) => acc + Number(c.total), 0).toFixed(2)}
          </div>
        </div>
      </div>

      {commandes.length === 0 ? (
        <div style={{ color: '#444', textAlign: 'center', padding: 40 }}>Aucune commande pour aujourd'hui</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {commandes.map((c: CommandeFull) => (
            <div key={c.id} style={{
              background: '#1a1a1a', borderRadius: 10, border: '1px solid #2a2a2a', padding: '14px 18px',
              opacity: (c.statut === 'annulee' || c.statut === 'prete') ? 0.6 : 1,
              borderLeft: c.statut === 'prete' ? '4px solid #4ade80' : '1px solid #2a2a2a',
              marginBottom: 10
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span style={{ fontWeight: 700, fontSize: 15 }}>#{c.numero_commande}</span>
                    <span style={{
                      fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500,
                      background: (c.statut === 'payee' || c.statut === 'prete') ? 'rgba(74,222,128,0.1)' : c.statut === 'annulee' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
                      color: (c.statut === 'payee' || c.statut === 'prete') ? '#4ade80' : c.statut === 'annulee' ? '#ef4444' : '#fbbf24'
                    }}>{c.statut === 'prete' ? 'PRÊTE' : c.statut.toUpperCase()}</span>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {c.statut === 'payee' && (
                      <>
                        <button onClick={() => marquerPrete(c.id)} style={{
                          padding: '6px 16px', border: 'none', borderRadius: 6, background: '#4ade80',
                          color: '#0f0f0f', cursor: 'pointer', fontSize: 13, fontWeight: 700, fontFamily: 'inherit'
                        }}>Prête ✓</button>
                        <button onClick={() => annulerCommande(c.id)} style={{
                          padding: '6px 12px', border: '1px solid #333', borderRadius: 6, background: 'transparent',
                          color: '#ef4444', cursor: 'pointer', fontSize: 12, fontFamily: 'inherit'
                        }}>Annuler</button>
                      </>
                    )}
                    {c.statut === 'prete' && (
                       <span style={{ fontSize: 12, color: '#4ade80', fontWeight: 600 }}>Prête à servir</span>
                    )}
                  </div>
                </div>
              </div>
              {c.commande_articles && c.commande_articles.length > 0 && (
                <div style={{ marginTop: 12, borderTop: '1px solid #222', paddingTop: 10 }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {c.commande_articles.map((l: CommandeArticle) => (
                      <div key={l.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <div style={{
                          background: '#333', border: '1px solid #444', color: '#f5c842', 
                          fontWeight: 800, fontSize: 13, minWidth: 32, height: 32, 
                          display: 'flex', alignItems: 'center', justifyContent: 'center', 
                          borderRadius: 6, flexShrink: 0
                        }}>
                          {l.quantite}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f0e8' }}>
                            {l.nom_article.split(' (')[0]}
                          </div>
                          {l.nom_article.includes(' (') && (
                            <div style={{ 
                              fontSize: 12, color: '#fbbf24', fontWeight: 600, 
                              marginTop: 2, background: 'rgba(251,191,36,0.1)', 
                              padding: '2px 6px', borderRadius: 4, width: 'fit-content' 
                            }}>
                              {l.nom_article.split(' (')[1].replace(')', '')}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {c.note && (
                <div style={{ 
                  marginTop: 12, background: 'rgba(245, 200, 66, 0.05)', 
                  border: '1px dashed rgba(245, 200, 66, 0.3)', borderRadius: 8, padding: '10px 14px' 
                }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', color: '#f5c842', fontWeight: 700, marginBottom: 4, letterSpacing: '0.5px' }}>Note cuisine</div>
                  <div style={{ fontSize: 13, color: '#f5f0e8', fontStyle: 'italic' }}>"{c.note}"</div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

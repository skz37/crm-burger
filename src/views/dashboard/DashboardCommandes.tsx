import { Commande, CommandeArticle } from '@/models/types'

type CommandeFull = Commande & { commande_articles?: CommandeArticle[] }

type DashboardCommandesProps = {
  commandes: CommandeFull[]
}

export function DashboardCommandes({ commandes }: DashboardCommandesProps) {
  return (
    <div>
      <h2 style={{ fontSize: 18, borderBottom: '2px solid #333', paddingBottom: 8, marginBottom: 16, color: '#aaa', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
        <span>DERNIÈRES COMMANDES</span>
        <span style={{ fontSize: 12, background: '#222', padding: '2px 10px', borderRadius: 20, color: '#f5c842' }}>{commandes.length}</span>
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxHeight: 'calc(100vh - 160px)', overflowY: 'auto', paddingRight: 8 }}>
        {commandes.length === 0 ? (
            <div style={{ padding: 60, textAlign: 'center', color: '#555', background: '#111', borderRadius: 12, border: '1px dashed #333' }}>
              Aucune commande reçue aujourd'hui
            </div>
        ) : (
          commandes.map((c: CommandeFull) => (
            <div key={c.id} style={{
              background: '#141414', borderRadius: 12, border: '1px solid #2a2a2a', padding: '20px',
              opacity: c.statut === 'annulee' ? 0.6 : 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              transition: 'border-color 0.2s'
            }} onMouseEnter={e => (e.currentTarget.style.borderColor = '#444')} onMouseLeave={e => (e.currentTarget.style.borderColor = '#2a2a2a')}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 18, color: '#fff' }}>#{c.numero_commande}</span>
                  <span style={{ fontSize: 13, color: '#888' }}>{new Date(c.heure).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}</span>
                  <span style={{
                    fontSize: 11, padding: '4px 10px', borderRadius: 20, fontWeight: 500, letterSpacing: '0.05em', textTransform: 'uppercase',
                    background: c.statut === 'payee' ? 'rgba(74,222,128,0.1)' : c.statut === 'annulee' ? 'rgba(239,68,68,0.1)' : 'rgba(251,191,36,0.1)',
                    color: c.statut === 'payee' ? '4ade80' : c.statut === 'annulee' ? '#ef4444' : '#fbbf24'
                  }}>{c.statut}</span>
                </div>
                {c.commande_articles && c.commande_articles.length > 0 && (
                  <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.5, maxWidth: '500px' }}>
                    {c.commande_articles.map((l: CommandeArticle) => `${l.quantite}x ${l.nom_article}`).join(', ')}
                  </div>
                )}
                {(c.nom_client || c.telephone || c.note) && (
                  <div style={{ fontSize: 12, color: '#666', marginTop: 8, padding: '8px 12px', background: '#1a1a1a', borderRadius: 6, display: 'inline-block' }}>
                    {c.nom_client ? <><span style={{ color: '#888' }}>Client:</span> <span style={{ color: '#ddd' }}>{c.nom_client}</span></> : ''}
                    {c.telephone ? ` (${c.telephone})` : ''}
                    {c.note ? <span style={{ marginLeft: 12, color: '#f5c842' }}>Note: {c.note}</span> : ''}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', minWidth: '100px' }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: '#f5c842', marginBottom: 6 }}>{Number(c.total).toFixed(2)}</div>
                <div style={{ fontSize: 11, color: '#555', background: '#222', padding: '4px 10px', borderRadius: 20, display: 'inline-block', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{c.mode_paiement}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

import { useCaisseController } from '@/controllers/useCaisseController'

export function CartSection({ caisse }: { caisse: ReturnType<typeof useCaisseController> }) {
  const { 
    lignes, retirerArticle, ajouterArticle, total, modePaiement, setModePaiement,
    nomClient, setNomClient, telephone, setTelephone, note, setNote, msg, 
    setLignes, validerCommande, loading
  } = caisse

  return (
    <div style={{ background: '#1a1a1a', borderRadius: 12, border: '1px solid #2a2a2a', padding: 20, height: 'fit-content' }}>
      <div style={{ fontSize: 14, fontWeight: 500, color: '#888', marginBottom: 16, letterSpacing: '0.05em' }}>COMMANDE EN COURS</div>

      {lignes.length === 0 ? (
        <div style={{ color: '#444', fontSize: 13, textAlign: 'center', padding: '32px 0' }}>Cliquez sur un article pour l'ajouter</div>
      ) : (
        <div style={{ marginBottom: 16 }}>
          {lignes.map(l => (
            <div key={`${l.article.id}-${l.article.nom}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #222' }}>
              <div>
                <div style={{ fontSize: 13, color: '#f5f0e8' }}>{l.article.nom}</div>
                <div style={{ fontSize: 12, color: '#666' }}>{l.article.prix.toFixed(2)} MAD × {l.quantite}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={() => retirerArticle(l.article.id, l.article.nom)} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #333', background: '#111', color: '#f5f0e8', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                <span style={{ fontSize: 14, minWidth: 16, textAlign: 'center' }}>{l.quantite}</span>
                <button onClick={() => ajouterArticle(l.article, true)} style={{ width: 24, height: 24, borderRadius: 6, border: '1px solid #333', background: '#111', color: '#f5f0e8', cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                <span style={{ fontSize: 14, color: '#f5c842', minWidth: 52, textAlign: 'right' }}>{(l.article.prix * l.quantite).toFixed(2)} MAD</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderTop: '1px solid #333', marginBottom: 16 }}>
        <span style={{ fontSize: 16, fontWeight: 500 }}>Total</span>
        <span style={{ fontSize: 20, fontWeight: 700, color: '#f5c842' }}>{total.toFixed(2)} MAD</span>
      </div>

      {/* Mode paiement */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 12 }}>
        {(['especes', 'carte'] as const).map(m => (
          <button key={m} onClick={() => setModePaiement(m)} style={{
            padding: '10px', border: '1px solid',
            borderColor: modePaiement === m ? '#f5c842' : '#333',
            borderRadius: 8, background: modePaiement === m ? 'rgba(245,200,66,0.1)' : 'transparent',
            color: modePaiement === m ? '#f5c842' : '#666', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit'
          }}>{m === 'especes' ? 'Espèces' : 'Carte'}</button>
        ))}
      </div>

      {/* Client Info */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 8, marginBottom: 12 }}>
        <input type="text" value={nomClient} onChange={e => setNomClient(e.target.value)} placeholder="Nom du client (requis)" style={{
          width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 8,
          color: '#f5f0e8', padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box'
        }} />
        <input type="tel" value={telephone} onChange={e => setTelephone(e.target.value)} placeholder="Téléphone (requis)" style={{
          width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 8,
          color: '#f5f0e8', padding: '8px 12px', fontSize: 13, fontFamily: 'inherit', boxSizing: 'border-box'
        }} />
      </div>

      {/* Note */}
      <textarea value={note} onChange={e => setNote(e.target.value)} placeholder="Note (optionnel)" rows={2} style={{
        width: '100%', background: '#111', border: '1px solid #2a2a2a', borderRadius: 8,
        color: '#f5f0e8', padding: '8px 12px', fontSize: 13, resize: 'none', marginBottom: 12,
        fontFamily: 'inherit', boxSizing: 'border-box'
      }} />

      {msg && <div style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid #4ade80', borderRadius: 8, padding: '8px 12px', color: '#4ade80', fontSize: 13, marginBottom: 12 }}>{msg}</div>}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        <button onClick={() => setLignes([])} style={{
          padding: '12px', border: '1px solid #333', borderRadius: 8, background: 'transparent',
          color: '#888', cursor: 'pointer', fontSize: 14, fontFamily: 'inherit'
        }}>Vider</button>
        <button onClick={validerCommande} disabled={loading || lignes.length === 0 || nomClient.trim() === '' || telephone.trim() === ''} style={{
          padding: '12px', border: 'none', borderRadius: 8, background: (lignes.length === 0 || nomClient.trim() === '' || telephone.trim() === '') ? '#2a2a2a' : '#f5c842',
          color: (lignes.length === 0 || nomClient.trim() === '' || telephone.trim() === '') ? '#555' : '#0f0f0f', cursor: (lignes.length === 0 || nomClient.trim() === '' || telephone.trim() === '') ? 'not-allowed' : 'pointer',
          fontSize: 14, fontWeight: 700, fontFamily: 'inherit'
        }}>{loading ? '...' : 'Valider'}</button>
      </div>
    </div>
  )
}

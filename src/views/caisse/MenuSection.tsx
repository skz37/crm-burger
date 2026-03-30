import { useCaisseController } from '@/controllers/useCaisseController'
import { Article } from '@/models/types'

export function MenuSection({ caisse }: { caisse: ReturnType<typeof useCaisseController> }) {
  const { categories, categorieActive, setCategorieActive, optionsBurger, setOptionsBurger, articlesFiltres, ajouterArticle } = caisse

  return (
    <div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => {
            setCategorieActive(cat);
            caisse.setPendingBurger(null);
            caisse.setOptionsBurger([]);
          }} style={{
            padding: '6px 16px', border: '1px solid', borderRadius: 20,
            background: categorieActive === cat ? '#f5c842' : 'transparent',
            borderColor: categorieActive === cat ? '#f5c842' : '#333',
            color: categorieActive === cat ? '#0f0f0f' : '#888',
            cursor: 'pointer', fontSize: 13, fontFamily: 'inherit', textTransform: 'capitalize', fontWeight: 500
          }}>{cat}</button>
        ))}
      </div>
      
      {categorieActive === 'burger' && (
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap', padding: '12px', background: '#1a1a1a', borderRadius: 8, border: '1px solid #2a2a2a', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, flex: 1 }}>
            <div style={{ width: '100%', fontSize: 11, color: '#f5c842', marginBottom: 4, fontWeight: 600, letterSpacing: '0.05em' }}>
              {caisse.pendingBurger ? `PERSONNALISATION : ${caisse.pendingBurger.nom.toUpperCase()}` : 'CHOISISSEZ UN BURGER D\'ABORD'}
            </div>
            {['Sans cheddar', 'Sans salade', 'Sans cornichon', 'Sans sauce sherif'].map(opt => (
              <button key={opt} 
                disabled={!caisse.pendingBurger}
                onClick={() => setOptionsBurger(prev => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt])} 
                style={{
                  padding: '6px 14px', borderRadius: 16, border: '1px solid',
                  background: optionsBurger.includes(opt) ? '#ef4444' : 'transparent',
                  borderColor: optionsBurger.includes(opt) ? '#ef4444' : '#333',
                  color: !caisse.pendingBurger ? '#333' : (optionsBurger.includes(opt) ? '#fff' : '#aaa'),
                  cursor: !caisse.pendingBurger ? 'not-allowed' : 'pointer', 
                  fontSize: 12, fontFamily: 'inherit', fontWeight: 500, transition: 'all 0.2s'
                }}>
                {opt}
              </button>
            ))}
          </div>

          {caisse.pendingBurger && (
            <button 
              onClick={() => caisse.confirmerPendingBurger()}
              style={{
                padding: '10px 20px', background: '#f5c842', color: '#0f0f0f', border: 'none', borderRadius: 8,
                fontSize: 13, fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(245,200,66,0.2)'
              }}>
              VALIDER +
            </button>
          )}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
        {articlesFiltres.map((a: Article) => {
          const isPending = caisse.pendingBurger?.id === a.id;
          return (
            <button key={a.id} onClick={() => ajouterArticle(a)} style={{
              background: isPending ? 'rgba(245,200,66,0.05)' : '#1a1a1a', 
              border: '1px solid',
              borderColor: isPending ? '#f5c842' : '#2a2a2a', 
              borderRadius: 10,
              padding: '14px 12px', cursor: 'pointer', textAlign: 'left',
              transition: 'all 0.2s', fontFamily: 'inherit',
              position: 'relative',
              overflow: 'hidden'
            }}>
              {isPending && (
                <div style={{ position: 'absolute', top: 0, right: 0, background: '#f5c842', color: '#000', fontSize: 9, padding: '2px 6px', fontWeight: 800 }}>SÉLECTIONNÉ</div>
              )}
              <div style={{ fontSize: 14, fontWeight: 600, color: isPending ? '#f5c842' : '#f5f0e8', marginBottom: 6 }}>{a.nom}</div>
              {a.description && <div style={{ fontSize: 11, color: '#888', marginBottom: 8, lineHeight: 1.3 }}>{a.description}</div>}
              <div style={{ fontSize: 16, color: '#f5c842', fontWeight: 700 }}>{a.prix.toFixed(2)} MAD</div>
            </button>
          );
        })}
      </div>
      
      {categories.length > 1 && !caisse.pendingBurger && (
        <div style={{ marginTop: 24, paddingBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <button onClick={() => {
            const idx = categories.indexOf(categorieActive);
            setCategorieActive(categories[(idx + 1) % categories.length]);
          }} style={{
            padding: '12px 32px', border: 'none', borderRadius: 24,
            background: '#222', color: '#f5f0e8', borderTop: '1px solid #333',
            cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', fontWeight: 600,
            boxShadow: '0 4px 12px rgba(0,0,0,0.5)', transition: 'background 0.2s'
          }} onMouseEnter={e => (e.currentTarget.style.background = '#333')}
             onMouseLeave={e => (e.currentTarget.style.background = '#222')}>
            Continuer vers : <span style={{ color: '#f5c842', textTransform: 'capitalize' }}>{categories[(categories.indexOf(categorieActive) + 1) % categories.length]}</span> ➔
          </button>
        </div>
      )}
    </div>
  )
}

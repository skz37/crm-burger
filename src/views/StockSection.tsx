import { useCaisseController } from '@/controllers/useCaisseController'
import { Article } from '@/models/types'

export function StockSection({ caisse }: { caisse: ReturnType<typeof useCaisseController> }) {
  const { categories, categorieActive, setCategorieActive, articlesFiltres, modifierStockArticle } = caisse

  return (
    <div style={{ background: '#1a1a1a', borderRadius: 12, border: '1px solid #2a2a2a', padding: 20 }}>
      <h2 style={{ fontSize: 20, color: '#f5c842', marginBottom: 20, marginTop: 0 }}>Gestion du Stock</h2>

      <div className="scroll-x" style={{ marginBottom: 24 }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategorieActive(cat)} style={{
            padding: '8px 20px', border: '1px solid', borderRadius: 20,
            background: categorieActive === cat ? '#f5c842' : 'transparent',
            borderColor: categorieActive === cat ? '#f5c842' : '#333',
            color: categorieActive === cat ? '#0f0f0f' : '#888',
            cursor: 'pointer', fontSize: 14, fontFamily: 'inherit', textTransform: 'capitalize', fontWeight: 600,
            whiteSpace: 'nowrap', marginRight: 10
          }}>{cat}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', padding: '0 16px 8px', borderBottom: '1px solid #333', color: '#888', fontSize: 12, textTransform: 'uppercase', fontWeight: 600 }}>
          <div>Article</div>
          <div style={{ textAlign: 'center' }}>Stock actuel</div>
          <div style={{ textAlign: 'right' }}>Actions</div>
        </div>

        {articlesFiltres.map((a: Article) => (
          <div key={a.id} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', alignItems: 'center', padding: '16px', background: '#222', borderRadius: 8, border: '1px solid #333' }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#f5f0e8' }}>{a.nom}</div>
              <div style={{ fontSize: 12, color: '#f5c842', marginTop: 4 }}>{a.prix.toFixed(2)} MAD</div>
            </div>

            <div style={{ textAlign: 'center', fontSize: 18, fontWeight: 700, color: (a.stock || 0) <= 5 ? '#ef4444' : '#4ade80' }}>
              {a.stock || 0}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button
                onClick={() => modifierStockArticle(a.id, Math.max(0, (a.stock || 0) - 1))}
                style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#333', color: '#f5f0e8', cursor: 'pointer', fontSize: 18, fontWeight: 'bold' }}
              >
                -
              </button>
              <button
                onClick={() => modifierStockArticle(a.id, (a.stock || 0) + 1)}
                style={{ width: 36, height: 36, borderRadius: 8, border: 'none', background: '#333', color: '#f5f0e8', cursor: 'pointer', fontSize: 18, fontWeight: 'bold' }}
              >
                +
              </button>
              <button
                onClick={() => {
                  const val = window.prompt(`Nouveau stock pour ${a.nom} :`, String(a.stock || 0));
                  if (val !== null && !isNaN(Number(val))) {
                    modifierStockArticle(a.id, Math.max(0, Number(val)));
                  }
                }}
                style={{ padding: '0 12px', height: 36, borderRadius: 8, border: '1px solid #444', background: 'transparent', color: '#aaa', cursor: 'pointer', fontSize: 13 }}
              >
                Éditer
              </button>
            </div>
          </div>
        ))}

        {articlesFiltres.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            Aucun article dans cette catégorie.
          </div>
        )}
      </div>
    </div>
  )
}

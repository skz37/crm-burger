import { useState, useEffect } from 'react'
import { Article, Commande, CommandeArticle, RapportJournalier, LigneCommande } from '@/models/types'
import { ArticleService, CommandeService, RapportService } from '@/models/services'

export function useCaisseController() {
  const [articles, setArticles] = useState<Article[]>([])
  const [lignes, setLignes] = useState<LigneCommande[]>([])
  const [modePaiement, setModePaiement] = useState<'especes' | 'carte'>('especes')
  const [note, setNote] = useState('')
  const [nomClient, setNomClient] = useState('')
  const [telephone, setTelephone] = useState('')
  const [commandes, setCommandes] = useState<(Commande & { commande_articles?: CommandeArticle[] })[]>([])
  const [rapportsData, setRapportsData] = useState<RapportJournalier[]>([])
  const [typeRapport, setTypeRapport] = useState<'jour' | 'semaine' | 'mois'>('jour')
  const [loading, setLoading] = useState(false)
  const [onglet, setOnglet] = useState<'commande' | 'historique' | 'rapport'>('commande')
  const [categorieActive, setCategorieActive] = useState('burger')
  const [msg, setMsg] = useState('')
  const [optionsBurger, setOptionsBurger] = useState<string[]>([])
  const [pendingBurger, setPendingBurger] = useState<Article | null>(null)

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    chargerArticles()
    chargerCommandes()
    chargerRapport()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function chargerArticles() {
    const data = await ArticleService.getAll()
    if (data) setArticles(data)
  }

  async function chargerCommandes() {
    const data = await CommandeService.getByDate(today)
    if (data) setCommandes(data)
  }

  async function chargerRapport() {
    const d = new Date()
    const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
    const dt = new Date(d)
    const day = dt.getDay() || 7
    dt.setDate(dt.getDate() - (day - 1))
    const firstDayOfWeek = dt.toISOString().split('T')[0]
    const earliestDate = firstDayOfWeek < firstDayOfMonth ? firstDayOfWeek : firstDayOfMonth

    const data = await RapportService.getDepuis(earliestDate)
    if (data) setRapportsData(data)
  }

  function ajouterArticle(article: Article, fromCart = false) {
    if (!fromCart && article.categorie === 'burger') {
      setPendingBurger(article)
      setOptionsBurger([]) // Reset options when a new burger is clicked
      return
    }

    const articleAjouter = { ...article }
    if (!fromCart && article.categorie === 'burger' && optionsBurger.length > 0) {
      const optionsSuffix = ` (${optionsBurger.join(', ')})`
      articleAjouter.id = `${article.id}-${optionsBurger.join('-')}`
      articleAjouter.nom = `${article.nom}${optionsSuffix}`
    }

    setLignes(prev => {
      const existant = prev.find(l => l.article.id === articleAjouter.id)
      if (existant) return prev.map(l => l.article.id === articleAjouter.id ? { ...l, quantite: l.quantite + 1 } : l)
      return [...prev, { article: articleAjouter, quantite: 1 }]
    })

    if (!fromCart && article.categorie === 'burger' && optionsBurger.length > 0) {
      setOptionsBurger([])
      setPendingBurger(null)
    }
  }

  function confirmerPendingBurger() {
    if (!pendingBurger) return
    
    const articleAjouter = { ...pendingBurger }
    if (optionsBurger.length > 0) {
      const optionsSuffix = ` (${optionsBurger.join(', ')})`
      articleAjouter.id = `${pendingBurger.id}-${optionsBurger.join('-')}`
      articleAjouter.nom = `${pendingBurger.nom}${optionsSuffix}`
    }

    setLignes(prev => {
      const existant = prev.find(l => l.article.id === articleAjouter.id)
      if (existant) return prev.map(l => l.article.id === articleAjouter.id ? { ...l, quantite: l.quantite + 1 } : l)
      return [...prev, { article: articleAjouter, quantite: 1 }]
    })

    setOptionsBurger([])
    setPendingBurger(null)
  }

  function retirerArticle(articleId: string) {
    setLignes(prev => {
      const existant = prev.find(l => l.article.id === articleId)
      if (!existant) return prev
      if (existant.quantite === 1) return prev.filter(l => l.article.id !== articleId)
      return prev.map(l => l.article.id === articleId ? { ...l, quantite: l.quantite - 1 } : l)
    })
  }

  const total = lignes.reduce((s, l) => s + l.article.prix * l.quantite, 0)

  async function validerCommande() {
    if (lignes.length === 0) return
    setLoading(true)
    try {
      await CommandeService.create(
        { mode_paiement: modePaiement, total, note, statut: 'payee', nom_client: nomClient.trim(), telephone: telephone.trim(), date_commande: today },
        lignes
      )
      setLignes([])
      setNote('')
      setNomClient('')
      setTelephone('')
      setMsg('Commande enregistrée !')
      setTimeout(() => setMsg(''), 3000)
      chargerCommandes()
      chargerRapport()
    } catch(e) {
       console.error(e)
    } finally { 
       setLoading(false) 
    }
  }

  async function annulerCommande(id: string) {
    await CommandeService.cancel(id)
    chargerCommandes()
    chargerRapport()
  }

  // Derived state
  const rapportJour = rapportsData.find(r => r.date_commande === today) || null
  const rapportAffiche = (() => {
    let filtered = rapportsData
    if (typeRapport === 'jour') {
      filtered = rapportsData.filter(r => r.date_commande === today)
    } else if (typeRapport === 'semaine') {
      const d = new Date()
      const day = d.getDay() || 7
      d.setDate(d.getDate() - (day - 1))
      const startOfWeek = d.toISOString().split('T')[0]
      filtered = rapportsData.filter(r => r.date_commande >= startOfWeek)
    } else if (typeRapport === 'mois') {
      const d = new Date()
      const startOfMonth = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
      filtered = rapportsData.filter(r => r.date_commande >= startOfMonth)
    }

    if (filtered.length === 0) return null

    return filtered.reduce((acc, r) => ({
      ...acc,
      date_commande: typeRapport,
      chiffre_affaires: Number(acc.chiffre_affaires) + Number(r.chiffre_affaires),
      nb_commandes: Number(acc.nb_commandes) + Number(r.nb_commandes),
      total_especes: Number(acc.total_especes) + Number(r.total_especes),
      total_carte: Number(acc.total_carte) + Number(r.total_carte),
      nb_annulations: Number(acc.nb_annulations) + Number(r.nb_annulations),
    }), { date_commande: '', chiffre_affaires: 0, nb_commandes: 0, total_especes: 0, total_carte: 0, nb_annulations: 0 } as RapportJournalier)
  })()

  const ordreCategories = ['burger', 'boisson', 'accompagnement', 'extra', 'dessert']
  const categories = Array.from(new Set(articles.map(a => a.categorie))).sort((a, b) => {
    let indexA = ordreCategories.indexOf(a)
    let indexB = ordreCategories.indexOf(b)
    if (indexA === -1) indexA = 99
    if (indexB === -1) indexB = 99
    return indexA - indexB
  })
  const articlesFiltres = articles.filter(a => a.categorie === categorieActive)

  return {
    articles, lignes, setLignes, modePaiement, setModePaiement,
    note, setNote, nomClient, setNomClient, telephone, setTelephone,
    commandes, rapportsData, typeRapport, setTypeRapport,
    loading, onglet, setOnglet, categorieActive, setCategorieActive,
    msg, optionsBurger, setOptionsBurger, pendingBurger, setPendingBurger,
    rapportJour, rapportAffiche, total, categories, articlesFiltres,
    ajouterArticle, confirmerPendingBurger, retirerArticle, validerCommande, annulerCommande
  }
}

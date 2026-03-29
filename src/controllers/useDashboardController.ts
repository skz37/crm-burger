import { useState, useEffect } from 'react'
import { Commande, CommandeArticle, RapportJournalier } from '@/models/types'
import { CommandeService, RapportService } from '@/models/services'

export function useDashboardController() {
  const [commandes, setCommandes] = useState<(Commande & { commande_articles?: CommandeArticle[] })[]>([])
  const [rapportsData, setRapportsData] = useState<RapportJournalier[]>([])
  const [typeRapport, setTypeRapport] = useState<'jour' | 'semaine' | 'mois'>('jour')
  const [lastUpdate, setLastUpdate] = useState(new Date())
  const [mounted, setMounted] = useState(false)

  const today = new Date().toISOString().split('T')[0]

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

  useEffect(() => {
    setMounted(true)
    fetchData()
    const interval = setInterval(fetchData, 15000)
    return () => clearInterval(interval)
  }, [])

  async function fetchData() {
    const cmdData = await CommandeService.getByDate(today)
    if (cmdData) setCommandes(cmdData)

    const d = new Date()
    const firstDayOfMonth = new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
    const dt = new Date(d)
    const day = dt.getDay() || 7
    dt.setDate(dt.getDate() - (day - 1))
    const firstDayOfWeek = dt.toISOString().split('T')[0]
    const earliestDate = firstDayOfWeek < firstDayOfMonth ? firstDayOfWeek : firstDayOfMonth

    const rapData = await RapportService.getDepuis(earliestDate)
    if (rapData) setRapportsData(rapData)
    
    setLastUpdate(new Date())
  }
  
  return {
    commandes,
    rapportAffiche,
    typeRapport,
    setTypeRapport,
    lastUpdate,
    mounted
  }
}

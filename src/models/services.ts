import { supabase } from '@/lib/supabase'
import { Article, Commande, CommandeArticle, RapportJournalier, LigneCommande } from './types'

export const ArticleService = {
  async getAll() {
    const { data } = await supabase.from('articles').select('*').eq('actif', true).order('categorie')
    return data as Article[] | null
  }
}

export const CommandeService = {
  async getByDate(date: string) {
    const { data } = await supabase
      .from('commandes')
      .select('*, commande_articles(*)')
      .eq('date_commande', date)
      .order('heure', { ascending: false })
    return data as (Commande & { commande_articles?: CommandeArticle[] })[] | null
  },

  async create(commandeData: Partial<Commande>, lignes: LigneCommande[]) {
    const { data: cmd, error } = await supabase
      .from('commandes')
      .insert(commandeData)
      .select().single()

    if (error || !cmd) throw error

    await supabase.from('commande_articles').insert(
      lignes.map(l => ({
        commande_id: cmd.id,
        article_id: l.article.id,
        nom_article: l.article.nom,
        prix_unitaire: l.article.prix,
        quantite: l.quantite
      }))
    )
    return cmd
  },

  async cancel(id: string) {
    const { error } = await supabase.from('commandes').update({ statut: 'annulee' }).eq('id', id)
    if (error) throw error
    return true
  }
}

export const RapportService = {
  async getDepuis(date: string) {
    const { data } = await supabase
      .from('rapport_journalier')
      .select('*')
      .gte('date_commande', date)
    return data as RapportJournalier[] | null
  },

  async getJour(date: string) {
    const { data } = await supabase
      .from('rapport_journalier')
      .select('*')
      .eq('date_commande', date)
      .single()
    return data as RapportJournalier | null
  }
}

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Article = {
  id: string
  nom: string
  prix: number
  categorie: string
  description?: string
  actif: boolean
}

export type Commande = {
  id: string
  numero_commande: number
  date_commande: string
  heure: string
  statut: 'en_cours' | 'payee' | 'annulee'
  mode_paiement: 'especes' | 'carte' | 'virement'
  total: number
  note?: string
  nom_client?: string
  telephone?: string
}

export type CommandeArticle = {
  id: string
  commande_id: string
  article_id: string
  nom_article: string
  prix_unitaire: number
  quantite: number
  sous_total: number
}

export type RapportJournalier = {
  date_commande: string
  nb_commandes: number
  chiffre_affaires: number
  total_especes: number
  total_carte: number
  nb_annulations: number
}

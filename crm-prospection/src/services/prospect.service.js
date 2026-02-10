import { hasSupabaseConfig, supabase } from '../lib.supabase'

const STORAGE_KEY = 'crm-prospects'

export function getStorageMode() {
  return hasSupabaseConfig ? 'supabase' : 'local'
}

export async function loadProspects() {
  if (hasSupabaseConfig) {
    const { data, error } = await supabase
      .from('prospects')
      .select('*, interactions(*)')
      .order('created_at', { ascending: false })

    if (error) throw new Error(`Supabase: ${error.message}`)

    return (data || []).map(mapSupabaseProspect)
  }

  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : seedProspects
}

export async function createProspect(payload) {
  if (hasSupabaseConfig) {
    const insertPayload = mapProspectToSupabase(payload)
    const { data, error } = await supabase
      .from('prospects')
      .insert(insertPayload)
      .select('*, interactions(*)')
      .single()

    if (error) throw new Error(`Supabase: ${error.message}`)
    return mapSupabaseProspect(data)
  }

  const prospect = {
    id: crypto.randomUUID(),
    interactions: [],
    hasReplied: false,
    questionsCount: 0,
    averageReplyHours: 48,
    ...payload
  }
  const current = await loadProspects()
  current.unshift(prospect)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  return prospect
}

export async function updateProspect(id, updates) {
  if (hasSupabaseConfig) {
    const patch = mapProspectToSupabase(updates)
    const { data, error } = await supabase
      .from('prospects')
      .update(patch)
      .eq('id', id)
      .select('*, interactions(*)')
      .single()

    if (error) throw new Error(`Supabase: ${error.message}`)
    return mapSupabaseProspect(data)
  }

  const current = await loadProspects()
  const idx = current.findIndex((p) => p.id === id)
  if (idx === -1) return null
  current[idx] = { ...current[idx], ...updates }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  return current[idx]
}

export async function appendInteraction(id, interaction) {
  if (hasSupabaseConfig) {
    const interactionPayload = {
      prospect_id: id,
      type: interaction.type,
      content: interaction.content,
      asked_question: Boolean(interaction.askedQuestion)
    }

    const { data, error } = await supabase
      .from('interactions')
      .insert(interactionPayload)
      .select('*')
      .single()

    if (error) throw new Error(`Supabase: ${error.message}`)
    return mapSupabaseInteraction(data)
  }

  const current = await loadProspects()
  const prospect = current.find((p) => p.id === id)
  if (!prospect) return null

  const newInteraction = { id: crypto.randomUUID(), date: new Date().toISOString(), ...interaction }
  prospect.interactions.unshift(newInteraction)
  prospect.lastInteractionDate = newInteraction.date
  prospect.lastAction = interaction.type
  if (interaction.type === 'Réponse reçue') prospect.hasReplied = true
  if (interaction.askedQuestion) prospect.questionsCount += 1

  localStorage.setItem(STORAGE_KEY, JSON.stringify(current))
  return newInteraction
}

function mapSupabaseProspect(row) {
  return {
    id: row.id,
    company: row.company,
    contactName: row.contact_name,
    position: row.position,
    platform: row.platform,
    linkedinUrl: row.linkedin_url,
    sector: row.sector,
    companySize: row.company_size,
    status: row.status,
    lastAction: row.last_action,
    lastInteractionDate: row.last_interaction_date,
    nextAction: row.next_action,
    nextActionDate: row.next_action_date,
    hasReplied: row.has_replied,
    questionsCount: row.questions_count,
    averageReplyHours: row.average_reply_hours,
    interactions: (row.interactions || []).map(mapSupabaseInteraction)
  }
}

function mapSupabaseInteraction(row) {
  return {
    id: row.id,
    date: row.created_at,
    type: row.type,
    content: row.content,
    askedQuestion: row.asked_question
  }
}

function mapProspectToSupabase(prospect) {
  const mapped = {}
  if ('company' in prospect) mapped.company = prospect.company
  if ('contactName' in prospect) mapped.contact_name = prospect.contactName
  if ('position' in prospect) mapped.position = prospect.position
  if ('platform' in prospect) mapped.platform = prospect.platform
  if ('linkedinUrl' in prospect) mapped.linkedin_url = prospect.linkedinUrl
  if ('sector' in prospect) mapped.sector = prospect.sector
  if ('companySize' in prospect) mapped.company_size = prospect.companySize
  if ('status' in prospect) mapped.status = prospect.status
  if ('lastAction' in prospect) mapped.last_action = prospect.lastAction
  if ('lastInteractionDate' in prospect) mapped.last_interaction_date = prospect.lastInteractionDate
  if ('nextAction' in prospect) mapped.next_action = prospect.nextAction
  if ('nextActionDate' in prospect) mapped.next_action_date = prospect.nextActionDate
  if ('hasReplied' in prospect) mapped.has_replied = prospect.hasReplied
  if ('questionsCount' in prospect) mapped.questions_count = prospect.questionsCount
  if ('averageReplyHours' in prospect) mapped.average_reply_hours = prospect.averageReplyHours
  return mapped
}

const seedProspects = [
  {
    id: crypto.randomUUID(),
    company: 'Nova ERP',
    contactName: 'Nadia Kouamé',
    position: 'Directrice Financière',
    platform: 'LinkedIn',
    linkedinUrl: 'https://linkedin.com/in/nadia-kouame',
    sector: 'Retail',
    companySize: 'PME',
    status: 'Contacté',
    lastAction: 'Premier message envoyé',
    lastInteractionDate: new Date(Date.now() - 4 * 86400000).toISOString(),
    nextAction: 'Relance courte',
    nextActionDate: new Date().toISOString().slice(0, 10),
    hasReplied: false,
    questionsCount: 0,
    averageReplyHours: 36,
    interactions: []
  }
]

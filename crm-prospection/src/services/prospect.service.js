const STORAGE_KEY = 'crm-prospects'

export function loadProspects() {
  const raw = localStorage.getItem(STORAGE_KEY)
  return raw ? JSON.parse(raw) : seedProspects
}

export function saveProspects(prospects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(prospects))
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
    hasReplied: false,
    questionsCount: 0,
    averageReplyHours: 36,
    interactions: []
  }
]

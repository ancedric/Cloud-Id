const decisionRoles = ['DG', 'CEO', 'CTO', 'Directeur', 'Fondateur', 'Founder']

export function computeProspectScore(prospect) {
  let score = 20

  if (prospect.hasReplied) score += 20
  if (decisionRoles.some((role) => prospect.position?.includes(role))) score += 15
  if (prospect.companySize === 'PME' || prospect.companySize === 'Grande entreprise') score += 15
  if (prospect.questionsCount > 0) score += Math.min(20, prospect.questionsCount * 5)

  const inactivity = daysSince(prospect.lastInteractionDate)
  if (inactivity <= 2) score += 15
  else if (inactivity <= 7) score += 5
  else score -= 10

  if (prospect.status === 'Intéressé' || prospect.status === 'Démo planifiée') score += 15
  if (prospect.status === 'Refusé') score = 0

  return Math.max(0, Math.min(100, score))
}

export function suggestFollowUp(prospect) {
  const daysInactive = daysSince(prospect.lastInteractionDate)
  const score = computeProspectScore(prospect)

  if (prospect.status === 'À contacter') {
    return 'Envoyer un premier message personnalisé avec une accroche sur ses enjeux métier.'
  }

  if (!prospect.hasReplied && daysInactive >= 5) {
    return `Ce prospect n'a pas répondu depuis ${daysInactive} jours. Relance courte recommandée.`
  }

  if (score >= 75) {
    return 'Prospect chaud: proposer une démo de 20 min cette semaine.'
  }

  return 'Partager un cas client concret pour maintenir l’intérêt et qualifier le besoin.'
}

export function suggestBestMoment(prospect) {
  const averageReplyHours = prospect.averageReplyHours || 48

  if (averageReplyHours <= 12) return 'Relancer en matinée (08h-11h), créneau réactif.'
  if (averageReplyHours <= 36) return 'Relancer en début d’après-midi (13h-15h).'
  return 'Relancer en milieu de semaine, matin, avec un message bref.'
}

function daysSince(dateString) {
  if (!dateString) return 99
  const now = new Date()
  const date = new Date(dateString)
  return Math.floor((now - date) / (1000 * 60 * 60 * 24))
}

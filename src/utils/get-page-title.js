import defaultSettings from '@/settings'

const title = defaultSettings.title || 'Clms 后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}

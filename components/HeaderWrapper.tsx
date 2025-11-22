import { getCollections } from '@/lib/cosmic'
import { Collection } from '@/types'
import Header from '@/components/Header'

export default async function HeaderWrapper() {
  const collections = await getCollections() as Collection[]
  
  return <Header collections={collections} />
}
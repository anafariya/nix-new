import { useEffect, useMemo, useState } from 'react'
import { Navbar } from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'
import { Calendar, User2 } from 'lucide-react'

interface Category { Id: number; Category: string }
interface NewsCard {
  NewsId: number
  ThumbnailUrl: string
  Heading: string
  Author: string
  NewsDate: string
}

export default function LatestNewsPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCat, setActiveCat] = useState<number>(0)
  const [pageNo, setPageNo] = useState(1)
  const [pageSize] = useState(10)
  const [items, setItems] = useState<NewsCard[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const url = 'https://api.nixtour.com/api/List/NewsCategoryList'
        console.log('[WebNews] Categories URL:', url)
        const res = await fetch(url)
        console.log('[WebNews] Categories status:', res.status)
        const data = await res.json()
        console.log('[WebNews] Categories JSON (raw):', data)
        if (data?.Success && Array.isArray(data?.Data)) {
          const mapped: Category[] = data.Data.map((x: any) => ({ Id: x.Id ?? x.NewsCategoryId ?? x.id, Category: x.Category ?? x.NewsCategoryName ?? x.name }))
          const merged = [{ Id: 0, Category: 'All News' }, ...mapped]
          console.log('[WebNews] Categories mapped:', merged)
          setCategories(merged)
        }
      } catch {}
    }
    fetchCats()
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true)
        const url = `https://api.nixtour.com/api/Web/NewsList?newsCategoryId=${activeCat}&pageNo=${pageNo}&pageSize=${pageSize}`
        console.log('[WebNews] List URL:', url)
        const res = await fetch(url)
        console.log('[WebNews] List status:', res.status)
        const data = await res.json()
        console.log('[WebNews] List JSON:', data)
        if (data?.Success) {
          const list = Array.isArray(data?.Data?.NewsList) ? data.Data.NewsList : Array.isArray(data?.Data) ? data.Data : []
          const mapped: NewsCard[] = list.map((x: any) => ({
            NewsId: x.NewsId ?? x.Id,
            ThumbnailUrl: x.ThumbnailUrl ?? x.ThumbnailImg ?? x.Thumbnail ?? '',
            Heading: x.Heading ?? x.Title ?? '',
            Author: x.Author ?? 'Nixtour',
            NewsDate: x.NewsDate ?? x.Date ?? '',
          }))
          console.log('[WebNews] Mapped cards:', mapped)
          setItems(mapped)
        } else {
          setItems([])
        }
      } catch {
        console.error('[WebNews] List error')
        setItems([])
      } finally {
        setLoading(false)
      }
    }
    fetchNews()
  }, [activeCat, pageNo, pageSize])

  const cards = useMemo(() => items, [items])

  const getImage = (path: string) => {
    if (!path) return '/api/placeholder/400/200'
    const raw = path.includes('\\') || path.includes('/')
      ? (path.split('\\').pop() || '').split('/').pop()
      : path
    const name = encodeURIComponent((raw || '').trim())
    return `https://api.nixtour.com/api/Image/GetImage/${name}`
  }

  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='bg-[#1E66F5] text-white py-10 text-center text-4xl font-bold'>Latest News</div>

      <div className='mx-auto px-6 sm:px-12 md:px-24 lg:px-36 xl:px-48 mt-6'>
        <div className='border-b border-gray-200'>
          <nav className='flex space-x-6 overflow-x-auto'>
            {categories.map((c) => (
              <button key={c.Id} onClick={() => { setActiveCat(c.Id); setPageNo(1) }}
                className={`py-3 px-1 border-b-2 whitespace-nowrap ${activeCat === c.Id ? 'border-[#BC1110] text-[#BC1110]' : 'border-transparent text-gray-600'}`}>
                {c.Category}
              </button>
            ))}
          </nav>
        </div>

        <div className='py-8'>
          <h2 className='text-2xl font-bold mb-4'>Top News</h2>
          {loading ? (
            <div className='bg-gray-50 rounded p-8'>Loading...</div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {cards.map((n) => (
                <div key={n.NewsId} className='bg-white rounded-[12px] shadow hover:shadow-lg transition overflow-hidden cursor-pointer' onClick={() => {
                  const slug = (n.Heading || '').toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()
                  window.location.href = `/news/${slug}`
                }}>
                  <img src={getImage(n.ThumbnailUrl)} alt={n.Heading} className='w-full h-40 object-cover' />
                  <div className='p-4'>
                    <h3 className='font-bold text-lg line-clamp-2'>{n.Heading}</h3>
                    <div className='mt-2 flex items-center gap-4 text-sm text-gray-600'>
                      <span className='flex items-center gap-1'><User2 className='w-4 h-4' /> Nixtour</span>
                      <span className='flex items-center gap-1'><Calendar className='w-4 h-4' /> {n.NewsDate}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className='flex items-center justify-center gap-3 pb-10'>
          <button className='px-3 py-1 border rounded' disabled={pageNo === 1} onClick={() => setPageNo((p) => Math.max(1, p - 1))}>Prev</button>
          <span>Page {pageNo}</span>
          <button className='px-3 py-1 border rounded' onClick={() => setPageNo((p) => p + 1)}>Next</button>
        </div>
      </div>
      <Footer />
    </div>
  )
}



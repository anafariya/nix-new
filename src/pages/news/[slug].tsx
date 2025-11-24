import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { Navbar } from '../../components/navbar/navbar'
import Footer from '../../components/footer/footer'
import { Calendar, User } from 'lucide-react'

const toSlug = (s: string) => s?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').trim()

type NewsItem = {
  NewsId: number
  Heading: string
  Title?: string
  Author: string
  Date?: string
  NewsDate?: string
  ThumbnailImg?: string
  ThumbnailUrl?: string
  BannerImg?: string
  BannerUrl?: string
  Content?: string
  Description?: string
}

export default function NewsDetailsPage() {
  const { slug } = useParams()
  const [item, setItem] = useState<NewsItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([])
  const [relatedLoading, setRelatedLoading] = useState(false)
  const [metaTitle, setMetaTitle] = useState<string>('')
  const [metaDescription, setMetaDescription] = useState<string>('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        console.log('[NewsDetails] Current slug:', slug)
        
        // First get list to find the heading that matches the slug
        const listUrl = 'https://api.nixtour.com/api/Web/NewsList?newsCategoryId=0&pageNo=1&pageSize=100'
        console.log('[NewsDetails] Fetching list from:', listUrl)
        const listRes = await fetch(listUrl)
        const listJson = await listRes.json()
        console.log('[NewsDetails] List response:', listJson)
        
        const list = Array.isArray(listJson?.Data?.NewsList) ? listJson.Data.NewsList : []
        console.log('[NewsDetails] Parsed list:', list)
        
        // Set related news (exclude current article)
        setRelatedLoading(true)
        
        // Find the news item that matches our slug
        const match = list.find((x: any) => {
          const heading = x.Heading || x.Title || ''
          const itemSlug = toSlug(heading)
          console.log('[NewsDetails] Comparing:', itemSlug, 'vs', slug)
          return itemSlug === slug
        })
        console.log('[NewsDetails] Found match:', match)
        
        if (match) {
          // Now use the NewsDetails API to get full content
          const heading = match.Heading || match.Title
          const detailsUrl = `https://api.nixtour.com/api/Web/NewsDetails?heading=${heading}`
          console.log('[NewsDetails] Fetching details from:', detailsUrl)
          
          const detailsRes = await fetch(detailsUrl)
          const detailsJson = await detailsRes.json()
          console.log('[NewsDetails] Details response:', detailsJson)
          
          if (detailsJson?.Success && detailsJson?.Data?.News) {
            const data = detailsJson.Data.News
            console.log('[NewsDetails] Details data:', data)
            setItem({
              NewsId: data.NewsId || match.NewsId,
              Heading: data.Heading || match.Heading || match.Title || '',
              Author: data.Author || match.Author || 'Nixtour',
              Date: data.Date || data.NewsDate || match.Date || match.NewsDate || '',
              ThumbnailImg: data.ThumbnailImg || data.ThumbnailUrl || match.ThumbnailImg || match.ThumbnailUrl,
              BannerImg: data.BannerImg || data.BannerUrl || match.BannerImg || match.BannerUrl,
              Content: data.Content || match.Content || '',
              Description: data.Description || match.Description || '',
            })
            setMetaTitle(data.Title || data.Heading || match.Heading || match.Title || '')
            setMetaDescription(data.Description || match.Description || '')
          } else {
            console.log('[NewsDetails] Details API failed, using fallback')
            // Fallback to list data if NewsDetails fails
            setItem({
              NewsId: match.NewsId,
              Heading: match.Heading || match.Title || '',
              Author: match.Author || 'Nixtour',
              Date: match.Date || match.NewsDate || '',
              ThumbnailImg: match.ThumbnailImg || match.ThumbnailUrl,
              BannerImg: match.BannerImg || match.BannerUrl,
              Content: match.Content || '',
              Description: match.Description || '',
            })
            setMetaTitle(match.Title || match.Heading || '')
            setMetaDescription(match.Description || '')
          }
        } else {
          console.log('[NewsDetails] No match found for slug:', slug)
        }
        
        // Set related news (exclude current article)
        const currentNewsId = match?.NewsId
        const related = list
          .filter((x: any) => x.NewsId !== currentNewsId)
          .slice(0, 10)
          .map((x: any) => ({
            NewsId: x.NewsId,
            Heading: x.Heading || x.Title || '',
            Author: x.Author || 'Nixtour',
            Date: x.Date || x.NewsDate || '',
            ThumbnailImg: x.ThumbnailImg || x.ThumbnailUrl,
            BannerImg: x.BannerImg || x.BannerUrl,
          }))
        setRelatedNews(related)
        setRelatedLoading(false)
        
      } catch (error) {
        console.error('[NewsDetails] Error:', error)
        setRelatedLoading(false)
      } finally {
        setLoading(false)
      }
    }
    if (slug) fetchData()
  }, [slug])

  const getImage = (name?: string) => {
    if (!name) return '/api/placeholder/800/400'
    const raw = name.includes('\\') || name.includes('/') ? (name.split('\\').pop() || '').split('/').pop() : name
    return `https://api.nixtour.com/api/Image/GetImage/${encodeURIComponent((raw || '').trim())}`
  }

  return (
    <div className='min-h-screen'>
      <Helmet>
        <title>{metaTitle}</title>
        <meta name="description" content={metaDescription} />
      </Helmet>
      <Navbar />
      {loading ? (
        <div className='py-16 text-center'>Loading...</div>
      ) : !item ? (
        <div className='py-16 text-center'>News not found</div>
      ) : (
        <div>
          {/* Image Part */}
          <div className='w-full h-56 md:h-[90vh] overflow-hidden'>
            <img src={getImage(item.BannerImg)} alt={item.Heading} className='w-full h-full object-cover' />
          </div>

          {/* Breadcrumb */}
          <div className='mx-auto px-6 sm:px-1 md:px-2 lg:px-3 xl:px-4 py-4 bg-gray-50'>
            <div className='flex items-center text-sm'>
              <a href='/' className='text-[#BC1110] hover:underline'>Home</a>
              <span className='mx-2 text-gray-400'>{'>'}</span>
              <a href='/news' className='text-[#BC1110] hover:underline'>News</a>
              <span className='mx-2 text-gray-400'>{'>'}</span>
              <span className='text-gray-600 truncate'>{item.Heading}</span>
            </div>
          </div>
          
          {/* Meta Part */}
          <div className='mx-auto px-6 sm:px-1 md:px-2 lg:px-3 xl:px-4 py-8 border-b border-gray-200'>
            <h1 className='text-3xl md:text-4xl font-bold mb-6 text-gray-900 leading-tight'>{item.Heading}</h1>
            <div className='flex items-center gap-6 text-gray-600'>
              <div className='flex items-center gap-2'>
                <User size={18} color='#BC1110'/> 
                <span className='font-medium'>{item.Author || 'Nixtour'}</span>
              </div>
              <div className='flex items-center gap-2'>
                <Calendar size={18} color='#BC1110'/>
                <span className='font-medium'>{item.Date}</span>
              </div>
            </div>
          </div>

        

          {/* Content Part */}
          <div className='mx-auto px-6 sm:px-1 md:px-2 lg:px-3 xl:px-4 py-8'>
            <div className='flex flex-col lg:flex-row gap-8'>
              {/* Main Content */}
              <div className='lg:w-2/3'>
                <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: item.Content || '' }} />
              </div>
              
              {/* Sidebar */}
              <div className='lg:w-1/3'>
                <div className='bg-gray-50 rounded-lg p-6'>
                  <h3 className='text-xl font-semibold mb-4 text-blue-900'>Related News</h3>
                  {relatedLoading ? (
                    <div className='text-center py-4 text-gray-500'>Loading...</div>
                  ) : (
                    <div className='space-y-4'>
                      {relatedNews.map((news) => (
                        <div 
                          key={news.NewsId} 
                          className='flex gap-3 cursor-pointer hover:bg-white p-3 rounded-lg transition-colors'
                          onClick={() => {
                            const newsSlug = toSlug(news.Heading)
                            window.location.href = `/news/${newsSlug}`
                          }}
                        >
                          <img 
                            src={getImage(news.ThumbnailImg)} 
                            alt={news.Heading}
                            className='w-16 h-16 object-cover rounded-md flex-shrink-0'
                          />
                          <div className='flex-1 min-w-0'>
                            <h4 className='font-semibold text-sm line-clamp-2 text-gray-800 mb-1'>
                              {news.Heading}
                            </h4>
                            <p className='text-xs text-gray-500'>
                              {news.Date}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </div>
  )
}



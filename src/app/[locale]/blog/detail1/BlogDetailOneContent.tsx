'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image';
import { Link, useRouter } from '@/i18n/routing';
import { useSearchParams } from 'next/navigation';
import NewsInsight from '@/components/Home3/NewsInsight';
import Footer from '@/components/Footer/Footer'
import BreadcrumbJsonLd from '@/components/SEO/BreadcrumbJsonLd'

interface Blog {
    id: string
    category: string
    tag: string | null
    tags?: Array<{ id: string; name: string; slug: string }>
    title: string
    date: string
    author: string
    avatar: string | null
    thumbImg: string | null
    coverImg: string | null
    subImg: string[]
    shortDesc: string
    description: string
    slug: string
}

const BlogDetailOneContent = () => {
    const searchParams = useSearchParams()
    const router = useRouter()
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://eyesoul-eyewear.com'
    const [blogMain, setBlogMain] = useState<Blog | null>(null)
    const [blogData, setBlogData] = useState<Blog[]>([])
    const [loading, setLoading] = useState(true)

    let blogId = searchParams.get('id')

    useEffect(() => {
        loadBlogs()
    }, [blogId])

    const loadBlogs = async () => {
        setLoading(true)
        try {
            // Load all blogs for navigation
            const allRes = await fetch('/api/blogs?limit=100', { cache: 'no-store' })
            if (allRes.ok) {
                const allJson = await allRes.json()
                setBlogData(allJson.data || [])
            }

            // Load specific blog
            if (blogId) {
                const res = await fetch(`/api/blogs/${blogId}`, { cache: 'no-store' })
                if (res.ok) {
                    const json = await res.json()
                    setBlogMain(json)
                } else if (allRes.ok) {
                    // Fallback to first blog if ID not found
                    const allJson = await allRes.json()
                    if (allJson.data && allJson.data.length > 0) {
                        setBlogMain(allJson.data[0])
                    }
                }
            } else if (allRes.ok) {
                // No ID provided, use first blog
                const allJson = await allRes.json()
                if (allJson.data && allJson.data.length > 0) {
                    setBlogMain(allJson.data[0])
                }
            }
        } catch (error) {
            console.error('Error loading blogs:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleBlogClick = (tagSlug: string) => {
        router.push(`/blog/default?tag=${tagSlug}`);
    };

    const handleBlogDetail = (id: string) => {
        router.push(`/blog/detail1?id=${id}`);
    };

    if (loading || !blogMain) {
        return (
            <div className="text-secondary text-center py-20">Loading blog...</div>
        )
    }

    const currentIndex = blogData.findIndex(b => b.id === blogMain.id)
    const prevBlog = currentIndex > 0 ? blogData[currentIndex - 1] : blogData[blogData.length - 1]
    const nextBlog = currentIndex < blogData.length - 1 ? blogData[currentIndex + 1] : blogData[0]

    return (
        <>
            <div id="header" className='relative w-full'>
            </div>
            <BreadcrumbJsonLd
                items={[
                    { name: 'Home', item: `${siteUrl}/` },
                    { name: 'Blog', item: `${siteUrl}/blog/default` },
                    { name: blogMain?.title || 'Blog Post', item: `${siteUrl}/blog/detail1?id=${blogMain.id}` },
                ]}
            />
            <div className='blog detail1'>
                <div className="bg-img md:mt-[74px] mt-14">
                    <Image
                        src={blogMain.thumbImg || '/images/blog/1.png'}
                        width={5000}
                        height={4000}
                        alt={blogMain.thumbImg || 'blog'}
                        className='w-full min-[1600px]:h-[800px] xl:h-[640px] lg:h-[520px] sm:h-[380px] h-[260px] object-cover'
                    />
                </div>
                <div className="container md:pt-20 pt-10">
                    <div className="blog-content flex items-center justify-center">
                        <div className="main md:w-5/6 w-full">
                            <div className="blog-tag bg-green py-1 px-2.5 rounded-full text-button-uppercase inline-block">{blogMain.tag || 'Blog'}</div>
                            <div className="heading3 mt-3">{blogMain.title}</div>
                            <div className="author flex items-center gap-4 mt-4">
                                {blogMain.avatar && (
                                    <div className="avatar w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                                        <Image
                                            src={blogMain.avatar}
                                            width={200}
                                            height={200}
                                            alt='avatar'
                                            className='w-full h-full object-cover'
                                        />
                                    </div>
                                )}
                                <div className='flex items-center gap-2'>
                                    <div className="caption1 text-secondary">by {blogMain.author}</div>
                                    <div className="line w-5 h-px bg-secondary"></div>
                                    <div className="caption1 text-secondary">{blogMain.date}</div>
                                </div>
                            </div>
                            <div className="content md:mt-8 mt-5">
                                <div className="body1">{blogMain.description}</div>
                                {blogMain.subImg && blogMain.subImg.length > 0 && (
                                    <div className="grid sm:grid-cols-2 gap-[30px] md:mt-8 mt-5">
                                        {blogMain.subImg.map((item, index) => (
                                            <Image
                                                key={index}
                                                src={item}
                                                width={3000}
                                                height={2000}
                                                alt={item}
                                                className='w-full rounded-3xl'
                                            />
                                        ))}
                                    </div>
                                )}
                                <div className="heading4 md:mt-8 mt-5">How did SKIMS start?</div>
                                <div className="body1 mt-4">This is such a hard question! Honestly, every time we drop a new collection I get obsessed with it. The pieces that have been my go-tos though are some of our simplest styles that we launched with. I wear our Fits Everybody Thong every single day – it is the only underwear I have now, it's so comfortable and stretchy and light enough that you can wear anything over it.</div>
                                <div className="body1 mt-4">For bras, I love our Cotton Jersey Scoop Bralette – it's lined with this amazing power mesh so you get great support and is so comfy I can sleep in it. I also love our Seamless Sculpt Bodysuit – it's the perfect all in one sculpting, shaping and smoothing shapewear piece with different levels of support woven throughout.</div>
                            </div>
                            <div className="action flex items-center justify-between flex-wrap gap-5 md:mt-8 mt-5">
                                <div className="left flex items-center gap-3 flex-wrap">
                                    <p>Tag:</p>
                                    <div className="list flex items-center gap-3 flex-wrap">
                                        {blogMain.tags && blogMain.tags.length > 0 ? (
                                            blogMain.tags.map((tag) => (
                                                <div
                                                    key={tag.id}
                                                    className={`tags bg-surface py-1.5 px-4 rounded-full text-button-uppercase cursor-pointer duration-300 hover:bg-black hover:text-white`}
                                                    onClick={() => handleBlogClick(tag.slug)}
                                                >
                                                    {tag.name}
                                                </div>
                                            ))
                                        ) : blogMain.tag ? (
                                            <div
                                                className={`tags bg-surface py-1.5 px-4 rounded-full text-button-uppercase cursor-pointer duration-300 hover:bg-black hover:text-white`}
                                            >
                                                {blogMain.tag}
                                            </div>
                                        ) : (
                                            <span className="text-secondary">No tags</span>
                                        )}
                                    </div>
                                </div>
                                <div className="right flex items-center gap-3 flex-wrap">
                                    <p>Share:</p>
                                    <div className="list flex items-center gap-3 flex-wrap">
                                        <Link href={'https://www.facebook.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-facebook duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.instagram.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-instagram duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.twitter.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-twitter duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.youtube.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-youtube duration-100"></div>
                                        </Link>
                                        <Link href={'https://www.pinterest.com/'} target='_blank' className='bg-surface w-10 h-10 flex items-center justify-center rounded-full duration-300 hover:bg-black hover:text-white'>
                                            <div className="icon-pinterest duration-100"></div>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                            {blogData.length > 1 && (
                                <div className="next-pre flex items-center justify-between md:mt-8 mt-5 py-6 border-y border-line">
                                    <div className="left cursor-pointer"
                                        onClick={() => handleBlogDetail(prevBlog.id)}
                                    >
                                        <div className="text-button-uppercase text-secondary2">Previous</div>
                                        <div className="text-title mt-2">{prevBlog.title}</div>
                                    </div>
                                    <div className="right text-right cursor-pointer"
                                        onClick={() => handleBlogDetail(nextBlog.id)}
                                    >
                                        <div className="text-button-uppercase text-secondary2">Next</div>
                                        <div className="text-title mt-2">{nextBlog.title}</div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
                <div className='md:pb-20 pb-10'>
                    <NewsInsight 
                        data={blogData.map(b => ({
                            id: b.id,
                            category: b.category,
                            tag: b.tag || '',
                            title: b.title,
                            date: b.date,
                            author: b.author,
                            avatar: b.avatar || '/images/avatar/1.png',
                            thumbImg: b.thumbImg || '/images/blog/1.png',
                            coverImg: b.coverImg || '/images/blog/1.png',
                            subImg: b.subImg,
                            shortDesc: b.shortDesc,
                            description: b.description,
                        }))} 
                        start={0} 
                        limit={3} 
                    />
                </div>
            </div>
            <Footer />
        </>
    )
}

export default BlogDetailOneContent


'use client'

import React, { useState, Suspense, useEffect, useCallback } from 'react'
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import BlogItem from '@/components/Blog/BlogItem';
import Footer from '@/components/Footer/Footer'
import HandlePagination from '@/components/Other/HandlePagination'
import { useRouter } from '@/i18n/routing'
import { useLocale } from 'next-intl'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { BlogType } from '@/type/BlogType'
import { TagType } from '@/type/TagType'
import { getTranslatedText, TranslationObject } from '@/utils/translations'

interface Blog {
    id: string
    category: string
    tag: string | null
    title: string
    titleTranslations?: TranslationObject | null
    date: string
    author: string
    avatar: string | null
    thumbImg: string | null
    coverImg: string | null
    subImg: string[]
    shortDesc: string
    shortDescTranslations?: TranslationObject | null
    description: string
    descriptionTranslations?: TranslationObject | null
    slug: string
}

// Transform Blog from API to BlogType for components with translations
function transformBlogToBlogType(blog: Blog, locale: string): BlogType {
    return {
        id: blog.id,
        category: blog.category,
        tag: blog.tag || '',
        title: blog.titleTranslations
            ? getTranslatedText(blog.titleTranslations, locale)
            : blog.title,
        date: blog.date,
        author: blog.author,
        avatar: blog.avatar || '',
        thumbImg: blog.thumbImg || '',
        coverImg: blog.coverImg || '',
        subImg: blog.subImg,
        shortDesc: blog.shortDescTranslations
            ? getTranslatedText(blog.shortDescTranslations, locale)
            : blog.shortDesc,
        description: blog.descriptionTranslations
            ? getTranslatedText(blog.descriptionTranslations, locale)
            : blog.description,
    }
}

const BlogDefaultContent = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [blogData, setBlogData] = useState<Blog[]>([]);
    const [tags, setTags] = useState<TagType[]>([]);
    const [loading, setLoading] = useState(true);
    const [tagsLoading, setTagsLoading] = useState(true);
    const productsPerPage = 3;
    const offset = currentPage * productsPerPage;
    const router = useRouter()
    const locale = useLocale()
    const searchParams = useSearchParams()
    const dataCategory = searchParams.get('category')
    const dataTag = searchParams.get('tag')
    const [category, setCategory] = useState<string | null>(dataCategory);
    const [selectedTag, setSelectedTag] = useState<string | null>(dataTag);

    // Sync category and tag with URL params (only when URL changes, not on every render)
    useEffect(() => {
        const urlCategory = searchParams.get('category')
        const urlTag = searchParams.get('tag')
        setCategory(urlCategory)
        setSelectedTag(urlTag)
    }, [searchParams])

    // Load tags from API
    const loadTags = useCallback(async () => {
        setTagsLoading(true)
        try {
            const res = await fetch('/api/tags?sortBy=count', { cache: 'no-store' })
            if (res.ok) {
                const json = await res.json()
                setTags(json.data || [])
            }
        } catch (error) {
            console.error('Error loading tags:', error)
        } finally {
            setTagsLoading(false)
        }
    }, [])

    useEffect(() => {
        loadTags()
    }, [loadTags])

    const loadBlogs = useCallback(async () => {
        setLoading(true)
        try {
            const params = new URLSearchParams()
            params.append('limit', '100')
            if (category) params.append('category', category)
            if (selectedTag) params.append('tag', selectedTag)
            const res = await fetch(`/api/blogs?${params.toString()}`, { cache: 'no-store' })
            if (res.ok) {
                const json = await res.json()
                setBlogData(json.data || [])
            }
        } catch (error) {
            console.error('Error loading blogs:', error)
        } finally {
            setLoading(false)
        }
    }, [category, selectedTag])

    useEffect(() => {
        loadBlogs()
    }, [loadBlogs])

    const handleCategory = (newCategoryValue: string) => {
        const newCategory = category === newCategoryValue ? null : newCategoryValue
        setCategory(newCategory)
        setSelectedTag(null) // Clear tag when category is selected
        
        // Update URL
        const params = new URLSearchParams()
        if (newCategory) {
            params.set('category', newCategory)
        }
        router.push(`/blog/default?${params.toString()}`)
    }

    const handleTag = (tagSlug: string) => {
        const newTag = selectedTag === tagSlug ? null : tagSlug
        setSelectedTag(newTag)
        setCategory(null) // Clear category when tag is selected
        
        // Update URL
        const params = new URLSearchParams()
        if (newTag) {
            params.set('tag', newTag)
        }
        router.push(`/blog/default?${params.toString()}`)
    }

    const handleBlogClick = (blogId: string) => {
        router.push(`/blog/detail1?id=${blogId}`);
    };

    let filteredData = blogData.filter(blog => {
        let isCategoryMatched = true
        if (category) {
            isCategoryMatched = blog.category === category && blog.category !== 'underwear'
        }

        return isCategoryMatched
    })

    if (filteredData.length === 0 && !loading) {
        filteredData = [{
            id: "no-data",
            category: "no-data",
            tag: "no-data",
            title: "no-data",
            date: "no-data",
            author: "no-data",
            avatar: "no-data",
            thumbImg: "",
            coverImg: "",
            subImg: [
                "",
                ""
            ],
            shortDesc: "no-data",
            description: "no-data",
            slug: "no-data"
        }];
    }

    const pageCount = Math.ceil(filteredData.length / productsPerPage);

    // Reset to page 0 when pageCount changes to 0 (useEffect to avoid render loop)
    useEffect(() => {
        if (pageCount === 0 && currentPage !== 0) {
            setCurrentPage(0);
        }
    }, [pageCount, currentPage])

    // Reset to page 0 when category or tag changes
    useEffect(() => {
        setCurrentPage(0);
    }, [category, selectedTag])

    const currentProducts = filteredData.slice(offset, offset + productsPerPage);

    const handlePageChange = (selected: number) => {
        setCurrentPage(selected);
    };

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='Blog Default' subHeading='Blog Default' />
            </div>
            <div className='blog default md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between max-md:flex-col gap-y-12">
                        <div className="left xl:w-3/4 md:w-2/3 pr-2">
                            {loading ? (
                                <div className="text-secondary text-center py-10">Loading blogs...</div>
                            ) : (
                                <div className="list-blog flex flex-col md:gap-10 gap-8">
                                    {currentProducts.map(item => (
                                        <BlogItem key={item.id} data={transformBlogToBlogType(item, locale)} type='style-default' />
                                    ))}
                                </div>
                            )}
                            {pageCount > 1 && (
                                <div className="list-pagination w-full flex items-center justify-center md:mt-10 mt-6">
                                    <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                        <div className="right xl:w-1/4 md:w-1/3 xl:pl-[52px] md:pl-8">
                            <form className='form-search relative w-full h-12'>
                                <input className='py-2 px-4 w-full h-full border border-line rounded-lg' type="text" placeholder='Search' />
                                <button>
                                    <Icon.MagnifyingGlass className='heading6 text-secondary hover:text-black duration-300 absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer' />
                                </button>
                            </form>
                            <div className="recent md:mt-10 mt-6 pb-8 border-b border-line">
                                <div className="heading6">Recent Posts</div>
                                <div className="list-recent pt-1">
                                    {blogData.slice(0, 3).map(item => (
                                        <div className="item flex gap-4 mt-5 cursor-pointer" key={item.id} onClick={() => handleBlogClick(item.id)}>
                                            <Image
                                                src={item.thumbImg || '/images/blog/1.png'}
                                                width={500}
                                                height={400}
                                                alt={item.thumbImg || 'blog'}
                                                className='w-20 h-20 object-cover rounded-lg flex-shrink-0'
                                            />
                                            <div>
                                                <div className="blog-tag whitespace-nowrap bg-green py-0.5 px-2 rounded-full text-button-uppercase text-xs inline-block">{item.tag || 'Blog'}</div>
                                                <div className="text-title mt-1">{item.title}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="filter-category md:mt-10 mt-6 pb-8 border-b border-line">
                                <div className="heading6">Categories</div>
                                <div className="list-cate pt-1">
                                    <div
                                        className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'eyewear' ? 'active' : ''}`}
                                        onClick={() => handleCategory('eyewear')}
                                    >
                                        <div className='capitalize has-line-before hover:text-black text-secondary'>Eyewear</div>
                                        <div className="text-secondary2">
                                            ({blogData.filter(dataItem => dataItem.category === 'eyewear').length})
                                        </div>
                                    </div>
                                    <div
                                        className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'cosmetic' ? 'active' : ''}`}
                                        onClick={() => handleCategory('cosmetic')}
                                    >
                                        <div className='capitalize has-line-before hover:text-black text-secondary'>cosmetic</div>
                                        <div className="text-secondary2">
                                            ({blogData.filter(dataItem => dataItem.category === 'cosmetic').length})
                                        </div>
                                    </div>
                                    <div
                                        className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'toys-kid' ? 'active' : ''}`}
                                        onClick={() => handleCategory('toys-kid')}
                                    >
                                        <div className='capitalize has-line-before hover:text-black text-secondary'>toys kid</div>
                                        <div className="text-secondary2">
                                            ({blogData.filter(dataItem => dataItem.category === 'toys-kid').length})
                                        </div>
                                    </div>
                                    <div
                                        className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'yoga' ? 'active' : ''}`}
                                        onClick={() => handleCategory('yoga')}
                                    >
                                        <div className='capitalize has-line-before hover:text-black text-secondary'>yoga</div>
                                        <div className="text-secondary2">
                                            ({blogData.filter(dataItem => dataItem.category === 'yoga').length})
                                        </div>
                                    </div>
                                    <div
                                        className={`cate-item flex items-center justify-between cursor-pointer mt-3 ${category === 'organic' ? 'active' : ''}`}
                                        onClick={() => handleCategory('organic')}
                                    >
                                        <div className='capitalize has-line-before hover:text-black text-secondary'>organic</div>
                                        <div className="text-secondary2">
                                            ({blogData.filter(dataItem => dataItem.category === 'organic').length})
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="filter-tags md:mt-10 mt-6">
                                <div className="heading6">Tags Cloud</div>
                                {tagsLoading ? (
                                    <div className="text-secondary text-center py-4">Loading tags...</div>
                                ) : tags.length === 0 ? (
                                    <div className="text-secondary text-center py-4">No tags available</div>
                                ) : (
                                    <div className="list-tags flex items-center flex-wrap gap-3 mt-4">
                                        {tags.map((tag) => (
                                            <div
                                                key={tag.id}
                                                className={`tags bg-white border border-line py-1.5 px-4 rounded-full text-button-uppercase text-secondary cursor-pointer duration-300 hover:bg-black hover:text-white ${selectedTag === tag.slug ? 'active bg-black text-white' : ''}`}
                                                onClick={() => handleTag(tag.slug)}
                                            >
                                                {tag.name} {tag.blogCount !== undefined && `(${tag.blogCount})`}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default BlogDefaultContent


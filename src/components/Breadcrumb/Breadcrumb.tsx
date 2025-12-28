import React from 'react'
import { Link } from '@/i18n/routing'
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface Pros {
    heading: string
    subHeading: string
    description?: string
}

const Breadcrumb: React.FC<Pros> = ({ heading, subHeading, description }) => {
    return (
        <>
            <div className="breadcrumb-block style-shared">
                <div className="breadcrumb-main bg-linear overflow-hidden pt-[86px] md:pt-[118px]">
                    <div className="container relative min-h-[240px] md:min-h-[280px] flex items-center justify-center py-16 lg:py-20">
                        <div className="main-content w-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center">{heading}</div>
                                <div className="link flex items-center justify-center gap-1 caption1 mt-3">
                                    <Link href={'/'}>Homepage</Link>
                                    <Icon.CaretRight size={14} className='text-secondary2' />
                                    <div className='caption1 text-secondary2 capitalize'>{subHeading}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Breadcrumb
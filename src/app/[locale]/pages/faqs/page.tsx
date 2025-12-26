'use client'
import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Faqs = () => {
    const t = useTranslations()
    const [activeTab, setActiveTab] = useState<string | undefined>(t('pages.faqs.tabs.howToBuy'))
    const [activeQuestion, setActiveQuestion] = useState<string | undefined>('')

    const handleActiveTab = (tab: string) => {
        setActiveTab(tab)
    }

    const handleActiveQuestion = (question: string) => {
        setActiveQuestion(prevQuestion => prevQuestion === question ? undefined : question)
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading={t('pages.faqs.heading')} subHeading={t('pages.faqs.heading')} />
            </div>
            <div className='faqs-block md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between">
                        <div className="left w-1/4">
                            <div className="menu-tab flex flex-col gap-5">
                                {[
                                    t('pages.faqs.tabs.howToBuy'),
                                    t('pages.faqs.tabs.paymentMethods'),
                                    t('pages.faqs.tabs.delivery'),
                                    t('pages.faqs.tabs.exchangesReturns'),
                                    t('pages.faqs.tabs.registration'),
                                    t('pages.faqs.tabs.lookAfterGarments'),
                                    t('pages.faqs.tabs.contacts')
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`tab-item inline-block w-fit heading6 has-line-before text-secondary2 hover:text-black duration-300 ${activeTab === item ? 'active' : ''}`}
                                        onClick={() => handleActiveTab(item)}
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="right w-2/3">
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === t('pages.faqs.tabs.howToBuy') ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '1' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('1')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === t('pages.faqs.tabs.paymentMethods') ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === t('pages.faqs.tabs.delivery') ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '1' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('1')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === t('pages.faqs.tabs.exchangesReturns') ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === t('pages.faqs.tabs.registration') ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '1' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('1')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === t('pages.faqs.tabs.lookAfterGarments') ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                            </div>
                            <div className={`tab-question flex flex-col gap-5 ${activeTab === t('pages.faqs.tabs.contacts') ? 'active' : ''}`}>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '1' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('1')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '2' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('2')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '3' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('3')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '4' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('4')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '5' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('5')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.covid19Affect')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.covid19Short')}</div>
                                </div>
                                <div
                                    className={`question-item px-7 py-5 rounded-[20px] overflow-hidden border border-line cursor-pointer ${activeQuestion === '6' ? 'open' : ''}`}
                                    onClick={() => handleActiveQuestion('6')}
                                >
                                    <div className="heading flex items-center justify-between gap-6">
                                        <div className="heading6">{t('pages.faqs.questions.plusSizes')}</div>
                                        <Icon.CaretRight size={24} />
                                    </div>
                                    <div className="content body1 text-secondary">{t('pages.faqs.answers.plusSizesShort')}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default Faqs
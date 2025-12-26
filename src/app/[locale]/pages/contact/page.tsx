'use client'
import React from 'react'
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer'
import FormField from '@/components/Form/FormField'
import FormError from '@/components/Form/FormError'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { useToast } from '@/context/ToastContext'

const ContactUs = () => {
    const t = useTranslations()
    const { success } = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm<ContactFormData>({
        resolver: zodResolver(contactSchema),
    })

    const onSubmit = async (data: ContactFormData) => {
        // TODO: Implement actual contact form submission
        console.log('Contact data:', data)
        success(t('pages.contact.messageSent'))
        reset()
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading={t('pages.contact.heading')} subHeading={t('pages.contact.heading')} />
            </div>
            <div className='contact-us md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between max-lg:flex-col gap-y-10">
                        <div className="left lg:w-2/3 lg:pr-4">
                            <div className="heading3">{t('pages.contact.formTitle')}</div>
                            <div className="body1 text-secondary2 mt-3">{t('pages.contact.formDescription')}</div>
                            <form className="md:mt-6 mt-4" onSubmit={handleSubmit(onSubmit)}>
                                <div className='grid sm:grid-cols-2 grid-cols-1 gap-4 gap-y-5'>
                                    <FormField
                                        {...register('name')}
                                        type="text"
                                        placeholder={t('pages.contact.namePlaceholder')}
                                        error={errors.name}
                                        required
                                    />
                                    <FormField
                                        {...register('email')}
                                        type="email"
                                        placeholder={t('pages.contact.emailPlaceholder')}
                                        error={errors.email}
                                        required
                                    />
                                    <div className="sm:col-span-2">
                                        <FormField
                                            {...register('subject')}
                                            type="text"
                                            placeholder={t('pages.contact.subjectPlaceholder')}
                                            error={errors.subject}
                                            required
                                        />
                                    </div>
                                    <div className="message sm:col-span-2">
                                        <div className="form-field">
                                            <textarea
                                                {...register('message')}
                                                className={`w-full px-4 py-3 rounded-lg border ${
                                                    errors.message ? 'border-red' : 'border-line'
                                                } focus:border-black focus:outline-none transition-colors`}
                                                rows={3}
                                                placeholder={t('pages.contact.messagePlaceholder')}
                                                aria-invalid={errors.message ? 'true' : 'false'}
                                                aria-describedby={errors.message ? 'message-error' : undefined}
                                                required
                                            />
                                            <FormError error={errors.message} id="message-error" />
                                        </div>
                                    </div>
                                </div>
                                <div className="block-button md:mt-6 mt-4">
                                    <button type="submit" className="button-main" disabled={isSubmitting}>
                                        {isSubmitting ? t('pages.contact.sending') : t('pages.contact.sendMessage')}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right lg:w-1/4 lg:pl-4">
                            <div className="item">
                                <div className="heading4">{t('pages.contact.ourStore')}</div>
                                <p className="mt-3">{t('pages.contact.storeAddress')}</p>
                                <p className="mt-3">{t('pages.contact.phone')}: <span className='whitespace-nowrap'>{t('pages.contact.storePhone')}</span></p>
                                <p className="mt-1">{t('pages.contact.email')}: <span className='whitespace-nowrap'>{t('pages.contact.storeEmail')}</span></p>
                            </div>
                            <div className="item mt-10">
                                <div className="heading4">{t('pages.contact.openHours')}</div>
                                <p className="mt-3">{t('pages.contact.monFri')}: <span className='whitespace-nowrap'>{t('pages.contact.hoursWeekdays')}</span></p>
                                <p className="mt-3">{t('pages.contact.saturday')}: <span className='whitespace-nowrap'>{t('pages.contact.hoursSaturday')}</span></p>
                                <p className="mt-3">{t('pages.contact.sunday')}: <span className='whitespace-nowrap'>{t('pages.contact.hoursSunday')}</span></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}

export default ContactUs
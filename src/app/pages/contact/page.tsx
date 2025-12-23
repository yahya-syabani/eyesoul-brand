'use client'
import React from 'react'
import Image from 'next/image';
import Link from 'next/link';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import Footer from '@/components/Footer/Footer'
import FormField from '@/components/Form/FormField'
import FormError from '@/components/Form/FormError'
import { contactSchema, type ContactFormData } from '@/lib/validations'
import { useToast } from '@/context/ToastContext'

const ContactUs = () => {
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
        success('Message sent successfully!')
        reset()
    }

    return (
        <>
            <TopNavOne props="style-two bg-purple" slogan='Limited Offer: Free shipping on orders over $50' />
            <div id="header" className='relative w-full'>
                <MenuTwo />
                <Breadcrumb heading='Contact us' subHeading='Contact us' />
            </div>
            <div className='contact-us md:py-20 py-10'>
                <div className="container">
                    <div className="flex justify-between max-lg:flex-col gap-y-10">
                        <div className="left lg:w-2/3 lg:pr-4">
                            <div className="heading3">Drop Us A Line</div>
                            <div className="body1 text-secondary2 mt-3">Use the form below to get in touch with the sales team</div>
                            <form className="md:mt-6 mt-4" onSubmit={handleSubmit(onSubmit)}>
                                <div className='grid sm:grid-cols-2 grid-cols-1 gap-4 gap-y-5'>
                                    <FormField
                                        {...register('name')}
                                        type="text"
                                        placeholder="Your Name *"
                                        error={errors.name}
                                        required
                                    />
                                    <FormField
                                        {...register('email')}
                                        type="email"
                                        placeholder="Your Email *"
                                        error={errors.email}
                                        required
                                    />
                                    <div className="sm:col-span-2">
                                        <FormField
                                            {...register('subject')}
                                            type="text"
                                            placeholder="Subject *"
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
                                                placeholder="Your Message *"
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
                                        {isSubmitting ? 'Sending...' : 'Send message'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right lg:w-1/4 lg:pl-4">
                            <div className="item">
                                <div className="heading4">Our Store</div>
                                <p className="mt-3">2163 Phillips Gap Rd, West Jefferson, North Carolina, United States</p>
                                <p className="mt-3">Phone: <span className='whitespace-nowrap'>+1 666 8888</span></p>
                                <p className="mt-1">Email: <span className='whitespace-nowrap'>hi.avitex@gmail.com</span></p>
                            </div>
                            <div className="item mt-10">
                                <div className="heading4">Open Hours</div>
                                <p className="mt-3">Mon - Fri: <span className='whitespace-nowrap'>7:30am - 8:00pm PST</span></p>
                                <p className="mt-3">Saturday: <span className='whitespace-nowrap'>8:00am - 6:00pm PST</span></p>
                                <p className="mt-3">Sunday: <span className='whitespace-nowrap'>9:00am - 5:00pm PST</span></p>
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
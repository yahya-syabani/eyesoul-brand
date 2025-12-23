'use client'
import React from 'react'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import FormField from '@/components/Form/FormField'
import { registerSchema, type RegisterFormData } from '@/lib/validations'
import { useToast } from '@/context/ToastContext'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Register = () => {
    const { success } = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>({
        resolver: zodResolver(registerSchema),
    })

    const onSubmit = async (data: RegisterFormData) => {
        // TODO: Implement actual registration logic
        console.log('Register data:', data)
        success('Registration successful!')
    }

    return (
        <>
            <TopNavOne props="style-two bg-purple" slogan='Limited Offer: Free shipping on orders over $50' />
            <div id="header" className='relative w-full'>
                <MenuTwo />
                <Breadcrumb heading='Create An Account' subHeading='Create An Account' />
            </div>
            <div className="register-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4">Register</div>
                            <form className="md:mt-7 mt-4" onSubmit={handleSubmit(onSubmit)}>
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <FormField
                                        {...register('firstName')}
                                        type="text"
                                        placeholder="First Name *"
                                        error={errors.firstName}
                                        required
                                    />
                                    <FormField
                                        {...register('lastName')}
                                        type="text"
                                        placeholder="Last Name *"
                                        error={errors.lastName}
                                        required
                                    />
                                </div>
                                <div className="mt-5">
                                    <FormField
                                        {...register('email')}
                                        type="email"
                                        placeholder="Email address *"
                                        error={errors.email}
                                        required
                                    />
                                </div>
                                <div className="mt-5">
                                    <FormField
                                        {...register('password')}
                                        type="password"
                                        placeholder="Password *"
                                        error={errors.password}
                                        required
                                    />
                                </div>
                                <div className="mt-5">
                                    <FormField
                                        {...register('confirmPassword')}
                                        type="password"
                                        placeholder="Confirm Password *"
                                        error={errors.confirmPassword}
                                        required
                                    />
                                </div>
                                <div className='flex items-center mt-5'>
                                    <div className="block-input">
                                        <input
                                            type="checkbox"
                                            {...register('acceptTerms')}
                                            id='acceptTerms'
                                        />
                                        <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                    </div>
                                    <label htmlFor='acceptTerms' className="pl-2 cursor-pointer text-secondary2">I agree to the
                                        <Link href={'#!'} className='text-black hover:underline pl-1'>Terms of User</Link>
                                    </label>
                                </div>
                                {errors.acceptTerms && (
                                    <p className="caption2 text-red mt-1">{errors.acceptTerms.message}</p>
                                )}
                                <div className="block-button md:mt-7 mt-4">
                                    <button type="submit" className="button-main" disabled={isSubmitting}>
                                        {isSubmitting ? 'Registering...' : 'Register'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4">Already have an account?</div>
                                <div className="mt-2 text-secondary">Welcome back. Sign in to access your personalized experience, saved preferences, and more. We{String.raw`'re`} thrilled to have you with us again!</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link href={'/login'} className="button-main">Login</Link>
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

export default Register
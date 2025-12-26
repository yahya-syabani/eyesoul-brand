'use client'
import React from 'react'
import { Link } from '@/i18n/routing'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import FormField from '@/components/Form/FormField'
import { loginSchema, type LoginFormData } from '@/lib/validations'
import { useToast } from '@/context/ToastContext'
import * as Icon from "@phosphor-icons/react/dist/ssr";

const Login = () => {
    const { success } = useToast()
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    })

    const onSubmit = async (data: LoginFormData) => {
        // TODO: Implement actual login logic
        console.log('Login data:', data)
        success('Login successful!')
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading='Login' subHeading='Login' />
            </div>
            <div className="login-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex gap-y-8 max-md:flex-col">
                        <div className="left md:w-1/2 w-full lg:pr-[60px] md:pr-[40px] md:border-r border-line">
                            <div className="heading4">Login</div>
                            <form className="md:mt-7 mt-4" onSubmit={handleSubmit(onSubmit)}>
                                <FormField
                                    {...register('email')}
                                    type="email"
                                    placeholder="Username or email address *"
                                    error={errors.email}
                                    required
                                />
                                <div className="mt-5">
                                    <FormField
                                        {...register('password')}
                                        type="password"
                                        placeholder="Password *"
                                        error={errors.password}
                                        required
                                    />
                                </div>
                                <div className="flex items-center justify-between mt-5">
                                    <div className='flex items-center'>
                                        <div className="block-input">
                                            <input
                                                type="checkbox"
                                                {...register('remember')}
                                                id='remember'
                                            />
                                            <Icon.CheckSquare size={20} weight='fill' className='icon-checkbox' />
                                        </div>
                                        <label htmlFor='remember' className="pl-2 cursor-pointer">Remember me</label>
                                    </div>
                                    <Link href={'/forgot-password'} className='font-semibold hover:underline'>Forgot Your Password?</Link>
                                </div>
                                <div className="block-button md:mt-7 mt-4">
                                    <button type="submit" className="button-main" disabled={isSubmitting}>
                                        {isSubmitting ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>
                            </form>
                        </div>
                        <div className="right md:w-1/2 w-full lg:pl-[60px] md:pl-[40px] flex items-center">
                            <div className="text-content">
                                <div className="heading4">New Customer</div>
                                <div className="mt-2 text-secondary">Be part of our growing family of new customers! Join us today and unlock a world of exclusive benefits, offers, and personalized experiences.</div>
                                <div className="block-button md:mt-7 mt-4">
                                    <Link href={'/register'} className="button-main">Register</Link>
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

export default Login
'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import TopNavOne from '@/components/Header/TopNav/TopNavOne'
import MenuTwo from '@/components/Header/Menu/MenuTwo'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import FormField from '@/components/Form/FormField'
import FormError from '@/components/Form/FormError'
import { checkoutSchema, type CheckoutFormData } from '@/lib/validations'
import { useToast } from '@/context/ToastContext'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from '@/context/CartContext'

const CheckoutContent = () => {
    const searchParams = useSearchParams()
    let discount = searchParams.get('discount')
    let ship = searchParams.get('ship')

    const { cartState } = useCart();
    const { success } = useToast()
    let [totalCart, setTotalCart] = useState<number>(0)
    
    cartState.cartArray.map(item => totalCart += item.price * item.quantity)

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting },
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            paymentMethod: 'credit-card',
        },
    })

    const activePayment = watch('paymentMethod')

    const onSubmit = async (data: CheckoutFormData) => {
        // TODO: Implement actual checkout logic
        console.log('Checkout data:', data)
        success('Order placed successfully!')
    }

    return (
        <>
            <TopNavOne props="style-two bg-purple" slogan='Limited Offer: Free shipping on orders over $50' />
            <div id="header" className='relative w-full'>
                <MenuTwo />
                <Breadcrumb heading='Shopping cart' subHeading='Shopping cart' />
            </div>
            <div className="cart-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex justify-between">
                        <div className="left w-1/2">
                            <div className="login bg-surface py-3 px-4 flex justify-between rounded-lg">
                                <div className="left flex items-center"><span className="text-on-surface-variant1 pr-4">Already have an account? </span><span className="text-button text-on-surface hover-underline cursor-pointer">Login</span></div>
                                <div className="right"><i className="ph ph-caret-down fs-20 d-block cursor-pointer"></i></div>
                            </div>
                            <div className="form-login-block mt-3">
                                <form className="p-5 border border-line rounded-lg">
                                    <div className="grid sm:grid-cols-2 gap-5">
                                        <div className="email ">
                                            <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="username" type="email" placeholder="Username or email" required />
                                        </div>
                                        <div className="pass ">
                                            <input className="border-line px-4 pt-3 pb-3 w-full rounded-lg" id="password" type="password" placeholder="Password" required />
                                        </div>
                                    </div>
                                    <div className="block-button mt-3">
                                        <button className="button-main button-blue-hover">Login</button>
                                    </div>
                                </form>
                            </div>
                            <div className="information mt-5">
                                <div className="heading5">Information</div>
                                <div className="form-checkout mt-5">
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="grid sm:grid-cols-2 gap-4 gap-y-5 flex-wrap">
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
                                            <FormField
                                                {...register('email')}
                                                type="email"
                                                placeholder="Email Address *"
                                                error={errors.email}
                                                required
                                            />
                                            <FormField
                                                {...register('phoneNumber')}
                                                type="tel"
                                                placeholder="Phone Numbers *"
                                                error={errors.phoneNumber}
                                                required
                                            />
                                            <div className="col-span-full select-block">
                                                <div className="form-field">
                                                    <select
                                                        {...register('country')}
                                                        className={`border px-4 py-3 w-full rounded-lg ${
                                                            errors.country ? 'border-red' : 'border-line'
                                                        }`}
                                                        aria-invalid={errors.country ? 'true' : 'false'}
                                                    >
                                                        <option value="">Choose Country/Region</option>
                                                        <option value="India">India</option>
                                                        <option value="France">France</option>
                                                        <option value="Singapore">Singapore</option>
                                                    </select>
                                                    <Icon.CaretDown className='arrow-down' />
                                                    <FormError error={errors.country} />
                                                </div>
                                            </div>
                                            <FormField
                                                {...register('city')}
                                                type="text"
                                                placeholder="Town/City *"
                                                error={errors.city}
                                                required
                                            />
                                            <FormField
                                                {...register('address')}
                                                type="text"
                                                placeholder="Street,..."
                                                error={errors.address}
                                                required
                                            />
                                            <div className="select-block">
                                                <div className="form-field">
                                                    <select
                                                        {...register('state')}
                                                        className={`border px-4 py-3 w-full rounded-lg ${
                                                            errors.state ? 'border-red' : 'border-line'
                                                        }`}
                                                        aria-invalid={errors.state ? 'true' : 'false'}
                                                    >
                                                        <option value="">Choose State</option>
                                                        <option value="India">India</option>
                                                        <option value="France">France</option>
                                                        <option value="Singapore">Singapore</option>
                                                    </select>
                                                    <Icon.CaretDown className='arrow-down' />
                                                    <FormError error={errors.state} />
                                                </div>
                                            </div>
                                            <FormField
                                                {...register('postalCode')}
                                                type="text"
                                                placeholder="Postal Code *"
                                                error={errors.postalCode}
                                                required
                                            />
                                            <div className="col-span-full">
                                                <div className="form-field">
                                                    <textarea
                                                        {...register('note')}
                                                        className={`border px-4 py-3 w-full rounded-lg ${
                                                            errors.note ? 'border-red' : 'border-line'
                                                        }`}
                                                        placeholder="Write note..."
                                                        rows={3}
                                                    />
                                                    <FormError error={errors.note} />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="payment-block md:mt-10 mt-6">
                                            <div className="heading5">Choose payment Option:</div>
                                            {errors.paymentMethod && (
                                                <FormError error={errors.paymentMethod} className="mt-2" />
                                            )}
                                            <div className="list-payment mt-5">
                                                <div className={`type bg-surface p-5 border border-line rounded-lg ${activePayment === 'credit-card' ? 'open' : ''}`}>
                                                    <input
                                                        {...register('paymentMethod')}
                                                        className="cursor-pointer"
                                                        type="radio"
                                                        id="credit"
                                                        value="credit-card"
                                                    />
                                                    <label className="text-button pl-2 cursor-pointer" htmlFor="credit">Credit Card</label>
                                                    <div className="infor">
                                                        <div className="text-on-surface-variant1 pt-4">Make your payment directly into our bank account. Your order will not be shipped until the funds have cleared in our account.</div>
                                                        {activePayment === 'credit-card' && (
                                                            <>
                                                                <div className="row">
                                                                    <div className="col-12 mt-3">
                                                                        <label htmlFor="cardNumberCredit">Card Numbers</label>
                                                                        <FormField
                                                                            {...register('cardNumber')}
                                                                            type="text"
                                                                            id="cardNumberCredit"
                                                                            placeholder="ex.1234567290"
                                                                            error={errors.cardNumber}
                                                                        />
                                                                    </div>
                                                                    <div className="mt-3">
                                                                        <label htmlFor="dateCredit">Date</label>
                                                                        <FormField
                                                                            {...register('cardDate')}
                                                                            type="date"
                                                                            id="dateCredit"
                                                                            error={errors.cardDate}
                                                                        />
                                                                    </div>
                                                                    <div className="mt-3">
                                                                        <label htmlFor="ccvCredit">CCV</label>
                                                                        <FormField
                                                                            {...register('cardCCV')}
                                                                            type="text"
                                                                            id="ccvCredit"
                                                                            placeholder="****"
                                                                            error={errors.cardCCV}
                                                                        />
                                                                    </div>
                                                                </div>
                                                                <div className="flex items-center gap-2 mt-3">
                                                                    <input
                                                                        {...register('saveCard')}
                                                                        type="checkbox"
                                                                        id="saveCredit"
                                                                    />
                                                                    <label className="text-button" htmlFor="saveCredit">Save Card Details</label>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <div className={`type bg-surface p-5 border border-line rounded-lg mt-5 ${activePayment === 'cash-delivery' ? 'open' : ''}`}>
                                                    <input
                                                        {...register('paymentMethod')}
                                                        className="cursor-pointer"
                                                        type="radio"
                                                        id="delivery"
                                                        value="cash-delivery"
                                                    />
                                                    <label className="text-button pl-2 cursor-pointer" htmlFor="delivery">Cash on delivery</label>
                                                    <div className="infor">
                                                        <div className="text-on-surface-variant1 pt-4">Make your payment directly into our bank account. Your order will not be shipped until the funds have cleared in our account.</div>
                                                    </div>
                                                </div>
                                                <div className={`type bg-surface p-5 border border-line rounded-lg mt-5 ${activePayment === 'apple-pay' ? 'open' : ''}`}>
                                                    <input
                                                        {...register('paymentMethod')}
                                                        className="cursor-pointer"
                                                        type="radio"
                                                        id="apple"
                                                        value="apple-pay"
                                                    />
                                                    <label className="text-button pl-2 cursor-pointer" htmlFor="apple">Apple Pay</label>
                                                    <div className="infor">
                                                        <div className="text-on-surface-variant1 pt-4">Make your payment directly into our bank account. Your order will not be shipped until the funds have cleared in our account.</div>
                                                    </div>
                                                </div>
                                                <div className={`type bg-surface p-5 border border-line rounded-lg mt-5 ${activePayment === 'paypal' ? 'open' : ''}`}>
                                                    <input
                                                        {...register('paymentMethod')}
                                                        className="cursor-pointer"
                                                        type="radio"
                                                        id="paypal"
                                                        value="paypal"
                                                    />
                                                    <label className="text-button pl-2 cursor-pointer" htmlFor="paypal">PayPal</label>
                                                    <div className="infor">
                                                        <div className="text-on-surface-variant1 pt-4">Make your payment directly into our bank account. Your order will not be shipped until the funds have cleared in our account.</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="block-button md:mt-10 mt-6">
                                            <button type="submit" className="button-main w-full" disabled={isSubmitting}>
                                                {isSubmitting ? 'Processing...' : 'Payment'}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>

                        </div>
                        <div className="right w-5/12">
                            <div className="checkout-block">
                                <div className="heading5 pb-3">Your Order</div>
                                <div className="list-product-checkout">
                                    {cartState.cartArray.length < 1 ? (
                                        <p className='text-button pt-3'>No product in cart</p>
                                    ) : (
                                        cartState.cartArray.map((product) => (
                                            <div key={product.id} className="item flex items-center justify-between w-full pb-5 border-b border-line gap-6 mt-5">
                                                <div className="bg-img w-[100px] aspect-square flex-shrink-0 rounded-lg overflow-hidden">
                                                    <Image
                                                        src={product.thumbImage[0]}
                                                        width={500}
                                                        height={500}
                                                        alt='img'
                                                        className='w-full h-full'
                                                    />
                                                </div>
                                                <div className="flex items-center justify-between w-full">
                                                    <div>
                                                        <div className="name text-title">{product.name}</div>
                                                        <div className="caption1 text-secondary mt-2">
                                                            <span className='size capitalize'>{product.selectedSize || product.sizes[0]}</span>
                                                            <span>/</span>
                                                            <span className='color capitalize'>{product.selectedColor || product.variation[0].color}</span>
                                                        </div>
                                                    </div>
                                                    <div className="text-title">
                                                        <span className='quantity'>{product.quantity}</span>
                                                        <span className='px-1'>x</span>
                                                        <span>
                                                            ${product.price}.00
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                                <div className="discount-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Discounts</div>
                                    <div className="text-title">-$<span className="discount">{discount}</span><span>.00</span></div>
                                </div>
                                <div className="ship-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">Shipping</div>
                                    <div className="text-title">{Number(ship) === 0 ? 'Free' : `$${ship}.00`}</div>
                                </div>
                                <div className="total-cart-block pt-5 flex justify-between">
                                    <div className="heading5">Total</div>
                                    <div className="heading5 total-cart">${totalCart - Number(discount) + Number(ship)}.00</div>
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

export default CheckoutContent


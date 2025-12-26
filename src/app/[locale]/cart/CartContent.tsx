'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Image from 'next/image'
import { Link, useRouter } from '@/i18n/routing'
import { useTranslations } from 'next-intl'
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb'
import Footer from '@/components/Footer/Footer'
import * as Icon from "@phosphor-icons/react/dist/ssr";
import { useCart } from '@/context/CartContext'
import { useCartExpiry } from '@/hooks/useCartExpiry'
import { useToast } from '@/context/ToastContext'

interface Promotion {
  id: string
  code: string
  discountPercent: number
  minOrder: number
  isActive: boolean
  validFrom: string | null
  validUntil: string | null
  usageLimit: number | null
  usedCount: number
}

const CartContent = () => {
    const t = useTranslations()
    const { timeLeft } = useCartExpiry()
    const router = useRouter()
    const { error } = useToast()

    const { cartState, updateCart, removeFromCart } = useCart();

    const handleQuantityChange = (productId: string, newQuantity: number) => {
        const itemToUpdate = cartState.cartArray.find((item) => item.id === productId);
        if (itemToUpdate) {
            updateCart(productId, newQuantity, itemToUpdate.selectedSize, itemToUpdate.selectedColor);
        }
    };

    let moneyForFreeship = 150;
    const totalCart = useMemo(() => {
        return cartState.cartArray.reduce((sum, item) => sum + item.price * item.quantity, 0)
    }, [cartState.cartArray])

    let [discountCart, setDiscountCart] = useState<number>(0)
    let [shipCart, setShipCart] = useState<number>(30)
    let [applyCode, setApplyCode] = useState<string>('')
    let [promotions, setPromotions] = useState<Promotion[]>([])
    let [promotionCode, setPromotionCode] = useState<string>('')
    let [loadingPromotions, setLoadingPromotions] = useState(true)

    useEffect(() => {
        loadPromotions()
    }, [])

    const loadPromotions = async () => {
        try {
            const res = await fetch('/api/promotions?isActive=true&limit=100', { cache: 'no-store' })
            if (res.ok) {
                const json = await res.json()
                setPromotions(json.data || [])
            }
        } catch (error) {
            console.error('Error loading promotions:', error)
        } finally {
            setLoadingPromotions(false)
        }
    }

    const handleApplyCode = async (promotion: Promotion) => {
        try {
            const res = await fetch('/api/promotions/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: promotion.code,
                    orderAmount: totalCart,
                }),
            })

            if (res.ok) {
                const json = await res.json()
                if (json.valid) {
                    setApplyCode(promotion.code)
                    setDiscountCart(json.promotion.discountAmount)
                } else {
                    error(json.error || t('cart.invalidPromoCode'))
                }
            } else {
                const json = await res.json()
                error(json.error || t('cart.failedToValidate'))
            }
        } catch (err) {
            console.error('Error validating promotion:', err)
            error(t('cart.failedToValidate'))
        }
    }

    const handleApplyCustomCode = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!promotionCode.trim()) return

        try {
            const res = await fetch('/api/promotions/validate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    code: promotionCode.trim().toUpperCase(),
                    orderAmount: totalCart,
                }),
            })

            if (res.ok) {
                const json = await res.json()
                if (json.valid) {
                    setApplyCode(json.promotion.code)
                    setDiscountCart(json.promotion.discountAmount)
                    setPromotionCode('')
                } else {
                    error(json.error || t('cart.invalidPromoCode'))
                }
            } else {
                const json = await res.json()
                error(json.error || t('cart.failedToValidate'))
            }
        } catch (err) {
            console.error('Error validating promotion:', err)
            error(t('cart.failedToValidate'))
        }
    }

    const cartIsEmpty = cartState.cartArray.length === 0
    const effectiveDiscountCart = applyCode ? discountCart : 0

    const eligibleFreeShipping = !cartIsEmpty && totalCart >= moneyForFreeship
    const effectiveShipCart = cartIsEmpty ? 0 : shipCart === 0 && !eligibleFreeShipping ? 30 : shipCart

    const redirectToCheckout = () => {
        router.push(`/checkout?discount=${effectiveDiscountCart}&ship=${effectiveShipCart}`)
    }

    return (
        <>
            <div id="header" className='relative w-full'>
                <Breadcrumb heading={t('cart.title')} subHeading={t('cart.title')} />
            </div>
            <div className="cart-block md:py-20 py-10">
                <div className="container">
                    <div className="content-main flex justify-between max-xl:flex-col gap-y-8">
                        <div className="xl:w-2/3 xl:pr-3 w-full">
                            <div className="time bg-green py-3 px-5 flex items-center rounded-lg">
                                <div className="heding5">🔥</div>
                                <div className="caption1 pl-2">
                                    {t('cart.cartExpiresIn', { 
                                        minutes: timeLeft.minutes, 
                                        seconds: timeLeft.seconds < 10 ? `0${timeLeft.seconds}` : timeLeft.seconds 
                                    })}
                                </div>
                            </div>
                            <div className="heading banner mt-5">
                                <div className="text">{t('cart.buy')}
                                    <span className="text-button"> $<span className="more-price">{moneyForFreeship - totalCart > 0 ? (<>{moneyForFreeship - totalCart}</>) : (0)}</span>.00 </span>
                                    <span>{t('cart.more')} </span>
                                    <span className="text-button">{t('cart.freeship')}</span>
                                </div>
                                <div className="tow-bar-block mt-4">
                                    <div
                                        className="progress-line"
                                        style={{ width: totalCart <= moneyForFreeship ? `${(totalCart / moneyForFreeship) * 100}%` : `100%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="list-product w-full sm:mt-7 mt-5">
                                <div className='w-full'>
                                    <div className="heading bg-surface bora-4 pt-4 pb-4">
                                        <div className="flex">
                                            <div className="w-1/2">
                                                <div className="text-button text-center">{t('cart.products')}</div>
                                            </div>
                                            <div className="w-1/12">
                                                <div className="text-button text-center">{t('cart.price')}</div>
                                            </div>
                                            <div className="w-1/6">
                                                <div className="text-button text-center">{t('cart.quantity')}</div>
                                            </div>
                                            <div className="w-1/6">
                                                <div className="text-button text-center">{t('cart.totalPrice')}</div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="list-product-main w-full mt-3">
                                        {cartState.cartArray.length < 1 ? (
                                            <p className='text-button pt-3'>{t('cart.noProductInCart')}</p>
                                        ) : (
                                            cartState.cartArray.map((product) => (
                                                <div className="item flex md:mt-7 md:pb-7 mt-5 pb-5 border-b border-line w-full" key={product.id}>
                                                    <div className="w-1/2">
                                                        <div className="flex items-center gap-6">
                                                            <div className="bg-img md:w-[100px] w-20 aspect-[3/4]">
                                                                <Image
                                                                    src={product.thumbImage[0]}
                                                                    width={1000}
                                                                    height={1000}
                                                                    alt={product.name}
                                                                    className='w-full h-full object-cover rounded-lg'
                                                                />
                                                            </div>
                                                            <div>
                                                                <div className="text-title">{product.name}</div>
                                                                <div className="list-select mt-3"></div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="w-1/12 price flex items-center justify-center">
                                                        <div className="text-title text-center">${product.price}.00</div>
                                                    </div>
                                                    <div className="w-1/6 flex items-center justify-center">
                                                        <div className="quantity-block bg-surface md:p-3 p-2 flex items-center justify-between rounded-lg border border-line md:w-[100px] flex-shrink-0 w-20">
                                                            <Icon.Minus
                                                                onClick={() => {
                                                                    if (product.quantity > 1) {
                                                                        handleQuantityChange(product.id, product.quantity - 1)
                                                                    }
                                                                }}
                                                                className={`text-base max-md:text-sm ${product.quantity === 1 ? 'disabled' : ''}`}
                                                            />
                                                            <div className="text-button quantity">{product.quantity}</div>
                                                            <Icon.Plus
                                                                onClick={() => handleQuantityChange(product.id, product.quantity + 1)}
                                                                className='text-base max-md:text-sm'
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="w-1/6 flex total-price items-center justify-center">
                                                        <div className="text-title text-center">${product.quantity * product.price}.00</div>
                                                    </div>
                                                    <div className="w-1/12 flex items-center justify-center">
                                                        <Icon.XCircle
                                                            className='text-xl max-md:text-base text-red cursor-pointer hover:text-black duration-500'
                                                            onClick={() => {
                                                                removeFromCart(product.id)
                                                            }}
                                                        />
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>
                            <div className="input-block discount-code w-full h-12 sm:mt-7 mt-5">
                                <form onSubmit={handleApplyCustomCode} className='w-full h-full relative'>
                                    <input 
                                        type="text" 
                                        placeholder='Add voucher discount' 
                                        className='w-full h-full bg-surface pl-4 pr-14 rounded-lg border border-line' 
                                        value={promotionCode}
                                        onChange={(e) => setPromotionCode(e.target.value)}
                                        required 
                                    />
                                    <button type="submit" className='button-main absolute top-1 bottom-1 right-1 px-5 rounded-lg flex items-center justify-center'>Apply Code
                                    </button>
                                </form>
                            </div>
                            {loadingPromotions ? (
                                <div className="text-secondary text-center py-4">{t('cart.loadingPromotions')}</div>
                            ) : promotions.length > 0 ? (
                                <div className="list-voucher flex items-center gap-5 flex-wrap sm:mt-7 mt-5">
                                    {promotions.map((promotion) => {
                                        const isApplied = applyCode === promotion.code
                                        const discountAmount = (totalCart * promotion.discountPercent) / 100
                                        return (
                                            <div key={promotion.id} className={`item ${isApplied ? 'bg-green' : ''} border border-line rounded-lg py-2`}>
                                                <div className="top flex gap-10 justify-between px-3 pb-2 border-b border-dashed border-line">
                                                    <div className="left">
                                                        <div className="caption1">{t('cart.discount')}</div>
                                                        <div className="caption1 font-bold">{promotion.discountPercent}% OFF</div>
                                                    </div>
                                                    <div className="right">
                                                        <div className="caption1">{t('cart.forAllOrders')} <br />{t('cart.from')} ${Number(promotion.minOrder).toFixed(0)}</div>
                                                    </div>
                                                </div>
                                                <div className="bottom gap-6 items-center flex justify-between px-3 pt-2">
                                                    <div className="text-button-uppercase">Code: {promotion.code}</div>
                                                    <div
                                                        className="button-main py-1 px-2.5 capitalize text-xs cursor-pointer"
                                                        onClick={() => handleApplyCode(promotion)}
                                                    >
                                                        {isApplied ? t('cart.applied') : t('cart.applyCode')}
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            ) : (
                                <div className="text-secondary text-center py-4">{t('cart.noPromotionsAvailable')}</div>
                            )}
                        </div>
                        <div className="xl:w-1/3 xl:pl-12 w-full">
                            <div className="checkout-block bg-surface p-6 rounded-2xl">
                                <div className="heading5">{t('cart.orderSummary')}</div>
                                <div className="total-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">{t('cart.subtotal')}</div>
                                    <div className="text-title">$<span className="total-product">{totalCart}</span><span>.00</span></div>
                                </div>
                                <div className="discount-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">{t('cart.discounts')}</div>
                                    <div className="text-title"> <span>-$</span><span className="discount">{effectiveDiscountCart}</span><span>.00</span></div>
                                </div>
                                <div className="ship-block py-5 flex justify-between border-b border-line">
                                    <div className="text-title">{t('cart.shipping')}</div>
                                    <div className="choose-type flex gap-12">
                                        <div className="left">
                                            <div className="type">
                                                {moneyForFreeship - totalCart > 0 ?
                                                    (
                                                        <input
                                                            id="shipping"
                                                            type="radio"
                                                            name="ship"
                                                            disabled
                                                        />
                                                    ) : (
                                                        <input
                                                            id="shipping"
                                                            type="radio"
                                                            name="ship"
                                                            checked={effectiveShipCart === 0}
                                                            onChange={() => setShipCart(0)}
                                                        />
                                                    )}
                                                < label className="pl-1" htmlFor="shipping">{t('cart.freeShipping')}</label>
                                            </div>
                                            <div className="type mt-1">
                                                <input
                                                    id="local"
                                                    type="radio"
                                                    name="ship"
                                                    value={30}
                                                    checked={effectiveShipCart === 30}
                                                    onChange={() => setShipCart(30)}
                                                />
                                                <label className="text-on-surface-variant1 pl-1" htmlFor="local">{t('cart.local')}</label>
                                            </div>
                                            <div className="type mt-1">
                                                <input
                                                    id="flat"
                                                    type="radio"
                                                    name="ship"
                                                    value={40}
                                                    checked={effectiveShipCart === 40}
                                                    onChange={() => setShipCart(40)}
                                                />
                                                <label className="text-on-surface-variant1 pl-1" htmlFor="flat">{t('cart.flatRate')}</label>
                                            </div>
                                        </div>
                                        <div className="right">
                                            <div className="ship">$0.00</div>
                                            <div className="local text-on-surface-variant1 mt-1">$30.00</div>
                                            <div className="flat text-on-surface-variant1 mt-1">$40.00</div>
                                        </div>
                                    </div>
                                </div>
                                <div className="total-cart-block pt-4 pb-4 flex justify-between">
                                    <div className="heading5">{t('cart.total')}</div>
                                    <div className="heading5">$
                                        <span className="total-cart heading5">{totalCart - effectiveDiscountCart + effectiveShipCart}</span>
                                        <span className='heading5'>.00</span></div>
                                </div>
                                <div className="block-button flex flex-col items-center gap-y-4 mt-5">
                                    <div className="checkout-btn button-main text-center w-full" onClick={redirectToCheckout}>{t('cart.processToCheckout')}</div>
                                    <Link className="text-button hover-underline" href="/shop/default">{t('cart.continueShopping')}</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </>
    )
}

export default CartContent


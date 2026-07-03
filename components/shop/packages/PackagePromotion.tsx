"use client"

import { Check, Zap, ShoppingCart } from "lucide-react"
import Image from "next/image"
import { ProductCard } from "@/components/shop/products/ProductCard"
import type { Product as ProductCardType } from "@/components/shop/products/ProductCard"

export interface Plan {
  id: string
  name: string
  price: number
  billingPeriod?: string
  features: string[]
  folios: number
  isPopular?: boolean
  cta: string
}

export interface Product {
  id: string
  name: string
  description: string
  image: string
  price: number
  features: string[]
}

export interface FolioRecharge {
  id: string
  quantity: number
  price: number
  savings?: number
}

interface PackagePromotionProps {
  title: string
  subtitle: string
  heroImage: string
  plans: Plan[]
  products?: Product[]
  folioRecharges?: FolioRecharge[]
}

// Convertir Product a ProductCardType para reutilizar ProductCard
const convertToProductCard = (product: Product): ProductCardType => ({
  id: product.id,
  name: product.name,
  slug: product.id, // Usar id como slug por simplicidad
  description: product.description,
  price: product.price,
  image: product.image,
  category: "hardware",
  stock: 10, // Asumimos stock disponible
  featured: false,
})

export function PackagePromotion({
  title,
  subtitle,
  heroImage,
  plans,
  products,
  folioRecharges,
}: PackagePromotionProps) {
  return (
    <section className="pt-40 pb-12 md:pt-48 md:pb-16 bg-[#e6f7f6] dark:bg-[#02505931] backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#04423c] dark:text-[#26FFDF] mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-[#085c54] dark:text-[#b2fff6] max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>

        {/* Main Content: Image + Products (Left) | Plans (Right) */}
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 mb-12 md:mb-16 items-stretch">
          {/* Left Column: Hero Image + Products */}
          <div className="flex flex-col gap-6 h-full">
            {/* Hero Image - Flex-grow para ocupar espacio disponible */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#08A696]/10 to-[#26FFDF]/10 p-8 flex items-center justify-center flex-1">
              <div className="relative w-full h-full min-h-[300px]">
                <Image
                  src={heroImage}
                  alt={title}
                  fill
                  className="object-contain drop-shadow-2xl"
                  priority
                />
              </div>
            </div>

            {/* Products Grid - 3 Columns Horizontal */}
            {products && products.length > 0 && (
              <div className="grid grid-cols-3 gap-3">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={convertToProductCard(product)}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Plans - Flex container para distribución uniforme */}
          <div className="flex flex-col gap-6 h-full">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`relative bg-white/70 dark:bg-[#02505950] backdrop-blur-sm rounded-2xl border-2 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex-1 ${
                  plan.isPopular
                    ? "border-[#08A696] shadow-lg shadow-[#08A696]/20"
                    : "border-[#08A696]/60 dark:border-[#08A696]/30 hover:border-[#08A696]"
                }`}
              >
                {/* Popular Badge */}
                {plan.isPopular && (
                  <div className="absolute -top-3 -right-3">
                    <div className="bg-[#08A696] text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-lg">
                      <Zap className="w-3 h-3" />
                      Más Popular
                    </div>
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between gap-4 mb-4">
                    {/* Plan Info */}
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-[#04423c] dark:text-[#26FFDF] mb-2">
                        {plan.name}
                      </h3>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-bold text-[#08A696] dark:text-[#26FFDF]">
                          ${plan.price.toLocaleString()}
                        </span>
                        {plan.billingPeriod && (
                          <span className="text-sm text-[#085c54] dark:text-[#b2fff6]">
                            /{plan.billingPeriod}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#085c54] dark:text-[#b2fff6] mt-1">
                        {plan.folios === 0 ? "Sin facturación electrónica" : `Incluye ${plan.folios} folios`}
                      </p>
                    </div>

                    {/* CTA Button */}
                    <button
                      className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center gap-2 whitespace-nowrap ${
                        plan.isPopular
                          ? "bg-[#08A696] text-white hover:scale-105 hover:shadow-lg hover:shadow-[#08A696]/30"
                          : "bg-white/70 dark:bg-[#08A696]/20 border border-[#08A696]/80 dark:border-[#08A696]/50 text-[#085c54] dark:text-[#26FFDF] hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30"
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {plan.cta}
                    </button>
                  </div>

                  {/* Features */}
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#08A696] dark:text-[#26FFDF] flex-shrink-0 mt-0.5" />
                        <span className="text-[#04423c] dark:text-[#b2fff6] text-xs">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Folio Recharges Section */}
        {folioRecharges && folioRecharges.length > 0 && (
          <div>
            <div className="text-center mb-6">
              <h3 className="text-2xl md:text-3xl font-bold text-[#04423c] dark:text-[#26FFDF] mb-3">
                Recargas de Folios
              </h3>
              <p className="text-[#085c54] dark:text-[#b2fff6]">
                Amplía tu capacidad de facturación electrónica
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
              {folioRecharges.map((recharge) => (
                <div
                  key={recharge.id}
                  className="bg-white/70 dark:bg-[#02505950] backdrop-blur-sm rounded-xl border border-[#08A696]/60 dark:border-[#08A696]/30 p-5 hover:border-[#08A696] transition-all duration-300 hover:shadow-lg hover:scale-105 text-center"
                >
                  <div className="mb-3">
                    <div className="inline-block p-2.5 bg-[#08A696]/10 dark:bg-[#08A696]/20 rounded-xl mb-2">
                      <Zap className="w-5 h-5 text-[#08A696] dark:text-[#26FFDF]" />
                    </div>
                    <h4 className="text-2xl font-bold text-[#04423c] dark:text-[#26FFDF]">
                      {recharge.quantity}
                    </h4>
                    <p className="text-xs text-[#085c54] dark:text-[#b2fff6]">folios</p>
                  </div>

                  <div className="mb-3">
                    <span className="text-xl font-bold text-[#08A696] dark:text-[#26FFDF]">
                      ${recharge.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-[#085c54] dark:text-[#b2fff6] block mt-1">
                      COP
                    </span>
                  </div>

                  {recharge.savings && (
                    <div className="mb-3">
                      <span className="inline-block px-2.5 py-1 bg-[#08A696]/20 text-[#08A696] dark:text-[#26FFDF] rounded-full text-xs font-semibold">
                        Ahorra ${recharge.savings.toLocaleString()}
                      </span>
                    </div>
                  )}

                  <button className="w-full py-2 px-4 bg-white/70 dark:bg-[#08A696]/20 border border-[#08A696]/80 dark:border-[#08A696]/50 rounded-xl text-[#085c54] dark:text-[#26FFDF] font-semibold text-sm hover:border-[#08A696] hover:bg-[#08A696]/10 dark:hover:bg-[#08A696]/30 transition-all duration-300">
                    Agregar
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

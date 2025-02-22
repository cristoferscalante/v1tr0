import { StaticImageData } from "next/image"
import { ReactNode } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import { ArrowRight } from "lucide-react"

interface Feature {
  icon: ReactNode
  text: string
}

interface ServiceBannerProps {
  title: string
  description: string
  features?: Feature[]
  // Si la imagen puede ser un string (URL) o un import de StaticImageData
  imageSrc: StaticImageData | string
  imageAlt: string
  ctaLink: string
  ctaText: string
}

const textVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export default function ServiceBanner({
  title,
  description,
  features = [],
  imageSrc,
  imageAlt,
  ctaLink,
  ctaText,
}: ServiceBannerProps) {
  return (
    <section className="min-h-screen w-full px-4 py-16 flex items-center bg-transparent">
      <div className="max-w-6xl mx-auto flex flex-col lg:flex-row items-center">
        <div className="lg:w-1/2 lg:pr-12">
          <motion.h1
            className="text-4xl md:text-6xl font-bold text-textPrimary mb-6"
            initial="hidden"
            animate="visible"
            variants={textVariant}
          >
            {title}
          </motion.h1>

          <motion.p
            className="text-textMuted text-lg mb-8"
            initial="hidden"
            animate="visible"
            variants={textVariant}
          >
            {description}
          </motion.p>

          <motion.div
            className="space-y-4"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.2 },
              },
            }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="flex items-center space-x-3"
                variants={textVariant}
              >
                <div className="p-2 rounded-full bg-custom-2 text-highlight">
                  {feature.icon}
                </div>
                <p className="text-textPrimary">{feature.text}</p>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="mt-10"
          >
            <a
              href={ctaLink}
              className="inline-flex items-center bg-primary text-textPrimary px-6 py-3 rounded-full text-lg font-semibold hover:bg-opacity-90 transition-colors duration-300"
            >
              {ctaText}
              <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </motion.div>
        </div>

        <motion.div
          className="lg:w-1/2 mt-12 lg:mt-0"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
        >
          <div className="relative">
            <Image
              src={imageSrc}
              alt={imageAlt}
              width={500}
              height={400}
              className="mx-auto"
            />
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-custom-3 rounded-full opacity-20 animate-pulse" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-custom-4 rounded-full opacity-20 animate-pulse" />
          </div>
        </motion.div>
      </div>
    </section>
  )
}

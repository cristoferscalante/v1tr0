import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock, User } from "lucide-react"

interface PostHeaderProps {
  title: string
  date: string
  author: string
  coverImage: string
  readingTime: string
  tags?: string[]
}

export default function PostHeader({ title, date, author, coverImage, readingTime, tags }: PostHeaderProps) {
  // Format date using a consistent locale
  const formattedDate = new Date(date).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC", // Add timezone to ensure consistency
  })

  return (
    <header className="mb-12">
      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tags?.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="text-xs font-medium px-3 py-1.5 rounded-full bg-custom-2/30 text-highlight hover:bg-custom-2/50 transition-all duration-300 hover:scale-105"
          >
            {tag}
          </Link>
        ))}
      </div>

      {/* Title */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 leading-tight">{title}</h1>

      {/* Meta info */}
      <div className="flex flex-wrap items-center gap-6 text-sm text-textMuted mb-8">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2" />
          <time dateTime={date}>{formattedDate}</time>
        </div>

        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-2" />
          <span>{readingTime}</span>
        </div>

        <div className="flex items-center">
          <User className="w-4 h-4 mr-2" />
          <span>Por {author}</span>
        </div>
      </div>

      {/* Cover image */}
      <div className="relative aspect-[21/9] w-full overflow-hidden rounded-xl shadow-lg mb-4">
        <Image
          src={coverImage || "/placeholder.svg?height=630&width=1200"}
          alt={title}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
      </div>
    </header>
  )
}


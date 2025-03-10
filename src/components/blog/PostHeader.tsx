import Image from "next/image"
import Link from "next/link"
import { Calendar, Clock } from "lucide-react"

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
    timeZone: 'UTC'  // Add timezone to ensure consistency
  });

  return (
    <header className="mb-8">
      <div className="flex flex-wrap gap-2 mb-4">
        {tags?.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${tag}`}
            className="text-xs px-3 py-1 rounded-full bg-custom-2/30 text-highlight hover:bg-custom-2/50 transition-colors"
          >
            {tag}
          </Link>
        ))}
      </div>

      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">{title}</h1>

      <div className="flex items-center gap-4 text-sm text-textMuted mb-6">
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-1" />
          <time dateTime={date}>{formattedDate}</time>
        </div>

        <div className="flex items-center">
          <Clock className="w-4 h-4 mr-1" />
          <span>{readingTime}</span>
        </div>

        <div>
          <span>Por {author}</span>
        </div>
      </div>

      <div className="relative aspect-video w-full overflow-hidden rounded-lg">
        <Image
          src={coverImage || "/placeholder.svg?height=630&width=1200"}
          alt={title}
          fill
          priority
          className="object-cover"
        />
      </div>
    </header>
  )
}


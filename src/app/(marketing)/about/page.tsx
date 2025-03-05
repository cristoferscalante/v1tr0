import About from "@/src/components/about/about"
import Team from "@/src/components/about/team"

export default function Home() {
  return (
    <main className="bg-background text-textPrimary">
      <About />
      <Team />
    </main>
  )
}
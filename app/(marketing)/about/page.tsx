import About from "@/components/about/about"
import FooterSection from "@/components/global/FooterSection"

export default function AboutPage() {
  return (
    <main className="text-textPrimary">
      <About />
      {/* Sección 5: Footer */}
      <section className="relative h-screen snap-start snap-always" id="footer">
        <FooterSection />
      </section>
    </main>
  )
}

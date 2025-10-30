import { SearchSection } from "@/components/search-section"
import { Header } from "@/components/header"
import { HowItWorks } from "@/components/how-it-works"
import { PopularProfessions } from "@/components/popular-professions"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <SearchSection />
        <HowItWorks />
        <PopularProfessions />
      </main>
      <Footer />
    </div>
  )
}

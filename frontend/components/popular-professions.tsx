import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Wrench, Zap, Hammer, Paintbrush, Sparkles, Car, Home, Scissors } from "lucide-react"

export function PopularProfessions() {
  const professions = [
    {
      icon: Wrench,
      name: "Plumbers",
      count: "1,247",
      description: "Pipe repairs, installations, emergency services",
    },
    {
      icon: Zap,
      name: "Electricians",
      count: "892",
      description: "Wiring, repairs, electrical installations",
    },
    {
      icon: Hammer,
      name: "Carpenters",
      count: "654",
      description: "Custom furniture, repairs, installations",
    },
    {
      icon: Paintbrush,
      name: "Painters",
      count: "543",
      description: "Interior, exterior, commercial painting",
    },
    {
      icon: Sparkles,
      name: "Cleaners",
      count: "789",
      description: "House cleaning, office cleaning, deep cleaning",
    },
    {
      icon: Car,
      name: "Mechanics",
      count: "432",
      description: "Auto repair, maintenance, diagnostics",
    },
    {
      icon: Home,
      name: "Contractors",
      count: "321",
      description: "Home renovation, construction, remodeling",
    },
    {
      icon: Scissors,
      name: "Landscapers",
      count: "298",
      description: "Garden design, lawn care, tree services",
    },
  ]

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">Popular professions</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover the most sought-after services in your area
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {professions.map((profession, index) => (
            <Card
              key={index}
              className="group hover:shadow-xl transition-all duration-300 cursor-pointer border-2 border-slate-200/20 bg-card/90 backdrop-blur-sm hover:scale-105 hover:border-primary/30"
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-200/10">
                  <div className="w-12 h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <profession.icon className="w-6 h-6 text-primary" />
                  </div>
                  <Badge variant="secondary" className="text-xs border border-slate-200/30">
                    {profession.count}
                  </Badge>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">{profession.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{profession.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

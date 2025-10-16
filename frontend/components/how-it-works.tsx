import { Card, CardContent } from "@/components/ui/card"
import { Search, Users, CheckCircle } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: Search,
      title: "Search for Services",
      description: "Enter the profession you need and your city to find local service providers.",
    },
    {
      icon: Users,
      title: "Browse Professionals",
      description: "View detailed profiles, ratings, and reviews from verified service providers.",
    },
    {
      icon: CheckCircle,
      title: "Connect & Hire",
      description: "Contact professionals directly and get your project completed with confidence.",
    },
  ]

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">How it works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Finding the right professional for your needs has never been easier
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {steps.map((step, index) => (
            <Card
              key={index}
              className="text-center border-2 border-slate-200/20 shadow-lg bg-card/90 backdrop-blur-sm hover:border-primary/30 transition-all duration-300"
            >
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 border-2 border-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <step.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-4 pb-2 border-b border-slate-200/10">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

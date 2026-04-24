import { createFileRoute } from '@tanstack/react-router'
import { Calendar, MapPin } from 'lucide-react'



export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 overflow-hidden">


        <div className="relative max-w-5xl mx-auto text-center z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-copper/10 border border-copper/30 text-copper-light text-sm font-medium backdrop-blur-sm text-accent">
            <Calendar className="w-4 h-4" />
            <span>March 15-17, 2026</span>
            <span className="mx-2 text-copper/40">•</span>
            <MapPin className="w-4 h-4" />
            <span>La Paz, Bolivia</span>
          </div>

          <h1 className="font-display text-6xl md:text-8xl font-bold text-cream mb-6 leading-tight ">
            Haute
            <span className="block text-gold italic">Pâtisserie</span>
          </h1>

          <p className="text-xl md:text-2xl text-cream/70 font-body max-w-3xl mx-auto mb-10 leading-relaxed bg-accent/50 backdrop-blur-sm rounded-lg p-4">
            Join the world's most celebrated pastry chefs and master bakers for
            three extraordinary days of masterclasses, demonstrations, and
            culinary inspiration.
          </p>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 bg-accent/50 backdrop-blur-sm rounded-lg p-4">
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-gold">
                20
              </div>
              <div className="text-cream/50 text-sm uppercase tracking-wider">
                Master Chefs
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-gold">
                20
              </div>
              <div className="text-cream/50 text-sm uppercase tracking-wider">
                Sessions
              </div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-gold">3</div>
              <div className="text-cream/50 text-sm uppercase tracking-wider">
                Days
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="h-px bg-linear-to-r from-transparent via-border to-transparent" />
      </div>
    </>
  )
}

import { Divider } from '#/shared/components/Divider'
import { createFileRoute } from '@tanstack/react-router'
import { MapPin, Users, Award } from 'lucide-react'

export const Route = createFileRoute('/')({
  component: HomePage,
})

function HomePage() {

  return (
    <>
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 pt-8 overflow-hidden">
        <div className="relative max-w-5xl mx-auto text-center z-10">

          {/* Badge informativo */}
          <div className="inline-flex items-center gap-2 px-4 py-2 mb-8 rounded-full bg-copper/10 border border-copper/30 text-copper-light text-sm font-medium backdrop-blur-sm">
            <MapPin className="w-4 h-4" />
            <span>Potosí, Bolivia</span>
            <span className="mx-2 text-copper/40">•</span>
            <span>Vicerrectorado • UATF</span>
          </div>

          <h1 className="font-display text-2xl md:text-4xl font-bold text-cream mb-6 leading-tight">
            UNIVERSIDAD AUTÓNOMA "TOMÁS FRÍAS"
          </h1>
          <h1 className="font-display text-xl md:text-4xl font-bold text-cream mb-6 leading-tight">
            VICERRECTORADO
          </h1>
          <h2 className="font-display text-xl md:text-4xl font-bold text-cream mb-6 leading-tight">
            Dirección de Servicios Académicos
          </h2>

          <p className="text-xl md:text-2xl text-cream/80 font-body max-w-3xl mx-auto mb-10 leading-relaxed">
            Gestión de postulaciones, inscripciones y trámites académicos de la Universidad Autónoma Tomás Frías.
            Tu puerta de ingreso a la excelencia universitaria en Potosí.
          </p>
          <Divider />

          <div className="flex flex-wrap justify-center gap-8 bg-accent/50 backdrop-blur-sm rounded-2xl p-8 border border-white/10">
            <div className="text-center">
              <div className="text-4xl font-display font-bold text-gold flex items-center justify-center gap-1">
                <Users className="w-8 h-8" />
                +700
              </div>
              <div className="text-cream/70 text-sm uppercase tracking-wider mt-1">
                Postulantes PSA
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-display font-bold text-gold">
                20+
              </div>
              <div className="text-cream/70 text-sm uppercase tracking-wider mt-1">
                Carreras
              </div>
            </div>

            <div className="text-center">
              <div className="text-4xl font-display font-bold text-gold flex items-center justify-center gap-1">
                <Award className="w-8 h-8" />
              </div>
              <div className="text-cream/70 text-sm uppercase tracking-wider mt-1">
                Admisión por Excelencia
              </div>
            </div>
          </div>

          <Divider />
          <div className="my-8 text-sm text-cream/60">
            Dirección de Servicios Académicos • Vicerrectorado UATF<br />
            Ciudadela Universitaria, Potosí • <span className="text-copper-light">direccion_academica@uatf.edu.bo</span>
            • <span className="text-copper-light">Telefono: 6227323</span>
          </div>
        </div>
      </section>


      {/* Footer con información institucional */}
      <footer className="bg-background/80 backdrop-blur-sm border-t border-border my-2">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-linear-to-br from-copper to-gold text-white shadow-lg shadow-gold/20">
                <UniversityIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-display text-xl font-bold text-copper">Universidad Autónoma Tomás Frías</h3>
                <p className="text-sm text-cream/70">Vicerrectorado • Dirección de Servicios Académicos</p>
              </div>
            </div>

            <div className="text-center md:text-right">
              <div className="flex items-center justify-center md:justify-end gap-2 mb-2">
                <MapPin className="w-4 h-4 text-gold" />
                <span className="text-cream/80 font-medium">Ciudadela Universitaria • Potosí, Bolivia</span>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center text-sm text-cream/50">
            <p>&copy; {new Date().getFullYear()} Universidad Autónoma Tomás Frías. Todos los derechos reservados.</p>
            <p className="mt-2">Plataforma de gestión académica • Desarrollado para la Dirección de Servicios Académicos</p>
          </div>
        </div>
      </footer>

      {/* Script de pre-carga para experiencia más fluida */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            // Pre-carga inteligente de assets críticos
            (function() {
              var assets = [
                'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap',
                '/assets/logo.png',
                '/assets/background.jpg',
                '/assets/postulaciones/logo-psa.png'
              ];
              
              assets.forEach(function(src) {
                var link = document.createElement('link');
                link.rel = 'preload';
                link.href = src;
                link.as = src.endsWith('.css') ? 'style' : src.endsWith('.png') || src.endsWith('.jpg') ? 'image' : 'fetch';
                document.head.appendChild(link);
              });
            })();
          `,
        }}
      />
    </>
  )
}

function UniversityIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg {...props} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 19l9 2-9-18-9 18zm0 0v-8"
      />
    </svg>
  )
}
"use client"

import { usePathname } from "next/navigation";

export default function ReactParticlesBackground() {
  const pathname = usePathname()

  // Deshabilitar partículas en página de contacto, dashboard y admin
  // Temporalmente deshabilitado completamente debido a problemas de dependencias
  const isDisabled = pathname === "/contact" ||
                     pathname?.startsWith("/dashboard") ||
                     pathname?.startsWith("/clientes") ||
                     pathname?.startsWith("/admin") ||
                     true // Temporalmente deshabilitado por completo

  if (isDisabled) {
    return null
  }

  // Este código está comentado hasta que se resuelvan los problemas de dependencias
  /*
  const [particlesLoaded, setParticlesLoaded] = useState(false)

  const particlesInit = useCallback(async (engine: Engine) => {
    try {
      await loadLinksPreset(engine)
      setParticlesLoaded(true)
      console.log("Particles initialized successfully")
    } catch (error) {
      console.error("Error initializing particles:", error)
      setParticlesLoaded(false)
    }
  }, [])

  return (
    <Particles
      id="react-tsparticles"
      init={particlesInit}
      loaded={() => console.log("Particles loaded successfully")}
      options={{
        preset: "links",
        fullScreen: { enable: false },
        background: { color: { value: "transparent" } },
        particles: {
          color: { value: "#0047AB" },
          links: {
            color: "#0047AB",
            distance: 150,
            enable: true,
            opacity: 0.12,
            width: 1.2,
          },
          move: {
            enable: true,
            speed: 0.25,
            direction: "none",
            random: false,
            straight: false,
            outModes: "out"
          },
          life: {
            duration: { sync: false, value: 6 },
            delay: { sync: false, value: 2 },
            count: 0
          },
          number: {
            value: 45,
            density: {
              enable: true,
              area: 800,
              factor: 1000
            }
          },
          opacity: {
            value: 0.15,
            animation: {
              enable: true,
              speed: 0.5,
              minimumValue: 0.1,
              sync: false
            }
          },
          size: {
            value: { min: 1, max: 2 },
            animation: {
              enable: true,
              speed: 1,
              minimumValue: 0.5,
              sync: false
            }
          },
          shape: {
            type: "circle"
          }
        },
        detectRetina: true,
        pauseOnBlur: true,
        pauseOnOutsideViewport: true,
        interactivity: {
          events: {
            onHover: {
              enable: false
            },
            onClick: {
              enable: false
            }
          }
        }
      }}
      style={{
        position: "fixed",
        inset: 0,
        pointerEvents: "none",
        zIndex: -1,
        opacity: particlesLoaded ? 1 : 0,
        transition: "opacity 0.5s ease-in-out"
      }}
    />
  )
  */

  // Return null while particles are disabled
  return null
}

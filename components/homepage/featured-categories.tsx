import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'

const FeaturedCategories = () => {
  return (
    <section className="container py-12 mx-auto space-y-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight uppercase md:text-4xl text-white!">Selection Hub</h2>
          <div className="w-24 h-1 mt-4 bg-cyan-500" />
        </div>
        <p className="max-w-md text-sm tracking-wide uppercase text-muted-foreground md:text-right">
          Navigate our curated divisions featuring the latest from global tech leaders.
        </p>
      </div>

      <div className="grid h-auto grid-cols-1 gap-6 lg:grid-cols-2 lg:h-150">
        {/* Left Column - Large Item (Notebooks) */}
        <Link 
          href="/products?category=notebooks" 
          className="relative block overflow-hidden border group rounded-xl bg-zinc-900 border-border/50 h-100 lg:h-full"
        >
          <Image
            src="https://images.unsplash.com/photo-1603302576837-37561b2e2302?q=80&w=2068&auto=format&fit=crop"
            alt="Notebooks"
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
          />
          <div className="absolute inset-0 flex flex-col justify-end p-6 bg-linear-to-t from-black/90 via-black/20 to-transparent md:p-8">
            <span className="mb-2 text-xs font-bold tracking-widest uppercase text-cyan-500">Authorized Reseller: Mobile Tech</span>
            <h3 className="mb-4 text-3xl font-bold tracking-tight text-white md:text-4xl">NOTEBOOKS</h3>
            <div className="flex items-center text-sm font-bold tracking-wider text-white transition-colors group-hover:text-cyan-400">
              VIEW FULL RANGE <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </Link>
        
        {/* Right Column */}
        <div className="flex flex-col h-full gap-6 lg:grid lg:grid-rows-2">
            {/* Top Right - Components */}
            <Link 
              href="/products?category=components"
              className="relative block overflow-hidden border group rounded-xl bg-zinc-900 border-border/50 h-75 lg:h-full"
            >
              <Image
                src="https://images.unsplash.com/photo-1591488320449-011701bb6704?q=80&w=2070&auto=format&fit=crop"
                alt="Components"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
              />
              <div className="absolute inset-0 flex flex-col justify-end p-6 bg-linear-to-t from-black/90 via-transparent to-transparent md:p-8">
                  <h3 className="mb-1 text-2xl font-bold tracking-tight text-white">COMPONENTS</h3>
                  <p className="text-sm font-medium text-zinc-300">Official Chipsets from Intel & AMD</p>
              </div>
            </Link>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 h-75 lg:h-full">
                 {/* Bottom Left - Power */}
                <Link 
                  href="/products?category=power" 
                  className="relative block h-full overflow-hidden border group rounded-xl bg-zinc-900 border-border/50"
                >
                    <Image
                        src="/images/gizzu-news.jpg"
                        alt="Power"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 bg-linear-to-t from-black/90 via-transparent to-transparent">
                        <h3 className="mb-1 text-xl font-bold tracking-tight text-white">POWER</h3>
                        <p className="text-xs font-bold tracking-widest uppercase text-cyan-500">Backup Solutions</p>
                    </div>
                </Link>

                {/* Bottom Right - Smart TVs */}
                <Link 
                  href="/products?category=smart-tvs"
                  className="relative block h-full overflow-hidden border group rounded-xl bg-zinc-900 border-border/50"
                >
                    <Image
                        src="https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?q=80&w=1935&auto=format&fit=crop"
                        alt="Smart TVs"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-60"
                    />
                    <div className="absolute inset-0 flex flex-col justify-end p-6 bg-linear-to-t from-black/90 via-transparent to-transparent">
                         <h3 className="mb-1 text-xl font-bold tracking-tight text-white">SMART TVS</h3>
                         <p className="text-xs font-bold tracking-widest uppercase text-cyan-500">
                            Big Screen Entertainment
                         </p>
                    </div>
                </Link>
            </div>
        </div>
      </div>
    </section>
  )
}

export default FeaturedCategories
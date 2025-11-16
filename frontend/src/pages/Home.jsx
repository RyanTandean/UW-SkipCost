import FeatureCard from "../components/FeatureCard";

export default function Home() {
  return (
    <main className="px-0 py-0 w-full flex flex-col items-center justify-center p-4">
      {/*Pebble Animation Background*/}
      {/* Hero section */}
      <section className="relative w-full py-60 bg-white overflow-hidden">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Every Skip Costs You
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6">
            See how much you lose every time you skip class.
          </p>
          <div className="flex justify-center">
            <a
              href="#/onboarding"
              className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40"
            >
              Get started
            </a>
          </div>
        </div>

        {/* Lake surface */}
        <div className="absolute bottom-0 left-0 right-0 h-48">
          {/* Water surface with wave effect */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-cyan-400/60 to-cyan-300/30" 
               style={{ borderRadius: '100% 100% 0 0 / 30px 30px 0 0' }} />
          
        </div>
      </section>

      {/* Demo video - underwater transition begins */}
      <section className="w-full bg-gradient-to-b from-cyan-400/60 via-cyan-500/70 to-cyan-600/80 py-0">
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl aspect-video flex items-center justify-center border border-white/30">
            <div className="text-center">
              <p className="text-xl font-semibold text-white">
                Demo Video Coming Soon
              </p>
              <p className="text-cyan-100">See ClassCost in action</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features - deeper underwater */}
      <section className="w-full bg-gradient-to-b from-cyan-600/80 via-cyan-700/85 to-slate-800/90 py-0">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-3xl font-bold text-center mb-12 text-white">
            Why Use ClassCost?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
            emoji="💰"
            title="See the Real Cost"
            description="Calculate exactly how much money you're losing every time you skip a lecture. No guessing."
            glowColor="shadow-amber-500/30"
          />

          <FeatureCard
            emoji="📊"
            title="Track Your Attendance"
            description="Monitor your attendance patterns and see how they impact your tuition investment over time."
            glowColor="shadow-red-500/30"
          />

          <FeatureCard
            emoji="🎯"
            title="Stay Motivated"
            description="Turn abstract tuition costs into tangible daily losses. Get the motivation boost you need."
            glowColor="shadow-blue-500/30"
          />
          </div>
        </div>
      </section>

      {/* Bottom of the lake - where the stone settles */}
      <section className="w-full bg-gradient-to-b from-slate-800/90 to-slate-900 py-10">
        <div className="max-w-4xl mx-auto text-center px-6">    
          <div className="inline-block mb-6">
            {/* Sinking stone placeholder */}
            <div className="w-10 h-10 bg-gray-600 rounded-full shadow-inner mx-auto opacity-60" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-4">
            Don't let your money sink away
          </h3>
          <p className="text-slate-300 mb-8">
            Start tracking your attendance and see the real cost of skipping.
          </p>
          <a
            href="#/onboarding"
            className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40"
          >
            Get Started Free
          </a>
        </div>
      </section>
    </main>
  );
}
import FeatureCard from '../components/FeatureCard'

export default function Home() {
  return (
    <main className="px-0 py-0 w-full flex flex-col items-center justify-center p-4">
      {/*Pebble Animation Background*/}
      {/* Hero section */}
      <section className="w-full bg-gradient-to-br from-amber-100 via-white to-white/80 py-60">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3">
            Know what your classes really cost
          </h1>
          <p className="text-base md:text-lg text-gray-600 mb-6">
            See how much you lose every time you skip class.
          </p>
          <div className="flex justify-center">
            <a
              href="#/onboarding"
              className="inline-block px-6 py-3 bg-amber-400 hover:bg-amber-500 text-white rounded-lg font-medium shadow-md"
            >
              Get started
            </a>
          </div>
        </div>
      </section>
      {/*Demo video*/}
      <section className="w-full bg-white py-0">
        <div className="max-w-4xl mx-auto px-6 py-10">
          <div className="bg-gray-200 rounded-xl aspect-video flex items-center justify-center">
            <div className="text-center">
              <p className="text-xl font-semibold text-gray-700">Demo Video Coming Soon</p>
              <p className="text-gray-500">See ClassCost in action</p>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full bg-gradient-to-br from-white via-white to-amber-100 py-0">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        <h2 className="text-3xl font-bold text-center mb-12 text-gray-900">
          Why Use ClassCost?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            emoji="💰"
            title="See the Real Cost"
            description="Calculate exactly how much money you're losing every time you skip a lecture. No guessing."
            borderColor="border-amber-500"
          />
          
          <FeatureCard
            emoji="📊"
            title="Track Your Attendance"
            description="Monitor your attendance patterns and see how they impact your tuition investment over time."
            borderColor="border-red-500"
          />
          
          <FeatureCard
            emoji="🎯"
            title="Stay Motivated"
            description="Turn abstract tuition costs into tangible daily losses. Get the motivation boost you need."
            borderColor="border-blue-500"
          />
        </div>
      </div>
      </section>
    </main>
  );
}

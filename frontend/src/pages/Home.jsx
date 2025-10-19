export default function Home() {
  return (
    <main className="px-0 py-0 w-full flex flex-col items-center justify-center p-4">
      {/* Hero section */}
      <section className="w-full bg-gradient-to-br from-amber-100 via-white to-white/50 py-60">
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
    </main>
  );
}

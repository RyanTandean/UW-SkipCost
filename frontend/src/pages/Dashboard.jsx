import WelcomeMessage from "../components/WelcomeMessage";
import WeeklyCostCard from "../components/WeeklyCostCard";
import TodayScheduleCard from "../components/TodayScheduleCard";
import TermOverviewCard from "../components/TermOverviewCard";
import AiInsightsCard from "../components/AiInsightsCard";

export default function Dashboard() {
    return (
        <main className="relative w-full min-h-screen bg-gradient-to-br from-cyan-400 via-cyan-500 to-cyan-600 p-6">
              <section className="w-full max-w-2xl">
                  <WelcomeMessage username="John Doe" />
              </section>
              <section className="mt-12 text-center">
                  <h2 className="text-4xl font-bold text-gray-800 mb-8">
                      Here's how much you would <span className="text-red-400">lose</span> if you skipped all classes today,
                  </h2>
                  
                  <div className="flex justify-center gap-8">
                      {/* Fairshare Cost Bubble */}
                      <div className="backdrop-blur-sm bg-white/50 rounded-3xl shadow-lg p-6 w-48 h-32 flex flex-col items-center justify-center">
                          <p className="text-sm font-semibold text-gray-600 mb-2">Fairshare Cost</p>
                          <p className="text-3xl font-bold text-red-400">$24.50</p>
                      </div>
                      
                      {/* Individual Cost Bubble */}
                      <div className="bg-white/70 rounded-3xl shadow-lg p-6 w-48 h-32 flex flex-col items-center justify-center">
                          <p className="text-sm font-semibold text-gray-600 mb-2">Individual Cost</p>
                          <p className="text-3xl font-bold text-red-400">$32.75</p>
                      </div>
                  </div>
              </section>
            <section className="mt-16 grid grid-cols-2 gap-6 max-w-6xl mx-auto">
                {/* Left column */}
                <div className="flex flex-col gap-6">
                    <TodayScheduleCard />
                </div>
                
                {/* Right column */}
                <div className="space-y-6">
                    <WeeklyCostCard />
                    <TermOverviewCard />
                    <div className="flex-1">
                        <AiInsightsCard />
                    </div>
                </div>
            </section>
        </main>
    );
}
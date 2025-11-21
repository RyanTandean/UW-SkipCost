import { motion } from "framer-motion";
import WelcomeMessage from "../components/WelcomeMessage";
import WeeklyCostCard from "../components/WeeklyCostCard";
import TodayScheduleCard from "../components/TodayScheduleCard";
import TermOverviewCard from "../components/TermOverviewCard";
import AiInsightsCard from "../components/AiInsightsCard";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" }
  }
};

export default function Dashboard() {
    return (
        <main className="relative w-full min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-sky-200 px-4 py-6 sm:p-6 md:p-8">
            {/* Welcome Section */}
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                className="w-full max-w-6xl mx-auto"
            >
                <WelcomeMessage username="John Doe" />
            </motion.section>

            {/* Cost Summary Section */}
            <motion.section 
                initial="hidden"
                animate="visible"
                variants={fadeUp}
                transition={{ delay: 0.1 }}
                className="mt-8 sm:mt-12 text-center max-w-4xl mx-auto"
            >
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6 sm:mb-8 px-2">
                    Here's how much you would <span className="text-red-400">lose</span> if you skipped all classes today,
                </h2>
                
                <motion.div 
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6 md:gap-8"
                >
                    {/* Fairshare Cost Bubble */}
                    <motion.div 
                        variants={staggerItem}
                        className="backdrop-blur-sm bg-white/50 rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 w-full sm:w-48 h-28 sm:h-32 flex flex-col items-center justify-center"
                    >
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Fairshare Cost</p>
                        <p className="text-2xl sm:text-3xl font-bold text-red-400">$24.50</p>
                    </motion.div>
                    
                    {/* Individual Cost Bubble */}
                    <motion.div 
                        variants={staggerItem}
                        className="bg-white/70 rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 w-full sm:w-48 h-28 sm:h-32 flex flex-col items-center justify-center"
                    >
                        <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">Individual Cost</p>
                        <p className="text-2xl sm:text-3xl font-bold text-red-400">$32.75</p>
                    </motion.div>
                </motion.div>
            </motion.section>

            {/* Main Dashboard Grid */}
            <motion.section 
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={staggerContainer}
                className="mt-10 sm:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto"
            >
                {/* Left column */}
                <motion.div variants={staggerItem} className="flex flex-col gap-4 sm:gap-6">
                    <TodayScheduleCard />
                </motion.div>
                
                {/* Right column */}
                <motion.div variants={staggerItem} className="flex flex-col gap-4 sm:gap-6">
                    <WeeklyCostCard />
                    <TermOverviewCard />
                    <AiInsightsCard />
                </motion.div>
            </motion.section>
        </main>
    );
}
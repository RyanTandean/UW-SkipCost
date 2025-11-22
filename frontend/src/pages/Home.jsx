import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import FeatureCard from "../components/FeatureCard";

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15
    }
  }
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

export default function Home({ onLoginClick }) {
  const { user } = useAuth();

  return (
    <main className="px-0 py-0 w-full flex flex-col items-center justify-center p-4">
      {/*Pebble Animation Background*/}
      {/* Hero section */}
      <section className="relative w-full py-60 bg-sky-50 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative z-10 max-w-4xl mx-auto text-center px-4"
        >
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
            className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-3"
          >
            Every Skip Costs You
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
            className="text-base md:text-lg text-gray-600 mb-6"
          >
            See how much you lose every time you skip class.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
            className="flex justify-center"
          >
            {user ? (
              <Link
                to="/dashboard"
                className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40"
              >
                Go to Dashboard
              </Link>
            ) : (
              <button
                onClick={onLoginClick}
                className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/30 transition-all hover:shadow-cyan-400/40"
              >
                Get started
              </button>
            )}
          </motion.div>
        </motion.div>

        {/* Lake surface */}
        <div className="absolute bottom-0 left-0 right-0 h-48">
          {/* Water surface with wave effect */}
          <div className="absolute bottom-0 w-full h-32 bg-gradient-to-t from-cyan-400/60 to-cyan-300/30" 
               style={{ borderRadius: '100% 100% 0 0 / 30px 30px 0 0' }} />
          
        </div>
      </section>

      {/* Demo video - underwater transition begins */}
      <section className="w-full bg-gradient-to-b from-cyan-400/60 via-cyan-500/70 to-cyan-600/80 py-0">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeUp}
          className="max-w-4xl mx-auto px-6 py-16"
        >
          <div className="bg-white/20 backdrop-blur-sm rounded-xl aspect-video flex items-center justify-center border border-white/30">
            <div className="text-center">
              <p className="text-xl font-semibold text-white">
                Demo Video Coming Soon
              </p>
              <p className="text-cyan-100">See SkipCost in action</p>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features - deeper underwater */}
      <section className="w-full bg-gradient-to-b from-cyan-600/80 via-cyan-700/85 to-slate-800/90 py-0">
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
          <motion.h2 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={fadeUp}
            className="text-3xl font-bold text-center mb-12 text-white"
          >
            Why Use SkipCost?
          </motion.h2>

          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            <motion.div variants={staggerItem}>
              <FeatureCard
                emoji="💰"
                title="See the Real Cost"
                description="Calculate exactly how much money you're losing every time you skip a lecture."
                glowColor="shadow-amber-500/30"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <FeatureCard
                emoji="📊"
                title="Track Every Skip"
                description="Monitor your attendance patterns and see how they impact your tuition investment over time."
                glowColor="shadow-red-500/30"
              />
            </motion.div>

            <motion.div variants={staggerItem}>
              <FeatureCard
                emoji="🎯"
                title="Make It Real"
                description="Turn abstract tuition costs into tangible daily losses. Get the motivation boost you need."
                glowColor="shadow-blue-500/30"
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Bottom of the lake - where the stone settles */}
      {/* Only show CTA section if not logged in */}
      {!user && (
        <section className="w-full bg-gradient-to-b from-slate-800/90 to-slate-900 py-10">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="max-w-4xl mx-auto text-center px-6"
          >    
            <motion.div variants={staggerItem} className="inline-block mb-6">
              {/* Sinking stone placeholder */}
              <div className="w-10 h-10 bg-gray-600 rounded-full shadow-inner mx-auto opacity-60" />
            </motion.div>
            <motion.h3 
              variants={staggerItem}
              className="text-2xl font-bold text-white mb-4"
            >
              Don't let your money sink away
            </motion.h3>
            <motion.p 
              variants={staggerItem}
              className="text-slate-300 mb-8"
            >
              Start tracking your attendance and see the real cost of skipping.
            </motion.p>
            <motion.div variants={staggerItem}>
              <button
                onClick={onLoginClick}
                className="inline-block px-8 py-4 bg-cyan-500 hover:bg-cyan-400 text-white rounded-lg font-semibold shadow-lg shadow-cyan-500/20 transition-all hover:shadow-cyan-400/30"
              >
                Get Started Free
              </button>
            </motion.div>
          </motion.div>
        </section>
      )}
    </main>
  );
}
import { useState, useEffect, use } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { supabase } from "../lib/supabase";
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
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export default function Dashboard() {
  const [hasCourses, setHasCourses] = useState(true); // default true to avoid flash
  const [userName, setUserName] = useState("");
  const [greeting, setGreeting] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [todayLectures, setTodayLectures] = useState([]);
  const [todayCost, setTodayCost] = useState({ fairshare: 0, individual: 0 });
  const [weekData, setWeekData] = useState([]);
  const [termStats, setTermStats] = useState({
    moneyLost: 0,
    attendanceRate: 100,
    totalClasses: 0,
    classesAttended: 0
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      // Get today's day name (e.g., "Monday")
      const today = "Tuesday";
      //const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

      // Fetch user's courses for today
      const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .eq("user_id", user.id)
        .contains("days_of_week", [today]);

      // Fetch user's profile to get program/student_type/term
      const { data: profile } = await supabase
        .from("users")
        .select("program, student_type, term_number")
        .eq("id", user.id)
        .single();

      // Fetch tuition rate for this user
      const { data: tuition } = await supabase
        .from("tuition_rates")
        .select("*")
        .eq("program", profile?.program)
        .eq("student_type", profile?.student_type)
        .maybeSingle();

      // Calculate cost per lecture
      if (courses && tuition) {
        // Count total lectures per week across all courses
        const { data: allCourses } = await supabase
          .from("courses")
          .select("days_of_week")
          .eq("user_id", user.id);

        const totalLecturesPerWeek =
          allCourses?.reduce(
            (sum, course) => sum + course.days_of_week.length,
            0
          ) || 1;

        // Assuming 12-week term
        const totalLecturesPerTerm = totalLecturesPerWeek * 12;

        // Fairshare cost = max_tuition / total lectures
        const fairshareCost = tuition.max_tuition / totalLecturesPerTerm;

        // Format lectures for the card
        const formattedLectures = courses.map((course, index) => ({
          id: course.id,
          title: `${course.course_code} - ${course.course_name || ""}`.trim(),
          time: formatTime(course.start_time),
          fairshareCost: fairshareCost,
          // Individual cost could factor in course-specific pricing later
          individualCost: fairshareCost,
          attended: null,
        }));

        // Sort by start time
        formattedLectures.sort((a, b) => a.time.localeCompare(b.time));

        setTodayLectures(formattedLectures);

        // Calculate weekly cost data
        const daysOfWeek = [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay()); // Start from Sunday

        const weekCosts = daysOfWeek.map((dayName, index) => {
          const date = new Date(startOfWeek);
          date.setDate(startOfWeek.getDate() + index);

          // Count lectures on this day
          const lecturesOnDay =
            allCourses?.filter((course) =>
              course.days_of_week.includes(dayName)
            ).length || 0;

          const dayCost = lecturesOnDay * fairshareCost;

          return {
            day: dayName.slice(0, 3), // "Mon", "Tue", etc.
            date: date.getDate().toString(),
            cost: dayCost,
          };
        });

        setWeekData(weekCosts);
        // Calculate total cost for today
        const totalFairshare = formattedLectures.reduce(
          (sum, l) => sum + l.fairshareCost,
          0
        );
        const totalIndividual = formattedLectures.reduce(
          (sum, l) => sum + l.individualCost,
          0
        );
        setTodayCost({
          fairshare: totalFairshare,
          individual: totalIndividual,
        });

        // Calculate term overview stats
        // For now, we'll calculate total classes in the term (12 weeks)
        const totalClassesPerTerm = totalLecturesPerWeek * 12;

        // TODO: Later, track actual attendance in a separate table
        // For now, assume 100% attendance (no money lost yet)
        setTermStats({
          moneyLost: 0,
          attendanceRate: 100,
          totalClasses: totalClassesPerTerm,
          classesAttended: totalClassesPerTerm
        });
      }
    };

    fetchDashboardData();
  }, []);

  const formatTime = (timeStr) => {
    if (!timeStr) return "";
    const [hours, minutes] = timeStr.split(":");
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  };

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };
    checkAuth();
  }, []);
  useEffect(() => {
    // Set greeting based on time of day
    const hour = new Date().getHours();
    if (hour < 12) {
      setGreeting("Good morning");
    } else if (hour < 17) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }

    // Fetch user's name
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // First try to get first_name from auth metadata
        const firstName = user.user_metadata?.first_name;
        if (firstName) {
          setUserName(firstName);
        } else {
          // Fallback to users table
          const { data } = await supabase
            .from("users")
            .select("name")
            .eq("id", user.id)
            .single();

          if (data?.name) {
            setUserName(data.name);
          }
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const checkCourses = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("courses")
          .select("id")
          .eq("user_id", user.id)
          .limit(1);

        setHasCourses(data && data.length > 0);
      }
    };
    checkCourses();
  }, []);

  // EARLY RETURN 1: Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-sky-200 flex items-center justify-center">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  // EARLY RETURN 2: Not logged in
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-sky-200 flex items-center justify-center px-4">
        <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center max-w-md">
          <div className="text-5xl mb-4">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Sign in required
          </h2>
          <p className="text-gray-600">
            Log in to see your dashboard and track your class costs.
          </p>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Setup banner */}
      {!hasCourses && (
        <Link
          to="/onboarding"
          className="block w-full bg-amber-100 border-b border-amber-200 py-3 px-4 text-center text-amber-800 hover:bg-amber-50 transition-colors"
        >
          ⚠️ You haven't set up your courses yet.{" "}
          <span className="underline font-semibold">
            Click here to get started
          </span>
        </Link>
      )}

      <main className="relative w-full min-h-screen bg-gradient-to-br from-cyan-50 via-cyan-100 to-sky-200 px-4 py-6 sm:p-6 md:p-8">
        {/* Welcome Section */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={fadeUp}
          className="w-full max-w-6xl mx-auto"
        >
          <WelcomeMessage greeting={greeting} username={userName} />
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
            Here's how much you would <span className="text-red-400">lose</span>{" "}
            if you skipped all classes today,
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
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                Fairshare Cost
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-red-400">
                ${todayCost.fairshare.toFixed(2)}
              </p>
            </motion.div>

            {/* Individual Cost Bubble */}
            <motion.div
              variants={staggerItem}
              className="bg-white/70 rounded-2xl sm:rounded-3xl shadow-lg p-4 sm:p-6 w-full sm:w-48 h-28 sm:h-32 flex flex-col items-center justify-center"
            >
              <p className="text-xs sm:text-sm font-semibold text-gray-600 mb-1 sm:mb-2">
                Individual Cost
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-red-400">
                ${todayCost.individual.toFixed(2)}
              </p>
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
          <motion.div
            variants={staggerItem}
            className="flex flex-col gap-4 sm:gap-6"
          >
            <TodayScheduleCard lectures={todayLectures} />
          </motion.div>

          {/* Right column */}
          <motion.div
            variants={staggerItem}
            className="flex flex-col gap-4 sm:gap-6"
          >
            <TermOverviewCard 
              moneyLost={termStats.moneyLost}
              attendanceRate={termStats.attendanceRate}
              totalClasses={termStats.totalClasses}
              classesAttended={termStats.classesAttended}
            />
            <TermOverviewCard />
            {/*<AiInsightsCard />*/}
          </motion.div>
        </motion.section>
      </main>
    </>
  );
}

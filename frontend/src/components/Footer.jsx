export default function Footer() {
  return (
    <footer className="bg-slate-900/90 text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} SkipCost. Built by a UWaterloo Student</p>
        </div>
    </footer>
  )
}
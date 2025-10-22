export default function Footer() {
  return (
    <footer className="bg-gray-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-5 text-center text-gray-400 text-sm">
            <p>© {new Date().getFullYear()} ClassCost. Built by a UWaterloo Student</p>
        </div>
    </footer>
  )
}
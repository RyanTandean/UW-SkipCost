export default function FeatureCard({ emoji, title, description, glowColor }) {
  return (
    <div className={`bg-white/10 backdrop-blur-sm rounded-xl p-8 border border-white/30 hover:bg-white/20 transition-all shadow-lg ${glowColor}`}>
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold text-white mb-3">
        {title}
      </h3>
      <p className="text-white/80">
        {description}
      </p>
    </div>
  )
}
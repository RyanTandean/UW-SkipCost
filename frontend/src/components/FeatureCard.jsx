

export default function FeatureCard({ emoji, title, description, borderColor }) {
  return (
    <div className={`bg-white rounded-xl p-8 shadow-lg border-t-4 ${borderColor} hover:shadow-xl transition-shadow`}>
      <div className="text-4xl mb-4">{emoji}</div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  )
}
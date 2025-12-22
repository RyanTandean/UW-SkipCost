export default function SignInRequired() {
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
    )
}
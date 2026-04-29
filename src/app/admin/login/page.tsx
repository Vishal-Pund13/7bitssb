import LoginForm from './LoginForm'

export const metadata = {
  title: 'Admin Login',
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-navy-700 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-gold-DEFAULT flex items-center justify-center mx-auto mb-4">
            <span className="text-white font-bold text-2xl font-serif">S</span>
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
          <p className="text-blue-200 opacity-70 text-sm mt-1">SSB Research Journal</p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}

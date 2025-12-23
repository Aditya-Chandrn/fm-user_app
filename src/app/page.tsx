import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Shield, Zap, TrendingUp } from 'lucide-react';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      {/* Navbar */}
      <nav className="fixed w-full z-50 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">FleetManager</span>
            <div className="flex items-center space-x-4">
                <Link href="/auth/login" className="text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white font-medium">Login</Link>
                <Link href="/auth/register">
                    <Button>Get Started</Button>
                </Link>
            </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-50 dark:bg-zinc-950">
         <div className="container mx-auto px-6 relative z-10 text-center">
             <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
                 <span className="w-2 h-2 bg-blue-600 rounded-full mr-2 animate-pulse"></span>
                 New V2.0 is live
             </div>
             <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
                 Smart Fleet Management <br />
                 <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Simplified.</span>
             </h1>
             <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                 Streamline your vehicle operations, track trips in real-time, and optimize your fleet's performance with our comprehensive management solution.
             </p>
             <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                 <Link href="/auth/register">
                     <Button size="lg" className="h-12 px-8">Start Free Trial <ArrowRight className="ml-2 w-4 h-4" /></Button>
                 </Link>
                 <Link href="/auth/login">
                     <Button variant="outline" size="lg" className="h-12 px-8">View Demo</Button>
                 </Link>
             </div>
         </div>
         
         <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/[0.04] dark:bg-grid-white/[0.04] z-0" />
      </section>

      {/* Features */}
      <section className="py-24 bg-white dark:bg-zinc-900">
          <div className="container mx-auto px-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                  <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mb-6 text-blue-600">
                          <Zap className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Real-time Tracking</h3>
                      <p className="text-slate-600 dark:text-slate-400">Monitor your vehicles and drivers in real-time with precission GPS integration.</p>
                  </div>
                   <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-green-50 dark:bg-green-900/20 rounded-2xl flex items-center justify-center mb-6 text-green-600">
                          <TrendingUp className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Cost Analytics</h3>
                      <p className="text-slate-600 dark:text-slate-400">Deep dive into fuel consumption, maintenance costs, and revenue generation.</p>
                  </div>
                   <div className="flex flex-col items-center text-center">
                      <div className="w-16 h-16 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center mb-6 text-purple-600">
                          <Shield className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3 text-slate-900 dark:text-white">Secure Platform</h3>
                      <p className="text-slate-600 dark:text-slate-400">Enterprise-grade security with role-based access control and encrypted data.</p>
                  </div>
              </div>
          </div>
      </section>
    </main>
  )
}


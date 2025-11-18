'use client'

export function SimpleParticles() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Static floating particles using CSS */}
      <div className="absolute top-10 left-10 w-2 h-2 bg-vanguard-blue/20 rounded-full animate-bounce" style={{ animationDelay: '0s', animationDuration: '4s' }}></div>
      <div className="absolute top-20 right-20 w-3 h-3 bg-blue-400/40 rounded-full animate-bounce" style={{ animationDelay: '1s', animationDuration: '5s' }}></div>
      <div className="absolute top-32 left-1/4 w-1.5 h-1.5 bg-vanguard-blue/25 rounded-full animate-bounce" style={{ animationDelay: '2s', animationDuration: '6s' }}></div>
      <div className="absolute top-40 right-1/3 w-2 h-2 bg-blue-500/20 rounded-full animate-bounce" style={{ animationDelay: '0.5s', animationDuration: '4.5s' }}></div>
      <div className="absolute top-16 left-3/4 w-3 h-3 bg-vanguard-blue/40 rounded-full animate-bounce" style={{ animationDelay: '1.5s', animationDuration: '5.5s' }}></div>
      
      <div className="absolute top-1/4 left-16 w-1.5 h-1.5 bg-blue-400/25 rounded-full animate-bounce" style={{ animationDelay: '2.5s', animationDuration: '4s' }}></div>
      <div className="absolute top-1/3 right-16 w-2 h-2 bg-vanguard-blue/20 rounded-full animate-bounce" style={{ animationDelay: '3s', animationDuration: '6s' }}></div>
      <div className="absolute top-1/2 left-1/5 w-3 h-3 bg-blue-500/40 rounded-full animate-bounce" style={{ animationDelay: '0.8s', animationDuration: '5s' }}></div>
      <div className="absolute top-3/5 right-1/4 w-1.5 h-1.5 bg-vanguard-blue/25 rounded-full animate-bounce" style={{ animationDelay: '1.8s', animationDuration: '4.5s' }}></div>
      <div className="absolute top-2/3 left-2/3 w-2 h-2 bg-blue-400/20 rounded-full animate-bounce" style={{ animationDelay: '2.8s', animationDuration: '5.5s' }}></div>
      
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-vanguard-blue/40 rounded-full animate-bounce" style={{ animationDelay: '3.5s', animationDuration: '4s' }}></div>
      <div className="absolute bottom-40 right-32 w-1.5 h-1.5 bg-blue-500/25 rounded-full animate-bounce" style={{ animationDelay: '4s', animationDuration: '6s' }}></div>
      <div className="absolute bottom-20 left-1/3 w-2 h-2 bg-vanguard-blue/20 rounded-full animate-bounce" style={{ animationDelay: '0.3s', animationDuration: '5s' }}></div>
      <div className="absolute bottom-16 right-1/5 w-3 h-3 bg-blue-400/40 rounded-full animate-bounce" style={{ animationDelay: '1.3s', animationDuration: '4.5s' }}></div>
      <div className="absolute bottom-24 left-3/5 w-1.5 h-1.5 bg-vanguard-blue/25 rounded-full animate-bounce" style={{ animationDelay: '2.3s', animationDuration: '5.5s' }}></div>
    </div>
  )
} 
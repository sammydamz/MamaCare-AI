import { Link, Outlet } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';

export function ClassicLayout() {
  return (
    <div className="flex min-h-screen w-full">
      {/* Left — Login Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[45%] px-8 py-12 bg-background">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2 mb-6">
              <img
                src={toAbsoluteUrl('/media/app/default-logo.svg')}
                className="h-[44px] w-auto"
                alt="MamaCare AI"
              />
              <span className="text-[18px] font-bold tracking-tight text-foreground">
                MamaCare <span style={{ color: '#ff66c4' }}>AI</span>
              </span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Right — Branded Panel */}
      <div
        className="hidden lg:flex flex-col justify-between w-[55%] p-12 relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, #0f1f3d 0%, #1a2f5a 50%, #0d1b35 100%)',
        }}
      >
        {/* Background glow blobs */}
        <div
          className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none"
          style={{ background: '#ff66c4' }}
        />
        <div
          className="absolute bottom-[-60px] left-[-60px] w-[300px] h-[300px] rounded-full opacity-15 blur-3xl pointer-events-none"
          style={{ background: '#24ebd3' }}
        />

        {/* Logo mark */}
        <div>
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-10" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <img
              src={toAbsoluteUrl('/media/app/default-logo.svg')}
              className="h-8 w-8"
              alt="MamaCare AI"
            />
          </div>

          {/* Badges */}
          <div className="flex gap-2 mb-6">
            {['AI-powered', 'Maternal health'].map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium px-3 py-1 rounded-full border"
                style={{ color: 'rgba(255,255,255,0.7)', borderColor: 'rgba(255,255,255,0.2)', background: 'rgba(255,255,255,0.05)' }}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Headline */}
          <h2 className="text-white text-3xl font-bold leading-tight mb-4">
            One platform for patients,<br />
            CHWs, referrals, and<br />
            risk monitoring.
          </h2>

          {/* Description */}
          <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.55)' }}>
            MamaCare AI keeps frontline health workers informed with
            real-time risk scores, AI-assisted consultations, and
            automated referral tracking — all in local languages.
          </p>

          {/* Feature grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              'Patient monitoring',
              'Referral tracking',
              'CHW management',
              'Risk analytics',
            ].map((feature) => (
              <div
                key={feature}
                className="px-4 py-3 rounded-xl text-sm font-medium"
                style={{
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.75)',
                }}
              >
                {feature}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-xs mt-10" style={{ color: 'rgba(255,255,255,0.3)' }}>
          © {new Date().getFullYear()} MamaCare AI · Empowering maternal health with technology
        </p>
      </div>
    </div>
  );
}

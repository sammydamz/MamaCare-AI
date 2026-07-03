import { Link, Outlet } from 'react-router-dom';
import { toAbsoluteUrl } from '@/lib/helpers';

export function BrandedLayout() {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Left - Login Form */}
      <div className="flex flex-col justify-center items-center w-full lg:w-[45%] px-8 py-12">
        <div className="w-full max-w-[380px]">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-3 justify-center mb-6">
              <img
                src={toAbsoluteUrl('/media/app/default-logo.svg')}
                className="h-[64px] w-auto"
                alt="MamaCare AI"
              />
              <span className="text-[24px] font-bold tracking-tight text-foreground">
                MamaCare <span style={{ color: '#ff66c4' }}>AI</span>
              </span>
            </Link>
          </div>
          <Outlet />
        </div>
      </div>

      {/* Right - Branded Panel (rounded card with margin) */}
      <div className="hidden lg:flex items-stretch w-[55%] p-6">
        <div
          className="flex flex-col justify-between w-full rounded-2xl p-10 relative overflow-hidden"
          style={{
            background: 'linear-gradient(160deg, #0d2137 0%, #0a2a2a 50%, #061a1a 100%)',
          }}
        >
          {/* Pink glow top-right */}
          <div
            className="absolute top-[-60px] right-[-60px] w-[320px] h-[320px] rounded-full opacity-25 blur-3xl pointer-events-none"
            style={{ background: '#ff66c4' }}
          />
          {/* Teal glow bottom-right */}
          <div
            className="absolute bottom-0 right-0 w-[350px] h-[350px] rounded-full opacity-30 blur-3xl pointer-events-none"
            style={{ background: '#0d5c4a' }}
          />

          <div>
            {/* Logo mark */}
            <div className="mb-10">
              <img
                src={toAbsoluteUrl('/media/app/default-logo.svg')}
                className="h-16 w-16"
                alt="MamaCare AI"
                style={{ filter: 'brightness(0) invert(1)' }}
              />
            </div>

            {/* Badges - hidden for now */}

            {/* Headline */}
            <h2 className="text-white text-[26px] font-bold leading-snug mb-5">
              Voice-first maternal care, reaching mothers where they are.
            </h2>

            {/* Description */}
            <p className="text-sm leading-relaxed mb-10" style={{ color: 'rgba(255,255,255,0.5)' }}>
              MamaCare AI monitors pregnant and perinatally bereaved mothers through automated voice calls,
              triaging risk in real time so healthcare providers can act when it matters most.
            </p>

            {/* Feature grid */}
            <div className="grid grid-cols-2 gap-3">
              {['AI risk triage', 'Referral tracking', 'Multilingual voice calls', 'Pregnancy loss support'].map(
                (feature) => (
                  <div
                    key={feature}
                    className="px-4 py-3 rounded-xl text-sm font-medium"
                    style={{
                      background: 'rgba(255,255,255,0.06)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'rgba(255,255,255,0.7)',
                    }}
                  >
                    {feature}
                  </div>
                ),
              )}
            </div>
          </div>

          {/* Footer */}
          <p className="text-xs mt-10 relative z-10" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © 2025 MamaCare AI by Kasalite
          </p>
        </div>
      </div>
    </div>
  );
}

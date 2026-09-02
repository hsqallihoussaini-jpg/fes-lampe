import Link from 'next/link'
import type { ReactNode } from 'react'

type VendorStat = {
  label: string
  value: string
  detail?: string
}

type VendorNavItem = {
  href: string
  label: string
  active?: boolean
}

type VendorAction = {
  href: string
  label: string
  variant?: 'primary' | 'secondary'
}

type VendorShellProps = {
  eyebrow?: string
  title: string
  subtitle: string
  stats?: VendorStat[]
  nav?: VendorNavItem[]
  actions?: VendorAction[]
  children?: ReactNode
}

export default function VendorShell({
  eyebrow = 'Espace vendeur',
  title,
  subtitle,
  stats = [],
  nav = [],
  actions = [],
  children,
}: VendorShellProps) {
  return (
    <div className="vendor-page">
      <div className="vendor-shell">
        <header className="vendor-card vendor-hero">
          <div className="vendor-soft-glow" aria-hidden="true" />

          <div className="vendor-hero-top">
            <div className="relative z-1">
              <p className="vendor-eyebrow">{eyebrow}</p>
              <h1 className="vendor-title">{title}</h1>
              <p className="vendor-subtitle">{subtitle}</p>
            </div>

            {actions.length > 0 ? (
              <div className="vendor-action-bar">
                {actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={action.variant === 'primary' ? 'vendor-button-primary' : 'vendor-button-secondary'}
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>

          {stats.length > 0 ? (
            <div className="vendor-stats-grid">
              {stats.map((stat) => (
                <div key={stat.label} className="vendor-stat">
                  <div className="vendor-stat-label">{stat.label}</div>
                  <div className="vendor-stat-value">{stat.value}</div>
                  {stat.detail ? <div className="vendor-stat-detail">{stat.detail}</div> : null}
                </div>
              ))}
            </div>
          ) : null}

          {nav.length > 0 ? (
            <nav className="vendor-nav" aria-label="Navigation vendeur">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={item.active ? 'vendor-nav-link vendor-nav-link-active' : 'vendor-nav-link'}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          ) : null}
        </header>

        <main className="vendor-section">{children}</main>
      </div>
    </div>
  )
}
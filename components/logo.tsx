type LogoProps = {
  className?: string
  width?: number
  height?: number
  showText?: boolean
}

export function Logo({ className = "", width = 120, height = 120, showText = false }: LogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src="/images/hynox-logo.jpg"
        alt="Hynox logo: HX with colored dots"
        width={width}
        height={height}
        className="rounded-md"
      />
      {showText ? <span className="text-xl font-semibold tracking-tight text-primary">Hynox</span> : null}
    </div>
  )
}

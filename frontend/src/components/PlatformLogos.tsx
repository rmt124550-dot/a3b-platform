// SVG logos de cada plataforma — originales, no copiados
export const logos: Record<string, React.FC<{ size?: number }>> = {

  coursera: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="20" fill="#0056D2"/>
      <path d="M50 20C33.4 20 20 33.4 20 50s13.4 30 30 30 30-13.4 30-30S66.6 20 50 20z" fill="white" opacity="0.15"/>
      <path d="M35 50c0-8.3 6.7-15 15-15 4.1 0 7.8 1.7 10.5 4.4L67 33c-4.5-4.2-10.5-6.8-17-6.8C36.4 26.2 24 38.7 24 54c0 15.4 12.4 27.8 26 27.8 6.5 0 12.5-2.5 17-6.8l-6.5-6.4C57.8 71.3 54.1 73 50 73c-8.3 0-15-6.7-15-15z" fill="white"/>
    </svg>
  ),

  edx: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="20" fill="#02262B"/>
      <path d="M15 36h25v8H23v6h15v8H23v6h17v8H15z" fill="#D23228"/>
      <path d="M45 36l10 13 10-13h10L60 52l15 20H65L55 59 45 72H35l15-20-15-16z" fill="white"/>
    </svg>
  ),

  udemy: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="20" fill="#5624D0"/>
      <path d="M50 15L70 28v44L50 85 30 72V28z" fill="white" opacity="0.1"/>
      <circle cx="50" cy="50" r="22" fill="none" stroke="white" strokeWidth="5"/>
      <path d="M43 39v22l18-11z" fill="white"/>
    </svg>
  ),

  udacity: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="20" fill="#02B3E4"/>
      <path d="M25 30h12v25c0 7.2 5.8 13 13 13s13-5.8 13-13V30h12v25c0 13.8-11.2 25-25 25S25 68.8 25 55z" fill="white"/>
    </svg>
  ),

  datacamp: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="20" fill="#03EF62" opacity="0.15"/>
      <rect width="100" height="100" rx="20" fill="#05192D"/>
      <path d="M30 65V35l18 10v10l12-7v12l-12 7v-10z" fill="#03EF62"/>
      <rect x="60" y="30" width="10" height="40" rx="5" fill="#03EF62" opacity="0.6"/>
    </svg>
  ),

  codecademy: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="20" fill="#1F4056"/>
      <path d="M20 50l15-15 7 7-8 8 8 8-7 7z" fill="#3CC8C8"/>
      <path d="M80 50L65 65l-7-7 8-8-8-8 7-7z" fill="#3CC8C8"/>
      <path d="M55 28l-10 44" stroke="#FFC301" strokeWidth="6" strokeLinecap="round"/>
    </svg>
  ),

  youtube: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="20" fill="#FF0000" opacity="0.15"/>
      <rect width="100" height="100" rx="20" fill="#1a0000"/>
      <rect x="15" y="28" width="70" height="44" rx="12" fill="#FF0000"/>
      <path d="M43 38l22 12-22 12z" fill="white"/>
    </svg>
  ),

  linkedin: ({ size = 32 }) => (
    <svg width={size} height={size} viewBox="0 0 100 100" fill="none">
      <rect width="100" height="100" rx="20" fill="#0A66C2"/>
      <rect x="20" y="38" width="14" height="42" rx="2" fill="white"/>
      <circle cx="27" cy="26" r="9" fill="white"/>
      <path d="M44 38h13v7c2-4 7-8 14-8 13 0 15 9 15 20v23H73V59c0-5-1-9-7-9s-9 4-9 10v20H44z" fill="white"/>
    </svg>
  ),
}

export default function PlatformLogo({ platform, size = 32 }: { platform: string; size?: number }) {
  const Logo = logos[platform.toLowerCase()]
  if (!Logo) return <span style={{ fontSize: size * 0.8 }}>🌐</span>
  return <Logo size={size} />
}

// Custom SVG muscle group icons — minimal line art, 24×24 viewBox

interface IconProps {
  className?: string
}

const props = (className?: string) => ({
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  className,
})

/** Brust — front torso with pectoral arch */
export function IconBrust({ className }: IconProps) {
  return (
    <svg {...props(className)}>
      {/* collarbone */}
      <path d="M6 7.5 Q9 6.5 12 6.5 Q15 6.5 18 7.5" />
      {/* left pec */}
      <path d="M6 7.5 C5 10 5.5 13.5 8 15 C10 16 11.5 15.5 12 14.5" />
      {/* right pec */}
      <path d="M18 7.5 C19 10 18.5 13.5 16 15 C14 16 12.5 15.5 12 14.5" />
      {/* sternum */}
      <line x1="12" y1="6.5" x2="12" y2="14.5" />
    </svg>
  )
}

/** Rücken — back muscles V-taper from behind */
export function IconRücken({ className }: IconProps) {
  return (
    <svg {...props(className)}>
      {/* trapezius top */}
      <path d="M7 5 Q12 4 17 5" />
      {/* left lat */}
      <path d="M7 5 C5 7 4 10 5.5 14 C6.5 16.5 9 17.5 10.5 17" />
      {/* right lat */}
      <path d="M17 5 C19 7 20 10 18.5 14 C17.5 16.5 15 17.5 13.5 17" />
      {/* lower back / waist */}
      <path d="M10.5 17 Q12 18 13.5 17" />
      {/* spine */}
      <line x1="12" y1="4" x2="12" y2="18" strokeDasharray="1.5 1.2" />
    </svg>
  )
}

/** Schulter — three deltoid heads */
export function IconSchulter({ className }: IconProps) {
  return (
    <svg {...props(className)}>
      {/* clavicle */}
      <path d="M8 9 Q12 7.5 16 9" />
      {/* anterior deltoid */}
      <path d="M8 9 C6 10 5.5 12.5 7 14 C8 15 9.5 14.5 10 13" />
      {/* medial deltoid (middle/top) */}
      <path d="M10 9 C10 7.5 11 6.5 12 6.5 C13 6.5 14 7.5 14 9" />
      {/* posterior deltoid */}
      <path d="M16 9 C18 10 18.5 12.5 17 14 C16 15 14.5 14.5 14 13" />
      {/* arm shaft */}
      <path d="M7 14 Q7.5 16.5 8.5 18" />
      <path d="M17 14 Q16.5 16.5 15.5 18" />
    </svg>
  )
}

/** Bizeps — flexed arm profile with bicep peak */
export function IconBizeps({ className }: IconProps) {
  return (
    <svg {...props(className)}>
      {/* upper arm / shoulder */}
      <path d="M7 6 Q8 5 10 5.5" />
      {/* bicep peak */}
      <path d="M7 6 C5.5 8 5.5 10 7 11.5 C8.5 13 11 13 12 12" />
      {/* bottom of upper arm */}
      <path d="M10 5.5 C12 6 13 8 12 12" />
      {/* elbow */}
      <path d="M7 11.5 Q7 13 8 13.5" />
      <path d="M12 12 Q13 13 12.5 14" />
      {/* forearm */}
      <path d="M8 13.5 Q9 16 10 18" />
      <path d="M12.5 14 Q12 16.5 11 18.5" />
      {/* fist */}
      <path d="M10 18 Q10.5 19 11 18.5" strokeWidth={1.4} />
    </svg>
  )
}

/** Trizeps — back of arm, horseshoe tricep */
export function IconTrizeps({ className }: IconProps) {
  return (
    <svg {...props(className)}>
      {/* shoulder top */}
      <path d="M8 5 Q12 4 16 5" />
      {/* tricep horseshoe - left side */}
      <path d="M8 5 C6.5 7 6.5 10 8 12 C9 13.5 10.5 14 12 14" />
      {/* tricep horseshoe - right side */}
      <path d="M16 5 C17.5 7 17.5 10 16 12 C15 13.5 13.5 14 12 14" />
      {/* forearm extending down */}
      <path d="M10.5 14 L10 19" />
      <path d="M13.5 14 L14 19" />
      {/* wrist */}
      <line x1="10" y1="19" x2="14" y2="19" />
    </svg>
  )
}

/** Beine — front view of thighs / quads */
export function IconBeine({ className }: IconProps) {
  return (
    <svg {...props(className)}>
      {/* hips */}
      <path d="M7 5 Q12 4 17 5" />
      {/* left quad */}
      <path d="M7 5 C5.5 7 5 10 5.5 13 C6 16 7.5 18.5 9 19" />
      <path d="M11 5.5 C11.5 7 11.5 10 11 13 C10.5 15.5 10 17.5 9 19" />
      {/* right quad */}
      <path d="M13 5.5 C12.5 7 12.5 10 13 13 C13.5 15.5 14 17.5 15 19" />
      <path d="M17 5 C18.5 7 19 10 18.5 13 C18 16 16.5 18.5 15 19" />
      {/* center gap */}
      <line x1="12" y1="5" x2="12" y2="8" />
    </svg>
  )
}

/** Mobility — seated forward fold / stretch */
export function IconMobility({ className }: IconProps) {
  return (
    <svg {...props(className)}>
      {/* head */}
      <circle cx="12" cy="5" r="2" />
      {/* spine curving forward */}
      <path d="M12 7 C12 9 11 11 9 13" />
      {/* legs flat on ground */}
      <line x1="4" y1="17" x2="20" y2="17" />
      {/* left leg */}
      <path d="M9 13 C8 14.5 6 16 4 17" />
      {/* right leg / hip */}
      <path d="M9 13 C10 14.5 12 16 14 17" />
      {/* arms reaching forward to toes */}
      <path d="M11 10 C10 12 9 14.5 8 17" />
      <path d="M11 10 C9.5 12 7.5 14.5 6 17" />
      {/* stretch lines (energy) */}
      <path d="M16 15 L19 13" strokeWidth={1} opacity={0.6} />
      <path d="M17 17 L20 16" strokeWidth={1} opacity={0.6} />
    </svg>
  )
}

/** Ausdauer — heartbeat / ECG line */
export function IconAusdauer({ className }: IconProps) {
  return (
    <svg {...props(className)}>
      {/* heart shape */}
      <path d="M12 19 C12 19 4 14 4 9 C4 6.5 6 5 8 5 C9.5 5 11 5.8 12 7 C13 5.8 14.5 5 16 5 C18 5 20 6.5 20 9 C20 14 12 19 12 19Z" />
      {/* ECG pulse line through heart */}
      <polyline points="5,10 7.5,10 9,7.5 10.5,13 12,8 13.5,10 16,10 18.5,10" strokeWidth={1.3} />
    </svg>
  )
}

/** Eisbaden — snowflake / ice crystal */
export function IconEisbaden({ className }: IconProps) {
  return (
    <svg {...props(className)}>
      {/* main cross */}
      <line x1="12" y1="3" x2="12" y2="21" />
      <line x1="3" y1="12" x2="21" y2="12" />
      {/* diagonal arms */}
      <line x1="5.6" y1="5.6" x2="18.4" y2="18.4" />
      <line x1="18.4" y1="5.6" x2="5.6" y2="18.4" />
      {/* top branch ticks */}
      <line x1="9.5" y1="6.5" x2="12" y2="4" />
      <line x1="14.5" y1="6.5" x2="12" y2="4" />
      {/* bottom branch ticks */}
      <line x1="9.5" y1="17.5" x2="12" y2="20" />
      <line x1="14.5" y1="17.5" x2="12" y2="20" />
      {/* left branch ticks */}
      <line x1="6.5" y1="9.5" x2="4" y2="12" />
      <line x1="6.5" y1="14.5" x2="4" y2="12" />
      {/* right branch ticks */}
      <line x1="17.5" y1="9.5" x2="20" y2="12" />
      <line x1="17.5" y1="14.5" x2="20" y2="12" />
      {/* center dot */}
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </svg>
  )
}

export const MUSCLE_ICONS: Record<string, (props: IconProps) => JSX.Element> = {
  Brust: IconBrust,
  Rücken: IconRücken,
  Schulter: IconSchulter,
  Bizeps: IconBizeps,
  Trizeps: IconTrizeps,
  Beine: IconBeine,
  Mobility: IconMobility,
  Ausdauer: IconAusdauer,
  Eisbaden: IconEisbaden,
}

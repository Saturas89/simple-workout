// Custom SVG muscle group icons — anatomical illustration style
// Each icon uses filled shapes + outlined strokes for depth and clarity
import React from 'react'

interface IconProps {
  className?: string
  style?: React.CSSProperties
}

/** Brust — front torso, two pectoral muscles */
export function IconBrust({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {/* Full chest area – soft background fill */}
      <path
        d="M4 9.5C4 6.5 6.5 4.5 9.5 5.5C11 6 11.8 7.5 12 9C12.2 7.5 13 6 14.5 5.5C17.5 4.5 20 6.5 20 9.5C20 14 16.5 18.5 12 20C7.5 18.5 4 14 4 9.5Z"
        fill="currentColor" fillOpacity="0.12"
      />
      {/* Left pec muscle body */}
      <path
        d="M4 9.5C4 6.5 6.5 4.5 9.5 5.5C11 6 11.8 7.5 12 9V16C9 15 6 12.5 4 9.5Z"
        fill="currentColor" fillOpacity="0.32"
      />
      {/* Right pec muscle body */}
      <path
        d="M20 9.5C20 6.5 17.5 4.5 14.5 5.5C13 6 12.2 7.5 12 9V16C15 15 18 12.5 20 9.5Z"
        fill="currentColor" fillOpacity="0.32"
      />
      {/* Main outline */}
      <path
        d="M4 9.5C4 6.5 6.5 4.5 9.5 5.5C11 6 11.8 7.5 12 9C12.2 7.5 13 6 14.5 5.5C17.5 4.5 20 6.5 20 9.5C20 14 16.5 18.5 12 20C7.5 18.5 4 14 4 9.5Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      {/* Sternum division */}
      <line x1="12" y1="7" x2="12" y2="20" stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" />
      {/* Collarbone */}
      <path d="M5.5 8Q9 6.5 12 7Q15 6.5 18.5 8"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Pec fold – left */}
      <path d="M6.5 11.5Q9.5 14.5 12 14"
        stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.55" />
      {/* Pec fold – right */}
      <path d="M17.5 11.5Q14.5 14.5 12 14"
        stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.55" />
    </svg>
  )
}

/** Rücken — back muscles, V-taper view from behind */
export function IconRücken({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {/* Full back fill */}
      <path
        d="M5 7C5 5.5 8 4 12 4C16 4 19 5.5 19 7C19 9 17.5 11 16 13L13.5 20H10.5L8 13C6.5 11 5 9 5 7Z"
        fill="currentColor" fillOpacity="0.1"
      />
      {/* Left lat */}
      <path
        d="M5 7C5 5.5 8 4 12 4V14L8 13C6.5 11 5 9 5 7Z"
        fill="currentColor" fillOpacity="0.3"
      />
      {/* Right lat */}
      <path
        d="M19 7C19 5.5 16 4 12 4V14L16 13C17.5 11 19 9 19 7Z"
        fill="currentColor" fillOpacity="0.3"
      />
      {/* Trapezius – top diamond */}
      <path
        d="M8 4.5C8 4.5 10 3 12 3C14 3 16 4.5 16 4.5C15 6 13.5 7 12 7C10.5 7 9 6 8 4.5Z"
        fill="currentColor" fillOpacity="0.45"
        stroke="currentColor" strokeWidth="0.8" strokeOpacity="0.5"
      />
      {/* Outline */}
      <path
        d="M5 7C5 5.5 8 4 12 4C16 4 19 5.5 19 7C19 9 17.5 11 16 13L13.5 20H10.5L8 13C6.5 11 5 9 5 7Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      {/* Spine */}
      <line x1="12" y1="4" x2="12" y2="20"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" strokeDasharray="1.5 1.5" />
      {/* Lat definition lines */}
      <path d="M7 8.5Q9.5 11 12 11" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M17 8.5Q14.5 11 12 11" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  )
}

/** Schulter — deltoid muscle, three heads visible */
export function IconSchulter({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {/* Posterior delt (back) */}
      <path
        d="M16.5 5.5C18.5 6 20 7.5 20 9.5C20 11.5 18.5 13 17 14L14 15.5L14.5 12Z"
        fill="currentColor" fillOpacity="0.25"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeLinejoin="round"
      />
      {/* Anterior delt (front) */}
      <path
        d="M7.5 5.5C5.5 6 4 7.5 4 9.5C4 11.5 5.5 13 7 14L10 15.5L9.5 12Z"
        fill="currentColor" fillOpacity="0.25"
        stroke="currentColor" strokeWidth="1" strokeOpacity="0.5" strokeLinejoin="round"
      />
      {/* Lateral deltoid – main cap, front and center */}
      <path
        d="M9.5 4.5C9.5 4.5 10.5 3 12 3C13.5 3 14.5 4.5 14.5 4.5C17 5.5 19 7.5 19 10C19 13 16 15.5 14 16L13.5 19H10.5L10 16C8 15.5 5 13 5 10C5 7.5 7 5.5 9.5 4.5Z"
        fill="currentColor" fillOpacity="0.35"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      {/* Arm shaft */}
      <path d="M10.5 19C10.5 19 10.5 21 12 21C13.5 21 13.5 19 13.5 19"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Muscle separation lines */}
      <path d="M9.5 8.5Q12 10 14.5 8.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M7 11Q10 13 12 13" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.45" />
      <path d="M17 11Q14 13 12 13" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.45" />
    </svg>
  )
}

/** Bizeps — flexed arm, bicep peak clearly defined */
export function IconBizeps({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {/* Upper arm base fill */}
      <path
        d="M6.5 7C6.5 5 8.5 3.5 10.5 4C12 4.5 13 6 13 7.5C13 9 12 10.5 11 11L11.5 14H8.5L8 11C7 10 6.5 8.5 6.5 7Z"
        fill="currentColor" fillOpacity="0.15"
      />
      {/* Bicep peak – inner head */}
      <path
        d="M8 7C8 5.5 9 4.5 10.5 4.5C12 4.5 13 5.5 13 7.5C13 9 12 10.5 11 11L10 11.5L9.5 11Z"
        fill="currentColor" fillOpacity="0.4"
      />
      {/* Bicep outer head */}
      <path
        d="M6.5 7C6.5 5 8 4 9.5 4.5C9 5.5 8.5 6.5 8.5 7.5C8.5 9 9 10 9.5 11L8 11C7 10 6.5 8.5 6.5 7Z"
        fill="currentColor" fillOpacity="0.25"
      />
      {/* Full upper arm outline */}
      <path
        d="M6.5 7C6.5 5 8.5 3.5 10.5 4C12 4.5 13 6 13 7.5C13 9 12 10.5 11 11L11.5 14H8.5L8 11C7 10 6.5 8.5 6.5 7Z"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      {/* Forearm */}
      <path
        d="M8.5 14C8.5 14 8 16 8 18C8 19.5 9 20.5 10 20.5C11 20.5 12 19.5 12 18C12 16 11.5 14 11.5 14"
        stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"
        fill="currentColor" fillOpacity="0.18"
      />
      {/* Elbow crease */}
      <path d="M8 13.5Q10 15 12 13.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Bicep peak line / muscle belly line */}
      <path d="M8.5 7.5Q10.5 5.5 12.5 7" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Shoulder top */}
      <path d="M6 6.5Q8 4.5 11 4Q14 3.5 16 5"
        stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.7" />
    </svg>
  )
}

/** Trizeps — back of arm, horseshoe tricep shape */
export function IconTrizeps({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {/* Shoulder area */}
      <path d="M7 4.5Q12 3 17 4.5"
        stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
      {/* Tricep horseshoe – full fill */}
      <path
        d="M7 4.5C5 6 4.5 8 5 10C5.5 12.5 7.5 14.5 10 15L12 15.5L14 15C16.5 14.5 18.5 12.5 19 10C19.5 8 19 6 17 4.5C16 5.5 15 7 15 9C15 11 13.5 12.5 12 12.5C10.5 12.5 9 11 9 9C9 7 8 5.5 7 4.5Z"
        fill="currentColor" fillOpacity="0.15"
        stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round"
      />
      {/* Left tricep head */}
      <path
        d="M7 4.5C5.5 6 5 8 5.5 10.5C6 12.5 8 14 10 14.5L12 15V12C10 11.5 9 10 9 9C9 7 8 5.5 7 4.5Z"
        fill="currentColor" fillOpacity="0.3"
      />
      {/* Right tricep head */}
      <path
        d="M17 4.5C18.5 6 19 8 18.5 10.5C18 12.5 16 14 14 14.5L12 15V12C14 11.5 15 10 15 9C15 7 16 5.5 17 4.5Z"
        fill="currentColor" fillOpacity="0.3"
      />
      {/* Long head center */}
      <path
        d="M10.5 4.5C10.5 4.5 11 3.5 12 3.5C13 3.5 13.5 4.5 13.5 4.5C13 6 12.5 8 12 9.5C11.5 11 12 13 12 15"
        fill="currentColor" fillOpacity="0.2"
        stroke="currentColor" strokeWidth="0.9" strokeOpacity="0.5" strokeLinecap="round"
      />
      {/* Forearm */}
      <path d="M10 15L9.5 21H14.5L14 15" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="9.5" y1="21" x2="14.5" y2="21" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

/** Beine — front view of quads, thigh musculature */
export function IconBeine({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {/* Hip / pelvis bar */}
      <path d="M5 5Q12 3.5 19 5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
      {/* Left quad body */}
      <path
        d="M5.5 5.5C4 7 3.5 9 4 12C4.5 15 6 18 8 20H11L11.5 16C10 15.5 9 14 9 12.5C9 10 10 8 10.5 5.5C9 5 7 5 5.5 5.5Z"
        fill="currentColor" fillOpacity="0.3"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
      />
      {/* Left VMO (teardrop above knee) */}
      <path
        d="M9 14C9 14 10 15.5 10.5 17C11 18.5 11 20 11 20H8C8 20 7 18.5 7 17C7 15.5 7.5 14 9 14Z"
        fill="currentColor" fillOpacity="0.45"
      />
      {/* Left rectus femoris line */}
      <path d="M10.5 6.5Q10 11 9.5 14" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.5" />
      {/* Right quad body */}
      <path
        d="M18.5 5.5C20 7 20.5 9 20 12C19.5 15 18 18 16 20H13L12.5 16C14 15.5 15 14 15 12.5C15 10 14 8 13.5 5.5C15 5 17 5 18.5 5.5Z"
        fill="currentColor" fillOpacity="0.3"
        stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round"
      />
      {/* Right VMO */}
      <path
        d="M15 14C15 14 14 15.5 13.5 17C13 18.5 13 20 13 20H16C16 20 17 18.5 17 17C17 15.5 16.5 14 15 14Z"
        fill="currentColor" fillOpacity="0.45"
      />
      {/* Right rectus femoris line */}
      <path d="M13.5 6.5Q14 11 14.5 14" stroke="currentColor" strokeWidth="0.85" strokeLinecap="round" strokeOpacity="0.5" />
    </svg>
  )
}

/** Mobility — warrior yoga pose, side stretch */
export function IconMobility({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {/* Head */}
      <circle cx="12" cy="3.5" r="1.8" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1.2" />
      {/* Torso – bent forward */}
      <path
        d="M12 5.5C12 5.5 11 7.5 9.5 9.5C8 11.5 6 13 5 14"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      />
      {/* Left arm reaching down */}
      <path
        d="M9.5 9.5C8.5 10.5 7 12.5 5.5 17"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* Right arm raised up – the stretch */}
      <path
        d="M11 7C12 6 13.5 5 15.5 4.5C17 4.2 18.5 4.5 19.5 5.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* Back leg straight */}
      <path
        d="M11.5 13.5C10.5 15 9 17 8 20"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      />
      {/* Front leg bent */}
      <path
        d="M11.5 13.5C12.5 15 14 17 13.5 20"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      />
      {/* Hip anchor */}
      <ellipse cx="11.5" cy="13.5" rx="1.2" ry="1.2" fill="currentColor" fillOpacity="0.4" />
      {/* Stretch radiance lines */}
      <path d="M18 6.5L20.5 4.5" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.5" />
      <path d="M19 8.5L21.5 8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.4" />
      <path d="M18.5 10.5L21 11" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeOpacity="0.3" />
    </svg>
  )
}

/** Ausdauer — dynamic running figure */
export function IconAusdauer({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {/* Head */}
      <circle cx="15.5" cy="3.5" r="1.8" fill="currentColor" fillOpacity="0.5" stroke="currentColor" strokeWidth="1.2" />
      {/* Torso – leaning forward */}
      <path
        d="M15 5.3C14 6.5 13 8 12.5 9.5"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      />
      {/* Front arm swinging back */}
      <path
        d="M14 7C15.5 7.5 17 8 18.5 7.5"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* Back arm swinging forward */}
      <path
        d="M13 8C12 8.5 10.5 9.5 9 9"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
      {/* Front knee up */}
      <path
        d="M12.5 9.5C12 11 11.5 12.5 11 14"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      />
      {/* Front lower leg – heel strike */}
      <path
        d="M11 14C10 15.5 9.5 17 9 18.5"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      />
      {/* Back leg pushing off */}
      <path
        d="M12.5 9.5C13.5 11.5 14.5 13.5 16 15"
        stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
      />
      <path
        d="M16 15C17 16 17.5 17.5 18 19"
        stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"
      />
      {/* Speed lines */}
      <path d="M5 10H9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.6" />
      <path d="M3.5 13H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.45" />
      <path d="M5 16H8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeOpacity="0.3" />
      {/* Ground line */}
      <line x1="4" y1="20.5" x2="20" y2="20.5" stroke="currentColor" strokeWidth="1" strokeOpacity="0.35" strokeLinecap="round" />
    </svg>
  )
}

/** Eisbaden — elaborate snowflake / ice crystal */
export function IconEisbaden({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} style={style}>
      {/* Main vertical arm */}
      <line x1="12" y1="2.5" x2="12" y2="21.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Main horizontal arm */}
      <line x1="2.5" y1="12" x2="21.5" y2="12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Diagonal arms */}
      <line x1="5.3" y1="5.3" x2="18.7" y2="18.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="18.7" y1="5.3" x2="5.3" y2="18.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      {/* Top arm branches */}
      <line x1="12" y1="6" x2="9.5" y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="12" y1="6" x2="14.5" y2="3.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {/* Bottom arm branches */}
      <line x1="12" y1="18" x2="9.5" y2="20.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="12" y1="18" x2="14.5" y2="20.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {/* Left arm branches */}
      <line x1="6" y1="12" x2="3.5" y2="9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="6" y1="12" x2="3.5" y2="14.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {/* Right arm branches */}
      <line x1="18" y1="12" x2="20.5" y2="9.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      <line x1="18" y1="12" x2="20.5" y2="14.5" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round" />
      {/* Diagonal arm branches – top-left */}
      <line x1="8.2" y1="8.2" x2="6.5" y2="4.8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="8.2" y1="8.2" x2="4.8" y2="6.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.7" />
      {/* Diagonal arm branches – top-right */}
      <line x1="15.8" y1="8.2" x2="17.5" y2="4.8" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="15.8" y1="8.2" x2="19.2" y2="6.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.7" />
      {/* Diagonal arm branches – bottom-left */}
      <line x1="8.2" y1="15.8" x2="6.5" y2="19.2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="8.2" y1="15.8" x2="4.8" y2="17.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.7" />
      {/* Diagonal arm branches – bottom-right */}
      <line x1="15.8" y1="15.8" x2="17.5" y2="19.2" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.7" />
      <line x1="15.8" y1="15.8" x2="19.2" y2="17.5" stroke="currentColor" strokeWidth="0.9" strokeLinecap="round" strokeOpacity="0.7" />
      {/* Center crystal */}
      <circle cx="12" cy="12" r="2.2" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="12" r="0.8" fill="currentColor" />
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

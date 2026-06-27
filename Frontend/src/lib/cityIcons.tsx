import React from 'react';

type IconProps = { className?: string };

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.3,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

// Vidhana Soudha-style domed legislature building (Bangalore)
const DomeBuildingIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <circle cx="12" cy="5.5" r="2" />
    <path d="M12 1.5v2" />
    <rect x="4.5" y="8" width="15" height="1.6" />
    <path d="M6 9.6V18M9 9.6V18M12 9.6V18M15 9.6V18M18 9.6V18" />
    <rect x="3.5" y="18" width="17" height="2" />
  </svg>
);

// India Gate style arch monument (Delhi)
const ArchMonumentIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M8 20V11a4 4 0 0 1 8 0v9" />
    <path d="M6 20h12" />
    <path d="M8 20v-1M16 20v-1" />
    <path d="M12 6.5v1.5" />
  </svg>
);

// Generic tower with grid windows (Faridabad)
const GenericTowerIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="6" y="3" width="12" height="17" />
    <path d="M9 6.5h1.5M13.5 6.5H15M9 10h1.5M13.5 10H15M9 13.5h1.5M13.5 13.5H15M9 17h1.5M13.5 17H15" />
    <path d="M4 20h16" />
  </svg>
);

// Building with a triangular pediment roof (Ghaziabad)
const PeakRoofBuildingIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M5 8 12 3l7 5" />
    <rect x="6" y="8" width="12" height="11" />
    <path d="M9 11.5h1.5M13.5 11.5H15M9 15h1.5M13.5 15H15" />
    <path d="M4 19h16" />
  </svg>
);

// Stepped / staggered tower (Greater Noida)
const SteppedTowerIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="9" y="3" width="6" height="5" />
    <rect x="6.5" y="8" width="11" height="5" />
    <rect x="4.5" y="13" width="15" height="6" />
    <path d="M3.5 19h17" />
  </svg>
);

// Tapering tower with rooftop antenna (Gurgaon)
const TaperedTowerIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M12 2v2" />
    <path d="M9 4h6l1.5 15h-9L9 4Z" />
    <path d="M9.6 8h4.8M9.3 11.5h5.4M9 15h6" />
    <path d="M4 19h16" />
  </svg>
);

// Charminar style tower with four corner minarets (Hyderabad)
const MinaretsIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="9" y="9" width="6" height="10" />
    <path d="M10.5 13a1.5 1.5 0 0 1 3 0" />
    <path d="M4 6v13M20 6v13M7 6v13M17 6v13" />
    <circle cx="4" cy="5" r="1" />
    <circle cx="20" cy="5" r="1" />
    <circle cx="7" cy="5" r="0.8" />
    <circle cx="17" cy="5" r="0.8" />
    <circle cx="12" cy="6.5" r="1.2" />
    <path d="M3 19h18" />
  </svg>
);

// Tiered palace facade with a small spire (Indore - Rajwada)
const TieredPalaceIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M12 2.5v1.5" />
    <rect x="10.5" y="4" width="3" height="3" />
    <rect x="8" y="7" width="8" height="3.5" />
    <rect x="6" y="10.5" width="12" height="4" />
    <rect x="4.5" y="14.5" width="15" height="4.5" />
    <path d="M3.5 19h17" />
  </svg>
);

// Hawa Mahal style lattice facade (Jaipur)
const LatticeFacadeIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M5 19V8a7 7 0 0 1 14 0v11" />
    <path d="M7.5 9.5a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z" />
    <path d="M11 9.5a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z" />
    <path d="M14.5 9.5a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z" />
    <path d="M7.5 13.5a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z" />
    <path d="M14.5 13.5a1 1 0 1 0 2 0 1 1 0 1 0-2 0Z" />
    <path d="M4 19h16" />
  </svg>
);

// Gateway of India style arch by the water (Mumbai)
const GatewayArchIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M9 18v-6a3 3 0 0 1 6 0v6" />
    <path d="M6 9V18M18 9V18" />
    <circle cx="6" cy="7.3" r="1" />
    <circle cx="18" cy="7.3" r="1" />
    <path d="M4 18h16" />
    <path d="M3 21c1.2-1 2.4-1 3.6 0s2.4 1 3.6 0 2.4-1 3.6 0 2.4 1 3.6 0 2.4-1 3.6 0" />
  </svg>
);

// Sleek modern glass tower (Navi Mumbai)
const GlassTowerIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M7 19V5l10-2v16" />
    <path d="M9.5 6.3v11.2M12 5.7v11.8M14.5 5.1v12.4" />
    <path d="M4 19h16" />
  </svg>
);

// Modern tower with rooftop antenna (Noida)
const AntennaTowerIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M12 2v2.5" />
    <rect x="7.5" y="4.5" width="9" height="14.5" />
    <path d="M10 7.5h1.2M12.8 7.5H14M10 11h1.2M12.8 11H14M10 14.5h1.2M12.8 14.5H14" />
    <path d="M4 19h16" />
  </svg>
);

// Shaniwar Wada style fort gate with battlements (Pune)
const FortGateIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <path d="M5 19v-6a7 7 0 0 1 14 0v6" />
    <path d="M9 19v-4a3 3 0 0 1 6 0v4" />
    <path d="M5 6h1.4M7.8 6h1.4M10.6 6H12M13.4 6h1.4M16.2 6h1.4M19 6h-1.4" />
    <path d="M4 19h16" />
  </svg>
);

// Lakeside building (Thane)
const LakesideBuildingIcon: React.FC<IconProps> = ({ className }) => (
  <svg {...baseProps} className={className}>
    <rect x="7" y="4" width="10" height="13" />
    <path d="M9.5 7h1.2M13.3 7h1.2M9.5 10.2h1.2M13.3 10.2h1.2M9.5 13.4h1.2M13.3 13.4h1.2" />
    <path d="M3 19c1.2-1 2.4-1 3.6 0s2.4 1 3.6 0 2.4-1 3.6 0 2.4 1 3.6 0 2.4-1 3.6 0" />
  </svg>
);

export const CITY_ICONS: Record<string, React.FC<IconProps>> = {
  Bangalore: DomeBuildingIcon,
  Delhi: ArchMonumentIcon,
  Faridabad: GenericTowerIcon,
  Ghaziabad: PeakRoofBuildingIcon,
  'Greater Noida': SteppedTowerIcon,
  Gurgaon: TaperedTowerIcon,
  Hyderabad: MinaretsIcon,
  Indore: TieredPalaceIcon,
  Jaipur: LatticeFacadeIcon,
  Mumbai: GatewayArchIcon,
  'Navi Mumbai': GlassTowerIcon,
  Noida: AntennaTowerIcon,
  Pune: FortGateIcon,
  Thane: LakesideBuildingIcon,
};

export const GenericCityIcon = GenericTowerIcon;

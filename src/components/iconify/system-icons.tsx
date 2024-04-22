import React from 'react';

import { SxProps } from '@mui/system';

import Iconify from './iconify';

// Define the type for the icon map keys
type IconType = keyof typeof ICON_MAP;

// Define the ICON_MAP with explicit type
const ICON_MAP = {
  product: { icon: "fluent-mdl2:product-variant" },
  client: { icon: "mdi:book-account" },
  marketAnalysis: { icon: "icon-park-outline:market-analysis" },
  customerSegmentation: { icon: "carbon:heat-map" },
  userEngagement: { icon: "dashicons:buddicons-groups" },
  userPerformance: { icon: "fluent:live-20-regular" },
  merchandising: { icon: "icon-park-outline:sales-report" },
  route: { icon: "eos-icons:route" },
  project: { icon: "material-symbols:construction-rounded" },
  campaign: { icon: "ic:baseline-campaign" },
  report: { icon: "iconoir:reports-solid" },
  create: { icon: "ion:create-outline" },
  checkin: { icon: "uil:user-location" },
  users: { icon: "mdi:users-check" },
  reach: { icon: "cib:periscope" },
  sale: {icon: "mingcute:sale-fill"},
  todayCheckin: {icon : "fluent:calendar-today-24-filled"},
  average: { icon: "carbon:chart-average" },
  live: { icon: "fluent:live-20-filled" }

} as const; // Using 'as const' to make the values readonly and their literal types
// Define the props for the DynamicIcon component
interface DynamicIconProps {
  type: IconType;
  width?: number;
  sx?: SxProps; // Using React.CSSProperties for style object type
}

const SystemIcon: React.FC<DynamicIconProps> = ({ type, sx, width }) => {
  const icon = ICON_MAP[type]?.icon;

  if (!icon) {
    return <span>Icon not found</span>;
  }

  return <Iconify width={width ?? 24} icon={icon} sx={sx} />;
};

export default SystemIcon;

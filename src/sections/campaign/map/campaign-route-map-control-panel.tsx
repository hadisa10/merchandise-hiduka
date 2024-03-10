import React, { memo } from 'react';

import { StyledControlPanel } from 'src/components/map';

// ----------------------------------------------------------------------

type Props = {
  children?: React.ReactNode; // Added children prop type
};

function RouteMapControlPanel({children }: Props) {
  return (
    <StyledControlPanel>
      {children} {/* Render children here */}
    </StyledControlPanel>
  );
}

export default memo(RouteMapControlPanel);

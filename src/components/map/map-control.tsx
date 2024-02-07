import { ScaleControl, GeolocateControl, NavigationControl, FullscreenControl, useControl } from 'react-map-gl';

import { StyledMapControls } from './styles';
import { IconButton } from '@mui/material';
import Iconify from '../iconify';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

// ----------------------------------------------------------------------

type Props = {
  hideScaleControl?: boolean;
  hideGeolocateControl?: boolean;
  hideFullscreenControl?: boolean;
  hideNavigationnControl?: boolean;
  onToggleInteractivity?: () => void; // New prop for custom control
};

function DrawControl(props: MapboxDraw.MapboxDrawOptions) {
  useControl(() => new MapboxDraw(props), {
    // @ts-expect-error expected
    position: props.position
  });

  return null;
}

export default function MapControl({
  hideScaleControl,
  hideGeolocateControl,
  hideFullscreenControl,
  hideNavigationnControl,
  onToggleInteractivity // New prop for custom control
}: Props) {
  return (
    <>

      <StyledMapControls />


      <DrawControl
        // @ts-expect-error expected
        position="top-left"
        displayControlsDefault={false}
        controls={{
          polygon: true,
        }}
      />
      {/* <IconButton onClick={onToggleInteractivity}><Iconify icon="material-symbols:lock" /></IconButton> */}


      {!hideGeolocateControl && (
        <GeolocateControl position="top-left" positionOptions={{ enableHighAccuracy: true }} />
      )}

      {!hideFullscreenControl && <FullscreenControl position="top-left" />}

      {!hideScaleControl && <ScaleControl position="bottom-left" />}

      {!hideNavigationnControl && <NavigationControl position="bottom-left" />}
    </>
  );
}

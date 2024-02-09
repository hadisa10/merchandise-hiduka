import MapboxDraw from '@mapbox/mapbox-gl-draw';
import { useControl, ScaleControl, GeolocateControl, NavigationControl, FullscreenControl } from 'react-map-gl';

import { StyledMapControls } from './styles';

// ----------------------------------------------------------------------

type Props = {
  hideScaleControl?: boolean;
  hideGeolocateControl?: boolean;
  hideFullscreenControl?: boolean;
  hideNavigationnControl?: boolean;
  onToggleInteractivity?: () => void; // New prop for custom control
};
// @ts-expect-error expected
function DrawControl({ position, ...props }: MapboxDraw.MapboxDrawOptions) {
  useControl(() => new MapboxDraw(props), {
    position
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

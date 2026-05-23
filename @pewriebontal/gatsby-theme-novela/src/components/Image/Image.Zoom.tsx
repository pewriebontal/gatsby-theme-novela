import React, { useCallback, useState } from 'react';
import { Controlled as ControlledZoom } from 'react-medium-image-zoom';
import { useThemeUI } from 'theme-ui';

import 'react-medium-image-zoom/dist/styles.css';

type ImageZoomProps = React.ImgHTMLAttributes<HTMLImageElement>;

const GATSBY_RESP_IMAGE_CLASS = 'gatsby-resp-image-image';

const hasClassName = (className = '', target: string) =>
  className.split(/\s+/).includes(target);

const ImageZoom: React.FC<ImageZoomProps> = ({
  className,
  style,
  ...props
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const { theme } = useThemeUI();

  if (hasClassName(className, GATSBY_RESP_IMAGE_CLASS)) {
    return <img {...props} className={className} style={style} />;
  }

  const imageClassName = ['Image__Zoom', className].filter(Boolean).join(' ');
  const imageStyle = {
    ...style,
    display: 'block',
    margin: '0 auto',
    width: '100%',
    borderRadius: isZoomed ? '5px' : '0px',
  };

  const handleZoomChange = useCallback((shouldZoom) => {
    setIsZoomed(shouldZoom);
  }, []);

  return (
    <ControlledZoom
      isZoomed={isZoomed}
      onZoomChange={handleZoomChange}
      zoomMargin={40}
      overlayBgColorEnd={theme.colors.background}
    >
      <img {...props} className={imageClassName} style={imageStyle} />
    </ControlledZoom>
  );
};

export default ImageZoom;

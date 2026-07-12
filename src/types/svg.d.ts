declare module '*.svg' {
<<<<<<< HEAD
  import React from 'react';
  import { SvgProps } from 'react-native-svg';
  const content: React.FC<SvgProps>;
=======
  import type { FC } from 'react';
  import type { SvgProps } from 'react-native-svg';

  const content: FC<SvgProps>;
  export default content;
}

declare module '*.mp4' {
  const content: NodeRequire;
>>>>>>> develop
  export default content;
}

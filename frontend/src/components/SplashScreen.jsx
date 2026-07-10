// import React, { useEffect, useState } from 'react';
// import './SplashScreen.css';
// import Vibeconnect from '../assets/Vibe Connect-2.png';

// const SplashScreen = ({ onFinish }) => {
//   useEffect(() => {
//     const timer = setTimeout(() => {
//       onFinish();
//     }, 2000); 
//     return () => clearTimeout(timer);
//   }, [onFinish]);

//   return (
//     <div className="splash-screen">
//       <img src={Vibeconnect} alt="Logo" className="splash-logo" />
//     </div>
//   );
// };
// export default SplashScreen;

import React, { useEffect, useState } from 'react';
import './SplashScreen.css';
import Vibeconnect from '../assets/Vibe Connect-2.png';

const SplashScreen = ({ onFinish }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
  //     if (onFinish) onFinish();
  //   }, 2000); 
  //   return () => clearTimeout(timer);
  // }, [onFinish]);
  if (typeof onFinish === 'function') {
        onFinish();
      }
    }, 2000);
    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="splash-screen">
      <img src={Vibeconnect} alt="Logo" className="splash-logo" />
    </div>
  );
};
export default SplashScreen;
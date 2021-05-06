/* eslint-disable */
/* tslint:disable */
import * as React from 'react';
export interface couponDividerProps extends React.SVGAttributes<SVGElement> {
size?: string | number;
}
const couponDivider: React.FC<couponDividerProps> = ({size, ...props}) => (
  <svg viewBox="0 0 180 19" fill="currentColor" width={ size || "1em" } height={ size || "1em" } {...props}>
    <path d="M180,2V0H0V2A7.2,7.2,0,0,1,7,9h3v1H7c-.25,3.74-3.13,7.07-7,7v2H180V17h0a7.3,7.3,0,0,1-7-7.5A7.3,7.3,0,0,1,180,2ZM16,10H13V9h3Zm6,0H19V9h3Zm6,0H25V9h3Zm6,0H31V9h3Zm6,0H37V9h3Zm6,0H43V9h3Zm6,0H49V9h3Zm6,0H55V9h3Zm6,0H61V9h3Zm6,0H67V9h3Zm6,0H73V9h3Zm6,0H79V9h3Zm6,0H85V9h3Zm6,0H91V9h3Zm6,0H97V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Zm6,0h-3V9h3Z"
    />
  </svg>
);
couponDivider.displayName = 'couponDivider';
export default couponDivider;
/* tslint:enable */
/* eslint-enable */

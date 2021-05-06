/* eslint-disable */
/* tslint:disable */
import * as React from 'react';
export interface iconVProps extends React.SVGAttributes<SVGElement> {
size?: string | number;
}
const iconV: React.FC<iconVProps> = ({size, ...props}) => (
  <svg viewBox="0 0 38 38" fill="currentColor" width={ size || "38" } height={ size || "38" } {...props}>
    <g id="BUSINESS-CHAT" stroke="none" fill="none" strokeWidth="1" fillRule="evenodd">
      <g id="light-theme-lead-10" transform="translate(-1633 -813)" stroke="currentColor">
        <g id="Group-4" transform="translate(1542 785)">
          <g id="Group" transform="translate(30 29)">
            <g id="Group-2" transform="translate(62)">
              <circle id="Oval" cx="17.923" cy="17.923" r="17.923" />
              <path id="Path-3" d="M10.0699301 19.0143636L15.7607463 25.6036074 25.7784293 11.1584807" />
            </g>
          </g>
        </g>
      </g>
    </g>
  </svg>
);
iconV.displayName = 'iconV';
export default iconV;
/* tslint:enable */
/* eslint-enable */

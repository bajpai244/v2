import React from 'react'
import PropTypes from 'prop-types'

export const glyphs = {
  'edit-3': (
    <g>
      <polygon points="14 2 18 6 7 17 3 17 3 13 14 2" />
      <line x1="3" y1="22" x2="21" y2="22" />
    </g>
  ),
  grid: (
    <g>
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
    </g>
  ),
  list: (
    <g>
      <line x1="8" y1="6" x2="21" y2="6" />
      <line x1="8" y1="12" x2="21" y2="12" />
      <line x1="8" y1="18" x2="21" y2="18" />
      <line x1="3" y1="6" x2="3" y2="6" />
      <line x1="3" y1="12" x2="3" y2="12" />
      <line x1="3" y1="18" x2="3" y2="18" />
    </g>
  )
}
export const glyphNames = Object.keys(glyphs)

const Icon = ({ is, glyph, size, ...props }) => {
  const Component = is
  return (
    <Component
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      ariaHidden="true"
      width={size}
      height={size}
      children={glyphs[glyph]}
      {...props}
    />
  )
}

Icon.propTypes = {
  is: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.func,
    PropTypes.element
  ]),
  glyph: PropTypes.oneOf(glyphNames),
  size: PropTypes.number
}

Icon.defaultProps = {
  is: 'svg',
  glyph: 'edit-3',
  size: 24
}

export default Icon

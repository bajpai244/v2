import styled from 'styled-components'
import React from 'react'
import { Box, Text } from '@hackclub/design-system'

const Base = styled(Box)`
  display: inline-block;
  line-height: 1;
`

const Stat = ({ label, value, children, f = [6, 7], ...props }) => (
  <Base mt={1} mb={1} width={128} align="center" {...props}>
    {children}
    <Text.span fontSize={f} m={0} bold children={value} />
    {label && <Text color="snow" fontSize={2} m={0} caps children={label} />}
  </Base>
)

export default Stat

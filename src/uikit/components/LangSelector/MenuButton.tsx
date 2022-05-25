import styled from 'styled-components'
import Button from '../Button/Button'

const MenuButton = styled(Button)<{ isActive: boolean }>`
  font-weight: normal;
  font-size: 15px;
  line-height: 16px;
  padding: 12px 67px;
  background: ${({ isActive }) => isActive ? '#F3FBFF' : 'transparent'};
  color: ${({ isActive }) => isActive ? '#4E89E3' : '#505050'};
  border-radius: 4px;
  margin-bottom: 7px;

  &:last-child {
    border-bottom: 0;
  }
`

export default MenuButton

import { useState } from 'react'
import { SliderContainer, SliderBase, SliderRange, Labels } from './styles'

const SliderSwitch = ({ values, onChange }) => {
  const [toggle, setToggle] = useState(0)
  const position = values.length === 2 ? [2, 28] : [2, 15, 28]

  return (
    <>
      <SliderContainer onClick={() => {
        const toggleValue = toggle + 1 === values.length ? 0 : toggle + 1
        setToggle(toggleValue)
        if (onChange) { onChange(values[toggleValue]) }
      }}
      >
        <SliderBase />
        <SliderRange style={{ left: `${position[toggle]}px` }} />
      </SliderContainer>
      <Labels>
        {values && values.map(label => (
          <label key={label}>{label}</label>
        ))}
      </Labels>
    </>

  )
}

export default SliderSwitch

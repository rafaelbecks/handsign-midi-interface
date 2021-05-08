import { Container, Step } from './styles'

const Sequencer = (props) => (
  <Container>
    <ul>
      {Array.from(Array(props.steps).keys()).map(n =>
        <Step className={n === 3 && 'selectedStep'} key={n}>
          <span className={[0, 4, 8, 12].includes(n) && 'markedNumber'}>
            {n + 1}
          </span>
        </Step>
      )}
    </ul>
  </Container>
)

export default Sequencer

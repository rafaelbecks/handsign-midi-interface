import styled from 'styled-components'
import wood from '../../assets/wood.jpg'

const DeviceLayout = styled.div`
    width: 1270px;
    height: 628px;
    background: rgb(93,101,101);
    background: linear-gradient(180deg,rgb(80 86 86) 2%,rgba(0,0,0,1) 100%);
    -webkit-box-shadow: -3px 17px 25px -1px rgba(0,0,0,0.75);
    -moz-box-shadow: -3px 17px 25px -1px rgba(0,0,0,0.75);
    box-shadow: -3px 17px 25px -1px rgba(0,0,0,0.75);
    border-radius: 20px;
    position: relative;
    padding: 24px 34px;
`

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: url(${wood});
    background-size: cover;
    background-position: center;
`

const RightCircleTop = styled.img`
    position: absolute;
    top: 0;
    margin: 16px;
    right: 0;
`

const LeftCircleTop = styled.img`
    position: absolute;
    top: 0;
    margin: 16px;
    left: 0;
`

const RightCircleBottom = styled.img`
    position: absolute;
    bottom: 0;
    margin: 16px;
    right: 0;
`

const LeftCircleBottom = styled.img`
    position: absolute;
    bottom: 0;
    margin: 16px;
    left: 0;
`

const DeviceName = styled.h1`
  font-family: 'Futura';
  font-weight: 100;
  font-size: 18px;
  color: #fff;
  text-align: center;
  margin: 0;
  margin-bottom: 12px;
`

const DeviceSection = styled.div`
    width: 256px;
    height: 519px;
    border: 1.5px solid #FFFFFF;
    box-sizing: border-box;
    border-radius: 10px;
    padding: 24px 0px;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    h2 {
        font-family: 'Futura';
        font-size: 18px;
        font-weight: 100;
        color: #fff;
        margin: 0;
    }
`

const DeviceContent = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const MiddleSection = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const FifthCircleSection = styled.div`
    display: flex;
    position: relative;
    img {
       width: 470px;
    }
`

const GreenScreen = styled.input`
    height: 38px;
    width: fit-content;
    min-width: 20px;
    padding: 0px 10px;
    display:flex;
    text-transform: uppercase;
    justify-content: center;
    align-items:center;
    background: #002207;
    margin: 0;
    font-family: 'Monda';
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    color: #FAFFBC;
    border: none;
    text-align: center;
`

const Row = styled.div`
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-around;
    align-items: center;
    margin: 26px 0px;
    height: 46px;
`

const Control = styled.div`
    height: 88px;
    width: 50%;
`

const Separator = styled.div`
    border-top: 0.5px solid #FFFFFF;
    width: 154px;
    margin: 20px 0;
`

const SmallSeparator = styled.div`
    border-top: 0.5px solid #FFFFFF;
    width: 154px;
    margin: 4px 0;
`

const GreenScreenContainer = styled.div`
    display: flex;
    justify-content: space-evenly;
`

const HandSignContainer = styled.div`
    width: 100%;
    margin: auto;
    svg {
        margin: 0px 20px;
    }
`

const GridScreen = styled.img`
    position: absolute;
    width: 304px !important;
    top: 106px;
    left: 82px;
    height: 336px;
    mix-blend-mode: screen;
`

const OscilloscopeScreen = styled.video`
    position: absolute;
    width: 298px !important;
    height: 284px;
    top: 114px;
    left: 85px;
    object-fit: cover;
    box-shadow: 0px 0px 7px 1px rgb(0 0 0 / 75%);
`

const MidiSelect = styled.select`
    opacity: 0;
    position: relative;
    bottom: 22px;
    width: 170px
`

const ScreenMessage = styled.h2`
    position: absolute;
    margin: 0;
    top: 243px;
    font-size: 13px;
    font-family: 'Monda';
    color: #a1fd84;
    width: 175px;
    z-index: 1;
    opacity: 1;
    background: black;
    left: 31%;
`

const ChordContainer = styled.div`
    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50px;
    margin: 3px 20px;
`

const KnobContainer = styled.div`
    display: flex;
    justify-content: center;
`

export {
  DeviceLayout,
  Container,
  ScreenMessage,
  RightCircleTop,
  LeftCircleTop,
  RightCircleBottom,
  LeftCircleBottom,
  DeviceSection,
  DeviceName,
  DeviceContent,
  FifthCircleSection,
  MiddleSection,
  GreenScreen,
  Row,
  Control,
  Separator,
  GreenScreenContainer,
  HandSignContainer,
  SmallSeparator,
  OscilloscopeScreen,
  GridScreen,
  MidiSelect,
  ChordContainer,
  KnobContainer
}

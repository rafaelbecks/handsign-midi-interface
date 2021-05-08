import styled from 'styled-components'

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    ul{
        list-style: none;
        display: flex;
    }
`

const Step = styled.li`
    width: 54px;
    height: 45px;
    background: #1d1d1d;
    border: 0.5px solid #9e9e9e4f;
    box-sizing: border-box;
    margin: 0 12px;
    color: #fff;
    font-family: 'Futura';
    cursor: pointer;
    font-size: 18px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 6px;
    box-shadow: inset -1px -1px 0px 0px rgb(0 0 0);
`

export { Container, Step }

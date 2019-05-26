/* eslint-disable react/no-unused-state */
/* eslint-disable react/jsx-one-expression-per-line */
import React, { Component } from 'react';
import classNames from 'classnames/bind';
import styles from './App.css';

const cx = classNames.bind(styles);

const QUANTITYBOMB = 10;
const SIZE = {
  row: 9,
  col: 9,
};

class App extends Component {
  constructor() {
    super();

    this.initialState = {
      grid: this.getGrid(),
      quantityFlagBomb: QUANTITYBOMB,
      quantityBomb: QUANTITYBOMB,
      // eslint-disable-next-line react/no-unused-state
      // Не понял как победить эту ошибку
      gameOver: false,
      quantityOpen: 0,
      isReload: false,
      isStoppedTimer: true,
      seconds: 0,
    };

    this.state = this.initialState;
  }

  componentWillMount() {
    this.getBombs();
    this.getNumbers();
  }

  componentDidUpdate() {
    const { isReload } = this.state;
    if (isReload) {
      this.setReload();
    }
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  getGrid = () => {
    const grid = [];
    for (let row = 0; row < SIZE.row; row += 1) {
      const cols = [];
      for (let col = 0; col < SIZE.col; col += 1) {
        cols.push({
          row,
          col,
          isBomb: false,
          isOpen: false,
          numberAround: '',
          stateRightClick: '',
        });
      }
      grid.push(cols);
    }

    return grid;
  }

  hasBomb = (cell) => {
    const { grid } = this.state;
    return grid[cell.row][cell.col].isBomb;
  };

  getQuantityBomb = ({ rowId, colId }) => {
    let quantity = 0;

    for (let row = rowId - 1; row <= rowId + 1; row += 1) {
      for (let col = colId - 1; col <= colId + 1; col += 1) {
        if (this.inRange({ row, col })) {
          if (this.hasBomb({ row, col })) {
            quantity += 1;
          }
        }
      }
    }

    return quantity;
  }

  getNumbers = () => {
    const { grid } = this.state;
    const newGrid = [...grid];

    // Не понял как победить эту ошибку( нужно чтобы был ретурн, но ретурн мне тут не нужен)
    // eslint-disable-next-line array-callback-return
    newGrid.map((row, rowId) => row.map((cell, colId) => {
      if (cell.isBomb) {
        this.setState({
          numberAround: '',
        });
      } else {
        const quantity = this.getQuantityBomb({ rowId, colId });
        // Находим количество бомб вокруг и мутируем, проставляя цифру.
        newGrid[rowId][colId].numberAround = quantity;
      }
    }));

    this.setState({
      grid: newGrid,
    });
  }

  getBombs = () => {
    const { grid, quantityBomb } = this.state;
    const newGrid = [...grid];
    for (let i = 0; i < quantityBomb; i += 1) {
      let bombsDot = {
        row: 0,
        col: 0,
      };

      do {
        bombsDot = {
          row: Math.floor(Math.random() * 9),
          col: Math.floor(Math.random() * 9),
        };
      } while (newGrid[bombsDot.row][bombsDot.col].isBomb);

      // Ищет нужный объект на секте row, col и потом мутируем ключ ставя бомбу.
      newGrid[bombsDot.row][bombsDot.col].isBomb = true;
    }

    this.setState({
      grid: newGrid,
    });
  }

  gameOver = () => {
    const { grid } = this.state;
    const newGrid = [...grid];

    // eslint-disable-next-line array-callback-return
    newGrid.map((row, rowId) => row.map((cell, colId) => {
      if (cell.isBomb) {
        // Находим все бомбы и открываем их
        newGrid[rowId][colId].isOpen = true;
      }
    }));
    this.handleStart();

    this.setState({
      // eslint-disable-next-line react/no-unused-state
      gameOver: true,
      grid: newGrid,
    });
  }

  openCell = (cell) => {
    const { grid } = this.state;
    const newGrid = [...grid];

    newGrid[cell.row][cell.col].isOpen = true;

    this.setState(prevState => ({
      grid: newGrid,
      quantityOpen: prevState.quantityOpen + 1,
    }));
  }

  checkIsOpen = (cell) => {
    const { grid } = this.state;

    return grid[cell.row][cell.col].isOpen;
  }

  // eslint-disable-next-line consistent-return
  openCellAround = (cell) => {
    const { grid } = this.state;
    this.openCell(cell);
    for (let row = cell.row - 1; row <= cell.row + 1; row += 1) {
      for (let col = cell.col - 1; col <= cell.col + 1; col += 1) {
        if (this.inRange({ row, col })) {
          if (!this.checkIsOpen({ row, col })) {
            this.openBox(grid[row][col]);
          }
        }
      }
    }
  }

  inRange = cell => cell.row >= 0 && cell.row < SIZE.row && cell.col >= 0 && cell.col < SIZE.col

  // eslint-disable-next-line consistent-return
  openBox = (cell) => {
    if (cell.stateRightClick === 'flag' || cell.isOpen) {
      return false;
    }
    if (cell.isBomb) {
      this.gameOver();
      this.openCell(cell);
    }
    if (cell.numberAround) {
      this.openCell(cell);
    }

    if (!cell.numberAround && !cell.isBomb) {
      this.openCellAround(cell);
    }
  }

  handleClick = cell => () => {
    this.handleStart();
    this.openBox(cell);
  }

  getStateRightClick = (cell) => {
    const { grid, quantityFlagBomb } = this.state;
    const newGrid = [...grid];

    switch (cell.stateRightClick) {
      case '':
        if (quantityFlagBomb > 0 && !this.checkIsOpen(cell)) {
          newGrid[cell.row][cell.col].stateRightClick = 'flag';
          this.setState(state => ({
            grid: newGrid,
            quantityFlagBomb: state.quantityFlagBomb === 0 ? 0 : state.quantityFlagBomb - 1,
          }));
        }
        break;
      case 'flag':
        newGrid[cell.row][cell.col].stateRightClick = 'question';
        this.setState(state => ({
          grid: newGrid,
          quantityFlagBomb: state.quantityFlagBomb >= QUANTITYBOMB
            ? QUANTITYBOMB
            : state.quantityFlagBomb + 1,
        }));
        break;
      case 'question':
        newGrid[cell.row][cell.col].stateRightClick = '';
        this.setState({
          grid: newGrid,
        });
        break;
      default:
        newGrid[cell.row][cell.col].stateRightClick = '';
        this.setState({
          grid: newGrid,
        });
        break;
    }
  }

  handleClickContextMenu = cell => (e) => {
    e.preventDefault();
    this.getStateRightClick(cell);
  }

  handleClickContextGrid = (e) => {
    e.preventDefault();
    return false;
  }

  setReload = () => {
    this.setState({
      isReload: false,
      seconds: 0,
    });
    this.getBombs();
    this.getNumbers();
    clearInterval(this.timerID);
  }

  handleRestart = () => {
    this.setState({
      ...this.initialState,
      grid: this.getGrid(),
      isReload: true,
    });
  }

  tick = () => {
    this.setState(prevState => ({
      seconds: prevState.seconds + 1,
    }));
  }

  handleStart = () => {
    const { isStoppedTimer } = this.state;
    if (isStoppedTimer) {
      this.timerID = setInterval(() => this.tick(), 1000);
      this.setState({
        isStoppedTimer: false,
      });
    } else {
      clearInterval(this.timerID);
      this.setState({
        isStoppedTimer: true,
      });
    }
  }

  correctValueFormat = value => (value < 10 ? `0${value}` : value)

  transformTime = () => {
    const { seconds } = this.state;
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const sec = Math.floor((seconds % 60));

    return {
      minutes: this.correctValueFormat(minutes),
      seconds: this.correctValueFormat(sec),
    };
  }

  render() {
    const {
      grid,
      quantityBomb,
      quantityFlagBomb,
      gameOver,
      quantityOpen,
    } = this.state;

    const isWinner = quantityOpen === (SIZE.row * SIZE.col) - quantityBomb;
    const { minutes, seconds } = this.transformTime();

    return (
      <div className="app">
        <div className="game" onContextMenu={this.handleClickContextGrid}>
          <header className="header">
            <div className="header__bomb">
              <div className="header__flag" />
              <div className="header__bomb-quantity">{quantityFlagBomb}</div>
            </div>
            <div className="header__timer-wrap">
              <div className="header__timer">{minutes} : {seconds}</div>
              <div className="header__timer-icon" />
            </div>
          </header>
          <section
            className={cx('grid', {
              grid_gameOver: gameOver || isWinner,
            })}
          >
            <div className="stub" />
            {grid.map(row => (
              row.map(cell => (
                <button
                  type="button"
                  onContextMenu={this.handleClickContextMenu(cell)}
                  onClick={this.handleClick(cell)}
                  key={`${cell.row} ${cell.col}`}
                  className={cx('cell', {
                    cell_isBomb: cell.isOpen && cell.isBomb,
                    cell_isOpen: cell.isOpen,
                    cell_flag: cell.stateRightClick === 'flag',
                    cell_question: cell.stateRightClick === 'question',
                    [`cell_number_${cell.numberAround}`]: cell.isOpen && cell.numberAround,
                  })}
                />
              ))
            ))}
          </section>
          <footer className="footer">
            {!gameOver && !isWinner && <div className="footer__begin">Игра началась.</div>}
            {gameOver && !isWinner
              && (
                <div className="footer__begin">
                  Игра закончилась.
                  <button type="button" onClick={this.handleRestart} className="footer__restart" />
                </div>
              )}
            {isWinner
              && (
                <div className="footer__begin">
                  Победа!
                  <button type="button" onClick={this.handleRestart} className="footer__restart" />
                </div>
              )}
          </footer>
        </div>
      </div>
    );
  }
}

export default App;

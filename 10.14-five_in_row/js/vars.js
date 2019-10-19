const cv = document.querySelector("#rows");
const ctx = cv.getContext("2d");

const playSelectDia = document.querySelector("#playSelect");
const playAgainDia = document.querySelector("#playAgain");
const tools = document.querySelector("#tools");
const keepGoing = document.querySelector("#keepGoing");

const blackWins = document.querySelector("#blackWins");
const whiteWins = document.querySelector("#whiteWins");

const msgP = document.querySelector("#winerTitle");

const dirs = ["lup", "up", "rup", "l", "r", "lbt", "bt", "rbt"];
const dirOprs = {
  lup: [-1, -1],
  up: [0, -1],
  rup: [1, -1],
  l: [-1, 0],
  r: [1, 0],
  lbt: [-1, 1],
  bt: [0, 1],
  rbt: [1, 1]
};

const result = {
  black: 0,
  white: 0
};
let piecesCount = []; // 棋盘棋子情况
let process = {}; // 棋子每个方向的自身个数
let playStyle = "";
let blackTime = true;
let gameover = false;
let blackSuc = true;

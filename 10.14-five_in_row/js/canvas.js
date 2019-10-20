// 生成棋盘
function printBoard() {
  ctx.strokeRect(0, 0, boardSideL, boardSideL);
  for (let i = 0; i < rows.rowNum; i++) {
    for (let j = 0; j < rows.rowNum; j++) {
      ctx.strokeRect(
        i * rows.sideL + blackSideL,
        j * rows.sideL + blackSideL,
        rows.sideL,
        rows.sideL
      );
    }
  }
}

// 生成一颗棋子
function printPiece(x, y, color) {
  return new Promise(r => {
    ctx.beginPath();
    ctx.moveTo(x + rows.pieceR + blackSideL, y + blackSideL);
    ctx.arc(x + blackSideL, y + blackSideL, rows.pieceR, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.closePath();

    r();
  });
}

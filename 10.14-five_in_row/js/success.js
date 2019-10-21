// 是否获胜
function ifSuccess(x, y) {
  if (success(x, y)) {
    let msg = "";
    if (gameover && blackSuc) {
      msg = "black wins!";
      result.black += 1;
    } else if (gameover && !blackSuc) {
      msg = "white wins!";
      result.white += 1;
    }
    msgP.innerText = msg;
    playAgainDia.style.display = "flex";

    changeResult(result.black, result.white);
    return true;
  } else {
    let fullR = 0;
    piecesCount.forEach(row => {
      row.findIndex(p => !p) === -1 ? fullR += 1 : '';
    });
    if (fullR === piecesCount.length) {
      let msg = "";
      msg = "a draw!";
      msgP.innerText = msg;
      playAgainDia.style.display = "flex";

      return true;
    }
  }
  return false;
}

// 获胜
function success(i, j) {
  const curPiece = piecesCount[i][j]; // 当前位置 0: 空, 1: 黑棋, 2: 白棋
  const key = "" + curPiece + "_" + i + "_" + j;
  process[key] = process[key] || {};
  const dirs = process[key];
  const tempDir = ["lup", "up", "rup", "l", "r", "lbt", "bt", "rbt"];

  // 按照tempDir的顺序 计算该棋子每个方向的相同棋子数
  for (let jj = j - 1; jj <= j + 1; jj++) {
    for (let ii = i - 1; ii <= i + 1; ii++) {
      if (gameover) {
        console.log("gameover! ");

        return true;
      }

      // 该位置本身不参与记录
      if (jj === j && ii === i) {
        continue;
      }
      const curDir = tempDir.shift();
      // 表示该方向越界了
      if (jj < 0 || ii < 0 || jj > rows.rowNum || ii > rows.rowNum) {
        dirs[curDir] = -1;
        continue;
      }

      dirs[curDir] = getDirCount(ii, jj, curDir, curPiece);
    }
  }
  process[key] = dirs;
  // console.log(piecesCount, process);
  if (gameover) {
    return true;
  }
  return false;
}

function getDirCount(i, j, curDir, curPiece) {
  const targetPiece = piecesCount[i][j]; // 该方向上的第一个棋子
  const index = dirs.findIndex(dir => dir === curDir);
  const revDir = dirs[dirs.length - index - 1];
  let tarCount = 1;

  // 如果第一颗棋子为空，返回1，表示只有它本身
  if (!targetPiece) {
    return tarCount;
  } else if (targetPiece === curPiece) {
    // 1. 目标count = 当前count + 1
    const ii = dirOprs[curDir][0];
    const jj = dirOprs[curDir][1];
    const curCount =
      process["" + targetPiece + "_" + i + "_" + j][curDir] > 0
        ? process["" + targetPiece + "_" + i + "_" + j][curDir]
        : 1; // 小于0表示没有一样的棋子，不能用该值参与计算
    tarCount = curCount + 1;

    // 2. 当前方向上所有的棋子反方向的count 更新
    // 需判断新棋子的反方向有无自家棋子,有则需要全部重新赋值
    const revCount =
      process["" + targetPiece + "_" + (i - ii) + "_" + (j - jj)][revDir] > 1 // 大于1表示有
        ? process["" + targetPiece + "_" + (i - ii) + "_" + (j - jj)][revDir]
        : 1;
    for (let k = 0; k < curCount; k++) {
      process["" + targetPiece + "_" + (i + ii * k) + "_" + (j + jj * k)][
        revDir
      ] += revCount;
    }

    // 11011,修改这种情况的bug
    if (revCount > 1) {
      for (let k = 2; k <= revCount; k++) {
        let rp = (process[
          "" + targetPiece + "_" + (i - ii * k) + "_" + (j - jj * k)
        ][curDir] += tarCount - 1); // 减去新棋的重复
        if (rp >= 5) {
          gameover = true;
          blackSuc = curPiece === 1 ? true : false;
          return;
        }
      }
    }
  } else {
    // 表示第一颗棋为对方棋子, 不仅要返回-2, 还要设置对方棋反方向的count = -2
    tarCount = -2;
    process["" + targetPiece + "_" + i + "_" + j][revDir] = -2;
    return tarCount;
  }
  if (tarCount >= 5) {
    console.log("tarCount:", tarCount);

    gameover = true;
    blackSuc = curPiece === 1 ? true : false;
  }
  return tarCount;
}

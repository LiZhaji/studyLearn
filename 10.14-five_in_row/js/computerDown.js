// 自动下白棋
async function computerDown() {
  let x = 0;
  let y = 0;

  let findIt = false;
  const nextP = {
    1: {
      x: 0,
      y: 0,
      length: 0,
      totL: 0,
      oriX: 0,
      oriY: 0
    },
    2: {
      x: 0,
      y: 0,
      length: 0,
      totL: 0,
      oriX: 0,
      oriY: 0
    },
    which: 1
  };

  // 找到最有可能性的白棋
  getMaxP("2");

  // 白棋可以获胜
  if (nextP[2].length === 4) {
    confirmXY();
  } else {
    // 找到最具危险性的黑棋
    getMaxP("1");

    if (nextP[1].length === 1) {
      randomP();
    } else {
      // 无危险性黑棋，就下白棋，否则进行拦截
      if (nextP[1].length < 3) {
        nextP.which = 2;
      }

      confirmXY();
    }
  }

  // 随机下
  // x = Math.ceil(Math.random() * (rows.rowNum - 2));
  // y = Math.ceil(Math.random() * (rows.rowNum - 2));
  // while (piecesCount[x][y]) {
  //   x = Math.ceil(Math.random() * (rows.rowNum - 2));
  //   y = Math.ceil(Math.random() * (rows.rowNum - 2));
  // }

  await printPiece(x * rows.sideL, y * rows.sideL, "wheat");
  piecesCount[x][y] = 2;
  blackTime = true;

  if (ifSuccess(x, y)) {
    return;
  }

  function randomP() {
    let k = Math.floor(Math.random() * 8);
    let dir = dirs[k];
    let xx = dirOprs[dir][0];
    let yy = dirOprs[dir][1];

    let tx = nextP[1].oriX + xx;
    let ty = nextP[1].oriY + yy;

    x = nextP[1].x + xx;
    y = nextP[1].y + yy;

    while (
      tx < 1 ||
      tx > rows.rowNum - 1 ||
      ty < 1 ||
      ty > rows.rowNum - 1 ||
      piecesCount[nextP[1].x + xx][nextP[1].y + yy]
    ) {
      k = Math.floor(Math.random() * 8);
      dir = dirs[k];
      xx = dirOprs[dir][0];
      yy = dirOprs[dir][1];

      tx = nextP[1].oriX + xx;
      ty = nextP[1].oriY + yy;
    }
    x = tx;
    y = ty;
  }

  function getMaxP(whichP) {
    nextP.which = whichP;

    for (const p in process) {
      if (p[0] === whichP) {
        const pDirs = process[p];
        const i = +p.match(/(?<=_x).*(?=_y)/)[0];
        const j = +p.match(/(?<=_y).*/)[0];
        const onMerge = {
          xl: i <= 1,
          xr: i >= rows.rowNum - 1,
          yt: j <= 1,
          yb: j >= rows.rowNum - 1
        };
        let totL = 0;

        for (const dir in pDirs) {
          // 跳过边缘地区
          if (onMerge.xl) {
            if (/l/.test(dir)) {
              continue;
            }
          } else if (onMerge.xr) {
            if (/r/.test(dir)) {
              continue;
            }
          }

          if (onMerge.yt) {
            if (/up/.test(dir)) {
              continue;
            }
          } else if (onMerge.yb) {
            if (/bt/.test(dir)) {
              continue;
            }
          }

          const index = dirs.findIndex(d => d === dir);
          const revDir = dirs[dirs.length - index - 1];

          const ii = dirOprs[revDir][0];
          const jj = dirOprs[revDir][1];

          hasP = false || pDirs[revDir] === 1; // 是否有空位
          totL += pDirs[dir]; // 视为周围棋子的情况，越大表示自身的棋越多

          // 11011 10111 找出这种情况
          let isP = false; // 反向第二个是否为本身
          try {
            isP = piecesCount[i + ii * 2][j + jj * 2] === +whichP;
          } catch (err) {
            console.log(err);
            isP = false;
          }
          if (hasP && isP) {
            const count = 4 - pDirs[dir];
            let hadDangerN = 1;
            if (count > 1) {
              for (let k = 3; k < count + 2; k++) {
                try {
                  piecesCount[i + ii * k][j + jj * k] === +whichP
                    ? (hadDangerN += 1)
                    : "";
                } catch (err) {
                  console.log(err);
                }
              }

              if (pDirs[dir] + hadDangerN + 1 === 5) {
                const ii = dirOprs[revDir][0];
                const jj = dirOprs[revDir][1];

                const x = i + ii;
                const y = j + jj;
                if (x < 1 || x > rows.rowNum || y < 1 || y > rows.rowNum) {
                  continue;
                }
                nextP[whichP].x = x;
                nextP[whichP].y = y;
                nextP[whichP].oriX = i;
                nextP[whichP].oriY = j;

                nextP[whichP].length = 4;
                nextP[whichP].totL = totL;
                findIt = true;
                break;
              }
            }
          }

          // 111 这种情况是否需要拦截
          let threeNeed = true;
          if (whichP === "1" && pDirs[dir] === 3) {
            threeNeed =
              pDirs[revDir] === 1 &&
              !piecesCount[i + dirOprs[dir][0] * 3][j + dirOprs[dir][1] * 3];
          }

          if (
            hasP &&
            threeNeed &&
            (pDirs[dir] > nextP[whichP].length ||
              (pDirs[dir] === nextP[whichP].length &&
                totL > nextP[whichP].totL))
          ) {
            const ii = dirOprs[revDir][0];
            const jj = dirOprs[revDir][1];

            const x = i + ii;
            const y = j + jj;
            if (x < 1 || x > rows.rowNum || y < 1 || y > rows.rowNum) {
              continue;
            }
            nextP[whichP].x = x;
            nextP[whichP].y = y;
            nextP[whichP].oriX = i;
            nextP[whichP].oriY = j;

            nextP[whichP].length = pDirs[dir];
            nextP[whichP].totL = totL;
          }
        }
      }
      if (findIt) {
        break;
      }
    }
  }

  function confirmXY() {
    x = nextP[nextP.which].x;
    y = nextP[nextP.which].y;
  }
}

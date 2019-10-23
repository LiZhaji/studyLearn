// 自动下白棋
async function computerDown() {
  let x = 0;
  let y = 0;

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

  // 如果只剩最后一颗
  if (hadDown >= rows.rowNum * rows.rowNum - 1) {
    let lastX = 0;
    let lastY = 0;
    piecesCount.forEach((line, x) => {
      const y = line.findIndex(p => !p);
      if (y >= 0) {
        lastX = x;
        lastY = y;
      }
    });
    x = lastX;
    y = lastY;
  } else {
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
  hadDown += 1;
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
      tx < 0 ||
      tx > rows.rowNum ||
      ty < 0 ||
      ty > rows.rowNum ||
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

    outer: for (const p in process) {
      if (p[0] === whichP) {
        const pDirs = process[p];
        const i = +p.split("_")[1];
        const j = +p.split("_")[2];
        const onMerge = {
          xl: i <= 0,
          xr: i >= rows.rowNum,
          yt: j <= 0,
          yb: j >= rows.rowNum
        };
        let totL = 0;

        inner: for (const dir in pDirs) {
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

          let x = 0;
          let y = 0;

          hasP = false || pDirs[revDir] === 1; // 是否有空位
          totL += pDirs[dir]; // 视为周围棋子的情况，越大表示自身的棋越多

          if (hasP) {
            let isP = false; // 反向第二个是否为本身

            // 越界
            try {
              isP = piecesCount[i + ii * 2][j + jj * 2] === +whichP;
            } catch (err) {
              console.log(err);
            }
            // ?101? 如果是这种类型
            if (isP) {
              let matchFive = false;
              let matchFour = false;

              if (pDirs[dir] === 1) {
                // m0111
                matchFive =
                  isSameP(i + ii * 3, j + jj * 3, whichP) &&
                  isSameP(i + ii * 4, j + jj * 4, whichP);

                // m011 && 两端为空
                if (!matchFive) {
                  matchFour =
                    isSameP(i + ii * 3, j + jj * 3, whichP) &&
                    isSameP(i + ii * 4, j + jj * 4, 0) &&
                    isSameP(i + ii * -1, j + jj * -1, 0)
                }
              } else if (pDirs[dir] === 2) {
                // 1m011
                matchFive = isSameP(i + ii * 3, j + jj * 3, whichP);

                // 1m01 && 两端为空
                if (!matchFive) {
                  matchFour =
                    isSameP(i + ii * 3, j + jj * 3, 0) &&
                    isSameP(i + ii * -2, j + jj * -2, 0);
                }
              } else if (pDirs[dir] === 3) {
                // 10m11
                matchFive = true;
              }
              
              if (matchFive || matchFour) {
                x = i + ii;
                y = j + jj;
                // next棋子是否越界
                if (x < 0 || x > rows.rowNum || y < 0 || y > rows.rowNum) {
                  continue;
                }
                assignP(matchFive ? 5 : 4);

                if (matchFive) {
                  break outer;
                }
                continue;
              }
            }
          }

          // 111 这种情况是否需要拦截
          let threeNeed = true;
          if (whichP === "1" && pDirs[dir] === 3) {
            try {
              threeNeed =
                pDirs[revDir] === 1 &&
                !piecesCount[i + dirOprs[dir][0] * 3][j + dirOprs[dir][1] * 3];
            } catch (error) {
              // 113 3为边界 不需要拦截
              threeNeed = false;
            }
          }

          if (
            hasP &&
            threeNeed &&
            (pDirs[dir] > nextP[whichP].length ||
              (pDirs[dir] === nextP[whichP].length &&
                totL > nextP[whichP].totL))
          ) {
            x = i + ii;
            y = j + jj;
            // next棋子是否越界
            if (x < 0 || x > rows.rowNum || y < 0 || y > rows.rowNum) {
              continue;
            }
            assignP();
          }

          function assignP(len) {
            nextP[whichP].x = x;
            nextP[whichP].y = y;
            nextP[whichP].oriX = i;
            nextP[whichP].oriY = j;

            nextP[whichP].length = len ? len : pDirs[dir];
            nextP[whichP].totL = totL;
          }

          function isSameP(x, y, targetP) {
            return piecesCount[x][y] === +targetP;
          }
        }
      }
    }
  }

  function confirmXY() {
    x = nextP[nextP.which].x;
    y = nextP[nextP.which].y;
  }
}

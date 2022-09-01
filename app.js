document.addEventListener('DOMContentLoaded', () => {
  let grid;
  let scoreDisplay;
  let timerCountdown;
  let timerDisplay;
  let WIDTH;
  let squares;
  let score;
  let availableMoves;

  let tokenSelected;
  let squareIdSelected;
  let tokenBeingReplaced;
  let squareIdBeingReplaced;

  const tokenColours = [
    'url(images/darryl.png)',
    'url(images/elliot.png)',
    'url(images/jasmine.png)',
    'url(images/jonathan.png)',
    'url(images/julia.png)',
  ];

  const createBoard = () => {
    for (let i = 0; i < WIDTH * WIDTH; i++) {
      const square = document.createElement('div');
      square.setAttribute('id', i);
      let randomColour = Math.floor(Math.random() * tokenColours.length);
      square.style.backgroundImage = tokenColours[randomColour];
      grid.appendChild(square);
      squares.push(square);
    }

    findMoves(3);

    while (availableMoves.length > 0) {
      main();
    }
  };

  function offset(el) {
    var rect = el.getBoundingClientRect(),
      scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
      scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    return { top: rect.top + scrollTop, left: rect.left + scrollLeft };
  }

  function gameOver() {
    const coords = offset(grid);
    const divOverlay = document.getElementById('overlay');
    divOverlay.style.top = `${coords.top}px`;
    divOverlay.style.left = `${coords.left}px`;
    divOverlay.style.display = 'block';
  }

  function timer() {
    var timeleft = 120;
    timerCountdown = setInterval(function () {
      if (timeleft <= 0) {
        timerDisplay.innerHTML = 0;
        gameOver();
      } else {
        timerDisplay.innerHTML = timeleft;
      }
      timeleft -= 1;
    }, 1000);
  }

  function main() {
    if (grid !== undefined && grid !== null) {
      grid.innerHTML = null;
      scoreDisplay.innerHTML = null;
      timerDisplay.innerHTML = null;
      clearInterval(timerCountdown);
    }
    grid = document.querySelector('.grid');
    scoreDisplay = document.getElementById('score');
    timerDisplay = document.getElementById('timer');
    WIDTH = 5;
    squares = [];
    score = 0;
    availableMoves = [];

    document.getElementById('overlay').style.display = 'none';
    createBoard();
    timer();
  }

  main();

  document
    .getElementById('newgamebtn')
    .addEventListener('click', () => location.reload());

  squares.forEach((square) => square.addEventListener('mousedown', mouseDown));

  function mouseDown() {
    if (
      (tokenSelected === undefined || tokenSelected === null) &&
      (squareIdSelected === undefined || squareIdSelected === null)
    ) {
      tokenSelected = this.style.backgroundImage;
      squareIdSelected = parseInt(this.id);
      square = squares[squareIdSelected];
      square.className = 'divSelected';
    } else if (
      tokenSelected === this.style.backgroundImage &&
      squareIdSelected === parseInt(this.id)
    ) {
      square.className = '';
      tokenSelected = null;
      squareIdSelected = null;
    } else {
      tokenBeingReplaced = this.style.backgroundImage;
      squareIdBeingReplaced = parseInt(this.id);

      let validMoves = [
        squareIdSelected - 1,
        squareIdSelected - WIDTH,
        squareIdSelected + 1,
        squareIdSelected + WIDTH,
      ];

      let validMove = validMoves.includes(squareIdBeingReplaced);

      if (squareIdBeingReplaced && validMove) {
        this.style.backgroundImage = tokenSelected;
        squares[squareIdSelected].style.backgroundImage = tokenBeingReplaced;
        square.className = '';
        tokenSelected = null;
        squareIdSelected = null;
        tokenBeingReplaced = null;
        squareIdBeingReplaced = null;
      } else if (squareIdBeingReplaced && !validMove) {
        squares[squareIdBeingReplaced].style.backgroundImage =
          tokenBeingReplaced;
        squares[squareIdSelected].style.backgroundImage = tokenSelected;
      } else {
        squares[squareIdSelected].style.backgroundImage = tokenSelected;
      }
    }
  }

  function moveDown() {
    for (i = 0; i < 20; i++) {
      if (squares[i + WIDTH].style.backgroundImage === '') {
        squares[i + WIDTH].style.backgroundImage =
          squares[i].style.backgroundImage;
        squares[i].style.backgroundImage = '';

        const firstRow = [0, 1, 2, 3, 4];
        const isFirstRow = firstRow.includes(i);

        if (isFirstRow && squares[i].style.backgroundImage === '') {
          let randomColour = Math.floor(Math.random() * tokenColours.length);
          squares[i].style.backgroundImage = tokenColours[randomColour];
        }
      }
    }
  }

  function findMoves(num) {
    //Check for row clusters
    let notValid = [];
    for (i = 1; i <= WIDTH; i++) {
      let firstInvalidNumInRow = i * WIDTH - num + i;
      let lastInvalidNumInRow = i * WIDTH - 1;

      const arr = Array.from(
        { length: lastInvalidNumInRow + 1 - firstInvalidNumInRow },
        (v, k) => k + firstInvalidNumInRow
      );
      notValid = [...arr];
    }

    for (i = 0; i < WIDTH * WIDTH - num; i++) {
      let clusterIndexOffset = Array.from(Array(num).keys());
      let rowOfCluster = clusterIndexOffset.map((num) => i + num);
      let decidedToken = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if (notValid.includes(i)) continue;

      if (
        rowOfCluster.every(
          (index) =>
            squares[index].style.backgroundImage === decidedToken && !isBlank
        )
      ) {
        availableMoves.push(rowOfCluster);
      }
    }

    //Check for column clusters
    const maxColumnToCheck = WIDTH * WIDTH - WIDTH * (num - 1);
    for (i = 0; i < maxColumnToCheck; i++) {
      let clusterIndexOffset = Array.from(Array(num).keys());
      let columnOfCluster = clusterIndexOffset.map((num) => i + WIDTH * num);
      let decidedToken = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if (
        columnOfCluster.every(
          (index) =>
            squares[index].style.backgroundImage === decidedToken && !isBlank
        )
      ) {
        availableMoves.push(columnOfCluster);
      }
    }
  }

  function checkForClusters(num) {
    //Check for row clusters
    let notValid = [];
    for (i = 1; i <= WIDTH; i++) {
      let firstInvalidNumInRow = i * WIDTH - num + i;
      let lastInvalidNumInRow = i * WIDTH - 1;

      const arr = Array.from(
        { length: lastInvalidNumInRow + 1 - firstInvalidNumInRow },
        (v, k) => k + firstInvalidNumInRow
      );
      notValid = [...arr];
    }

    for (i = 0; i <= WIDTH * WIDTH - num; i++) {
      let clusterIndexOffset = Array.from(Array(num).keys());
      let rowOfCluster = clusterIndexOffset.map((num) => i + num);
      let decidedToken = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if (notValid.includes(i)) continue;

      if (
        rowOfCluster.every(
          (index) =>
            squares[index].style.backgroundImage === decidedToken && !isBlank
        )
      ) {
        availableMoves.push(rowOfCluster);
        score += num - 2;
        scoreDisplay.innerHTML = score;
        rowOfCluster.forEach((index) => {
          squares[index].style.backgroundImage = '';
        });
      }
    }

    //Check for column clusters
    const maxColumnToCheck = WIDTH * WIDTH - WIDTH * (num - 1);
    for (i = 0; i < maxColumnToCheck; i++) {
      let clusterIndexOffset = Array.from(Array(num).keys());
      let columnOfCluster = clusterIndexOffset.map((num) => i + WIDTH * num);
      let decidedToken = squares[i].style.backgroundImage;
      const isBlank = squares[i].style.backgroundImage === '';

      if (
        columnOfCluster.every(
          (index) =>
            squares[index].style.backgroundImage === decidedToken && !isBlank
        )
      ) {
        availableMoves.push(columnOfCluster);
        score += num - 2;
        scoreDisplay.innerHTML = score;
        columnOfCluster.forEach((index) => {
          squares[index].style.backgroundImage = '';
        });
      }
    }
  }

  checkForClusters(5);
  checkForClusters(4);
  checkForClusters(3);

  window.setInterval(() => {
    moveDown();
    checkForClusters(5);
    checkForClusters(4);
    checkForClusters(3);
  }, 100);
});

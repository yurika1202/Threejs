const startBtn = document.querySelector('.startButton');
const stopBtn = document.querySelector('.stopButton');
const displayElm = document.querySelector('.display');
const logElm = document.querySelector('.log');

function stopWatch(options) {
  let timeAry = [];

  function addMessage(message) {
    const messageElm = document.createElement('div');
    messageElm.innerText = message;
    messageElm.classList.add('message');

    const now = new Date();
    messageElm.innerText = now.getHours() + '時' + now.getMinutes() + '分' + now.getSeconds() + '秒' + message;

    // 改造１：最新順にソート
    timeAry.push(messageElm);
    const reverseTime = [...timeAry].reverse();

    reverseTime.forEach(time => {
      logElm.appendChild(time);
    });
  }

  options = options || {};
  const color = options.color || 'lightblue';
  const backgroundColor = options.backgroundColor || 'black';
  displayElm.style.color = color;
  displayElm.style.backgroundColor = backgroundColor;

  let seconds = 0;
  let timer = null;

  startBtn.addEventListener('click', function () {
    if (timer === null) {
      timer = setInterval(function () {
        seconds++;
        displayElm.innerText = seconds;
        return seconds;
      }, 1000);

      // 改造２：ボタンの無効化
      startBtn.setAttribute('disabled', true);
      stopBtn.removeAttribute('disabled');

      addMessage('開始');
    }
  });

  stopBtn.addEventListener('click', function () {
    if (timer !== null) {
      clearInterval(timer);
      timer = null;

      // 改造２：ボタンの無効化
      startBtn.removeAttribute('disabled');
      stopBtn.setAttribute('disabled', true);

      addMessage('終了');
    }
  });
}

const options = {
  color: 'limegreen',
  backgroundColor: '#333',
};
stopWatch(options);

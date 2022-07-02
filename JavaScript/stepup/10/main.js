class WordQuiz {
  constructor(root) {
    this.rootElm = root;
    this.gameStatus = {};
    this.resetGame();
  }

  async init() {
    await this.fetchQuizDate();
    this.displayStartView();
  }

  // JSONデータの取得
  async fetchQuizDate() {
    try {
      const response = await fetch('./quiz.json');
      this.quizData = await response.json();
    } catch (e) {
      this.rootElm.innerText = '問題の読み込みに失敗しました';
      console, log(e);
    }
  }

  // 最終ステップを動的設定
  isLastStep() {
    const currentQuestions = this.quizData[this.gameStatus.level];
    return this.gameStatus.step === Object.keys(currentQuestions).length;
  }

  // ステップを1追加して質問ページを更新
  nextStep() {
    this.clearTimer();
    this.addResult();

    if (this.isLastStep()) {
      this.displayResultView();
    } else {
      this.gameStatus.step++;
      this.displayQuestionView();
    }
  }

  // 解答結果の保持
  addResult() {
    const checkedElm = this.rootElm.querySelector('input[name="choice"]:checked');
    const answer = checkedElm ? checkedElm.value : ''; // 選択要素のvalueをanswer変数へ格納し、未選択の場合は空文字列を格納
    const currentQuestion = this.quizData[this.gameStatus.level][`step${this.gameStatus.step}`];

    this.gameStatus.results.push({
      question: currentQuestion, // 解答
      selectedAnswer: answer, // 正解
    });
  }

  // 正答率の計算
  calcResult() {
    let correctNum = 0;
    const results = this.gameStatus.results;
    for (const result of results) {
      const selected = result.selectedAnswer; // 解答
      const correct = result.question.answer; // 正解
      if (selected === correct) {
        correctNum++;
      }
    }
    return Math.floor((correctNum / results.length) * 100);
  }

  // ステータスのリセット処理
  resetGame() {
    this.gameStatus.level = null; // 選択レベル
    this.gameStatus.step = 1; // 現在表示中の設問番号
    this.gameStatus.results = []; // プレイヤーの解答結果
    this.gameStatus.timeLimit = 0; // 問題ごとの制限時間
    this.gameStatus.intervalKey = null; // setIntervalのキー
  }

  // タイマーの作成
  setTimer() {
    // setTimerを複数回連続で呼び出すをバグにつながるため、intervalKeyがnullでない時には例外処理を投げる
    if (this.gameStatus.intervalKey !== null) {
      throw new Error('まだタイマーが動いています');
    }

    this.gameStatus.timeLimit = 10;
    this.gameStatus.intervalKey = setInterval(() => {
      this.gameStatus.timeLimit--;
      if (this.gameStatus.timeLimit === 0) {
        this.nextStep();
      } else {
        this.renderTimeLimitStr();
      }
    }, 1000);
  }

  // タイマーの停止
  clearTimer() {
    clearInterval(this.gameStatus.intervalKey);
    this.gameStatus.intervalKey = null;
  }

  // 開始画面の表示
  displayStartView() {
    const levelStrs = Object.keys(this.quizData);
    this.gameStatus.level = levelStrs[0];
    const optionStrs = [];
    for (let i = 0; i < levelStrs.length; i++) {
      optionStrs.push(`<option value="${levelStrs[i]}" name="level">レベル${i + 1}</option>`);
    }

    const html = `<select class="levelSelector">${optionStrs.join('')}</select><button class="startBtn">スタート</button>`;
    const parentElm = document.createElement('div');
    parentElm.innerHTML = html;

    const selectorElm = parentElm.querySelector('.levelSelector');
    selectorElm.addEventListener('change', e => {
      this.gameStatus.level = e.target.value;
    });

    const startBtnElm = parentElm.querySelector('.startBtn');
    startBtnElm.addEventListener('click', () => {
      this.displayQuestionView();
    });
    this.replaceView(parentElm);
  }

  // クイズ画面の表示
  displayQuestionView() {
    this.setTimer();
    // 各ステップの問題を配列として格納
    const stepKey = `step${this.gameStatus.step}`;
    const currentQuestion = this.quizData[this.gameStatus.level][stepKey];
    const choiceStrs = [];
    for (const choice of currentQuestion.choices) {
      choiceStrs.push(`<label><input type="radio" name="choice" value="${choice}" />${choice}</label>`);
    }

    // クイズページの作成
    const html = `<p>${currentQuestion.word}</p><div>${choiceStrs.join('')}</div><div class="actions"><button class="nextBtn">解答する</button><p class="sec">残り解答時間：${this.gameStatus.timeLimit}秒</p></div>`;
    const parentElm = document.createElement('div');
    parentElm.className = 'question';
    parentElm.innerHTML = html;

    // ステップの更新
    const nextBtnElm = parentElm.querySelector('.nextBtn');
    nextBtnElm.addEventListener('click', () => {
      this.nextStep();
    });

    this.replaceView(parentElm);
  }

  // 残り時間の更新
  renderTimeLimitStr() {
    const secElm = this.rootElm.querySelector('.sec');
    secElm.innerText = `残り解答時間：${this.gameStatus.timeLimit}秒`;
  }

  // 終了画面の表示
  displayResultView() {
    const score = this.calcResult();
    const html = `<h2>ゲーム終了</h2><p>正解率：${score}%</p><button class="resetBtn">開始画面にもどる</button>`;
    const parentElm = document.createElement('div');
    parentElm.className = 'results';
    parentElm.innerHTML = html;
    const resultBtnElm = parentElm.querySelector('.resetBtn');

    resultBtnElm.addEventListener('click', () => {
      this.resetGame();
      this.displayStartView();
    });
    this.replaceView(parentElm);
  }

  // 共通処理：rootElmを空にして新しい要素をセット
  replaceView(elm) {
    this.rootElm.innerHTML = '';
    this.rootElm.appendChild(elm);
  }
}

new WordQuiz(document.querySelector('.app')).init();

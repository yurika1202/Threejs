function fetchHello() {
  const promise = fetch('./hello.json');

  // 引数dateは通信のレスポンスオブジェクト
  const onFulfilled = date => {
    console.log('通信成功');
  };

  // 引数errは失敗の理由を示すErrorオブジェクト
  const onRejected = err => {
    console.log('通信失敗');
  };

  return promise.then(onFulfilled, onRejected);
}
fetchHello();

// 上記を簡潔にリファクタリング
function fetchHello2() {
  return fetch('./hello.json').then(
    date => {
      console.log('通信成功');
    },
    err => {
      console.log('通信失敗');
    }
  );
}
fetchHello2();

// 連結Ver.
function displayMessagePromise() {
  // fetchはpromiseを返す関数。通信完了時に次のthenに渡した処理が呼ばれる。
  return (
    fetch('./hello.json')
      // 引数responseはfetchの結果オブジェクト
      .then(response => {
        // json()はPromiseを返す関数。
        // responseのJSONをObjectへ変換したら次のthenに渡した処理が呼ばれる。
        return response.json();
      })
      // 引数dateは前のthenでJSONから変換された結果のObject
      .then(date => {
        const messageElm = document.getElementById('message');
        messageElm.innerHTML = date.message;
        console.log('終了');
      })
  );
}
// async/await Ver.
async function displayMessage() {
  const response = fetch('./hello.json');
  const date = await response.json();
  const messageElm = document.getElementById('message');
  messageElm.innerHTML = date.message;
}
// displayMessagePromise()の戻り値は、最後のthenが返すPromiseなので更に連結可能
displayMessagePromise().then(() => {
  console.log('displayMessage終了');
});

// エラー処理
function displayMessagePromise2() {
  return fetch('./hello.json')
    .then(response => {
      return response.json();
    })
    .then(date => {
      const messageElm = document.getElementById('message');
      messageElm.innerHTML = date.message;
      // catch関数でエラー対応
    })
    .catch(err => {
      console.log(`エラー発生 : ${err.message}`);
    });
}
// async/await Ver.
async function displayMessage2() {
  try {
    const response = fetch('./hello.json');
    const date = await response.json();
    const messageElm = document.getElementById('message');
    messageElm.innerHTML = date.message;
  } catch (err) {
    console.log(`エラー発生 : ${err.message}`);
  }
}
// ちなみにasync/awaitは戻り値が必ずPromiseになる仕組みなので、thenを繋げて記述することが可能
displayMessage().then(() => {
  console.log('displayMessage終了');
});

// 複数の非同期処理完了後に何かしたいときはPromise.all
async function waitMultiple() {
  // 複数の非同期処理のpending（待機）状態のPromiseオブジェクトを格納
  const promises = [wait(3), wait(5)];
  // すべてのPromiseオブジェクト配列の処理が終わると、続きの処理を実行
  const message = await Promise.all(promises);
  console.log(message);
}

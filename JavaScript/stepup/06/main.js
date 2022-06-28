const rootElm = document.querySelector('.ariaSelector');

// 初期化メソッド これを実行することでアプリが動く
async function initAreaSelector() {
  await updatePref();
  await updateCity();
}

// AJAXで都道府県のJSONデータを取得し、オブジェクトとして返す
async function getPrefs() {
  const prefResponse = await fetch('./prefectures.json');
  return await prefResponse.json();
}

// AJAXで市区町村のJSONデータを取得し、オブジェクトとして返す
async function getCities(prefCode) {
  const cityResponse = await fetch(`./cities/${prefCode}.json`);
  return await cityResponse.json();
}

// 取得した都道府県JSONデータからoptionタグを生成しselectへ反映
async function updatePref() {
  const prefs = await getPrefs();
  createPrefOptionsHtml(prefs);
}

// 取得した市区町村JSONデータの内容をselectへ反映
async function updateCity() {
  const prefSelectorElm = rootElm.querySelector('.prefectures');
  const cities = await getCities(prefSelectorElm.value);
  createCityOptionsHtml(cities);
}

// HTMLの整備
function createPrefOptionsHtml(prefs) {
  const optionStrs = [];
  for (const pref of prefs) {
    optionStrs.push(`
      <option name="${pref.name}" value="${pref.code}">
        ${pref.name}
      </option>
    `);
  }
  const prefSelectorElm = rootElm.querySelector('.prefectures');
  // join()：呼び出し元の配列を引数で与えた文字で区切りつつ連結（文字列化）する。
  // 今回は引数が空なので区切り文字なしで連結。
  prefSelectorElm.innerHTML = optionStrs.join('');
  // 都道府県選択時に市区町村の内容を変更する
  prefSelectorElm.addEventListener('change', event => {
    updateCity();
  });
}

function createCityOptionsHtml(cities) {
  const optionStrs = [];
  for (const city of cities) {
    optionStrs.push(`
      <option name="${city.name}" value="${city.code}">
        ${city.name}
      </option>
    `);
  }
  const citySelectorElm = rootElm.querySelector('.cities');
  citySelectorElm.innerHTML = optionStrs.join('');
}

initAreaSelector();

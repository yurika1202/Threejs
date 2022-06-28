class AreaSelector {
  constructor(root) {
    this.rootElm = root;
    this.prefectures = [];
    this.cities = [];
    this.prefCode = null;
  }

  // 初期化メソッド これを実行することでアプリが動く
  async init() {
    await this.updatePref();
    await this.updateCity();
  }

  // AJAXで都道府県のJSONデータを取得し、オブジェクトとして返す
  async getPrefs() {
    const prefResponse = await fetch('./prefectures.json');
    return await prefResponse.json();
  }

  // AJAXで市区町村のJSONデータを取得し、オブジェクトとして返す
  async getCities(prefCode) {
    const cityResponse = await fetch(`./cities/${prefCode}.json`);
    return await cityResponse.json();
  }

  // 取得した都道府県JSONデータからoptionタグを生成しselectへ反映
  async updatePref() {
    this.prefectures = await this.getPrefs();
    // 選択中の都道府県コード
    this.prefCode = this.prefectures[0].code;
    this.createPrefOptionsHtml();
  }

  // 取得した市区町村JSONデータの内容をselectへ反映
  async updateCity() {
    this.cities = await this.getCities(this.prefCode);
    this.createCityOptionsHtml();
  }

  // HTMLの整備
  createPrefOptionsHtml() {
    const prefSelectorElm = this.rootElm.querySelector('.prefectures');
    // join()：呼び出し元の配列を引数で与えた文字で区切りつつ連結（文字列化）する。
    // 今回は引数が空なので区切り文字なしで連結。
    prefSelectorElm.innerHTML = this.toOptionsHtml(this.prefectures);
    // 都道府県選択時に市区町村の内容を変更する
    prefSelectorElm.addEventListener('change', event => {
      this.prefCode = event.target.value;
      this.updateCity();
    });
  }
  createCityOptionsHtml() {
    const citySelectorElm = this.rootElm.querySelector('.cities');
    citySelectorElm.innerHTML = this.toOptionsHtml(this.cities);
  }

  toOptionsHtml(records) {
    return records
      .map(record => {
        return `
          <option name="${record.name}" value="${record.code}">
          ${record.name}
          </option>
        `;
      })
      .join('');
  }
}

const rootElm = document.querySelector('.ariaSelector');
const areaSelector = new AreaSelector(rootElm);
areaSelector.init();

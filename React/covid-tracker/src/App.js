import { useState, useEffect } from "react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import countriesJson from "./countries.json";
import TopPage from "./pages/TopPage";
import WorldPage from "./pages/WorldPage";
import "./App.css";

function App() {
  /**
   * state；値を保持しておく（＝選択国のslug情報を保管する）
   * country = state（選択国のslug（データ）が格納される）
   * setCountry = stateを操作する仕組み（格納されているデータを操作する）
   * useState("初期データ")
   */
  const [loading, setLoading] = useState(false);
  const [country, setCountry] = useState("japan");
  const [countryDate, setCountryDate] = useState({
    date: "",
    newConfirmed: "",
    totalConfirmed: "",
    newRecovered: "",
    totalRecovered: "",
  });
  const [allCountriesDate, setAllCountriesDate] = useState([]);

  // 第二引数にcountry stateを指定しているので、
  // country stateが変更されるたびに実行される。
  useEffect(() => {
    const getCountryDate = () => {
      setLoading(true);
      // fetch：非同期通信で指定先のデータを取得
      fetch(`https://api.covid19api.com/country/${country}`)
        // 取得したデータをJSON形式に変換
        .then((res) => res.json())
        .then((date) => {
          setCountryDate({
            date: date[date.length - 1].Date,
            newConfirmed: date[date.length - 1].Confirmed - date[date.length - 2].Confirmed,
            totalConfirmed: date[date.length - 1].Confirmed,
            newRecovered: date[date.length - 1].Recovered - date[date.length - 2].Recovered,
            totalRecovered: date[date.length - 1].Recovered,
          });
          setLoading(false);
        })
        .catch((err) => alert("エラーが発生しました。ページをリロードして、もう一度トライしてください。"));
    };
    getCountryDate();
  }, [country]);

  useEffect(() => {
    fetch("https://api.covid19api.com/summary")
      .then((res) => res.json())
      .then((date) => setAllCountriesDate(date.Countries))
      .catch((err) => alert("エラーが発生しました。ページをリロードして、もう一度トライしてください。"));
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            /* 任意のdate名に渡したいdateを指定すると、コンポーネントにデータが渡される 
            コンポーネント内ではprops.countryNameでデータにアクセスできる。 */
            <TopPage countriesJson={countriesJson} setCountry={setCountry} countryDate={countryDate} loading={loading} />
          }
        ></Route>
        <Route path="/world" element={<WorldPage allCountriesDate={allCountriesDate} />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

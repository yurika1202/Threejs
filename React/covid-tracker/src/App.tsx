import * as React from "react";
import { useState, useEffect } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import countriesJson from "./countries.json";
import TopPage from "./pages/TopPage";
import WorldPage from "./pages/WorldPage";
import "./App.css";
import { CountryDateType, AllCountriesDateType } from "./types";

function App() {
  /**
   * state；値を保持しておく（＝選択国のslug情報を保管する）
   * country = state（選択国のslug（データ）が格納される）
   * setCountry = stateを操作する仕組み（格納されているデータを操作する）
   * useState("初期データ")
   */
  const [loading, setLoading] = useState<boolean>(false);
  const [country, setCountry] = useState<string>("japan");
  const [countryDate, setCountryDate] = useState<CountryDateType>({
    date: "",
    newConfirmed: 0,
    totalConfirmed: 0,
    newRecovered: 0,
    totalRecovered: 0,
  });
  const [allCountriesDate, setAllCountriesDate] = useState<AllCountriesDateType>([
    {
      Country: "",
      NewConfirmed: 0,
      TotalConfirmed: 0,
    },
  ]);

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
      <Switch>
        <Route exact path="/">
          <TopPage countriesJson={countriesJson} setCountry={setCountry} countryDate={countryDate} loading={loading} />
        </Route>
        <Route exact path="/world">
          <WorldPage allCountriesDate={allCountriesDate} />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;

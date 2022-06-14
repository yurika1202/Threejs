import Header from "../components/Header";
import Title from "../components/Title";
import Selector from "../components/Selector";
import Results from "../components/Results";

const TopPage = ({ countriesJson, setCountry, countryDate, loading }) => {
  return (
    <div className="top-page-container">
      <div>
        <Header />
        <Title />
        <Selector countriesJson={countriesJson} setCountry={setCountry} />
        <Results countryDate={countryDate} loading={loading} />
      </div>
    </div>
  );
};

export default TopPage;

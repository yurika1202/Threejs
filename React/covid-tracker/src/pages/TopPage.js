import Title from "../components/Title";
import Selector from "../components/Selector";
import Results from "../components/Results";

const TopPage = (props) => {
  return (
    <div className="top-page-container">
      <div>
        <Title />
        <Selector
          countriesJson={props.countriesJson}
          setCountry={props.setCountry}
          getCountryDate={props.getCountryDate}
        />
        <Results countryDate={props.countryDate} />
      </div>
    </div>
  );
};

export default TopPage;

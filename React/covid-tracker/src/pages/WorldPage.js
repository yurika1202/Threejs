import Header from "../components/Header";
import Card from "../components/Card";
import Title from "../components/Title";

const WorldPage = ({ allCountriesDate }) => {
  return (
    <div className="world-page-container">
      <Header />
      <Title />
      <Card allCountriesDate={allCountriesDate} />
    </div>
  );
};

export default WorldPage;

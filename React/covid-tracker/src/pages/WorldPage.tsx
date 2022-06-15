import Header from "../components/Header";
import Card from "../components/Card";
import Title from "../components/Title";
import { WorldPageType } from "../types";

const WorldPage = ({ allCountriesDate }: WorldPageType) => {
  return (
    <div className="world-page-container">
      <Header />
      <Title />
      <Card allCountriesDate={allCountriesDate} />
    </div>
  );
};

export default WorldPage;

const Results = (props) => {
  console.log("Resultsのprops", props);
  return (
    <div className="results-container">
      <div>
        <p>日付: {props.countryDate.date.slice(0, 10)}</p>
        <p>新規感染者: {props.countryDate.newConfirmed.toLocaleString()}</p>
        <p>感染者総数: {props.countryDate.totalConfirmed.toLocaleString()}</p>
        <p>新規回復者: {props.countryDate.newRecovered.toLocaleString()}</p>
        <p>回復者総数: {props.countryDate.totalRecovered.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default Results;

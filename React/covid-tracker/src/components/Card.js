const Card = (props) => {
  return (
    <div className="card-container">
      {props.allCountriesDate.map((singleDate, index) => (
        <div key={index} className="card">
          <div>
            <h2>{singleDate.Country}</h2>
            <p>
              新規感染者:<span>{singleDate.NewConfirmed.toLocaleString()}</span>
            </p>
            <p>
              感染者総数:
              <span>{singleDate.TotalConfirmed.toLocaleString()}</span>
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Card;

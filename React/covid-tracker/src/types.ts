// type
export type CountryDateType = {
  date: string;
  newConfirmed: number;
  totalConfirmed: number;
  newRecovered: number;
  totalRecovered: number;
};

type CountriesJsonType = {
  Country: string;
  Slug: string;
}[];

export type TopPageType = {
  countriesJson: CountriesJsonType;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
  countryDate: CountryDateType;
  loading: boolean;
};

export type SelectorType = {
  countriesJson: CountriesJsonType;
  setCountry: React.Dispatch<React.SetStateAction<string>>;
};

export type ResultsType = {
  countryDate: CountryDateType;
  loading: boolean;
};

// interface
interface SingleCountriesDateType {
  Country: string;
  NewConfirmed: number;
  TotalConfirmed: number;
}

export interface AllCountriesDateType extends Array<SingleCountriesDateType> {}

export interface WorldPageType {
  allCountriesDate: Array<SingleCountriesDateType>;
}

export interface CardType {
  allCountriesDate: Array<SingleCountriesDateType>;
}

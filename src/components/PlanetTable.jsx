import React, { useContext, useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import filterContext from '../context/FilterContext';

function PlanetTable() {
  const OPTIONS = [
    'population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water',
  ];
  const [planets, setPlanets] = useState([]);
  const [apiData, setApiData] = useState([]);
  const { isLoading, makeFetch } = useFetch();
  const [nameFilter, setNameFilter] = useState('');
  const {
    columnFilter,
    comparisonFilter,
    filterValue,
    setColumnFilter,
    setComparisonFilter,
    setFilterValue,
  } = useContext(filterContext);
  const [filterColumnOptions, setFilterColumnOptions] = useState(OPTIONS);

  useEffect(() => {
    const getPlanets = async () => {
      const data = await makeFetch('https://swapi.dev/api/planets');
      setApiData(data.results);
      setPlanets(data.results);
    };
    getPlanets();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = ({ target: { value } }) => {
    // const value = e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1);
    setNameFilter(value);
  };

  const handleChangeOnColumnInput = (e) => {
    setColumnFilter(e.target.value);
  };
  const handleChangeOnComparisonParameter = (e) => {
    setComparisonFilter(e.target.value);
  };
  const handleChangeOnValueInput = (e) => {
    setFilterValue(e.target.value);
  };

  const numericalFilter = () => {
    const columnPattern = columnFilter;
    const comparisonParameter = comparisonFilter;
    const valueParameter = filterValue;
    setFilterColumnOptions(filterColumnOptions.filter((e) => !columnFilter.includes(e)));

    switch (comparisonParameter) {
    case 'maior que':
      setColumnFilter(filterColumnOptions[0]);
      return planets.filter((planet) => planet[columnPattern] > +valueParameter);

    case 'menor que':
      setColumnFilter(filterColumnOptions[0]);
      console.log('xablau', columnFilter, valueParameter);
      return planets.filter((planet) => planet[columnPattern] < +valueParameter);

    case 'igual a':
      setColumnFilter(filterColumnOptions[0]);
      return planets.filter((planet) => planet[columnPattern] === valueParameter);

    default:
      break;
    }
  };

  const handleFiltersBtn = () => {
    setPlanets(numericalFilter());
  };

  const debugButton = () => {
    console.log(columnFilter, comparisonFilter, filterValue);
    console.log(planets, apiData);
  };

  return (
    <div>
      <button type="button" onClick={ debugButton }>Debug</button>
      <input
        type="search"
        name="nameFilter"
        id="nameFilter"
        data-testid="name-filter"
        value={ nameFilter }
        onChange={ handleChange }
      />
      <br />
      <br />
      <form>
        <select
          data-testid="column-filter"
          name="columnFilter"
          id="columnFilter"
          value={ columnFilter }
          onChange={ handleChangeOnColumnInput }
        >
          {filterColumnOptions.map((option) => (
            <option key={ option } value={ option }>{option}</option>
          ))}
        </select>

        <select
          data-testid="comparison-filter"
          name="comparisonFilter"
          id="comparisonFilter"
          value={ comparisonFilter }
          onChange={ handleChangeOnComparisonParameter }
        >
          <option value="maior que">maior que</option>
          <option value="menor que">menor que</option>
          <option value="igual a">igual a</option>
        </select>

        <input
          data-testid="value-filter"
          type="number"
          name="valueFilter"
          id="valueFilter"
          value={ filterValue }
          onChange={ handleChangeOnValueInput }
        />

        <button
          type="button"
          data-testid="button-filter"
          onClick={ handleFiltersBtn }
        >
          Aplicar
        </button>

      </form>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Rotation Period</th>
            <th>Orbital Period</th>
            <th>Diameter</th>
            <th>Climate</th>
            <th>Gravity</th>
            <th>Terrain</th>
            <th>Surface Water</th>
            <th>Population</th>
            <th>Films</th>
            <th>Created</th>
            <th>Edited</th>
            <th>URL</th>
          </tr>
        </thead>
        <tbody>
          {!isLoading ? (
            planets.filter((planet) => planet.name.includes(nameFilter))
              .map((planet) => (
                <tr key={ planet.name }>
                  <td>{`${planet.name}`}</td>
                  <td>{`${planet.rotation_period}`}</td>
                  <td>{`${planet.orbital_period}`}</td>
                  <td>{`${planet.diameter}`}</td>
                  <td>{`${planet.climate}`}</td>
                  <td>{`${planet.gravity}`}</td>
                  <td>{`${planet.terrain}`}</td>
                  <td>{`${planet.surface_water}`}</td>
                  <td>{`${planet.population}`}</td>
                  <td>
                    { planet.films.map((film) => (`${film},
                `))}
                  </td>
                  <td>{`${planet.created}`}</td>
                  <td>{`${planet.edited}`}</td>
                  <td>{`${planet.url}`}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
              <td>loading...</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PlanetTable;

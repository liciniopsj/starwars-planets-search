import React, { useContext, useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';
import filterContext from '../context/FilterContext';

function PlanetTable() {
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

  useEffect(() => {
    const getPlanets = async () => {
      const data = await makeFetch('https://swapi.dev/api/planets');
      setApiData(data.results);
      setPlanets(data.results);
    };
    getPlanets();
    console.log(apiData);
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

    switch (comparisonParameter) {
    case 'maior que':
      return planets.filter((planet) => planet[columnPattern] > +valueParameter);

    case 'menor que':
      return planets.filter((planet) => planet[columnPattern] < +valueParameter);

    case 'igual a':
      return planets.filter((planet) => planet[columnPattern] === valueParameter);

    default:
      break;
    }
  };

  const handleFilters = () => {
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
          <option value="population">population</option>
          <option value="orbital_period">orbital_period</option>
          <option value="diameter">diameter</option>
          <option value="rotation_period">rotation_period</option>
          <option value="surface_water">surface_water</option>
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
          onClick={ handleFilters }
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

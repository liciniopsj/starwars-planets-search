import React, { useContext, useEffect, useState } from 'react';
import filterContext from '../context/FilterContext';

function PlanetTable() {
  const THEAD = ['Name', 'Rotation Period', 'Orbital Period', 'Diameter', 'Climate',
    'Gravity', 'Terrain', 'Surface Water',
    'Population', 'Films', 'Created', 'Edited', 'URL'];
  const OPTIONS = [
    'population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water',
  ];
  const [planets, setPlanets] = useState([]);
  const [nameFilter, setNameFilter] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [tableSort, setTableSort] = useState(
    { order: { column: 'population', sort: 'ASC' } },
  );
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
      try {
        setIsLoading(true);
        const promise = await fetch('https://swapi.dev/api/planets');
        const data = await promise.json();
        setPlanets(data.results);
      } finally {
        setIsLoading(false);
      }
    };
    getPlanets();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSortBtn = () => {
    const { order: { column, sort } } = tableSort;
    const toSort = [...planets];

    if (sort === 'ASC') toSort.sort((a, b) => a[column] - b[column]);
    if (sort === 'DESC') toSort.sort((a, b) => b[column] - a[column]);

    const top = toSort.filter((e) => e[column] !== 'unknown');
    const bot = toSort.filter((e) => e[column] === 'unknown');

    const sortedPlanets = [...top, ...bot];

    setPlanets(sortedPlanets);
  };

  const numericalFilter = () => {
    const columnPattern = columnFilter;
    const comparisonParameter = comparisonFilter;
    const valueParameter = filterValue;
    setFilterColumnOptions(filterColumnOptions.filter((e) => !columnFilter.includes(e)));

    if (comparisonParameter === 'maior que') {
      setColumnFilter(filterColumnOptions[0]);
      return planets.filter((planet) => planet[columnPattern] > +valueParameter);
    }

    if (comparisonParameter === 'menor que') {
      setColumnFilter(filterColumnOptions[0]);
      return planets.filter((planet) => planet[columnPattern] < +valueParameter);
    }

    setColumnFilter(filterColumnOptions[0]);
    return planets.filter((planet) => planet[columnPattern] === valueParameter);
  };

  const handleFiltersBtn = () => {
    setPlanets(numericalFilter());
  };

  return (
    <div>
      <input
        type="search"
        name="nameFilter"
        id="nameFilter"
        data-testid="name-filter"
        value={ nameFilter }
        onChange={ (e) => setNameFilter(e.target.value) }
      />
      <br />
      <br />
      <form>
        <select
          data-testid="column-filter"
          name="columnFilter"
          id="columnFilter"
          value={ columnFilter }
          onChange={ (e) => setColumnFilter(e.target.value) }
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
          onChange={ (e) => setComparisonFilter(e.target.value) }
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
          onChange={ (e) => setFilterValue(e.target.value) }
        />

        <button
          type="button"
          data-testid="button-filter"
          onClick={ handleFiltersBtn }
        >
          Aplicar
        </button>

        {' '}

        <select
          data-testid="column-sort"
          name="columnSort"
          id="columnSort"
          value={ tableSort.order.column }
          onChange={ (e) => setTableSort(
            {
              ...tableSort,
              order: { ...tableSort.order, column: e.target.value },
            },
          ) }
        >
          {OPTIONS.map((option) => (
            <option key={ option } value={ option }>{option}</option>
          ))}
        </select>
        <input
          data-testid="column-sort-input-asc"
          type="radio"
          value="ASC"
          name="sortInput"
          onChange={ (e) => setTableSort(
            {
              ...tableSort,
              order: { ...tableSort.order, sort: e.target.value },
            },
          ) }
        />
        ASC
        <input
          data-testid="column-sort-input-desc"
          type="radio"
          value="DESC"
          name="sortInput"
          onChange={ (e) => setTableSort(
            {
              ...tableSort,
              order: { ...tableSort.order, sort: e.target.value },
            },
          ) }
        />
        DESC

        {' '}

        <button
          type="button"
          data-testid="column-sort-button"
          onClick={ handleSortBtn }
        >
          ORDENAR
        </button>

      </form>
      <table>
        <thead>
          <tr>
            {THEAD.map((th) => (<th key={ th }>{th}</th>))}
          </tr>
        </thead>
        <tbody>
          {!isLoading ? (
            planets.filter((planet) => planet.name.includes(nameFilter))
              .map((planet) => (
                <tr key={ planet.name }>
                  <td data-testid="planet-name">{`${planet.name}`}</td>
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

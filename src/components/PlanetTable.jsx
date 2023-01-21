import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetch';

function PlanetTable() {
  const [planets, setPlanets] = useState([]);
  const { isLoading, makeFetch } = useFetch();
  const [nameFilter, setNameFilter] = useState('');

  useEffect(() => {
    const getPlanets = async () => {
      const data = await makeFetch('https://swapi.dev/api/planets');
      setPlanets(data.results);
      console.log(data);
    };
    getPlanets();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleChange = (e) => {
    setNameFilter(e.target.value);
  };

  return (
    <div>
      <input
        type="search"
        name="nameFilter"
        id="nameFilter"
        data-testid="name-filter"
        value={ nameFilter }
        onChange={ handleChange }
      />
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

import React, { useContext } from 'react';
import './Table.css';
import AppContext from '../context/AppContext';
import Logo from './logo.png';

export default function Table() {
  const { valor, setValor } = useContext(AppContext);
  const { filter, setFilter } = useContext(AppContext);
  const { paramer, setParamer } = useContext(AppContext);
  const { number, setNumber } = useContext(AppContext);
  const { filtroFiEsqueça } = useContext(AppContext);
  const { filtered } = useContext(AppContext);
  const { filtros } = useContext(AppContext);
  const { colunas } = useContext(AppContext);
  const { deletFilters } = useContext(AppContext);
  const { deletFilter } = useContext(AppContext);
  const msg = 'Teste algum filtro!';
  const c = 'delete-filter-button';
  const montaButton = (
    <button
      data-testid="button-remove-filters"
      onClick={ deletFilters }
      type="button"
    >
      Remover Filtros
    </button>);
  const montaXbutton = (i, filtroName) => (
    <button
      name={ i }
      type="button"
      className={ c }
      onClick={ () => deletFilter(i, filtroName) }
    >
      X
    </button>
  );
  return (
    <div>
      <label htmlFor="text-box-search">
        Pesquise por algum Planeta:
        <input
          id="text-box-search"
          type="text"
          onChange={ (e) => setValor(e.target.value) }
          value={ valor }
          data-testid="name-filter"
        />
      </label>
      <label htmlFor="filterC">
        <select
          id="filterC"
          data-testid="column-filter"
          onChange={ (e) => setFilter(e.target.value) }
          value={ filter }
        >
          { colunas.map((f, i) => <option key={ i }>{f}</option>)}
        </select>
      </label>
      <label htmlFor="filterM">
        <select
          id="filterM"
          data-testid="comparison-filter"
          onChange={ (e) => setParamer(e.target.value) }
          value={ paramer }
        >
          <option>maior que</option>
          <option>menor que</option>
          <option>igual a</option>
        </select>
      </label>
      <input
        data-testid="value-filter"
        type="number"
        onChange={ (e) => setNumber(e.target.value) }
        value={ number }
      />
      <button
        type="button"
        data-testid="button-filter"
        onClick={ filtered }
      >
        Filtrar

      </button>
      {montaButton}
      { filtros.map((filtro, i) => (
        <div data-testid="filter" className="filter-and-button" key={ i }>
          <p className="filters" key={ i }>
            { filtro.Name }
          </p>
          {
            filtro.Name === msg ? null : montaXbutton(i, filtro.Name)
          }
        </div>
      ))}
      <img className="logo" alt="Star Wars Logo" src={ Logo } />
      <table className="tableBody">
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
          <th>Created Water</th>
          <th>Edited</th>
          <th> URL </th>
        </tr>
        { filtroFiEsqueça.map((pla) => (
          <tr key={ pla.url }>
            <td>
              { pla.name }
            </td>
            <td>
              { pla.rotation_period }
            </td>
            <td>
              { pla.orbital_period }
            </td>
            <td>
              { pla.diameter }
            </td>
            <td>
              { pla.climate }
            </td>
            <td>
              { pla.gravity }
            </td>
            <td>
              { pla.terrain }
            </td>
            <td>
              { pla.surface_water }
            </td>
            <td>
              { pla.population }
            </td>
            <td>
              { pla.films.map((movie, i) => (
                <p className="links" key={ i }>
                  {movie}
                </p>
              )) }
            </td>
            <td>
              { pla.created }
            </td>
            <td>
              { pla.edited }
            </td>
            <td className="links">
              { pla.url }
            </td>
          </tr>
        )) }

      </table>
    </div>
  );
}

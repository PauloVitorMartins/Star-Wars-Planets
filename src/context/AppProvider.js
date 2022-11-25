import { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import AppContext from './AppContext';

function AppProvider({ children }) {
  const [planet, setPlanet] = useState([]);
  const [valor, setValor] = useState('');
  const [filter, setFilter] = useState('population');
  const [paramer, setParamer] = useState('maior que');
  const [number, setNumber] = useState('0');
  const [filtroFiEsqueça, setfiltroFiEsqueça] = useState([]);
  const msg = 'Teste algum filtro!';
  const [filtros, setFiltros] = useState([{ Name: msg }]);
  const [segundaFil, setSegundaFil] = useState([]);
  const [filtroUm, setFiltroUm] = useState([]);
  const [filtroTres, setFiltroTres] = useState([]);
  const coluns = [
    'population', 'orbital_period', 'diameter', 'rotation_period', 'surface_water'];
  const [colunas, setColunas] = useState(coluns);
  const [s, setS] = useState(false);
  const leng = 3;

  const arrayFiltrado = planet.filter((pla) => pla.name.includes(valor));

  const updateColum = () => {
    const toRemove = filtros.map((el) => el.filte);
    const updatedColum = colunas.filter((el) => !toRemove.includes(el));
    setColunas(updatedColum);
  };

  const deletFilters = () => {
    setfiltroFiEsqueça(arrayFiltrado);
    setFiltros([{ Name: msg }]);
    setColunas(coluns);
  };

  const deletFilter = (i, filterName) => {
    if (i === 0) {
      setFiltroUm(arrayFiltrado);
      const toRemoveFi = filterName;
      const pegaNome = filtros.filter((el) => el.Name === toRemoveFi);
      setFiltros(filtros.filter((el) => el.Name !== toRemoveFi));
      console.log(pegaNome.filte);
      setColunas([...colunas, pegaNome[0].filte]);
      setFilter(filter[1]);
    }
    if (i === 1) {
      setSegundaFil(filtroUm);
      const toRemoveFi = filterName;
      const pegaNome = filtros.filter((el) => el.Name === toRemoveFi);
      setFiltros(filtros.filter((el) => el.Name !== toRemoveFi));
      setColunas([...colunas, pegaNome[0].filte]);
      setFilter(filter[1]);
    }
    if (i === 2) {
      setFiltroTres(segundaFil);
      const toRemoveFi = filterName;
      const pegaNome = filtros.filter((el) => el.Name === toRemoveFi);
      setFiltros(filtros.filter((el) => el.Name !== toRemoveFi));
      setColunas([...colunas, filterName]);
      setColunas([...colunas, pegaNome[0].filte]);
      setFilter(filter[1]);
    }
  };

  const garanteIdentidade = () => {
    if (filtros.length === 0) {
      setfiltroFiEsqueça(arrayFiltrado);
      setFiltros([{ Name: msg }]);
      setColunas(coluns);
      setFilter('population');
      setFiltroUm(arrayFiltrado);
      setSegundaFil(arrayFiltrado);
      setS(false);
      setFiltroTres(arrayFiltrado);
    }
  };

  useEffect(() => {
    setfiltroFiEsqueça(planet);
  }, [planet]);

  useEffect(() => {
    setfiltroFiEsqueça(arrayFiltrado);
  }, [valor]);

  useEffect(() => {
    setfiltroFiEsqueça(filtroUm);
  }, [filtroUm]);

  useEffect(() => {
    setfiltroFiEsqueça(segundaFil);
  }, [segundaFil]);

  useEffect(() => {
    setfiltroFiEsqueça(filtroTres);
  }, [filtroTres]);

  useEffect(() => {
    updateColum();
    garanteIdentidade();
  }, [filtros]);

  const funçãoFiltradoraUm = () => {
    if (paramer === 'maior que') {
      const filtração = arrayFiltrado.filter((pla) => Number(pla[filter]) > number);
      setFiltroUm(filtração);
    }
    if (paramer === 'menor que') {
      const filtração = arrayFiltrado.filter((pla) => Number(pla[filter]) < number);
      setFiltroUm(filtração);
    }
    if (paramer === 'igual a') {
      const filtração = arrayFiltrado.filter((pla) => pla[filter] === number);
      setFiltroUm(filtração);
    }
    setFiltros([{
      paramer, filte: filter, number, Name: `${filter} ${paramer} ${number}` }]);
    console.log('entrou na primeira');
  };
  const funçãoFiltradoraDois = () => {
    if (paramer === 'maior que') {
      const filtração = filtroUm.filter((pla) => Number(pla[filter]) > number);
      setS(true);
      setSegundaFil(filtração);
    }
    if (paramer === 'menor que') {
      const filtração = filtroUm.filter((pla) => Number(pla[filter]) < number);
      setS(true);
      setSegundaFil(filtração);
    }
    if (paramer === 'igual a') {
      const filtração = filtroUm.filter((pla) => pla[filter] === number);
      setS(true);
      setSegundaFil(filtração);
    }
    setFiltros([...filtros, {
      paramer, filte: filter, number, Name: `${filter} ${paramer} ${number}` }]);
  };
  const funçãoTerceira = () => {
    if (paramer === 'maior que') {
      const filtração = segundaFil.filter((pla) => Number(pla[filter]) > number);
      setFiltroTres(filtração);
    }
    if (paramer === 'menor que') {
      const filtração = segundaFil.filter((pla) => Number(pla[filter]) < number);
      setFiltroTres(filtração);
    }
    if (paramer === 'igual a') {
      const filtração = segundaFil.filter((pla) => pla[filter] === number);
      setFiltroTres(filtração);
    }
    setFiltros([...filtros, {
      paramer, filte: filter, number, Name: `${filter} ${paramer} ${number}` }]);
  };

  const filtered = () => {
    if (number.length > 0 && filtros[0].Name === msg) {
      funçãoFiltradoraUm();
    } if (
      number.length > 0 && filtros[0].Name !== msg && filtros.length < leng && s === false
    ) {
      funçãoFiltradoraDois();
    } if (
      number.length > 0 && filtros[0].Name !== msg && filtros.length < leng && s === true
    ) {
      funçãoTerceira();
    } else {
      const filtração = arrayFiltrado;
      setfiltroFiEsqueça(filtração);
      console.log('entrou no else');
      setFilter(colunas[3]);
    }
  };

  const FetchPlanet = async () => {
    const api = 'https://swapi.dev/api/planets';
    const requestAPI = await fetch(api);
    const response = await requestAPI.json();
    setPlanet(response.results);
  };

  useEffect(() => {
    FetchPlanet();
  }, []);

  const values = useMemo(() => ({
    planet,
    valor,
    setValor,
    paramer,
    setParamer,
    number,
    setNumber,
    filter,
    setFilter,
    filtroFiEsqueça,
    setfiltroFiEsqueça,
    filtros,
    setFiltros,
    segundaFil,
    setSegundaFil,
    filtroUm,
    setFiltroUm,
    filtroTres,
    setFiltroTres,
    colunas,
    setColunas,
    s,
    setS,
    filtered,
    deletFilters,
    deletFilter,
  }), [
    planet,
    valor,
    setValor,
    paramer,
    setParamer,
    number,
    setNumber,
    filtroFiEsqueça,
    setfiltroFiEsqueça,
    filtros,
    setFiltros,
    segundaFil,
    setSegundaFil,
    filtroUm,
    setFiltroUm,
    filtroTres,
    setFiltroTres,
    colunas,
    setColunas,
    s,
    setS,
    filter,
    setFilter,
  ]);
  return (
    <AppContext.Provider value={ values }>
      { children }
    </AppContext.Provider>
  );
}

AppProvider.propTypes = {
  children: PropTypes.func.isRequired,
};

export default AppProvider;

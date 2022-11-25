import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import planet from './mockData';
import App from '../App';
import testData from '../../cypress/mocks/testData';
import userEvent from '@testing-library/user-event';
import { useMemo } from 'react';
import AppProvider from '../context/AppProvider';
import AppContext from '../context/AppContext';

const mockFunc = () => {
  global.fetch = jest.fn(() => Promise.resolve({
    json: () => Promise.resolve(testData),
  }));
}

function renderUserApp() {
  return render(
    <AppProvider>
      <App />,
    </AppProvider>
  );
}

describe('Testa tela de App', () => {
  beforeEach(mockFunc);
  afterEach(cleanup);
  test('Input "texto", "números", "btnFilter", firts table line is render', async () => {
    console.log(testData);
  renderUserApp();
     { planet };
    const inputText = screen.getByRole('textbox');
    expect(inputText).toBeInTheDocument();
    const inputNumber = screen.getByRole('spinbutton');
    expect(inputNumber).toBeInTheDocument();
    const filterBtn = screen.getByRole('button', { name: /filtrar/i });
    expect(filterBtn).toBeInTheDocument();
    const tabelaName = screen.getByRole('columnheader', { name: /name/i });
    expect(tabelaName).toBeInTheDocument();
    const tabelaRotation = screen.getByRole('columnheader', { name: /rotation period/i });
    expect(tabelaRotation).toBeInTheDocument();
  });
   test('Se api esta sendo consumida e renderizando corretamente', async () => {
    renderUserApp();
    const firstPlanetResult = await screen.findByRole('cell', { name: /tatooine/i });
    expect(firstPlanetResult).toBeInTheDocument();
    const otherPlanetResult = await screen.findByRole('cell', {  name: /alderaan/i});
    expect(otherPlanetResult).toBeInTheDocument();
  });
  test('Testa se filtra pelo texto', async () => {
    renderUserApp();
    const inputText = await screen.findByRole('textbox');
    userEvent.type(inputText, 't');
    const filterBtn = await screen.findByRole('button', { name: /filtrar/i });
    userEvent.click(filterBtn);
    const firstPlanetResult = await screen.findByRole('cell', { name: /tatooine/i });
    expect(firstPlanetResult).toBeInTheDocument();
  });
  test('Testa se filtra pelo Number', async () => {
    renderUserApp();
    const options = await screen.findByTestId("column-filter");
    expect(options).toBeInTheDocument();
    const paramers = await screen.findByTestId("comparison-filter");
    expect(paramers).toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'population' } });
    fireEvent.change(paramers, { target: { value: 'igual a' } } );
    const inputNumber = screen.getByRole('spinbutton');
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '1000000000000');
    const filterBtn = await screen.findByRole('button', { name: /filtrar/i });
    userEvent.click(filterBtn);
    const mostPopulatedPlanet = await screen.findByRole('cell', {  name: /coruscant/i });
    expect(mostPopulatedPlanet).toBeInTheDocument();
  });
  test('Testa options', async () => {
    renderUserApp();
    const options = await screen.findByTestId("column-filter");
    expect(options).toBeInTheDocument();
    const paramers = await screen.findByTestId("comparison-filter");
    expect(paramers).toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'diameter' } });
    fireEvent.change(paramers, { target: { value: 'igual a' } } );
    const inputNumber = screen.getByRole('spinbutton');
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '12500');
    const filterBtn = await screen.findByRole('button', { name: /filtrar/i });
    userEvent.click(filterBtn);
    const otherPlanetResult = await screen.findByRole('cell', {  name: /alderaan/i});
    expect(otherPlanetResult).toBeInTheDocument();
  });
  test('testa options menores', async () => {
    renderUserApp();
    const otherPlanetResult = await screen.findByRole('cell', {  name: /alderaan/i});
    const options = await screen.findByTestId("column-filter");
    expect(options).toBeInTheDocument();
    const paramers = await screen.findByTestId("comparison-filter");
    expect(paramers).toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'orbital_period' } });
    fireEvent.change(paramers, { target: { value: 'menor que' } } );
    const inputNumber = screen.getByRole('spinbutton');
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '305');
    const filterBtn = await screen.findByRole('button', { name: /filtrar/i });
    userEvent.click(filterBtn);
    const firstPlanetResult = await screen.findByRole('cell', { name: /tatooine/i });
    expect(firstPlanetResult).toBeInTheDocument();
    
    expect(otherPlanetResult).not.toBeInTheDocument();
  });
  test('testa sem filtro é 0', async () => {
    renderUserApp();
    const otherPlanetResult = await screen.findByRole('cell', {  name: /alderaan/i});
    const options = await screen.findByTestId("column-filter");
    expect(options).toBeInTheDocument();
    const paramers = await screen.findByTestId("comparison-filter");
    expect(paramers).toBeInTheDocument();
    const inputNumber = screen.getByRole('spinbutton');
    userEvent.clear(inputNumber);
    const filterBtn = await screen.findByRole('button', { name: /filtrar/i });
    userEvent.click(filterBtn);
    const firstPlanetResult = await screen.findByRole('cell', { name: /tatooine/i });
    expect(firstPlanetResult).toBeInTheDocument();
    expect(otherPlanetResult).toBeInTheDocument();
  });
  test('Testa se aplica vários filtros', async () => {
    renderUserApp();
    const mesageText = screen.getByText(/teste algum filtro!/i)
    const otherPlanetResult = await screen.findByRole('cell', {  name: /alderaan/i});
    const options = await screen.findByTestId("column-filter");
    expect(mesageText).toBeInTheDocument();
    expect(mesageText).toContainHTML('Teste algum filtro!');
    expect(options).toBeInTheDocument();
    const paramers = await screen.findByTestId("comparison-filter");
    expect(paramers).toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'rotation_period' } });
    fireEvent.change(paramers, { target: { value: 'menor que' } } );
    const inputNumber = screen.getByRole('spinbutton');
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '24');
    const filterBtn = await screen.findByRole('button', { name: /filtrar/i });
    userEvent.click(filterBtn);
    expect(mesageText).toContainHTML('rotation_period menor que 24');
    const firstPlanetResult = await screen.findByRole('cell', { name: /tatooine/i });
    expect(firstPlanetResult).toBeInTheDocument();
    expect(otherPlanetResult).not.toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'orbital_period' } });
    fireEvent.change(paramers, { target: { value: 'maior que' } } );
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '304');
    userEvent.click(filterBtn);
    expect(firstPlanetResult).not.toBeInTheDocument();
    const secondMesage = await screen.findByText(/orbital_period maior que 304/i);
    expect(secondMesage).toBeInTheDocument();
    const previousPlanet = await screen.findByRole('cell', {  name: /hoth/i})
    fireEvent.change(options, { target: { value: 'diameter' } });
    fireEvent.change(paramers, { target: { value: 'maior que' } } );
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '7200');
    userEvent.click(filterBtn);
    const thirdMesage = await screen.findByText(/diameter maior que 7200/i);
    expect(thirdMesage).toBeInTheDocument();
    const lastPlanet = await screen.findByRole('cell', {  name: /dagobah/i});
    expect(lastPlanet).toBeInTheDocument();
    expect(previousPlanet).not.toBeInTheDocument();
  });
  test('testa se entra nas condições para cada uma das operações de menor', async () => {
    renderUserApp();
    const mesageText = screen.getByText(/teste algum filtro!/i);
    const otherPlanetResult = await screen.findByRole('cell', {  name: /alderaan/i});
    const options = await screen.findByTestId("column-filter");
    expect(mesageText).toBeInTheDocument();
    expect(mesageText).toContainHTML('Teste algum filtro!');
    expect(options).toBeInTheDocument();
    const paramers = await screen.findByTestId("comparison-filter");
    expect(paramers).toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'rotation_period' } });
    fireEvent.change(paramers, { target: { value: 'menor que' } } );
    const inputNumber = screen.getByRole('spinbutton');
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '24');
    const filterBtn = await screen.findByRole('button', { name: /filtrar/i });
    userEvent.click(filterBtn);
    expect(mesageText).toContainHTML('rotation_period menor que 24');
    const firstPlanetResult = await screen.findByRole('cell', { name: /tatooine/i });
    expect(firstPlanetResult).toBeInTheDocument();
    expect(otherPlanetResult).not.toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'surface_water' } });
    fireEvent.change(paramers, { target: { value: 'menor que' } } );
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '100');
    const previousPlanet = await screen.findByRole('cell', {  name: /hoth/i})
    userEvent.click(filterBtn);
    expect(firstPlanetResult).toBeInTheDocument();
    expect(previousPlanet).not.toBeInTheDocument();
    const secondMesage = await screen.findByText(/surface_water menor que 100/i);
    expect(secondMesage).toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'diameter' } });
    fireEvent.change(paramers, { target: { value: 'menor que' } } );
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '10465');
    userEvent.click(filterBtn);
    const thirdMesage = await screen.findByText(/diameter menor que 10465/i);
    expect(thirdMesage).toBeInTheDocument();
    expect(firstPlanetResult).not.toBeInTheDocument();
  });
  test('testa se entra nas condições para cada uma das operações de igualq', async () => {
    renderUserApp();
    const mesageText = screen.getByText(/teste algum filtro!/i);
    const otherPlanetResult = await screen.findByRole('cell', {  name: /alderaan/i});
    const options = await screen.findByTestId("column-filter");
    expect(mesageText).toBeInTheDocument();
    expect(mesageText).toContainHTML('Teste algum filtro!');
    expect(options).toBeInTheDocument();
    const paramers = await screen.findByTestId("comparison-filter");
    expect(paramers).toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'rotation_period' } });
    fireEvent.change(paramers, { target: { value: 'menor que' } } );
    const inputNumber = screen.getByRole('spinbutton');
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '24');
    const filterBtn = await screen.findByRole('button', { name: /filtrar/i });
    userEvent.click(filterBtn);
    expect(mesageText).toContainHTML('rotation_period menor que 24');
    const firstPlanetResult = await screen.findByRole('cell', { name: /tatooine/i });
    expect(firstPlanetResult).toBeInTheDocument();
    expect(otherPlanetResult).not.toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'surface_water' } });
    fireEvent.change(paramers, { target: { value: 'igual a' } } );
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '100');
    const previousPlanet = await screen.findByRole('cell', {  name: /hoth/i})
    userEvent.click(filterBtn);
    expect(firstPlanetResult).not.toBeInTheDocument();
    expect(previousPlanet).toBeInTheDocument();
    const secondMesage = await screen.findByText(/surface_water igual a 100/i);
    expect(secondMesage).toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'diameter' } });
    fireEvent.change(paramers, { target: { value: 'igual a' } } );
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '10465');
    userEvent.click(filterBtn);
    const thirdMesage = await screen.findByText(/diameter igual a 10465/i);
    expect(thirdMesage).toBeInTheDocument();
    expect(firstPlanetResult).not.toBeInTheDocument();
  });
  test('testa botoes de apagar filtro', async () => {
    renderUserApp();
    const mesageText = screen.getByText(/teste algum filtro!/i);
    const otherPlanetResult = await screen.findByRole('cell', {  name: /alderaan/i});
    const options = await screen.findByTestId("column-filter");
    expect(mesageText).toBeInTheDocument();
    expect(mesageText).toContainHTML('Teste algum filtro!');
    expect(options).toBeInTheDocument();
    const paramers = await screen.findByTestId("comparison-filter");
    expect(paramers).toBeInTheDocument();
    fireEvent.change(options, { target: { value: 'rotation_period' } });
    fireEvent.change(paramers, { target: { value: 'menor que' } } );
    const inputNumber = screen.getByRole('spinbutton');
    userEvent.clear(inputNumber);
    userEvent.type(inputNumber, '24');
    const filterBtn = await screen.findByRole('button', { name: /filtrar/i });
    const yavin = await screen.findByRole('cell', {  name: /yavin iv/i})
    userEvent.click(filterBtn);
    expect(otherPlanetResult).not.toBeInTheDocument();
    const deleteFiltersBtn = await screen.findByRole('button', {  name: /remover filtros/i});
    userEvent.click(deleteFiltersBtn); 
    expect(yavin).not.toBeInTheDocument();
  });
});

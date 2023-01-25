import React from 'react';
import userEvent from '@testing-library/user-event';
import { render, screen, waitFor, waitForElementToBeRemoved } from '@testing-library/react';
import NumericalFiltersProvider from '../context/NumericalFiltersProvider';
import { mockedResponse } from './helper/mockedResponse';
import App from '../App';

describe('Test', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ results: mockedResponse })
    })
  })

  afterEach(() => {
    jest.clearAllMocks();
  });
  test('existance of key components', async () => {
    render(
      <NumericalFiltersProvider>
        <App />
      </NumericalFiltersProvider>
    );

    await waitForElementToBeRemoved(() => screen.getAllByRole('cell', { name: /loading.../i }));
    const searchbox = screen.getByRole('searchbox');
    const columnFilter = screen.getByTestId('column-filter');
    const comparisonFilter = screen.getByTestId('comparison-filter');
    const filterValue = screen.getByRole('spinbutton');
    const filterBtn = screen.getByRole('button', { name: /aplicar/i });

    expect(searchbox).toBeInTheDocument();
    expect(columnFilter).toBeInTheDocument();
    expect(comparisonFilter).toBeInTheDocument();
    expect(filterValue).toBeInTheDocument();
    expect(filterBtn).toBeInTheDocument();

    userEvent.clear(filterValue)
    userEvent.type(filterValue, '5000');

    expect(filterValue.value).toBe('5000');
  });

  test('components of PlanetTable - searchbox', async () => {
    render(
      <NumericalFiltersProvider>
        <App />
      </NumericalFiltersProvider>
    );

    await waitForElementToBeRemoved(() => screen.getAllByRole('cell', { name: /loading.../i }));
    const searchbox = screen.getByRole('searchbox');

    userEvent.type(searchbox, 'Tatooine');

    expect(searchbox.value).toBe('Tatooine');

    await waitFor(async () => {
      const row = screen.getAllByRole('row');
      expect(row.length).toBe(2);
    });

    userEvent.clear(searchbox)

    userEvent.type(searchbox, 'oo');

    await waitFor(async () => {
      const row = screen.getAllByRole('row');
      const planet = screen.getByText(/Tatooine/i);
      const planet2 = screen.getByText(/Naboo/i);
      expect(row.length).toBe(3);
      expect(planet).toBeInTheDocument();
      expect(planet2).toBeInTheDocument();
    });

  });

  test('components of PlanetTable - ColumnFilter', async () => {
    render(
      <NumericalFiltersProvider>
        <App />
      </NumericalFiltersProvider>
    );

    await waitForElementToBeRemoved(() => screen.getAllByRole('cell', { name: /loading.../i }));

    const columnFilter = screen.getByTestId('column-filter');
    expect(columnFilter.value).toBe('population');
    
    userEvent.selectOptions(columnFilter, 'orbital_period');
    expect(columnFilter.value).toBe('orbital_period');

    userEvent.selectOptions(columnFilter, 'diameter');
    expect(columnFilter.value).toBe('diameter');

    userEvent.selectOptions(columnFilter, 'rotation_period');
    expect(columnFilter.value).toBe('rotation_period');

    userEvent.selectOptions(columnFilter, 'surface_water');
    expect(columnFilter.value).toBe('surface_water');

  });

  test('components of PlanetTable - comparison filter', async () => {
    render(
      <NumericalFiltersProvider>
        <App />
      </NumericalFiltersProvider>
    );

    await waitForElementToBeRemoved(() => screen.getAllByRole('cell', { name: /loading.../i }));

    const comparisonFilter = screen.getByTestId('comparison-filter');

    expect(comparisonFilter.value).toBe('maior que');

    userEvent.selectOptions(comparisonFilter, 'menor que');
    expect(comparisonFilter.value).toBe('menor que');
    
    userEvent.selectOptions(comparisonFilter, 'igual a');
    expect(comparisonFilter.value).toBe('igual a');
    

  });

  test('Numerical Filters - equal to', async () => {
    render(
      <NumericalFiltersProvider>
        <App />
      </NumericalFiltersProvider>
    );

    await waitForElementToBeRemoved(() => screen.getAllByRole('cell', { name: /loading.../i }));

    const columnFilter = screen.getByTestId('column-filter');

    userEvent.selectOptions(columnFilter, 'rotation_period');
    expect(columnFilter.value).toBe('rotation_period');

    const comparisonFilter = screen.getByTestId('comparison-filter');

    userEvent.selectOptions(comparisonFilter, 'igual a');
    expect(comparisonFilter.value).toBe('igual a');

    const filterValue = screen.getByRole('spinbutton');

    userEvent.clear(filterValue);
    userEvent.type(filterValue, '24');
    expect(filterValue.value).toBe('24');

    const filterBtn = screen.getByRole('button', { name: /aplicar/i });
    
    userEvent.click(filterBtn);

    await waitFor(() => {
      const row = screen.getAllByRole('row');
      expect(row.length).toBe(4);
    });
  });

  test('Numerical Filters - bigger than', async () => {
    render(
      <NumericalFiltersProvider>
        <App />
      </NumericalFiltersProvider>
    );

    await waitForElementToBeRemoved(() => screen.getAllByRole('cell', { name: /loading.../i }));

    const filterValue = screen.getByRole('spinbutton');

    userEvent.clear(filterValue);
    userEvent.type(filterValue, '10000000000');
    expect(filterValue.value).toBe('10000000000');

    const filterBtn = screen.getByRole('button', { name: /aplicar/i });
    
    userEvent.click(filterBtn);

    await waitFor(() => {
      const row = screen.getAllByRole('row');
      expect(row.length).toBe(2);
    });
  });

  test('Numerical Filters - less than', async () => {
    render(
      <NumericalFiltersProvider>
        <App />
      </NumericalFiltersProvider>
    );

    await waitForElementToBeRemoved(() => screen.getAllByRole('cell', { name: /loading.../i }));

    const comparisonFilter = screen.getByTestId('comparison-filter');

    userEvent.selectOptions(comparisonFilter, 'menor que');
    expect(comparisonFilter.value).toBe('menor que');

    const filterValue = screen.getByRole('spinbutton');

    userEvent.clear(filterValue);
    userEvent.type(filterValue, '5000');
    expect(filterValue.value).toBe('5000');

    const filterBtn = screen.getByRole('button', { name: /aplicar/i });
    
    userEvent.click(filterBtn);

    await waitFor(() => {
      const row = screen.getAllByRole('row');
      expect(row.length).toBe(2);
    });
  });

  test('components of PlanetTable - Table', async () => {
    render(
      <NumericalFiltersProvider>
        <App />
      </NumericalFiltersProvider>
    );

    await waitForElementToBeRemoved(() => screen.getAllByRole('cell', { name: /loading.../i }));
    
    await waitFor(() => {
      const alderaan = screen.getByText(/alderaan/i);
      expect(alderaan).toBeInTheDocument();
      const yavin = screen.getByText(/Yavin IV/i);
      expect(yavin).toBeInTheDocument();
      const hoth = screen.getByText(/Hoth/i);
      expect(hoth).toBeInTheDocument();
      const dagobah = screen.getByText(/Dagobah/i);
      expect(dagobah).toBeInTheDocument();
      const endor = screen.getByText(/endor/i);
      expect(endor).toBeInTheDocument();
      const tatooine = screen.getByText(/tatooine/i);
      expect(tatooine).toBeInTheDocument();
      const planet = screen.getByText(/Bespin/i);
      const planet2 = screen.getByText(/Naboo/i);
      const planet3 = screen.getByText(/Coruscant/i);
      const planet4 = screen.getByText(/Kamino/i);
      expect(planet).toBeInTheDocument();
      expect(planet2).toBeInTheDocument();
      expect(planet3).toBeInTheDocument();
      expect(planet4).toBeInTheDocument();
      const row = screen.getAllByRole('row');
      expect(row.length).toBe(11);
    });

  });

  test('Sort table', async () => {
    render(
      <NumericalFiltersProvider>
        <App />
      </NumericalFiltersProvider>
    );

    await waitForElementToBeRemoved(() => screen.getAllByRole('cell', { name: /loading.../i }));

    const columnSort = screen.getByTestId('column-sort');
    expect(columnSort.value).toBe('population');

    userEvent.selectOptions(columnSort, 'orbital_period');
    expect(columnSort.value).toBe('orbital_period');

    userEvent.selectOptions(columnSort, 'diameter');
    expect(columnSort.value).toBe('diameter');

    userEvent.selectOptions(columnSort, 'rotation_period');
    expect(columnSort.value).toBe('rotation_period');

    userEvent.selectOptions(columnSort, 'surface_water');
    expect(columnSort.value).toBe('surface_water');

    userEvent.selectOptions(columnSort, 'population');

    const sortASC = screen.getByTestId('column-sort-input-asc');
    const sortDESC = screen.getByTestId('column-sort-input-desc');

    expect(sortASC).not.toBeChecked();
    expect(sortDESC).not.toBeChecked();

    userEvent.click(sortDESC);

    expect(sortDESC).toBeChecked();
    expect(sortASC).not.toBeChecked();

    const filterBtn = screen.getByRole('button', { name: /ordenar/i });
    
    userEvent.click(filterBtn);
        
    await waitFor(() => {
      const row = screen.getAllByRole('row');
      expect(row.length).toBe(11);
      expect(row[1].childNodes[0].textContent).toBe('Coruscant');
    });
    
    userEvent.click(sortASC);
    userEvent.click(filterBtn);
    
    await waitFor(() => {
      const row = screen.getAllByRole('row');
      expect(row[1].childNodes[0].textContent).toBe('Yavin IV');
    });

  });
});

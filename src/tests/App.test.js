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

    expect(searchbox).toBeInTheDocument();
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
    expect(filterBtn).toBeInTheDocument();
    
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
    expect(filterBtn).toBeInTheDocument();
    
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
    expect(filterBtn).toBeInTheDocument();
    
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
      const planet = screen.getByText(/tatooine/i);
      expect(planet).toBeInTheDocument();
    });

    await waitFor(() => {
      const planet = screen.getByText(/Endor/i);
      expect(planet).toBeInTheDocument();
    });

    await waitFor(() => {
      const planet = screen.getByText(/alderaan/i);
      expect(planet).toBeInTheDocument();
    });

    await waitFor(() => {
      const planet = screen.getByText(/Yavin IV/i);
      expect(planet).toBeInTheDocument();
    });

    await waitFor(() => {
      const planet = screen.getByText(/Hoth/i);
      expect(planet).toBeInTheDocument();
    });

    await waitFor(() => {
      const planet = screen.getByText(/Dagobah/i);
      expect(planet).toBeInTheDocument();
    });

    await waitFor(() => {
      const planet = screen.getByText(/Bespin/i);
      const planet2 = screen.getByText(/Naboo/i);
      const planet3 = screen.getByText(/Coruscant/i);
      const planet4 = screen.getByText(/Kamino/i);
      expect(planet).toBeInTheDocument();
      expect(planet2).toBeInTheDocument();
      expect(planet3).toBeInTheDocument();
      expect(planet4).toBeInTheDocument();
    });

    await waitFor(async () => {
      const row = screen.getAllByRole('row');
      expect(row.length).toBe(11);
    });

  });
});

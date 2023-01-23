import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import filterContext from './FilterContext';

function NumericalFiltersProvider({ children }) {
  const [columnFilter, setColumnFilter] = useState('population');
  const [comparisonFilter, setComparisonFilter] = useState('maior que');
  const [filterValue, setFilterValue] = useState(0);

  const contextValue = useMemo(
    () => (
      { columnFilter,
        comparisonFilter,
        filterValue,
        setColumnFilter,
        setComparisonFilter,
        setFilterValue }),
    [columnFilter, comparisonFilter, filterValue],
  );

  return (
    <filterContext.Provider value={ contextValue }>
      { children }
    </filterContext.Provider>
  );
}

export default NumericalFiltersProvider;

NumericalFiltersProvider.propTypes = {
  children: PropTypes.object,
}.isrequired;

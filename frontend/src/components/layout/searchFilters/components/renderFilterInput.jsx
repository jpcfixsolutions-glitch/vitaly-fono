import { FilterInputText } from './FilterInputText';
import { FilterInputSelect } from './FilterInputSelect';
import { FilterInputDate } from './FilterInputDate';

export const renderFilterInput = (filter, filterValues, handleFilterChange) => {
  switch (filter.type) {
    case 'text':
      return (
        <FilterInputText
          filter={filter}
          value={filterValues[filter.id]}
          onChange={handleFilterChange}
        />
      );

    case 'select':
      return (
        <FilterInputSelect
          filter={filter}
          value={filterValues[filter.id]}
          onChange={handleFilterChange}
        />
      );

    case 'date':
      return (
        <FilterInputDate
          filter={filter}
          value={filterValues[filter.id]}
          onChange={handleFilterChange}
        />
      );

    default:
      return null;
  }
};


import React, { FC, useCallback } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { FormControl, InputLabel } from '@mui/material';
import { SortTypes } from '../../types';
import { SortDropdownProps } from './types';

const sortOptions = [SortTypes.none, SortTypes.title, SortTypes.dueDate];

const SortDropdown: FC<SortDropdownProps> = React.memo(({sort, setSort}) => {
  const handleChange = useCallback((event: SelectChangeEvent) => {
    setSort(event.target.value as SortTypes);
  }, [setSort]);

  return (
    <FormControl style={{height: 40, width: 200}}>
        <InputLabel id="sort-by-label">Сортировать по:</InputLabel>
        <Select
        labelId="sort-by-label"
        label="Sort by:"
        value={sort}
        defaultValue='Сброс'
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Filter' }}
        style={{height: 40}}
        >
        {sortOptions.map((option) => (
            <MenuItem key={option} value={option}>
            {option}
            </MenuItem>
        ))}
        </Select>
    </FormControl>
  );
});

SortDropdown.displayName = 'SortDropdown';
export default SortDropdown;

import React, { FC } from 'react';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import Chip from '@mui/material/Chip';
import { FormControl, InputLabel } from '@mui/material';
import { TASK_STATUS } from '../../constants';
import { FilterDropdownProps } from './types';
import { StatusTypes } from '../../types';

const FilterDropdown: FC<FilterDropdownProps> = React.memo(({filter, setFilter}) => {
  const handleChange = (event: SelectChangeEvent) => {
    setFilter(event.target.value as StatusTypes);
  };

  return (
    <FormControl style={{height: 40, width: 200}}>
        <InputLabel id="filter-by-label">Фильтрация по:</InputLabel>
        <Select
        value={filter}
        onChange={handleChange}
        displayEmpty
        inputProps={{ 'aria-label': 'Filter' }}
        style={{height: 40}}
        labelId='filter-by-label'
        label='Filter by:'
        defaultValue='all'
        >
        <MenuItem value={StatusTypes.all}>
            <span>Все статусы</span>
        </MenuItem>
        {Object.entries(TASK_STATUS).map(([key, {color, label}]) => (
            <MenuItem key={key} value={key}>
            <Chip
                label={label}
                color="primary"
                style={{ backgroundColor: color, marginRight: 8 }}
            />
            </MenuItem>
        ))}
        </Select>
    </FormControl>
  );
});

FilterDropdown.displayName = 'FilterDropdown';
export default FilterDropdown;

import { TextField, InputAdornment, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import React, { FC, useCallback } from 'react';
import { SearchBarProps } from './types';

const SearchBar: FC<SearchBarProps> = React.memo(({searchValue, setSearchValue}) => {
  const handleClear = useCallback(() => {
    setSearchValue('');
  }, [setSearchValue]);

  return (
    <TextField
      id="search-input"
      label="Поиск"
      variant="outlined"
      fullWidth
      size="small"
      value={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      sx={{
        '& .MuiInputBase-root': {padding: 0, paddingLeft: '10px'}
      }}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={handleClear}>
              <ClearIcon />
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
});

SearchBar.displayName = 'SearchBar';
export default SearchBar;

'use client';
import { useState } from "react";
import { 
  Box, 
  Button, 
  IconButton, 
  TextField,
  Card,
  CardActions,
  CardContent,
  Pagination,
  Typography,
  Stack
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';


export function SearchBar({onSearch}) {
  const [value, setValue] = useState('');

  return (
    <Box sx={{display:'flex', flexDirection: 'row', alignItems: 'center'}}>
      <TextField 
        id="search-bar"
        label="Input Query"
        variant="outlined"
        size='small'
        sx={{flexGrow:1}}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => (e.key === 'Enter') && onSearch(value)}
      />
      <Button 
        sx={{ ml: 1, display: { xs: "none", md: "flex" } }}
        variant='contained'
        startIcon={<SearchIcon/>}
        onClick={()=> onSearch(value)}
      >
        Search
      </Button>
      <IconButton
        sx={{ ml:1, display: { xs: "flex", md: "none" } }}
        variant='contained'
        color='primary'
        onClick={()=> onSearch(value)}
      >
        <SearchIcon/>
      </IconButton>
    </Box>
  );
}

export function SearchResult({ items, totalPages, currentPage, onPageChange }){
  return (
    <Box>
      <Stack spacing={2} direction='column' justifyContent='center' sx={{m: 3}}>
        {items.map((item, i) => {
          return <ResultItem key={i} info={item}/>
          })}
      </Stack>
      <Box>
      {items.length > 0 && <Pagination 
        shape='rounded'
        color='secondary'
        count={totalPages}
        onChange={(e, page) => onPageChange(page)}
      />}
      </Box>
    </Box>
  )
}

export function ResultItem({ info }){
  return (
    <Card variant='outlined' >
      <CardContent>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
            {info.user.name}
        </Typography>
        <Typography sx={{ mb: 1.5 }} color="text.secondary">
          {info.user.location}
        </Typography>
        <Typography variant="body2">
          {info.headline}
        </Typography>
    </CardContent>
    </Card>
  )
}
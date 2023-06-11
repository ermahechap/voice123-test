'use client';
import { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import { SearchBar, SearchResult } from "./components/Search";
import axios from "axios";


export default function SearchHome() {
  const initialMount = useRef(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('empty');
  
  useEffect(() => {
    if (initialMount.current){
      initialMount.current = false;
      return;
    }
    console.log('Effect');
    console.log(searchQuery);
    setStatus('loading');
    axios.get('https://api.sandbox.voice123.com/providers/search/',{
      'params': {
        'service': 'voice_over',
        'keywords': searchQuery,
        'page': currentPage
      }
    })
    .then((response) => {
      setData(response.data['providers']);
      setTotalPages(parseInt(response.headers['x-list-total-pages']));
      setCurrentPage(parseInt(response.headers['x-list-current-page']));
      setStatus('loaded');
    })
    .catch((error) => {
      console.log(error);
    })
  }, [searchQuery, currentPage])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SearchBar onSearch={setSearchQuery} />
      </Grid>
      <Grid item xs={12}>
        <SearchResult 
          items={data}
          totalPages={totalPages}
          loadStatus={status}
          searchQuery={searchQuery}
          onPageChange={setCurrentPage}
        />
      </Grid>
    </Grid>
  );
}

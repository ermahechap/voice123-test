'use client';
import { useState, useEffect, useRef } from "react";
import { Grid } from "@mui/material";
import { SearchBar, SearchResult } from "./components/Search";
import axios from "axios";


export default function SearchHome() {
  const initialMount = useRef(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [audioUrls, setAudioUrls] = useState([]);
  const [data, setData] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [status, setStatus] = useState('empty');
  
  // Initial Request
  useEffect(() => {
    if (initialMount.current){
      initialMount.current = false;
      return;
    }
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
      return response.data['providers'];
    })
    .then((data) =>{
      // Because the file url returned by the method wasn't properly formatted
      const sample_ids = data.map((item) => {
        return {provider_id: item.relevant_sample.provider_id, sample_id: item.relevant_sample.id}
      });
      return Promise.all(sample_ids.map((item) => {
        return new Promise((resolve, reject)=>{
          axios.get(`https://voice123.com/api/providers/${item.provider_id}/samples`)
            .then(response => {
              const searchObject = response.data.find((provider) => provider.id === item.sample_id)
              if(searchObject === undefined) resolve('');
              resolve(searchObject.file);
            })
            .catch(error => {reject(new Error(error))});
        })
      }));
    })
    .then((values) => {
      setAudioUrls(values);
      setStatus('loaded');
    })
    .catch((error) => {
      console.log(error);
    })
  }, [searchQuery, currentPage]);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <SearchBar onSearch={setSearchQuery} />
      </Grid>
      <Grid item xs={12}>
      </Grid>
      <Grid item xs={12}>
        <SearchResult 
          items={data}
          audioUrls={audioUrls}
          totalPages={totalPages}
          loadStatus={status}
          searchQuery={searchQuery}
          onPageChange={setCurrentPage}
        />
      </Grid>
    </Grid>
  );
}

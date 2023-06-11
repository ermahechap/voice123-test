'use client';
import { useState } from "react";
import {
  Box,
  Grid,
  Skeleton,
  Button,
  IconButton,
  TextField,
  Card,
  CardHeader,
  CardContent,
  Pagination,
  Typography,
  Stack,
  Avatar
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

export function SearchBar({ onSearch }) {
  const [value, setValue] = useState('');

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
      <TextField
        id="search-bar"
        label="Input Query"
        variant="outlined"
        size='small'
        sx={{ flexGrow: 1 }}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => (e.key === 'Enter') && onSearch(value)}
      />
      <Button
        sx={{ ml: 1, display: { xs: "none", md: "flex" } }}
        variant='contained'
        startIcon={<SearchIcon />}
        onClick={() => onSearch(value)}
      >
        Search
      </Button>
      <IconButton
        sx={{ ml: 1, display: { xs: "flex", md: "none" } }}
        variant='contained'
        color='primary'
        onClick={() => onSearch(value)}
      >
        <SearchIcon />
      </IconButton>
    </Box>
  );
}

function LoadingWrapper({ children, status }) {
  if(status === 'empty') {
    return <Box sx={{display:'flex', justifyContent:'center'}}>
      <Typography variant='h4' color="text.secondary">Make a new Query!</Typography>
    </Box>
  }
  if(status === 'loading') {
    return <Stack spacing={2} direction='column' sx={{ m: 3 }}>
        {Array(5).fill(0).map((_, i) => {return <Skeleton key={i} variant="rectangular" animation='wave' height={150}/>})}
    </Stack>
  }
  if(status === 'loaded') {
    return <Stack spacing={2} direction='column' sx={{ m: 3 }}>{children}</Stack>
  }
}

export function SearchResult({items, totalPages, loadStatus='empty', searchQuery, onPageChange }) {
  
  
  return (
    <Box>
      <LoadingWrapper status={loadStatus}>
        {items.map((item, i) => {
          return <ResultItem key={i} info={item} searchQuery={searchQuery} />
        })}
      </LoadingWrapper>
      {items.length > 0 && <Pagination
        sx={{ '& > *': { justifyContent: 'center', display: 'flex' } }}
        className="pagination"
        shape='rounded'
        color='secondary'
        count={totalPages}
        onChange={(e, page) => onPageChange(page)}
      />}
    </Box>
  )
}

export function ResultItem({ info, searchQuery }) {
  const userProfileURL = `https://voice123.com/${info.user.username}`

  function processDetail(detail, additionalDetail, searchQuery){
    const keywords = searchQuery.split(' ');
    const regex = new RegExp(`(${keywords.join('|')})`, 'gi');

    // Find string match over the defined fields
    const match = [detail, additionalDetail].map((text) => {
      if ((text === undefined) || (text === '')) return null;
      const paragraphs = text.split('.\n');

      let matched_paragraph = null;
      paragraphs.every(paragraph => {
        if (paragraph.length > 0) {
          if (paragraph.match(regex)) {
            matched_paragraph = paragraph;
            return false;
          }
        }
        return true;
      });
      return matched_paragraph;
    }).reduce((acc, cur) => { return acc || cur });
    if (match === null) return 'None';

    // Highlight keywords
    const chunks = []
    let result;
    let last_index = 0;
    while ((result = regex.exec(match)) !== null) {
      chunks.push(match.slice(last_index, result.index));
      chunks.push(<b>{match.slice(result.index, regex.lastIndex)}</b>);
      last_index = regex.lastIndex;
    }
    if(last_index < match.length - 1) {
      chunks.push(match.slice(last_index, match.length));
    }

    return <p>{chunks.map((v) => {return v})}</p>
  }

  return (
    <Card variant='outlined'>
      <CardHeader
        avatar={
          <a href={userProfileURL} target="_blank">
            <Avatar alt={info.user.name} src={info.user.picture_medium}/>
          </a>
        }
        title={
          <Typography component='a' color='text.secondary' href={userProfileURL} target="_blank">
            {info.user.name}
          </Typography>
        }
      />
      <CardContent>
        <Grid container>
          <Grid item md={8} xs={12}>
            <Typography variant='subtitle1'>
              Description:
            </Typography>
            <Typography variant="body2">
              {processDetail(info.summary, info.additional_details, searchQuery)}
            </Typography>
          </Grid>
          <Grid item md={4} xs={12} sx={{padding: 5}}>
            <Typography variant='subtitle1'>
              Sample Audio: {info.relevant_sample.name}
            </Typography>
            <AudioPlayer
              src="https://file-examples.com/storage/fef677cdf46481c8d96f8cd/2017/11/file_example_MP3_700KB.mp3"
              showSkipControls={false}
              showJumpControls={false}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
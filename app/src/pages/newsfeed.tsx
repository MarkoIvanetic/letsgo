import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Button, Card, CardActions, CardContent, CardMedia, Container, Grid, Typography } from '@mui/material'
import { getArticleList } from '@/api'
import { Article } from '@/types'
import { Link } from 'react-router-dom'

export const Newsfeed: React.FC = () => {
    const page = 1

    const { isLoading, isError, error, data = [], status } = useQuery(['news', page], getArticleList)

    if (isLoading) {
        return <span>Loading...</span>
    }

    if (isError) {
        return <span>Error!</span>
    }

    return (
        <Container>
            <Grid container spacing={2}>
                {data.map((article: Article) => {
                    return (
                        <Grid key={article.url} item xs={2} md={4}>
                            <FeedItem data={article}></FeedItem>
                        </Grid>
                    )
                })}
            </Grid>
        </Container>
    )
}

interface FeedItemProps {
    data: Article
}

export const FeedItem: React.FC<FeedItemProps> = ({ data }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia
                component="img"
                height="200"
                image={data.urlToImage || 'https://picsum.photos/340/200'}
                alt={data.title}
            />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {data.title}
                </Typography>
                <Typography variant="body2" color="text.secondary"></Typography>
            </CardContent>
            <CardActions>
                <Button variant="contained" size="small">
                    Share
                </Button>
                <Link to={data.slug}>Open</Link>
            </CardActions>
        </Card>
    )
    // return (
    //     <Grid container spacing={2}>
    //         <Grid item xs={12}>
    //             <h2 key={data.url}>{data.title}</h2>
    //         </Grid>
    //     </Grid>
    // )
}

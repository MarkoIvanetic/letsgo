import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Container, Grid } from '@mui/material'
import { getNewsData } from '@/api'

interface Article {
    title: string
    url: string
}

export const Newsfeed: React.FC = () => {
    const page = 1

    const { isLoading, isError, error, data = [], status } = useQuery(['news', page], getNewsData)

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
                        <Grid key={article.url} item xs={8}>
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
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <h2 key={data.url}>{data.title}</h2>
            </Grid>
        </Grid>
    )
}

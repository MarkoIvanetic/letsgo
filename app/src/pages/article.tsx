import React from 'react'
import { useQuery } from 'react-query'
import { Container, Grid, Typography } from '@mui/material'
import { getArticle } from '@/api'
import { useParams } from 'react-router-dom'

export const Article: React.FC = () => {
    const { slug = '' } = useParams()

    const { isLoading, data } = useQuery(['news', slug], () => getArticle(slug))

    if (isLoading || !data) {
        return (
            <Grid container rowSpacing={2} sx={{ mx: 'auto' }}>
                <span>Loading...</span>
            </Grid>
        )
    }

    return (
        <Container fixed>
            <Grid container rowSpacing={2} sx={{ mx: 'auto' }}>
                <Grid item xs={12}>
                    <img
                        width={'100%'}
                        src={data.urlToImage || 'https://picsum.photos/340/200'}
                        alt={data.title}
                        loading="lazy"
                    />
                </Grid>
                <Grid item xs={12}>
                    <Typography gutterBottom variant="h3" component="div">
                        {data.title}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                        {data.description}
                    </Typography>
                </Grid>
                <Grid item xs={12}>
                    <Typography variant="body1" color="text.secondary">
                        {data.content}
                    </Typography>
                </Grid>
            </Grid>
        </Container>
    )
}

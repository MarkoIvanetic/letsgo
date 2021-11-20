import React from 'react'
import { useQuery } from 'react-query'
import { Card, CardContent, CardMedia, Typography } from '@mui/material'
import { getNewsData } from '@/api'
import { useLocation } from 'react-router'

export const Article: React.FC = () => {
    const location = useLocation()

    const pathname = location.pathname.replace('news/', '')

    console.log(pathname)

    const { isLoading, isError, error, data: allArticles = [], status } = useQuery(['news'], getNewsData)

    const data = allArticles[0]

    if (isLoading) {
        return <span>Loading...</span>
    }

    return (
        <Card sx={{ maxWidth: 645 }}>
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
                <Typography variant="body2" color="text.secondary">
                    {data.description}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    {data.content}
                </Typography>
            </CardContent>
        </Card>
    )
}

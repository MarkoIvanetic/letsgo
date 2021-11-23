import React from 'react'
import { useQuery } from 'react-query'
import { Grid, Typography } from '@mui/material'
import { getArticle } from '@/api'
import { useLocation } from 'react-router'

export const Article: React.FC = () => {
    const location = useLocation()

    const pathname: string = location.pathname.split('/').pop() || ''

    const { isLoading, data } = useQuery(['news', pathname], () => getArticle(pathname))

    if (isLoading || !data) {
        return (
            <Grid container rowSpacing={2} sx={{ mx: 'auto' }} xs={12} sm={10} lg={8}>
                <span>Loading...</span>
            </Grid>
        )
    }

    return (
        <Grid container rowSpacing={2} sx={{ mx: 'auto' }} xs={12} sm={10} lg={8}>
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
    )

    // return (
    //     <Card sx={{ maxWidth: 645 }}>
    //         <CardMedia
    //             component="img"
    //             height="200"
    //             image={data.urlToImage || 'https://picsum.photos/340/200'}
    //             alt={data.title}
    //         />
    //         <CardContent>
    //             <Typography gutterBottom variant="h5" component="div">
    //                 {data.title}
    //             </Typography>
    //             <Typography variant="body2" color="text.secondary">
    //                 {data.description}
    //             </Typography>
    //             <Typography variant="body1" color="text.secondary">
    //                 {data.content}
    //             </Typography>
    //         </CardContent>
    //     </Card>
    // )
}

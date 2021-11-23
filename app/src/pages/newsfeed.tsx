import React from 'react'
import { useQuery } from 'react-query'
import {
    Button,
    Card,
    CardActions,
    CardContent,
    CardMedia,
    Container,
    Grid,
    Pagination,
    Stack,
    Typography
} from '@mui/material'
import { getArticleList } from '@/api'
import { Article } from '@/types'
import { useSearchParams } from '@/hooks'
import { Link } from 'react-router-dom'

export const Newsfeed: React.FC = () => {
    const { params, setSearchParams } = useSearchParams()

    const { isLoading, isError, data } = useQuery(['news', params], () => getArticleList(params))

    const onPaginationChange = (e: React.ChangeEvent<unknown>, page: number): void => {
        setSearchParams({ ...params, page: page.toString() })
    }

    if (isLoading) {
        return (
            <Container fixed>
                <span>Loading...</span>
            </Container>
        )
    }

    if (isError) {
        return <span>Error!</span>
    }

    return (
        <Container fixed>
            <Grid container spacing={2}>
                {data?.articles.map((article: Article) => {
                    return (
                        <Grid key={article.url} item xs={12} md={6} lg={4} xl={3}>
                            <FeedItem data={article}></FeedItem>
                        </Grid>
                    )
                })}
            </Grid>
            {data?.totalResults && data?.totalResults > 0 ? (
                <Stack spacing={2} sx={{ pt: '16px' }}>
                    <Pagination
                        page={+params.page || 1}
                        color="primary"
                        count={Math.ceil(data?.totalResults / 20)}
                        onChange={onPaginationChange}
                        variant="outlined"
                        shape="rounded"
                    />
                </Stack>
            ) : null}
        </Container>
    )
}

interface FeedItemProps {
    data: Article
}

export const FeedItem: React.FC<FeedItemProps> = ({ data }) => {
    return (
        <Card sx={{ maxWidth: 345 }}>
            <CardMedia component="img" height="200" image={data.urlToImage} alt={data.title} />
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
                <Button component={Link} to={data.slug} variant="contained" size="small" sx={{ marginLeft: '10px' }}>
                    Open
                </Button>
            </CardActions>
        </Card>
    )
}

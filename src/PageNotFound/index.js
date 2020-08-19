import React from 'react'
import { Button, Container, Grid, Paper, Typography } from '@material-ui/core'

const PageNotFound = () => {
    return (
        <Container maxWidth="md">
            <Paper elevation={2}>
                <Grid container>
                    <Grid
                        item
                        container
                        xs={12}
                        justify="center"
                    >
                        <Typography
                            variant="h1"
                            align="center"
                            color="textPrimary"
                        >
                            404 ¯\_(ツ)_/¯
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        container
                        xs={12}
                        justify="center"
                    >
                        <section id="404Content">
                            <Grid xs={10}>
                                <Typography
                                    variant="h3"
                                    gutterBottom
                                >
                                    Oh no! We could not find what you are
                                    looking for..
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    display="inline"
                                >
                                    Its probably best to go back and&nbsp;
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    display="inline"
                                >
                                    try again
                                </Typography>
                                <Typography
                                    variant="subtitle2"
                                    display="inline"
                                >
                                    ..&nbsp;
                                </Typography>
                            </Grid>
                        </section>
                    </Grid>
                    <Grid
                        item
                        container
                        xs={12}
                        justify="center"
                    >
                        <Grid
                            item
                            xs={6}
                            container
                            justify="space-around"
                        >
                            <>
                                <Button
                                    label="Dashboard"
                                    name="goHome"
                                    variant="contained"
                                    color="primary"
                                    onClick={() => console.log('/dashboard')}
                                />
                            </>
                        </Grid>
                    </Grid>
                </Grid>
            </Paper>
        </Container>
    )
}

export default PageNotFound

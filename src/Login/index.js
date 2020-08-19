/* eslint-disable camelcase */
import React from 'react'
import { Button,
    Container,
    TextField,
    Grid,
    Paper,
    Typography } from '@material-ui/core'
import useStyles from './index.styles'
import axios from 'axios'
const Login = () => {
    /*const {
        actions: { login },
        state: { loggingIn },
    } = useBasicAuth()*/
    const classes = useStyles()
const loggingIn = false
const login = (data) => {
    console.log(data)
}
    return (
                <Container
                    maxWidth="xs"
                    disableGutters
                >
                    <Paper
                        elevation={2}
                        className={classes.papier}
                    >
                        <Grid
                            item
                            container
                            spacing={0}
                            justify="flex-end"
                            alignItems="flex-end"
                        >
                            <form
                                onSubmit={login}
                            >
                                <div className={classes.form}>
                                    <div className={classes.centered}>
                                        <Typography variant="caption" gutterBottom>
                                            Im just a PoC to test new cookies bruh
                                        </Typography>
                                        <TextField
                                            label="Username"
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            fullWidth
                                            id="username"
                                            name="username"
                                            autoComplete="username"
                                            disabled={loggingIn}
                                            required
                                        />
                                        <br />
                                        <TextField
                                            label="Password"
                                            name="password"
                                            type="password"
                                            size="small"
                                            autoComplete="current-password"
                                            fullWidth
                                            disabled={loggingIn}
                                        />

                                    </div>
                                    <div className={classes.actions}>
                                        <Button
                                            type="submit"
                                            label={
                                                loggingIn ? (
                                                    <Loader
                                                        relative
                                                        size={1}
                                                    />
                                                ) : (
                                                    'LOGIN'
                                                )
                                            }
                                            name="submit"
                                            color="primary"
                                            variant="contained"
                                            disabled={loggingIn}
                                        >SUBMIT</Button>
                                    </div>
                                </div>
                            </form>
                        </Grid>
                        <div className={classes.copyright}>
                            <Typography variant="caption">
                                Copyright ©2020 ABF Informatik AG
                            </Typography>
                        </div>
                    </Paper>
                </Container>
    )
}

export default Login

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
import storageHandler from '../storageHandler'

const Login = () => {
    /*const {
        actions: { login },
        state: { loggingIn },
    } = useBasicAuth()*/
    console.log(storageHandler)
    const classes = useStyles()
const loggingIn = false
const login = (e) => {
    console.log(e)
e.preventDefault()

    axios.post('https://osxdev.abf.local:443/api/login', {
        username: 'dfeger',
        password: 'manager'
      })
      .then(function (response) {
        console.log(response)
        storageHandler.set('cubelineToken', response.data.accessToken , +response.data.expires)

      })
      .catch(function (error) {
        console.log(error)
      })
      console.log(storageHandler.get('cubelineToken'))
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

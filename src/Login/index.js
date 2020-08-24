/* eslint-disable camelcase */
import React from "react";
import {
  Button,
  Container,
  TextField,
  Grid,
  Paper,
  Typography,
} from "@material-ui/core";
import useStyles from "./index.styles";
import axios from "axios";
import storageHandler from "../storageHandler";

const Login = () => {
  /*const {
        actions: { login },
        state: { loggingIn },
    } = useBasicAuth()*/
  console.log(storageHandler);
  const classes = useStyles();
  const loggingIn = false;
  storageHandler.set(
    "bensToken",
    "ben ishc recht geil man",
    1440,
    "Secure; SameSite=Strict"
  );

  console.log(storageHandler.get("cubelineToken"));

  const login = (e) => {
    console.log(e);
    e.preventDefault();
    //login then orgs then env

    axios
      .post("https://osxdev.abf.local:443/api/login", {
        username: "dfeger",
        password: "manager",
      })
      .then((response) => {
        storageHandler.set(
          "cubelineToken",
          response.data.accessToken,
          +response.data.expires,
          "Secure; SameSite=Strict"
        );

        console.log(storageHandler.get("cubelineToken"));

        axios
          .get("https://osxdev.abf.local:443/api/env/orgs", {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${response.data.accessToken}`,
            },
          })
          .then((response) => {
            console.log(response);
            storageHandler.set("orgs", response.data);

            axios
              .post(
                "https://osxdev.abf.local:443/api/env",
                {
                  orgId: 12,
                  isRest: false,
                },
                {
                  headers: {
                    Authorization: `Bearer ${storageHandler.get(
                      "cubelineToken"
                    )}`,
                  },
                }
              )
              .then((response) => {
                console.log(response);
                storageHandler.set("env", response.data);
              })
              .catch((error) => {
                console.log(error);
              });
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Container maxWidth="xs" disableGutters>
      <Paper elevation={2} className={classes.papier}>
        <Grid
          item
          container
          spacing={0}
          justify="flex-end"
          alignItems="flex-end"
        >
          <form onSubmit={login}>
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
                  label={loggingIn ? <Loader relative size={1} /> : "LOGIN"}
                  name="submit"
                  color="primary"
                  variant="contained"
                  disabled={loggingIn}
                >
                  SUBMIT
                </Button>
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
  );
};

export default Login;

import React, { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useHistory } from "react-router-dom";
import axios from "axios";
import TextField from "@mui/material/TextField";
import { message } from "antd";
import { Layout } from "antd";
import { useStyles } from "../Components/Styles";

import VisibilityIcon from "@material-ui/icons/Visibility";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import { InputAdornment } from "@material-ui/core";
const { Footer } = Layout;
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" target="_blank" href="https://smartiam.in/">
        SmartIam
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const theme = createTheme();
const SignInSide = () => {
  const classes = useStyles();
  const [hidePassword, setHidePassWord] = useState(true);
  const history = useHistory();
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const signUpDetails = {
      username: data.get("userName"),
      password: data.get("password"),
    };
    axios
      .post("/auth", signUpDetails)
      .then((response) => {
        localStorage.setItem("JWTtoken", response.data.token);
        try {
          window.location.href = history.location.state.from;
        } catch (error) {
          window.location.href = "/";
        }
      })
      .catch((err) => {
        try {
          message.error([err.response.data.detail]);
        } catch (error1) {
          message.error("Backend server not responding");
        }
      });
  };
  console.log(process.env.REACT_APP_VERSION)
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: "url(Frame7.png)",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "#000000" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Login
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                label="Username"
                name="userName"
                autoComplete="email"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                // type="password"
                type={hidePassword ? "password" : "text"}
                // onChange={(e) => {
                //   setPassword(e.target.value);
                // }}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {hidePassword ? (
                        <VisibilityOffIcon
                          className={classes.showPassword}
                          onClick={() => {
                            setHidePassWord(false);
                          }}
                        />
                      ) : (
                        <VisibilityIcon
                          className={classes.showPassword}
                          onClick={() => {
                            setHidePassWord(true);
                          }}
                        />
                      )}
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                style={{ backgroundColor: "#000000" }}
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Login
              </Button>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
          <Footer style={{ position: "fixed", bottom: 0, marginLeft: "220px" }}>
            Version:{process.env.REACT_APP_VERSION}
            {/* console.log() */}
          </Footer>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};
export default SignInSide;

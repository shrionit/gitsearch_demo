import React from "react";
import {
  createMuiTheme,
  ThemeProvider,
  makeStyles,
  AppBar,
  Toolbar,
  Typography,
  Paper,
  IconButton,
  CssBaseline,
  Grid,
  Snackbar,
  List,
  ListItem,
} from "@material-ui/core";
import SearchBox from "./components/searchbox";
import MenuIcon from "@material-ui/icons/Menu";
import CloseIcon from "@material-ui/icons/Close";
import GitHubIcon from "@material-ui/icons/GitHub";
import api from "./api";
import UserView from "./components/userview";

const API = api();

const lydiaTheme = createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      light: "#7986cb",
      main: "#bf5f3f",
      dark: "#303f9f",
      contrastText: "#fff",
    },
    text: {
      primary: "#fefefe",
    },
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  appBar: {
    position: "relative",
  },
  layout: {
    width: "auto",
    marginLeft: theme.spacing(2),
    marginRight: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(2) * 2)]: {
      width: 600,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    [theme.breakpoints.up(600 + theme.spacing(3) * 2)]: {
      marginTop: theme.spacing(6),
      marginBottom: theme.spacing(6),
      padding: theme.spacing(3),
    },
    width: "auto",
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: "flex",
    justifyContent: "flex-end",
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
}));

export default function Lydia() {
  const classes = useStyles(lydiaTheme);

  const [open, setOpen] = React.useState(false);
  const [feedBack, setFeedBack] = React.useState("");
  const [gitUsers, addGitUsers] = React.useState({});

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  function feedBackHandler(msg) {
    setOpen(true);
    setFeedBack(msg);
    console.log(feedBack, open);
  }

  React.useEffect(() => {
    const oldData = JSON.parse(localStorage.getItem("gitUsers") || "{}");
    console.log(oldData);
    if (Object.keys(oldData).length > 0) {
      addGitUsers(oldData);
    }
    return () => {
      localStorage.clear();
    };
  }, [addGitUsers]);

  function addUser(user) {
    let gitusers = localStorage.getItem("gitUsers") || "";

    gitusers = gitusers ? JSON.parse(gitusers) : {};

    gitusers[user.login] = user;

    fetch(API.ENDPOINTS.USER_REPO(user.login))
      .then((d) => d.json())
      .then((d) => {
        if (d.length > 5) gitusers[user.login].repos = d.slice(0, 5);
        else gitusers[user.login].repos = d;
        localStorage.setItem("gitUsers", JSON.stringify(gitusers));
        addGitUsers({ ...gitUsers, ...gitusers });
      });
    return true;
  }

  function delUser(user) {
    if (user.login in gitUsers) {
      if (delete gitUsers[user.login]) {
        localStorage.setItem("gitUsers", JSON.stringify(gitUsers));
        addGitUsers({ ...gitUsers });
        return true;
      }
    }
    return false;
  }

  function genList(ulist) {
    const out = Object.values(ulist).map((u) => {
      return (
        <ListItem key={u.node_id}>
          <UserView
            user={u}
            repos={u.repos}
            feedBack={feedBackHandler}
            delUser={delUser}
          />
        </ListItem>
      );
    });
    return out;
  }

  return (
    <ThemeProvider theme={lydiaTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              edge="start"
              className={classes.menuButton}
              color="inherit"
              aria-label="menu"
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" className={classes.title}>
              GitSearch
            </Typography>
            <IconButton
              color="inherit"
              onClick={() => window.open("https://www.github.com")}
            >
              <GitHubIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
        <main className={classes.layout}>
          <Paper className={classes.paper}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <SearchBox
                  onAddUser={addUser}
                  onDelUser={delUser}
                  feedBack={feedBackHandler}
                />
              </Grid>
            </Grid>
          </Paper>
          <Paper className={classes.paper}>
            <List>{genList(gitUsers)}</List>
          </Paper>
        </main>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        open={open}
        autoHideDuration={700}
        onClose={handleClose}
        message={`User ${feedBack} successfully`}
        action={
          <React.Fragment>
            <IconButton
              size="small"
              aria-label="close"
              color="inherit"
              onClick={handleClose}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </React.Fragment>
        }
      />
    </ThemeProvider>
  );
}

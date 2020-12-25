import React from "react";
import api from "../api";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Card,
  CardContent,
  CardHeader,
  Grid,
  GridList,
  GridListTile,
  IconButton,
  makeStyles,
  Modal,
  Typography,
} from "@material-ui/core";

import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityIcon from "@material-ui/icons/Visibility";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
const API = api();

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 600,
    height: 500,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  gridList: {
    width: 500,
    height: 150,
  },
  gridListTile: {
    height: 50,
    padding: 0,
  },
}));

export default function UserView(props) {
  const classes = useStyles();
  const [user, setUser] = React.useState({});
  const [openModal, setOpenModal] = React.useState(false);

  const handleModalOpen = () => {
    setOpenModal(true);
  };

  const handleModalClose = () => {
    setOpenModal(false);
  };

  React.useEffect(() => {
    if (Object.keys(user).length === 0) {
      (async () => {
        const response = await fetch(API.ENDPOINTS.USER_INFO(props.user.login));
        const userinfo = await response.json();
        console.log(userinfo);
        if (userinfo) {
          userinfo.repos = props.repos;
          setUser(userinfo);
        }
      })();
    }
  });

  function genModalBody() {
    const u = user;
    return (
      <div
        className={classes.paper}
        style={{
          top: `50%`,
          left: `50%`,
          transform: `translate(-50%, -50%)`,
        }}
      >
        <Card style={{ height: 400 }}>
          <CardHeader
            avatar={
              <Avatar
                variant="rounded"
                src={u.avatar_url}
                alt={u.login}
                style={{ width: 100, height: 100 }}
              ></Avatar>
            }
            action={
              <Grid container direction="column">
                <Grid item style={{ marginTop: "20px" }}>
                  <Typography variant="body1">
                    Followers: {u.followers}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body1">
                    Following: {u.following}
                  </Typography>
                </Grid>
              </Grid>
            }
            title={
              <Typography>
                {user.name}
                <br />@{user.login}
                <Typography variant="body1">{u.location}</Typography>
              </Typography>
            }
            subheader={user.bio}
          />
          <CardContent>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="repo-content"
                id="repo-header"
              >
                <Typography>Repositories</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <GridList
                  cellHeight={160}
                  className={classes.gridList}
                  cols={1}
                >
                  {props.repos.map((r) => (
                    <GridListTile
                      key={r.id}
                      cols={1}
                      style={{
                        height: "auto",
                        borderLeft: "3px solid green",
                        borderRadius: "2px",
                        marginBottom: "5px",
                        paddingLeft: "10px",
                      }}
                    >
                      <Grid container>
                        <Grid item xs="10">
                          <Typography variant="body2">{r.name}</Typography>
                          <Typography variant="caption" color="textSecondary">
                            {r.full_name}
                          </Typography>
                        </Grid>
                        <Grid item xs="2">
                          <IconButton
                            onClick={() => {
                              window.open(r.html_url);
                            }}
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </GridListTile>
                  ))}
                </GridList>
              </AccordionDetails>
            </Accordion>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card>
          <CardHeader
            avatar={
              <Avatar
                variant="rounded"
                src={user.avatar_url}
                alt={user.login}
                style={{ width: 100, height: 100 }}
              ></Avatar>
            }
            action={
              <Grid container spacing={2} direction="column">
                <Grid item xs={6}>
                  <IconButton aria-label="view" onClick={handleModalOpen}>
                    <VisibilityIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={6}>
                  <IconButton
                    aria-label="delete"
                    onClick={() => {
                      if (props.delUser(user)) {
                        props.feedBack("deleted");
                      }
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            }
            title={
              <Typography>
                {user.name}
                <br />@{user.login}
              </Typography>
            }
            subheader={user.bio}
          />
        </Card>
      </Grid>
      <Modal
        open={openModal}
        onClose={handleModalClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description"
      >
        {genModalBody()}
      </Modal>
    </Grid>
  );
}

import React from "react";
import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import AddIcon from "@material-ui/icons/Add";
import DeleteIcon from "@material-ui/icons/Delete";

export default function SearchResult(props) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <List>
            <ListItem>
              <ListItemAvatar>
                <Avatar
                  alt={props.option.login}
                  src={props.option.avatar_url}
                ></Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={"@" + props.option.login}
                secondary={props.option.html_url}
              />
            </ListItem>
            <ListItemSecondaryAction>
              {props.check(props.option.login) ? (
                <IconButton
                  onClick={() => {
                    if (props.onDelUser(props.option)) {
                      props.feedBack("deleted");
                    }
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => {
                    if (props.onAddUser(props.option)) {
                      props.feedBack("added");
                    }
                  }}
                >
                  <AddIcon />
                </IconButton>
              )}
            </ListItemSecondaryAction>
          </List>
        </Grid>
      </Grid>
    </>
  );
}

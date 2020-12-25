import React from "react";
import api from "../api";
import { CircularProgress, TextField } from "@material-ui/core";

import Autocomplete from "@material-ui/lab/Autocomplete";
import SearchResult from "./searchresult";
const API = api();

export default function Asynchronous(props) {
  const [open, setOpen] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  let loading = open && users.length === 0;
  const [inputValue, setInputValue] = React.useState("");

  function getUsers() {
    fetch(
      API.ENDPOINTS.USER_SEARCH +
        "?" +
        new URLSearchParams({
          q: inputValue,
        })
    )
      .then((d) => d.json())
      .then((searchResult) => {
        if (searchResult.items) {
          setUsers(searchResult.items);
        }
      });
  }

  function handleSearchTextChange(newText) {
    setInputValue(newText);
    if (newText && newText.length > 1) {
      if (newText.length % 2 === 0) {
        getUsers();
      }
    }
  }

  function checkIfUserAlreadyAdded(user) {
    const obj = localStorage.getItem("gitUsers") || "{}";
    const truth = user in JSON.parse(obj);
    return truth;
  }

  return (
    <div style={{ display: "flex" }}>
      <Autocomplete
        id="searchbox"
        color="secondary"
        fullWidth={true}
        open={open}
        noOptionsText="User not found"
        onOpen={() => {
          setOpen(true);
        }}
        onClose={() => {
          setOpen(false);
        }}
        onInputChange={(event, newInputValue) => {
          handleSearchTextChange(newInputValue);
        }}
        getOptionSelected={(option, value) => option.login === value.name}
        getOptionLabel={(users) => users.login}
        options={users}
        loading={loading}
        renderOption={(option, state) => {
          return (
            <React.Fragment>
              <SearchResult
                option={option}
                onDelUser={props.onDelUser}
                onAddUser={props.onAddUser}
                check={checkIfUserAlreadyAdded}
                feedBack={props.feedBack}
              />
            </React.Fragment>
          );
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="users"
            variant="outlined"
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <React.Fragment>
                  {loading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </React.Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
}

import { makeStyles } from "@material-ui/core";

const useTodoStyles = makeStyles({
  root: {
    display: "flex",
    width: "100%",
  },
  underline: {
    "&&&:before": {
      borderBottom: "none",
    },
  },
  textFeild: {
    padding: "10px 0px 7px",
  },
  subtitle1: {
    textDecorationLine: "line-through",
    textDecorationStyle: "solid",
    padding: "10px 0px 7px",
  },
  accordion: {
    boxShadow: "none",
    borderTop: "1px solid black",
    marginTop: "20px",
  },
  accordionDetails: {
    display: "block",
    paddingLeft: "0px",
  },
  accordionSummary: {
    paddingLeft: "4.2%",
  },
  closeIcon: {
    margin: "10px 0px 7px",
    cursor: "pointer",
  },
  plusIcon: {
    margin: "5px 10px 0px 8px",
  },
  list: {
    listStyleType: "none",
  },
});

export default useTodoStyles;

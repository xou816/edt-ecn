import React from "react";
import {connect} from 'react-redux';
import {getRecent} from "../../app/actions";
import List from "@material-ui/core/List/List";
import ListItem from "@material-ui/core/ListItem/ListItem";
import ListItemText from "@material-ui/core/ListItemText/ListItemText";
import {Link} from "react-router-dom";
import History from '@material-ui/icons/History';
import ListItemIcon from "@material-ui/core/ListItemIcon/ListItemIcon";
import Paper from "@material-ui/core/Paper/Paper";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import {T} from "../Translation";

@connect(state => ({
    recent: state.app.history
}), dispatch => ({
    getRecent: () => dispatch(getRecent())
}))
@withStyles(theme => ({
    title: {
        padding: `${theme.spacing.unit}px ${2 * theme.spacing.unit}px`
    }
}))
export default class extends React.Component {

    componentDidMount() {
        let {getRecent} = this.props;
        getRecent();
    }

    render() {
        let {recent, classes, className} = this.props;
        return recent.length > 0 ? (
            <Paper className={className}>
                <Typography className={classes.title} variant="subtitle2"><T.RecentlyViewed/></Typography>
                <List dense>
                    {recent.map(entry => (
                        <ListItem key={entry.id} component={Link} to={'/'+entry.id+'/today'} button>
                            <ListItemIcon><History/></ListItemIcon>
                            <ListItemText primary={entry.name}/>
                        </ListItem>
                    ))}
                </List>
            </Paper>
        ) : null;
    }
}
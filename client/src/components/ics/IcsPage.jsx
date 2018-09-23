import React from "react";
import {Page, PageContent} from "../Page";
import {Nav} from "../Nav";
import {IconButton, InputAdornment, Paper, TextField, Typography, withStyles} from "@material-ui/core";
import copy from "copy-to-clipboard";
import Copy from "@material-ui/icons/FileCopy";

@withStyles(theme => ({
    paper: {
        margin: `${2 * theme.spacing.unit}px auto`,
        maxWidth: '60%',
        height: 'auto',
        paddingTop: theme.spacing.unit,
        [theme.breakpoints.down(1024)]: {
            maxWidth: '100%',
            margin: `${2 * theme.spacing.unit}px ${theme.spacing.unit}px`,
        }
    },
    margin: {
        margin: `${theme.spacing.unit}px ${3 * theme.spacing.unit}px`
    },
}))
export default class extends React.Component {

    get calendar() {
        return this.props.match.params.calendar;
    }

    get link() {
        return `${process.env.PUBLIC}/api/calendar/custom/${this.calendar}.ics`;
    }

    copy() {
        copy(this.link);
    }

    render() {
        let {classes} = this.props;
        return (
            <Page>
                <Nav><Typography color="inherit" variant="subheading">Exporter le calendrier</Typography></Nav>
                <PageContent>
                    <Paper className={classes.paper}>
                        <Typography variant="subheading" className={classes.margin} gutterBottom>
                            Copiez ce lien dans votre application de calendrier préférée.
                        </Typography>
                        <TextField variant="outlined" value={this.link} className={classes.margin} InputProps={{
                            endAdornment: (<InputAdornment position="end">
                                <IconButton onClick={() => this.copy()}><Copy/></IconButton>
                            </InputAdornment>),
                        }}/>
                    </Paper>
                </PageContent>
            </Page>
        )
    }
}
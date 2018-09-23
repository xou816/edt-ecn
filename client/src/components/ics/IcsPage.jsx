import React from "react";
import {Page, PageContent} from "../Page";
import {Nav} from "../Nav";
import {IconButton, InputAdornment, Paper, List, ListItem, TextField, Typography, withStyles} from "@material-ui/core";
import copy from "copy-to-clipboard";
import Copy from "@material-ui/icons/FileCopy";
import {Link} from "react-router-dom";
import Back from "@material-ui/icons/ArrowBack";

@withStyles(theme => ({
    paper: {
        margin: `${2 * theme.spacing.unit}px auto`,
        maxWidth: '60%',
        height: 'auto',
        padding: 3 * theme.spacing.unit,
        [theme.breakpoints.down(1024)]: {
            maxWidth: '100%',
            margin: `${2 * theme.spacing.unit}px ${theme.spacing.unit}px`,
        }
    },
    marginTop: {
        marginTop: 4*theme.spacing.unit
    }
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
        const endAdornment = (
            <InputAdornment position="end">
                <IconButton onClick={() => this.copy()}><Copy/></IconButton>
            </InputAdornment>
        );
        return (
            <Page>
                <Nav>
                    <IconButton component={Link} to={'/'+this.calendar} color="inherit">
                        <Back/>
                    </IconButton>
                    <Typography color="inherit" variant="subheading">Exporter le calendrier</Typography>
                </Nav>
                <PageContent>
                    <Paper className={classes.paper}>
                        <Typography variant="title" gutterBottom>
                            Calendrier ICS
                        </Typography>
                        <Typography variant="subheading" gutterBottom>
                            Copiez ce lien dans votre application de calendrier préférée.
                        </Typography>
                        <TextField variant="outlined"
                                   fullWidth
                                   value={this.link}
                                   InputProps={{endAdornment}}/>
                        <Typography variant="title" gutterBottom className={classes.marginTop}>
                            Instructions
                        </Typography>
                        <Typography variant="subheading" gutterBottom>
                            Dans Google Agenda, cliquez sur le {<IconButton size="small">+</IconButton>} au dessus de vos agendas, et choisissez "À partir de l'URL". Copiez alors l'URL ci-dessus.
                        </Typography>
                       </Paper>
                </PageContent>
            </Page>
        )
    }
}
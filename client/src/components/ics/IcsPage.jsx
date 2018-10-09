import React from "react";
import {Page, PageContent} from "../Page";
import {Nav} from "../Nav";
import copy from "copy-to-clipboard";
import {Link} from "react-router-dom";
import Copy from "@material-ui/icons/FileCopy";
import OpenInNew from "@material-ui/icons/OpenInNew";
import Back from "@material-ui/icons/ArrowBack";
import withStyles from "@material-ui/core/styles/withStyles";
import InputAdornment from "@material-ui/core/InputAdornment/InputAdornment";
import IconButton from "@material-ui/core/IconButton/IconButton";
import Tooltip from "@material-ui/core/Tooltip/Tooltip";
import Typography from "@material-ui/core/Typography/Typography";
import TextField from "@material-ui/core/TextField/TextField";
import Paper from "@material-ui/core/Paper/Paper";
import Button from "@material-ui/core/Button/Button";

@withStyles(theme => ({
    paper: {
        width: 'auto',
        padding: 3 * theme.spacing.unit,
        margin: `${2 * theme.spacing.unit}px 0`,
    },
    marginTop: {
        marginTop: 4 * theme.spacing.unit
    },
    main: {
        margin: `0 auto`,
        padding: 2 * theme.spacing.unit,
        width: '60%',
        [theme.breakpoints.down(1024)]: {
            width: `100%`,
            margin: 0,
        }
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
                <IconButton onClick={() => this.copy()}>
                    <Tooltip title="Cliquer pour copier"><Copy/></Tooltip>
                </IconButton>
            </InputAdornment>
        );
        return (
            <Page>
                <Nav>
                    <IconButton component={Link} to={'/' + this.calendar} color="inherit">
                        <Back/>
                    </IconButton>
                    <Typography color="inherit" variant="subtitle1">Exporter le calendrier</Typography>
                </Nav>
                <PageContent className={classes.main} orientation="column">
                    <TextField variant="filled"
                               label="Calendrier ICS"
                               fullWidth
                               value={this.link}
                               InputProps={{endAdornment}}/>
                    <Paper elevation={1} className={classes.paper}>
                        <Typography variant="title" gutterBottom>
                            Instructions (Google Agenda)
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            Cliquez sur le "+" au dessus de vos agendas, et choisissez "À partir de
                            l'URL". Copiez alors l'URL ci-dessus.
                        </Typography>
                        <Button size="small" href="https://calendar.google.com/calendar/r">Google Agenda <OpenInNew fontSize="small"/></Button>
                    </Paper>
                </PageContent>
            </Page>
        )
    }
}
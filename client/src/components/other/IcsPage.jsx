import React from "react";
import {Page, PageContent} from "../Page";
import {Nav} from "../Nav";
import copy from "copy-to-clipboard";
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
import {T} from "../Translation";
import {withRouter} from "react-router";
import {linkToCalendar} from "../../app/event";

@withRouter
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
        [theme.breakpoints.down(993)]: {
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
        return linkToCalendar(this.calendar) + '.ics';
    }

    copy() {
        copy(this.link);
    }

    render() {
        let {classes, history} = this.props;
        const endAdornment = (
            <InputAdornment position="end">
                <IconButton onClick={() => this.copy()}>
                    <Tooltip title={<T.ClickToCopy/>}><Copy/></Tooltip>
                </IconButton>
            </InputAdornment>
        );
        return (
            <Page>
                <Nav>
                    <IconButton onClick={() => history.goBack()} color="inherit">
                        <Back/>
                    </IconButton>
                    <Typography color="inherit" variant="subtitle1"><T.ExportCalendar/></Typography>
                </Nav>
                <PageContent className={classes.main} orientation="column">
                    <TextField variant="filled"
                               label={<T.IcsCalendar/>}
                               fullWidth
                               value={this.link}
                               InputProps={{endAdornment}}/>
                    <Paper elevation={1} className={classes.paper}>
                        <Typography variant="h6" gutterBottom>
                            <T.Instructions/>
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <T.DetailedInstructions/>
                        </Typography>
                        <Button size="small" href={"https://calendar.google.com/calendar/r?cid=" + this.link}>Google Agenda <OpenInNew fontSize="small"/></Button>
                    </Paper>
                </PageContent>
            </Page>
        )
    }
}
import React from "react";
import {Button, Dialog, DialogTitle, IconButton, InputAdornment, TextField, Typography, withStyles} from "material-ui";
import Reply from "material-ui-icons/Reply";
import Copy from "material-ui-icons/ContentCopy";
import {history} from "../index";

@withStyles(theme => ({
    btn: {
        position: 'fixed',
        bottom: theme.spacing.unit,
        right: theme.spacing.unit
    },
    margin: {
        margin: 2*theme.spacing.unit
    }
}))
export class ExportButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDialog: false
        }
    }

    calendar() {
        return history.location.pathname.substring(1);
    }

    disabled() {
        return this.calendar().length === 0;
    }

    link() {
        return `${window.location.protocol}//${window.location.host}/api/calendar/custom/${this.calendar()}.ics`;
    }

    toggleDialog() {
        return !this.disabled() ?
            () => this.setState({showDialog: !this.state.showDialog}) :
            () => {};
    }

    render() {
        return (
            <React.Fragment>
                <Button disabled={this.disabled()} onClick={this.toggleDialog()} variant="fab" color="secondary"
                        className={this.props.classes.btn}>
                    <Reply/>
                </Button>
                <Dialog open={this.state.showDialog} onClose={this.toggleDialog()}>
                    <DialogTitle>Lien ICS</DialogTitle>
                    <Typography className={this.props.classes.margin}>
                        Copiez ce lien dans votre application de calendrier préférée.
                    </Typography>
                    <TextField value={this.link()} className={this.props.classes.margin} InputProps={{
                        endAdornment: <InputAdornment position="end">
                            <IconButton><Copy/></IconButton>
                        </InputAdornment>,
                    }}/>
                </Dialog>
            </React.Fragment>
        );
    }
}
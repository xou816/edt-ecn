import React from "react";
import {
    Avatar,
    Button,
    Dialog,
    DialogTitle,
    IconButton,
    InputAdornment,
    TextField,
    Typography,
    withStyles
} from "material-ui";
import Copy from "material-ui-icons/ContentCopy";
import {connect} from "react-redux";

@connect(state => ({
    calendar: state.app.calendar
}))
@withStyles(theme => ({
    btn: {
        position: 'fixed',
        bottom: theme.spacing.unit,
        right: theme.spacing.unit
    },
    avatar: {
        backgroundColor: 'inherit'
    },
    margin: {
        margin: `${theme.spacing.unit}px ${3*theme.spacing.unit}px`
    },
    copyright: {
        margin: 2*theme.spacing.unit,
        textAlign: 'center'
    }
}))
export class ExportButton extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDialog: false
        }
    }

    disabled() {
        return this.props.calendar === null;
    }

    link() {
        return `${window.location.protocol}//${window.location.host}/api/calendar/custom/${this.props.calendar}.ics`;
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
                    <Avatar className={this.props.classes.avatar}>ICS</Avatar>
                </Button>
                <Dialog open={this.state.showDialog} onClose={this.toggleDialog()}>
                    <DialogTitle>Lien ICS</DialogTitle>
                    <Typography className={this.props.classes.margin}>
                        Copiez ce lien dans votre application de calendrier préférée.
                    </Typography>
                    <TextField value={this.link()} className={this.props.classes.margin} InputProps={{
                        endAdornment: (<InputAdornment position="end">
                            <IconButton><Copy/></IconButton>
                        </InputAdornment>),
                    }}/>
                    <div className={this.props.classes.copyright}>
                        <Typography color="textSecondary">
                            Créé par Alexandre Trendel
                        </Typography>
                        <Button color="secondary" href="https://github.com/xou816/edt-ecn">Github</Button>
                    </div>
                </Dialog>
            </React.Fragment>
        );
    }
}
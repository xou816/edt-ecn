import * as React from 'react';
import {Timetable} from "./Timetable";
import Swipeable from 'react-swipeable';
import {Nav} from "./Nav";
import {next, prev} from "../app/actions";
import {connect} from "react-redux";
import {
    Button, CssBaseline, Dialog, DialogTitle, IconButton, InputAdornment, Typography,
    withStyles
} from "material-ui";
import {Sidebar} from "./Sidebar";
import Reply from "material-ui-icons/Reply";
import Copy from "material-ui-icons/ContentCopy";
import TextField from "material-ui/TextField/TextField";
import {history} from "../index";

const mapDispatch = dispatch => ({
    next: () => dispatch(next()),
    prev: () => dispatch(prev())
});

@connect(null, mapDispatch)
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
export class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showDialog: false
        }
    }

    link() {
        return `https://edt-ecn.herokuapp.com/api/calendar/custom/${history.location.pathname.substring(1)}.ics`;
    }

    toggleDialog() {
        return () => this.setState({showDialog: !this.state.showDialog});
    }

    render() {
        return (
            <React.Fragment>
                <CssBaseline/>
                <Swipeable onSwipedLeft={() => this.props.next()} onSwipedRight={() => this.props.prev()}>
                    <Nav/>
                    <Timetable/>
                </Swipeable>
                <Sidebar/>
                <Button onClick={this.toggleDialog()} variant="fab" color="secondary" className={this.props.classes.btn}>
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
                    }} />
                </Dialog>
            </React.Fragment>
        );
    }
}
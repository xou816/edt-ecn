import * as React from "react";
import {next, prev, toggleMenu, setDate} from "../app/actions";
import {connect} from "react-redux";
import {AppBar, Button, IconButton, Toolbar, Typography, withStyles, Input} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import DatePicker from 'material-ui-pickers/DatePicker';
import DateFnsUtils from 'material-ui-pickers/utils/date-fns-utils';
import MuiPickersUtilsProvider from 'material-ui-pickers/utils/MuiPickersUtilsProvider';
import frLocale from 'date-fns/locale/fr';
import {startOfWeek, format, parse} from 'date-fns';
import {withRouter} from "react-router-dom";

let textField = withStyles(theme => ({
    underline: {
        color: 'white',
        '&:after': {
            borderBottomColor: 'white',
        },
        '&:before': {
            borderBottomColor: 'transparent',
        }
    }
}));
let DateDisplay = textField((props) => {
    let otherProps = {...props};
    delete otherProps.InputProps;
    delete otherProps.isPhone;
    delete otherProps.helperText;
    let doFormat = d => format(d, 'Do MMMM', {locale: frLocale});
    let date = props.isPhone ? 
        doFormat(props.date) :
        `Semaine du ${doFormat(startOfWeek(props.date, {weekStartsOn: 1}))}`;
    return <Input 
        {...props.InputProps} 
        {...otherProps} 
        value={date}
        classes={{underline: props.classes.underline}} />;
});

const mapState = state => ({
    date: state.app.date,
    isPhone: state.responsive.isPhone,
    menu: state.app.menu
});

const mapDispatch = (dispatch, ownProps) => ({
    next: () => dispatch(next(ownProps.history)),
    prev: () => dispatch(prev(ownProps.history)),
    setDate: (date) => dispatch(setDate(ownProps.history, date)),
    toggleMenu: () => dispatch(toggleMenu())
});

@withRouter
@connect(mapState, mapDispatch)
@withStyles(theme => ({
    toolbar: {
        display: 'flex'
    },
    spread: {
        flexGrow: 1
    },
    appbar: {
        position: 'sticky !important',
        top: 0
    },
    btn: {
        marginLeft: 2
    }
}))
export class Nav extends React.Component {

    render() {
        let classes = this.props.classes;
        return (
            <AppBar className={classes.appbar} position="static">
                <Toolbar className={classes.toolbar}>
                    <IconButton color="inherit" onClick={() => this.props.toggleMenu()} aria-label="menu">
                        <MenuIcon/>
                    </IconButton>
                    <MuiPickersUtilsProvider utils={DateFnsUtils} locale={frLocale}>
                        <DatePicker
                            cancelLabel={'Annuler'}
                            rightArrowIcon={<KeyboardArrowRight/>}
                            leftArrowIcon={<KeyboardArrowLeft/>}
                            showTodayButton={true}
                            todayLabel={'Aujourd\'hui'}
                            format={'L'}
                            autoOk
                            onChange={this.props.setDate}
                            TextFieldComponent={props => <DateDisplay {...props} 
                                isPhone={this.props.isPhone} 
                                date={this.props.date} />} />
                    </MuiPickersUtilsProvider>
                    <div className={classes.spread} />
                    {
                        this.props.isPhone ? null : [
                            <Button className={classes.btn} key="left" variant="raised" color="secondary"
                                    onClick={() => this.props.prev()}>Préc.</Button>,
                            <Button className={classes.btn} key="right" variant="raised" color="secondary"
                                    onClick={() => this.props.next()}>Suiv.</Button>
                        ]
                    }
                </Toolbar>
            </AppBar>
        );
    }

}
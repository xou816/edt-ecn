import React from "react";
import {connect} from "react-redux";
import {Button, IconButton, withStyles} from "@material-ui/core";
import Back from '@material-ui/icons/ArrowBack';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import frLocale from 'date-fns/locale/fr';
import {format, startOfWeek} from 'date-fns';
import {Nav} from "../Nav";
import {Link} from "react-router-dom";

let DateDisplay = (props) => {
    let doFormat = d => format(d, 'Do MMMM', {locale: frLocale});
    let date = props.isPhone ?
        doFormat(props.date) :
        `Semaine du ${doFormat(startOfWeek(props.date, {weekStartsOn: 1}))}`;
    return <Button onClick={props.onClick} color="inherit" variant="flat">{date}</Button>;
};

/*
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
                                                                      date={this.props.date}/>}/>
                    </MuiPickersUtilsProvider>
 */

@connect(state => ({
    isPhone: state.responsive.isPhone,
}))
@withStyles(theme => ({
    spread: {
        flexGrow: 1
    },
    btn: {
        marginLeft: 2,
        minWidth: 0
    }
}))
export class TimetableNav extends React.Component {


    render() {
        let {classes, next, prev} = this.props;
        return (
            <Nav>
                <IconButton component={Link} to={'/'} color="inherit" aria-label="menu">
                    <Back/>
                </IconButton>
                <div className={classes.spread}/>
                {
                    this.props.isPhone ? null : [
                        <Button component={Link} className={classes.btn} key="left" variant="raised" color="secondary"
                                to={prev}><KeyboardArrowLeft/></Button>,
                        <Button component={Link} className={classes.btn} key="right" variant="raised" color="secondary"
                                to={next}><KeyboardArrowRight/></Button>
                    ]
                }
            </Nav>
        );
    }

}
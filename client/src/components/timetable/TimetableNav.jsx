import React from "react";
import {Button, IconButton, withStyles} from "@material-ui/core";
import Back from '@material-ui/icons/ArrowBack';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import frLocale from 'date-fns/locale/fr';
import {format, startOfWeek} from 'date-fns';
import {Nav} from "../Nav";
import {Link} from "react-router-dom";
import Media from "react-media";

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
                <Media query={{maxWidth: '767px'}}>
                    {isPhone => [
                        <Button component={Link} className={classes.btn} key="left" variant="raised" color="secondary"
                                to={prev} size={isPhone ? 'small' : 'medium'}><KeyboardArrowLeft/></Button>,
                        <Button component={Link} className={classes.btn} key="right" variant="raised" color="secondary"
                                to={next} size={isPhone ? 'small' : 'medium'}><KeyboardArrowRight/></Button>
                    ]}
                </Media>

            </Nav>
        );
    }

}
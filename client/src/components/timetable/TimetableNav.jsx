import React from "react";
import {Button, IconButton, withStyles} from "@material-ui/core";
import Menu from '@material-ui/icons/Menu';
import LinkIcon from '@material-ui/icons/Link';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import frLocale from 'date-fns/locale/fr';
import {addWeeks, format, subWeeks} from 'date-fns';
import {Nav} from "../Nav";
import {Link} from "react-router-dom";
import Media from "react-media";

function DateDisplay({date, onClick}) {
    let doFormat = d => format(d, 'd MMMM', {locale: frLocale});
    let dateFormatted= doFormat(date);
    return <Button onClick={onClick} color="inherit" variant="flat">{dateFormatted}</Button>;
}

@withStyles(theme => ({
    spread: {
        flexGrow: 1
    },
    nav: {
        flex: 0
    }
}))
export class TimetableNav extends React.Component {


    render() {
        let {classes, date, onDateClick, makeLink} = this.props;
        return (
            <Nav className={classes.nav}>
                <IconButton component={Link} to={'/'} color="inherit">
                    <Menu/>
                </IconButton>
                <Media query={{maxWidth: '767px'}}>
                    {isPhone => [
                        isPhone ? null : <IconButton color="inherit" component={Link}
                                                     key="prev"
                                                     children={<KeyboardArrowLeft/>}
                                                     to={makeLink(subWeeks(date, 1))}/>,
                        <DateDisplay key="date" date={date} onClick={onDateClick}/>,
                        isPhone ? null : <IconButton color="inherit" component={Link}
                                                     key="next"
                                                     children={<KeyboardArrowRight/>}
                                                     to={makeLink(addWeeks(date, 1))}/>,
                    ]}
                </Media>
                <div className={classes.spread}/>
                <Button size="small" component={Link} to={'/ics'} color="secondary" variant="raised" style={{minWidth: 0}}>
                    <LinkIcon/>
                </Button>
            </Nav>
        );
    }

}
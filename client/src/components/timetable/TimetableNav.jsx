import React from "react";
import {Button, Menu, IconButton, withStyles} from "@material-ui/core";
import MenuIcon from '@material-ui/icons/Menu';
import LinkIcon from '@material-ui/icons/Link';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';
import frLocale from 'date-fns/locale/fr';
import {addWeeks, format, subWeeks} from 'date-fns';
import {Nav} from "../Nav";
import {Link} from "react-router-dom";
import {Media} from "../Media";
import DatePicker from "./DatePicker";

function DateDisplay({date, onClick}) {
    let doFormat = d => format(d, 'd MMMM', {locale: frLocale});
    let dateFormatted = doFormat(date);
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

    constructor(props) {
        super(props);
        this.ref = null;
    }

    render() {
        let {classes, date, onOpenPicker, onClosePicker, makeLink, open} = this.props;
        return (
            <Media queries={[{screen: true, maxWidth: '767px'}]} serverMatchDevices={['mobile']}>
                {([isPhone]) =>
                    <Nav className={classes.nav}>
                        <IconButton component={Link} to={'/'} color="inherit">
                            <MenuIcon/>
                        </IconButton>
                        <div ref={ref => this.ref = ref}>
                            {!isPhone && <IconButton color="inherit" component={Link}
                                                     children={<KeyboardArrowLeft/>}
                                                     to={makeLink(subWeeks(date, 1))}/>}
                            <DateDisplay date={date} onClick={onOpenPicker}/>
                            {!isPhone && <IconButton color="inherit" component={Link}
                                                     children={<KeyboardArrowRight/>}
                                                     to={makeLink(addWeeks(date, 1))}/>}

                        </div>
                        <Menu anchorEl={open ? this.ref : null} open={open} onClose={onClosePicker}>
                            <DatePicker date={date} makeLink={makeLink} onChange={onClosePicker}/>
                        </Menu>
                        <div className={classes.spread}/>
                        <Button size="small" component={Link} to={'/ics'} color="secondary" variant="raised"
                                style={{minWidth: 0}}>
                            <LinkIcon/>
                        </Button>
                    </Nav>
                }
            </Media>
        );
    }

}
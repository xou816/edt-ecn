import React from "react";
import {CalendarSelect} from "./CalendarSelect";
import HomeDrawer from "./HomeDrawer";
import {Page, PageContent} from "../Page";
import Filter from '@material-ui/icons/FilterList';
import {connect} from 'react-redux';
import HomeNav from "./HomeNav";
import Portal from "@material-ui/core/Portal/Portal";
import Snackbar from "@material-ui/core/Snackbar/Snackbar";
import withStyles from "@material-ui/core/styles/withStyles";
import IconButton from "@material-ui/core/IconButton/IconButton";
import {T} from '../Translation';
import Chip from "@material-ui/core/Chip/Chip";
import RecentCalendars from "./RecentCalendars";
import classnames from 'classnames';
import {Logo} from "../Logo";
import Button from "@material-ui/core/Button/Button";
import {Link} from "react-router-dom";

@connect(({app, browser}, {visible}) => ({
    open: app.meta.length > 0 && !browser.greaterThan.small && visible
}))
class FilterMessage extends React.PureComponent {
    render() {
        let {open, doFilter} = this.props;
        return (
            <Portal>
                <Snackbar open={open}
                          message={<T.FilterForSelection/>}
                          action={<IconButton onClick={doFilter} color={"secondary"}><Filter/></IconButton>}/>
            </Portal>
        );
    }
}

@connect(state => ({loading: state.app.loading}))
@withStyles(theme => ({
    root: {
        margin: `${2 * theme.spacing.unit}px auto`,
        maxWidth: '20%',
        display: 'block',
        [theme.breakpoints.down(769)]: {
            maxWidth: '60%'
        }
    },
    loading: {
        fill: theme.palette.grey[300],
        transition: 'fill .5s ease',
    },
    primary: {
        fill: theme.palette.primary.main,
        transition: 'fill .5s ease',
    },
    secondary: {
        fill: theme.palette.secondary.main,
        transition: 'fill .5s ease',
    }
}))
class LoadingLogo extends React.PureComponent {
    render() {
        let {loading, classes} = this.props;
        const getClass = key => classnames({[classes[key]]: !loading, [classes.loading]: loading});
        return <Logo classes={{root: classes.root, primary: getClass('primary'), secondary: getClass('secondary')}}/>;
    }
}

@withStyles(theme => ({
    rightContainer: {
        padding: 2 * theme.spacing.unit,
        flex: 3,
        overflow: 'auto',
        textAlign: 'center'
    },
    spread: {
        flexGrow: 1
    },
    searchField: {
        margin: `0 0 ${2 * theme.spacing.unit}px 0`
    },
    paper: {
        textAlign: 'left',
        margin: `${2 * theme.spacing.unit}px auto`,
        maxWidth: '60%',
        [theme.breakpoints.down(993)]: {
            maxWidth: '100%'
        }
    },
    last: {
        margin: `${2 * theme.spacing.unit}px auto 5em auto`,
    },
    switchLanguage: {
        margin: `${2 * theme.spacing.unit}px auto`
    }
}))
export class HomePage extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    toggleSidebar(open) {
        return () => this.setState({open});
    }

    render() {
        let {classes, switchLanguage} = this.props;
        return (
            <Page>
                <HomeNav/>
                <PageContent className={classes.main}>
                    <div className={classes.rightContainer}>
                        <LoadingLogo/>
                        <Chip className={classes.switchLanguage} onClick={switchLanguage}
                              label={<T.SwitchLanguage/>}/>
                        <RecentCalendars className={classes.paper}/>
                        <CalendarSelect className={classes.paper}/>
                        <div className={classes.last}>
                            <Button component={Link} to="/about"><T.About/></Button>
                        </div>
                    </div>
                    <HomeDrawer open={this.state.open} onClose={this.toggleSidebar(false)}/>
                    <FilterMessage doFilter={this.toggleSidebar(true)} visible={!this.state.open}/>
                </PageContent>
            </Page>
        );
    }
}
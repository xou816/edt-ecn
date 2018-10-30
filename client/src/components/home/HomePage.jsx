import React from "react";
import {CalendarSelect} from "./CalendarSelect";
import HomeDrawer from "./HomeDrawer";
import {Page, PageContent} from "../Page";
import Filter from '@material-ui/icons/FilterList';
import {Media} from "../Media";
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
import {Event, Logo} from "../Logo";

function FilterMessage({show, doFilter}) {
    return (
        <Portal>
            <Snackbar open={show}
                      message={<T.FilterForSelection/>}
                      action={<IconButton onClick={doFilter} color={"secondary"}><Filter/></IconButton>}/>
        </Portal>
    );
}

const ConditionalFilterMessage = connect(state => ({show: state.app.meta.length > 0}))(FilterMessage);

@connect(state => ({loading: state.app.loading}))
@withStyles(theme => ({
    root: {
        margin: `${2 * theme.spacing.unit}px auto`,
        maxWidth: '15%',
        display: 'block',
        transition: 'all .5s ease',
        opacity: 0.2,
        [theme.breakpoints.down(797)]: {
            maxWidth: '40%'
        }
    },
    loaded: {
        opacity: 1
    }
}))
class LoadingLogo extends React.PureComponent {
    render() {
        let {loading, classes} = this.props;
        return <Event className={classnames({[classes.root]: true, [classes.loaded]: !loading})}/>;
    }
}

@withStyles(theme => ({
    main: {
        background: theme.palette.grey[100]
    },
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
        [theme.breakpoints.down(1024)]: {
            maxWidth: '100%'
        }
    },
    paperLast: {
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
                <Media queries={[{maxWidth: '797px'}]} serverMatchDevices={['mobile']}>
                    {([isPhone]) => (
                        <PageContent className={classes.main}>
                            <div className={classes.rightContainer}>
                                <LoadingLogo/>
                                <Chip className={classes.switchLanguage} onClick={switchLanguage}
                                      label={<T.SwitchLanguage/>}/>
                                <RecentCalendars className={classes.paper}/>
                                <CalendarSelect className={classnames(classes.paper, classes.paperLast)}/>
                            </div>
                            <HomeDrawer open={this.state.open}
                                        onClose={this.toggleSidebar(false)}
                                        permanent={!isPhone}/>
                            {!isPhone || this.state.open ? null :
                                <ConditionalFilterMessage doFilter={this.toggleSidebar(true)}/>}
                        </PageContent>
                    )}
                </Media>
            </Page>
        );
    }
}
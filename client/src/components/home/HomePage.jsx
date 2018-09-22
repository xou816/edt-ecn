import React from "react";
import {CalendarSelect} from "../CalendarSelect";
import HomeDrawer from "./HomeDrawer";
import {Page, PageContent} from "../Page";
import {IconButton, LinearProgress, Paper, Portal, Snackbar, withStyles} from "@material-ui/core";
import Filter from '@material-ui/icons/FilterList';
import {Media} from "../Media";
import {connect} from 'react-redux';
import HomeNav from "./HomeNav";

function FilterMessage({show, doFilter}) {
    return (
        <Portal>
            <Snackbar open={show}
                      message={"Filtrer les matières pour la sélection"}
                      action={<IconButton onClick={doFilter} color={"secondary"}><Filter/></IconButton>}/>
        </Portal>
    );
}

const ConditionalFilterMessage = connect(state => ({show: state.app.meta.length > 0}))(FilterMessage);

@connect(state => ({loading: state.app.loading}))
@withStyles(theme => ({
    main: {
        background: theme.palette.grey[100]
    },
    rightContainer: {
        padding: 2 * theme.spacing.unit,
        flex: 3,
        overflow: 'auto'
    },
    spread: {
        flexGrow: 1
    },
    searchField: {
        margin: `0 0 ${2 * theme.spacing.unit}px 0`
    },
    paper: {
        margin: `0 auto 5em auto`,
        maxWidth: '60%',
        [theme.breakpoints.down(1024)]: {
            maxWidth: '100%'
        }
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
        let {classes, loading} = this.props;
        return (
            <Page>
                <HomeNav/>
                {loading ? <LinearProgress/> : null}
                <Media query={{screen: true, maxWidth: '797px'}} serverMatchDevices={['mobile']}>
                    {isPhone => (
                        <PageContent className={classes.main}>
                            <div className={classes.rightContainer}>
                                <Paper className={classes.paper}>
                                    <CalendarSelect/>
                                </Paper>
                            </div>
                            <HomeDrawer open={this.state.open} onClose={this.toggleSidebar(false)}
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
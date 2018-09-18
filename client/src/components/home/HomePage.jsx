import React from "react";
import {CalendarSelect} from "../CalendarSelect";
import HomeDrawer from "./HomeDrawer";
import {Page, PageContent} from "../Page";
import {IconButton, Paper, Snackbar, withStyles} from "@material-ui/core";
import Filter from '@material-ui/icons/FilterList';
import Media from "react-media";
import {connect} from 'react-redux';
import HomeNav from "./HomeNav";

function FilterMessage({show, doFilter}) {
    return <Snackbar open={show}
                     message={"Filter les matières pour la sélection"}
                     action={<IconButton onClick={doFilter} color={"secondary"}><Filter/></IconButton>}/>;
}

const ConditionalFilterMessage = connect(state => ({show: state.app.meta.length > 0}))(FilterMessage);

@withStyles(theme => ({
    main: {
        background: theme.palette.grey[100]
    },
    rightContainer: {
        padding: 3 * theme.spacing.unit,
        flex: 1,
        overflow: 'auto',
        [theme.breakpoints.down(767)]: {
            padding: theme.spacing.unit
        }
    },
    spread: {
        flexGrow: 1
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
        let {classes} = this.props;
        return (
            <Page>
                <HomeNav/>
                <Media query={{screen: true, maxWidth: '797px'}}>
                    {isPhone => (
                        <PageContent className={classes.main}>
                            <HomeDrawer open={this.state.open} onClose={this.toggleSidebar(false)}
                                        permanent={!isPhone}/>
                            <div className={classes.rightContainer}>
                                <Paper style={{marginBottom: '5em'}}><CalendarSelect/></Paper>
                            </div>
                            {!isPhone || this.state.open ? null :
                                <ConditionalFilterMessage doFilter={this.toggleSidebar(true)}/>}
                        </PageContent>
                    )}
                </Media>
            </Page>
        );
    }
}
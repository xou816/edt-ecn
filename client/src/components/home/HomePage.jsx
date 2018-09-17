import React from "react";
import {Nav} from "../Nav";
import {CalendarSelect} from "../CalendarSelect";
import HomeDrawer from "./HomeDrawer";
import {Page, PageContent} from "../Page";
import {Paper, withStyles} from "@material-ui/core";

@withStyles(theme => ({
    main: {
        background: theme.palette.grey[100]
    },
    paper: {
        margin: 3 * theme.spacing.unit
    }
}))
export class HomePage extends React.Component {

    render() {
        let {classes} = this.props;
        return (
            <Page>
                <Nav>Calendriers</Nav>
                <PageContent className={classes.main}>
                    <HomeDrawer/>
                    <Paper className={classes.paper}>
                        <CalendarSelect/>
                    </Paper>
                </PageContent>
            </Page>
        );
    }
}
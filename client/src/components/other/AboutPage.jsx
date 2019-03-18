import {Page, PageContent} from "../Page";
import React from "react";
import {T} from "../Translation";
import Typography from "@material-ui/core/Typography/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import Home from "@material-ui/icons/Home";
import Tabs from "@material-ui/core/Tabs/Tabs";
import Tab from "@material-ui/core/Tab/Tab";
import AppBar from "@material-ui/core/AppBar/AppBar";
import {Link} from "react-router-dom";
import {AppIcon} from "../Logo";
import Button from "@material-ui/core/Button/Button";
import Paper from "@material-ui/core/Paper/Paper";

@withStyles(theme => ({
    paper: {
        width: 'auto',
        padding: 3 * theme.spacing.unit,
        margin: `${4 * theme.spacing.unit}px 0`,
    },
    marginTop: {
        marginTop: 4 * theme.spacing.unit
    },
    main: {
        margin: `0 auto`,
        padding: 2 * theme.spacing.unit,
        width: '60%',
        [theme.breakpoints.down(993)]: {
            width: `100%`,
            margin: 0,
        }
    },
    icon: {
        maxWidth: '20%',
        [theme.breakpoints.down(769)]: {
            maxWidth: '40%'
        },
        boxShadow: theme.shadows[2],
        borderRadius: 3 * theme.shape.borderRadius
    }
}))
export default class extends React.Component {

    render() {
        let {classes} = this.props;
        return (
            <Page>
                <AppBar position="static" elevation={1}>
                    <Tabs value={1}>
                        <Tab component={Link} to="/" label={<Home/>}/>
                        <Tab label={<T.About/>}/>
                    </Tabs>
                </AppBar>
                <PageContent className={classes.main} orientation="column">
                    <Typography variant="subtitle1" color="textSecondary" gutterBottom align="center">
                        <AppIcon className={classes.icon}/>
                        <p><T.AppName version={process.env.VERSION}/><br />Alexandre Trendel</p>
                        <Button variant="outlined" size="small" component="a" href="https://github.com/xou816/edt-ecn"><T.ViewSource/></Button>
                    </Typography>
                    <Paper elevation={1} className={classes.paper}>
                        <Typography variant="h6" gutterBottom>
                            <T.HowItWorks/>
                        </Typography>
                        <Typography variant="subtitle1" gutterBottom>
                            <T.HowItWorksDetails/>
                        </Typography>
                    </Paper>
                </PageContent>
            </Page>
        );
    }
}
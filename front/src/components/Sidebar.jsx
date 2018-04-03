import React from "react";
import {
    Button, Checkbox, Collapse, Divider, Drawer, List, ListItem, ListItemText, ListSubheader,
    SwipeableDrawer, Typography, withStyles
} from "material-ui";
import {connect} from "react-redux";
import {finishSelection, getCalendar, resetSelection, toggleCalendar, toggleMenu} from "../app/actions";
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import {PREFIXES} from "../app/event";

const mapState = state => ({
    list: state.app.list,
    shown: state.app.menu,
    selection: state.app.selection
});

const mapDispatch = dispatch => ({
    hide: () => {
        dispatch(finishSelection());
        dispatch(toggleMenu());
    },
    show: () => dispatch(toggleMenu()),
    toggle: id => () => dispatch(toggleCalendar(id)),
    resetSelection: () => dispatch(resetSelection())
});

function NestedList(props) {
    return (
        <React.Fragment key={props.title}>
            <ListItem onClick={props.togglePrefix} button>
                <ListItemText primary={props.title}/>
                {props.unfold ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={props.unfold}>
                <List>
                    {props.calendars.map(calendar => (
                        <ListItem key={calendar.id} button onClick={props.toggle(calendar.id)}>
                            <Checkbox checked={props.selection.indexOf(calendar.id) > -1} tabIndex={-1} disableRipple/>
                            <ListItemText primary={calendar.display}/>
                        </ListItem>
                    ))}
                </List>
            </Collapse>
        </React.Fragment>
    );
}

@connect(mapState, mapDispatch)
@withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        margin: '1px',
        display: 'flex'
    },
    title: {
        padding: `${2 * theme.spacing.unit}px`,
        flexGrow: 1
    }
}))
export class Sidebar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            unfold: []
        };
    }

    togglePrefix(prefix) {
        this.setState({
            unfold: this.state.unfold.indexOf(prefix) > -1 ?
                this.state.unfold.filter(p => p !== prefix) :
                this.state.unfold.concat([prefix])
        });
    }

    render() {
        let classes = this.props.classes;
        let s = this.props.selection.length > 1 ? 's' : '';
        let list = this.props.list;
        return (
            <Drawer open={this.props.shown} onClose={this.props.hide}>
                <Divider/>
                <List component="nav" subheader={(
                    <ListSubheader className={classes.root} component="div">
                        <Checkbox onClick={this.props.resetSelection} checked={this.props.selection.length > 0}
                                  disableRipple/>
                        <Typography component="h2" variant="title" className={classes.title}>
                            {this.props.selection.length} calendrier{s} sélectionné{s}
                        </Typography>
                        <Button onClick={this.props.hide} color="primary">
                            Fermer
                        </Button>
                    </ListSubheader>
                )}>{
                    Object.keys(list).map(prefix => NestedList({
                        title: PREFIXES[prefix],
                        calendars: list[prefix],
                        unfold: this.state.unfold.indexOf(prefix) > -1,
                        selection: this.props.selection,
                        toggle: this.props.toggle,
                        togglePrefix: () => this.togglePrefix(prefix)
                    }))
                }</List>
            </Drawer>
        );
    }

}
import React from "react";
import {Checkbox, Collapse, List, ListItemText, ListSubheader, Typography, withStyles} from "material-ui";
import {resetSelection, toggleCalendar} from "../app/actions";
import ListItem from "material-ui/es/List/ListItem";
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import {connect} from "react-redux";

const PREFIXES = {
    'OD': 'Option disciplinaire',
    'EI': 'Cycle ingénieur',
    'AP': 'Cycle ingénieur apprenti',
    'BTP': 'BTP',
    'M1': 'Master 1',
    'M2': 'Master 2',
    'MECA': 'Filière mécanique',
    'OP': 'Option profesionnelle',
    'PROMO': 'Promo EI1',
    '': 'Autres'
};

function NestedList(props) {
    return (
        <React.Fragment>
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

function indexList(list) {
    return list.reduce((acc, calendar) => {
        let prefix = Object.keys(PREFIXES).find(prefix => calendar.name.startsWith(prefix));
        return {...acc, [prefix]: (acc[prefix] || []).concat([calendar])};
    }, {});
}

const mapState = state => ({
    list: indexList(state.app.list),
    selection: state.app.selection
});

const mapDispatch = dispatch => ({
    toggle: id => () => dispatch(toggleCalendar(id)),
    resetSelection: () => dispatch(resetSelection())
});

@connect(mapState, mapDispatch)
@withStyles(theme => ({
    root: {
        backgroundColor: theme.palette.background.paper,
        margin: '1px',
        display: 'flex'
    },
    title: {
        padding: `${1.5 * theme.spacing.unit}px`,
        flexGrow: 1
    }
}))
export class CalendarSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            unfold: null
        };
    }

    togglePrefix(prefix) {
        this.setState({
            unfold: this.state.unfold === prefix ? null : prefix
        });
    }

    render() {
        let classes = this.props.classes;
        let s = this.props.selection.length > 1 ? 's' : '';
        return (
            <List component="nav" subheader={(
                <ListSubheader className={classes.root} component="div">
                    <Checkbox onClick={this.props.resetSelection}
                              checked={this.props.selection.length > 0}
                              disableRipple/>
                    <Typography component="h2" variant="subheading" className={classes.title}>
                        {this.props.selection.length} calendrier{s} sélectionné{s}
                    </Typography>
                </ListSubheader>
            )}>
                {
                    Object.keys(this.props.list).map(prefix => <NestedList
                        key={prefix}
                        title={PREFIXES[prefix]}
                        calendars={this.props.list[prefix]}
                        unfold={this.state.unfold === prefix}
                        selection={this.props.selection}
                        toggle={this.props.toggle}
                        togglePrefix={() => this.togglePrefix(prefix)}
                    />)
                }
            </List>
        );
    }
}
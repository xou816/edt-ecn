import React from "react";
import {Checkbox, List, ListSubheader, Typography, withStyles} from "material-ui";
import {resetSelection, toggleCalendar} from "../app/actions";
import {connect} from "react-redux";
import {NestedList} from "./NestedList";

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
    toggle: id => dispatch(toggleCalendar(id)),
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
                        key={`prefix_${prefix}`}
                        title={PREFIXES[prefix]}
                        nested={this.props.list[prefix]}
                        shown={this.state.unfold === prefix}
                        checked={(id) => this.props.selection.indexOf(id) > -1}
                        toggle={(id) => this.props.toggle(id)}
                        unfold={() => this.togglePrefix(prefix)}
                        getId={calendar => calendar.id}
                        getDisplay={calendar => calendar.display}
                    />)
                }
            </List>
        );
    }
}
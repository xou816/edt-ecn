import React from "react";
import {List, CircularProgress, withStyles} from "@material-ui/core";
import {getCalendarList, toggleCalendar} from "../app/actions";
import {connect} from "react-redux";
import {NestedList} from "./NestedList";
import {includesCalendar} from "../app/meta";

const PREFIXES = {
    'OD': 'Option disciplinaire',
    'EI': 'Cycle ingénieur',
    'AP': 'Cycle ingénieur apprenti',
    'BTP': 'BTP',
    'M1ECN': 'Fac de sciences',
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
    checked: includesCalendar(state.app.meta)
});

const mapDispatch = dispatch => ({
    toggle: id => dispatch(toggleCalendar(id)),
    getList: () => dispatch(getCalendarList())
});

@connect(mapState, mapDispatch)
@withStyles(theme => ({
    loader: {
        margin: `${theme.spacing.unit}px auto`,
        display: 'block',
        width: '1em'
    }
}))
export class CalendarSelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            unfold: null
        };
    }

    componentDidMount() {
        if (Object.keys(this.props.list).length === 0) {
            this.props.getList();
        }
    }

    togglePrefix(prefix) {
        this.setState({
            unfold: this.state.unfold === prefix ? null : prefix
        });
    }

    render() {
        let {list, toggle, checked, classes} = this.props;
        return (
            <List component="nav">
                {Object.keys(list).length > 0 ?
                    Object.keys(list).map(prefix => <NestedList
                        key={`prefix_${prefix}`}
                        title={PREFIXES[prefix]}
                        nested={list[prefix]}
                        shown={this.state.unfold === prefix}
                        checked={checked}
                        toggle={(id) => toggle(id)}
                        unfold={() => this.togglePrefix(prefix)}
                        getId={calendar => calendar.id}
                        getPrimary={calendar => calendar.display}
                    />) : <CircularProgress className={classes.loader}/>}
            </List>
        );
    }
}
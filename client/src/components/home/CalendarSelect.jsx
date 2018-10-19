import React from "react";
import {getCalendarList, toggleCalendar} from "../../app/actions";
import {connect} from "react-redux";
import {NestedList} from "../NestedList";
import {includesCalendar} from "../../app/meta";
import withStyles from "@material-ui/core/styles/withStyles";
import List from "@material-ui/core/List/List";
import {Translation} from '../Translation';
import Paper from "@material-ui/core/Paper/Paper";

const fake = classes => Array.from({length: 5}, (x, i) => ({
    key: `skeleton_${i}`,
    title: <div className={classes.skeleton}/>,
    nested: [],
    shown: false,
    checked: false,
    toggle: () => null,
    unfold: () => null,
    getId: () => null,
    getPrimary: () => null,
}));

const PREFIXES = ['EI', 'OD', 'OP', 'M1ECN', 'AP', 'MECA', 'BTP', 'M1', 'M2', 'OTHER'];

function indexList(list) {
    return list
        .map(calendar => ({...calendar,
            prefix: PREFIXES.find(prefix => calendar.name.startsWith(prefix)) || 'OTHER'}))
        .sort((a, b) => {
            return PREFIXES.indexOf(a.prefix) > PREFIXES.indexOf(b.prefix) ? 1 : -1;
        })
        .reduce((acc, calendar) => {
            return {...acc, [calendar.prefix]: (acc[calendar.prefix] || []).concat([calendar])};
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
    skeleton: {
        margin: 0,
        display: 'block',
        height: '1.5rem',
        background: theme.palette.grey[200],
        position: 'relative',
        overflow: 'hidden',
        '&:after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: `linear-gradient(90deg, ${theme.palette.grey[200]}, ${theme.palette.grey[100]}, ${theme.palette.grey[200]})`,
            animation: 'progress 1s ease-in-out infinite'
        }
    },
    '@keyframes progress': {
        '0%': {
            transform: 'translate3d(-100%, 0, 0)'
        },
        '100%': {
            transform: 'translate3d(100%, 0, 0)'
        },
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
        let {getList, list} = this.props;
        if (Object.keys(list).length === 0) {
            getList();
        }
    }

    togglePrefix(prefix) {
        this.setState({
            unfold: this.state.unfold === prefix ? null : prefix
        });
    }

    render() {
        let {list, toggle, checked, classes, className} = this.props;
        let mapped = Object.keys(list).length ? Object.keys(list).map(prefix => ({
            key: `prefix_${prefix}`,
            title: <Translation for={'Calendar' + prefix}/>,
            nested: list[prefix],
            shown: this.state.unfold === prefix,
            checked,
            toggle: (id) => toggle(id),
            unfold: () => this.togglePrefix(prefix),
            getId: calendar => calendar.id,
            getPrimary: calendar => calendar.display
        })) : fake(classes);
        return (
            <Paper className={className}>
                <List component="nav">
                    {mapped.map(({key, ...props}) => <NestedList key={key} {...props} />)}
                </List>
            </Paper>
        );
    }
}
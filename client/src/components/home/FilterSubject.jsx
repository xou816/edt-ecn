import React from "react";
import {connect} from "react-redux";
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import {getSubjects, resetSubjects, toggleSubject} from "../../app/actions";
import {NestedList} from "../NestedList";
import {countSubjects, getCalendars, includesSubject} from "../../app/meta";
import withStyles from "@material-ui/core/styles/withStyles";
import ListSubheader from "@material-ui/core/ListSubheader/ListSubheader";
import Checkbox from "@material-ui/core/Checkbox/Checkbox";
import Typography from "@material-ui/core/Typography/Typography";
import List from "@material-ui/core/List/List";

const mapState = state => ({
    subjects: state.app.subjects,
    list: state.app.list,
    calendars: getCalendars(state.app.meta),
    count: countSubjects(state.app.meta),
    checked: includesSubject(state.app.meta)
});

const mapDispatch = dispatch => ({
    toggleSubject: (calendar, subject) => dispatch(toggleSubject(calendar, subject)),
    reset: () => dispatch(resetSubjects()),
    getSubjects: () => dispatch(getSubjects())
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
export class FilterSubject extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            unfold: null
        };
    }

    componentWillReceiveProps(nextProps, nextContext) {
        let {calendars, getSubjects} = this.props;
        if (nextProps.calendars.length !== calendars.length) {
            getSubjects();
        }
    }


    componentWillMount() {
        this.props.getSubjects();
    }

    toggleCalendar(cal) {
        this.setState({
            unfold: this.state.unfold === cal ? null : cal
        });
    }

    render() {
        let {classes, count, toggleSubject, checked, reset, subjects, list} = this.props;
        let s = count > 1 ? 's' : '';
        return (
            <List component="nav" subheader={(
                <ListSubheader onClick={reset} className={classes.root} component="div">
                    <Checkbox checked={count > 0} disableRipple/>
                    <Typography component="h2" variant="subtitle1" className={classes.title}>
                        {count} matière{s} filtrée{s}
                    </Typography>
                </ListSubheader>
            )}>
                {
                    Object.keys(subjects).map(calendar => <NestedList
                        key={calendar}
                        title={(list.find(cal => cal.id === calendar) || {display: ''}).display}
                        nested={subjects[calendar].sort((a, b) => a.name < b.name ? -1 : 1)}
                        shown={this.state.unfold === calendar}
                        unfold={() => this.toggleCalendar(calendar)}
                        toggle={(subject) => toggleSubject(calendar, subject)}
                        checked={(subject) => checked(calendar, subject)}
                        getId={subject => subject.id}
                        getPrimary={subject => subject.name}
                        getSecondary={subject => subject.full_name}
                        checkbox={{
                            icon: <Visibility/>,
                            checkedIcon: <VisibilityOff/>
                        }}
                    />)
                }
            </List>
        );
    }
}
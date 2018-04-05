import React from "react";
import {connect} from "react-redux";
import {Checkbox, List, ListSubheader, Typography, withStyles} from "material-ui";
import {resetSubjects, toggleSubject} from "../app/actions";
import {NestedList} from "./NestedList";

const mapState = state => ({
    subjects: state.app.subjects,
    list: state.app.list,
    filters: state.app.filters
});

const mapDispatch = dispatch => ({
    toggleSubject: (calendar, subject) => dispatch(toggleSubject(calendar, subject)),
    reset: () => dispatch(resetSubjects())
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

    toggleCalendar(cal) {
        this.setState({
            unfold: this.state.unfold === cal ? null : cal
        });
    }

    render() {
        let classes = this.props.classes;
        let len = Object.keys(this.props.filters).reduce((s, f) => s + this.props.filters[f].length, 0);
        let s = len > 1 ? 's' : '';
        return (
            <List component="nav" subheader={(
                <ListSubheader className={classes.root} component="div">
                    <Checkbox onClick={this.props.reset}
                              checked={len > 0}
                              disableRipple/>
                    <Typography component="h2" variant="subheading" className={classes.title}>
                        {len} matière{s} filtrée{s}
                    </Typography>
                </ListSubheader>
            )}>
                {
                    Object.keys(this.props.subjects).map(calid => <NestedList
                        key={calid}
                        title={this.props.list.find(cal => cal.id === calid).display}
                        nested={this.props.subjects[calid]}
                        shown={this.state.unfold === calid}
                        unfold={() => this.toggleCalendar(calid)}
                        toggle={(subject) => this.props.toggleSubject(calid, subject)}
                        checked={(subject) => (this.props.filters[calid] || []).indexOf(subject) > -1}
                        getId={subject => subject.id}
                        getDisplay={subject => subject.name}
                    />)
                }
            </List>
        );
    }
}
import React from "react";
import {connect} from "react-redux";
import {Checkbox, Collapse, List, ListItem, ListItemText, ListSubheader, withStyles} from "material-ui";
import ExpandLess from 'material-ui-icons/ExpandLess';
import ExpandMore from 'material-ui-icons/ExpandMore';
import {toggleSubject} from "../app/actions";

const mapState = state => ({
    subjects: state.app.subjects,
    list: state.app.list,
    filters: state.app.filters
});

const mapDispatch = dispatch => ({
    toggleSubject: (calendar, subject) => dispatch(toggleSubject(calendar, subject))
});

function NestedList(props) {
    return (
        <React.Fragment>
            <ListItem onClick={props.toggleCalendar} button>
                <ListItemText primary={props.title}/>
                {props.unfold ? <ExpandLess/> : <ExpandMore/>}
            </ListItem>
            <Collapse in={props.unfold}>
                <List>
                    {props.nested.map(subject => (
                        <ListItem key={subject.id} onClick={() => props.toggle(subject.id)} button>
                            <Checkbox checked={props.checked(subject.id)} tabIndex={-1} disableRipple/>
                            <ListItemText primary={subject.name}/>
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
        return (
            <List component="nav" subheader={(
                <ListSubheader className={classes.root} component="div">
                </ListSubheader>
            )}>
                {
                    Object.keys(this.props.subjects).map(calid => <NestedList
                        key={calid}
                        title={this.props.list.find(cal => cal.id === calid).display}
                        nested={this.props.subjects[calid]}
                        unfold={this.state.unfold === calid}
                        toggleCalendar={() => this.toggleCalendar(calid)}
                        toggle={(subject) => this.props.toggleSubject(calid, subject)}
                        checked={(subject) => (this.props.filters[calid] || []).indexOf(subject) > -1}
                    />)
                }
            </List>
        );
    }
}
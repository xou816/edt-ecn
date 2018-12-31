import React from "react";
import withStyles from "@material-ui/core/styles/withStyles";
import {TimetableEvents} from "./TimetableEvents";
import Typography from "@material-ui/core/Typography/Typography";
import {Course} from "./Course";
import {endOfMonth, format, startOfDay, startOfMonth} from "date-fns";
import {TranslateDate, T} from "../Translation";
import Fade from "@material-ui/core/Fade";
import {focusEvent} from "../../app/actions";
import {connect} from "react-redux";
import {FocusedCourse} from "./FocusedCourse";
import timeviewAware from "./timeviewAware";

@connect(({app}) => ({focus: app.focus}), dispatch => ({focusEvent: id => dispatch(focusEvent(id))}))
@withStyles(theme => ({
    root: {
        display: 'flex'
    },
    courses: {
        margin: theme.spacing.unit,
        flexGrow: 1
    },
    day: {
        margin: 2 * theme.spacing.unit,
        width: 3 * theme.spacing.unit
    },
}))
class DayContainer extends React.Component {
    render() {
        let {date, group, tag, classes, focusEvent} = this.props;
        return (
            <ScrollSection tag={tag} className={classes.root}>
                <TranslateDate>
                    {locale => {
                        let day = format(date, 'eee', {locale}).toUpperCase();
                        let num = format(date, 'd', {locale});
                        return (
                            <div className={classes.day}>
                                <Typography align="center" children={day}/>
                                <Typography align="center" children={num}/>
                            </div>
                        );
                    }}
                </TranslateDate>
                <div className={classes.courses}>
                    {group.map(event => <Course onClick={() => focusEvent(event.id)}
                                                size="medium"
                                                elevation={0}
                                                key={event.id}
                                                {...event} />)}
                </div>
            </ScrollSection>
        );
    }
}

@timeviewAware
@withStyles(theme => ({
    root: {
        flexGrow: '1',
        height: '100%',
        overflowY: 'auto',
        overflowX: 'hidden',
        padding: '0 10%',
        [theme.breakpoints.down(769)]: {
            padding: 0
        }
    },
    headline: {
        marginTop: '1em'
    }
}))
export default class extends React.Component {

    get date() {
        return startOfMonth(this.props.renderDate, {weekStartsOn: 1});
    }

    handleChange(ts) {
        let {navigateTo, active} = this.props;
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            if (active) navigateTo(new Date(ts))
        }, 500);
    }

    matchTag(tag, tags) {
        return tags.reduce((index, existingTag, curr) => {
            return existingTag >= tag && index === null ? curr : index;
        }, null);
    }

    render() {
        let {classes, renderDate, active} = this.props;
        let pos = startOfDay(renderDate).valueOf();
        if (!active) clearTimeout(this.timeout);
        return (
            <Fade in>
                <ScrollSpy position={pos} matchTag={this.matchTag} onChange={(pos) => this.handleChange(pos)}
                           className={classes.root}>
                    <FocusedCourse allowFocus={active}/>
                    <Typography align="center" color="textSecondary" variant="h6" className={classes.headline}>
                        <TranslateDate>{locale => format(renderDate, 'MMMM Y', {locale})}</TranslateDate>
                    </Typography>
                    <TimetableEvents from={this.date.valueOf()} to={endOfMonth(this.date).valueOf()} group="day">
                        {groups => groups.length > 0 ?
                            groups.map(([date, group]) => {
                                let tag = startOfDay(date).valueOf();
                                return <DayContainer key={tag} tag={tag} date={date} group={group}/>;
                            }) :
                            <Typography align="center" color="textSecondary" variant="subtitle1">
                                <T.NoEvents/>
                            </Typography>
                        }
                    </TimetableEvents>
                </ScrollSpy>
            </Fade>
        );
    }
}

const {Provider, Consumer} = React.createContext(() => null);

class ScrollSection extends React.Component {

    render() {
        let {component, tag, children, refProp, ...rest} = this.props;
        return (
            <Consumer>{({register, match}) => {
                return React.createElement(component || 'div', {
                    ...rest,
                    [refProp || 'ref']: ref => register(ref, tag)
                }, children)
            }}</Consumer>
        );
    }
}

class ScrollSpy extends React.Component {

    constructor(props) {
        super(props);
        this.handler = null;
        this.elements = [];
        this.tags = [];
        this.ref = null;
        this.state = {
            match: null
        };
    }

    attachEvent(ref, handler) {
        if (this.ref === null && ref !== null) {
            this.ref = ref;
            this.handler = this.handleScroll(handler);
            ref.addEventListener('scroll', this.handler);
            ref.addEventListener('touchmove', this.handler);
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        let {position} = this.props;
        if (position != null && prevProps.position !== position && this.state.match !== position) {
            let pos = this.getPos(position);
            if (pos > -1) {
                this.ref.scrollTop = pos + 1;
            }
        }
    }

    componentWillUnmount() {
        if (this.ref !== null) {
            this.ref.removeEventListener('scroll', this.handler);
            this.ref.removeEventListener('touchmove', this.handler);
        }
    }

    getPos(tag) {
        let {matchTag} = this.props;
        let matcher = matchTag != null ?
            (tag => matchTag(tag, this.tags)) :
            (tag => this.tags.indexOf(tag));
        let index = matcher(tag);
        return this.elements[index] == null ?
            -1 :
            this.elements[index].offsetTop - this.ref.offsetTop;
    }

    getMatch() {
        let rev = this.elements.slice().reverse();
        let match = rev.find(ref => {
            return ref.offsetTop - this.ref.offsetTop < this.ref.scrollTop;
        });
        let index = Math.max(this.elements.indexOf(match), 0);
        return this.tags[index];
    }

    handleScroll(handler) {
        return () => {
            let newMatch = this.getMatch();
            if (this.state.match !== newMatch) {
                this.setState({match: newMatch});
                handler(newMatch);
            }
        };
    }

    saveRef(ref, tag) {
        if (ref !== null) {
            this.elements.push(ref);
            this.tags.push(tag);
            if (this.state.match === null) {
                this.setState({match: tag});
            }
        } else {
            this.elements.shift();
            this.tags.shift();
        }
    }

    render() {
        let {component, children, onChange, position, matchTag, ...others} = this.props;
        let props = {
            ref: ref => this.attachEvent(ref, onChange),
            ...others
        };
        return React.createElement(component || 'div', props, (
            <Provider value={{
                register: (ref, tag) => this.saveRef(ref, tag),
                match: this.state.match
            }}>
                {children}
            </Provider>
        ));
    }
}
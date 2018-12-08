import React from "react";
import timetableAware from "./timetableAware";
import withStyles from "@material-ui/core/styles/withStyles";
import {TimetableEvents} from "./TimetableEvents";
import Typography from "@material-ui/core/Typography/Typography";
import RootRef from "@material-ui/core/RootRef/RootRef";
import {Course} from "./Course";
import {format, startOfWeek} from "date-fns";
import {T, TranslateDate} from "../Translation";

const PRELOAD = 4;

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
        let {date, group, classes} = this.props;
        return (
            <div className={classes.root}>
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
                    {group.map(event => <Course size="medium" key={event.id} {...event} />)}
                </div>
            </div>
        );
    }
}

function TypographyRef({rootRef, ...rest}) {
    return <RootRef rootRef={rootRef}><Typography {...rest} /></RootRef>
}

@timetableAware
@withStyles(theme => ({
    root: {
        flex: '1',
        overflowY: 'auto',
        overflowX: 'hidden',
    }
}))
export default class extends React.Component {

    normalizedDate(date) {
        return startOfWeek(date, {weekStartsOn: 1});
    }

    range(curr) {
        return Array.from({length: 2 * PRELOAD + 1}, (x, i) => {
            return curr + i - PRELOAD;
        });
    }

    handleChange(pos) {
        let {navigateTo, atPosition} = this.props;
        const nav = () => navigateTo(atPosition(pos));
        if ('requestIdleCallback' in window) {
            window.requestIdleCallback(nav);
        } else {
            nav();
        }
    }

    render() {
        let {classes, date, position, atPosition} = this.props;
        const curr = position(date);
        return (
            <ScrollSpy position={curr} onChange={(pos) => this.handleChange(pos)} className={classes.root}>
                {this.range(curr).map(pos => {
                    const date = this.normalizedDate(atPosition(pos));
                    return (
                        <TimetableEvents key={date.valueOf()} days={5} offset={date.valueOf()} group="day">
                            {groups => groups.length === 0 ? null : (
                                <ScrollSection tag={pos}>
                                    <Typography align="center" color="textSecondary" variant="h6">
                                        <TranslateDate>{locale => <T.WeekN
                                            n={format(date, 'I', {locale})}/>}</TranslateDate>
                                    </Typography>
                                    {groups.map(([d, g]) => <DayContainer key={d.valueOf()} date={d} group={g}/>)}
                                </ScrollSection>
                            )}
                        </TimetableEvents>
                    );
                })}
            </ScrollSpy>
        );
    }
}

const {Provider, Consumer} = React.createContext(() => null);

class ScrollSection extends React.Component {

    render() {
        let {component, tag, children, refProp, ...rest} = this.props;
        return (
            <Consumer>{({register, match, height}) => {
                console.log(match === tag);
                return React.createElement(component || 'div', {
                    ...rest,
                    [refProp || 'ref']: ref => register(ref, tag),
                    style: {height: match === tag ? undefined : height, overflow: 'hidden'}
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
        let {position} = this.props;
        if (this.ref !== null) {
            this.ref.removeEventListener('scroll', this.handler);
            //this.ref.removeEventListener('touchmove', this.handler);
        }
        if (ref !== null) {
            this.ref = ref;
            if (position != null && this.state.match !== position) {
                //ref.scrollTop = this.getPos(position) + 1;
            }
            this.handler = this.handleScroll(handler);
            ref.addEventListener('scroll', this.handler);
            //ref.addEventListener('touchmove', this.handler);
        }
    }

    getPos(tag) {
        let index = this.tags.indexOf(tag);
        return this.elements[index] == null ?
            0 :
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
        let {component, children, onChange, ...others} = this.props;
        let props = {
            ref: ref => this.attachEvent(ref, onChange),
            ...others
        };
        return React.createElement(component || 'div', props, (
            <Provider value={{
                register: (ref, tag) => this.saveRef(ref, tag), 
                match: this.state.match,
                height: this.ref && this.ref.clientHeight
            }}>
                {children}
            </Provider>
        ));
    }
}
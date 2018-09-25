import React from "react";
import timetableAware from "./timetableAware";
import {virtualize} from "react-swipeable-views-utils";
import SwipeableViews from "react-swipeable-views";
import {Timetable} from "./Timetable";

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

@timetableAware
export default class extends React.Component {

    get index() {
        let {position, date} = this.props;
        return position(date);
    }

    onChangeIndex() {
        return newIndex => {
            let {navigateTo, atPosition, date} = this.props;
            navigateTo(atPosition(date, newIndex));
        };
    }

    slideRenderer() {
        let {weekView, atPosition, position, date} = this.props;
        return ({key, index}) => {
            const diff = Math.abs(index - position(date));
            return diff < 3 ?
                <Timetable active={diff === 0} days={weekView ? 5 : 1} date={atPosition(date, index)} key={key} /> :
                <div key={key}/>;
        };
    }

    render() {
        return (
            <VirtualizeSwipeableViews overscanSlideAfter={1}
                                      overscanSlideBefore={1}
                                      onChangeIndex={this.onChangeIndex()}
                                      index={this.index}
                                      style={{flexGrow: 1}}
                                      slideRenderer={this.slideRenderer()}/>
        );
    }
}
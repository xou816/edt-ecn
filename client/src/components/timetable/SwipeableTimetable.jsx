import React from "react";
import timetableAware from "./timetableAware";
import {virtualize} from "react-swipeable-views-utils";
import SwipeableViews from "react-swipeable-views";
import {Timetable} from "./Timetable";
import {addDays, isWeekend, startOfISOWeek} from "date-fns";

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

@timetableAware
export default class extends React.Component {

    get index() {
        let {position, date} = this.props;
        return position(date);
    }

    onChangeIndex() {
        return newIndex => {
            let {navigateTo, atPosition} = this.props;
            let newDate = atPosition(newIndex);
            if (isWeekend(newDate)) {
                navigateTo(addDays(startOfISOWeek(newDate), (newIndex - this.index) > 0 ? 7 : 4));
            } else {
                navigateTo(newDate);
            }
        };
    }

    slideRenderer() {
        let {weekView, atPosition} = this.props;
        return ({key, index}) => {
            const diff = Math.abs(index - this.index);
            return diff < 3 ?
                <Timetable active={diff === 0} days={weekView ? 5 : 1} date={atPosition(index)} key={key} /> :
                <div key={key}/>;
        };
    }

    render() {
        let {weekView} = this.props;
        let prerender = weekView ? 1 : 2;
        return (
            <VirtualizeSwipeableViews overscanSlideAfter={prerender}
                                      overscanSlideBefore={prerender}
                                      onChangeIndex={this.onChangeIndex()}
                                      index={this.index}
                                      style={{flexGrow: 1}}
                                      slideRenderer={this.slideRenderer()}/>
        );
    }
}
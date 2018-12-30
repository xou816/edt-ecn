import React from "react";
import timetableAware, {View} from "./timetableAware";
import {virtualize} from "react-swipeable-views-utils";
import SwipeableViews from "react-swipeable-views";
import {Timetable} from "./Timetable";
import {addDays, isWeekend, startOfISOWeek} from "date-fns";

const VirtualizeSwipeableViews = virtualize(SwipeableViews);

@timetableAware
export default class extends React.Component {

    constructor(props) {
        super(props);
        this.slideRenderer = this.slideRenderer.bind(this);
        this.onChangeIndex = this.onChangeIndex.bind(this);
    }

    get index() {
        let {position, date} = this.props;
        return position(date);
    }

    onChangeIndex(newIndex) {
        let {atPosition, navigateTo} = this.props;
        let newDate = atPosition(newIndex);
        if (isWeekend(newDate)) {
            navigateTo(addDays(startOfISOWeek(newDate), (newIndex - this.index) > 0 ? 7 : 4));
        } else {
            navigateTo(newDate);
        }
    }

    slideRenderer({key, index}) {
        let {view, atPosition, position, date} = this.props;
        const diff = Math.abs(index - this.index);
        date = position(date) === index ? date : atPosition(index);
        return diff < 3 ?
            <Timetable active={diff === 0} days={(view & View.MOBILE) > 0 ? 1 : 5} currDate={diff === 0 ? date : null}
                       date={date} key={key}/> :
            <div key={key}/>;
    }

    render() {
        let {view} = this.props;
        let prerender = (view & View.MOBILE) > 0 ? 2 : 1;
        return (
            <VirtualizeSwipeableViews overscanSlideAfter={prerender}
                                      overscanSlideBefore={prerender}
                                      onChangeIndex={this.onChangeIndex}
                                      index={this.index}
                                      style={{flexGrow: 1}}
                                      enableMouseEvents
                                      slideRenderer={this.slideRenderer}/>
        );
    }
}